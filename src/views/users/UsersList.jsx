import { exportToUserCsv, exportToUserPdf } from 'utils/tableExports';
import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  SearchOutlinedIcon,
  FaCheckCircle,
  FaTimesCircle,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from 'utils/tableImports';

const UsersList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/users`);
      const users = response.data.data.map((user) => ({
        ...user,
        id: user._id || user.id,
        primaryRole: user.roles?.[0]?.name || 'No Role',
        branchName: user.branchDetails?.name || user.branch || 'N/A'
      }));

      setData(users);
      setFilteredData(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        setData(data.filter((user) => user.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        let message = 'Failed to delete. Please try again.';

        if (error.response) {
          const res = error.response.data;
          message = res.message || res.error || message;
        } else if (error.request) {
          message = 'No response from server. Please check your network.';
        } else if (error.message) {
          message = error.message;
        }

        showError(message);
      }
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axiosInstance.patch(`/users/${userId}/status`, {
        isActive: newStatus
      });

      const updateStatus = (users) => users.map((user) => (user.id === userId ? { ...user, isActive: newStatus } : user));

      setData((prev) => updateStatus(prev));
      setFilteredData((prev) => updateStatus(prev));

      showSuccess(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      handleClose();
    } catch (error) {
      console.error('Error toggling user status:', error);
      showError('Failed to update user status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never logged in';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getRoleNames = (roles) => {
    if (!roles || !roles.length) return 'No Role';
    return roles.map((role) => role.name).join(', ');
  };
  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('users'))} />
          <SearchOutlinedIcon />
        </div>
        <Link to="/users/add-user">
          <button className="new-user-btn">+ New User</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile number</th>
                <th>Branch</th>
                <th>Role(s)</th>
                <th>Discount</th>
                <th>Last login</th>
                {/* <th>Created by</th> */}
                <th>Is active</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4">No users available</td>
                </tr>
              ) : (
                currentRecords.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>{user.branchName}</td>
                    <td>{getRoleNames(user.roles)}</td>
                    <td>{user.discount || '0'}</td>
                    <td>{formatDate(user.lastLogin)}</td>
                    <td>
                      {user.status}
                    </td>
                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, user.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${user.id}`} anchorEl={anchorEl} open={menuId === user.id} onClose={handleClose}>
                        <Link className="Link" to={`/users/update-user/${user.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(user.id)}>Delete</MenuItem>
                        {/* <MenuItem onClick={() => handleToggleActive(user.id, user.isActive)}>
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </MenuItem> */}
                      </Menu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <PaginationOptions />
    </div>
  );
};

export default UsersList;
