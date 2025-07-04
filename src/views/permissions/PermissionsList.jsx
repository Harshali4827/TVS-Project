import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  SearchOutlinedIcon,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance,
  FaCheckCircle,
  FaTimesCircle
} from 'utils/tableImports';

const PermissionsList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/permissions`);
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
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
        await axiosInstance.delete(`/permissions/providers/${id}`);
        setData(data.filter((permission) => permission.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError();
      }
    }
  };
  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('permission'))} />
          <SearchOutlinedIcon />
        </div>
        <Link to="/permissions/add-permissions">
          <button className="new-user-btn">+ New permission</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Name</th>
                <th>Description</th>
                <th>Module</th>
                <th>Permission</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red' }}>
                    No permission available
                  </td>
                </tr>
              ) : (
                currentRecords.map((permission, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{permission.name}</td>
                    <td>{permission.description}</td>
                    <td>{permission.module}</td>
                    <td>{permission.action}</td>
                    <td>
                      <span className={`status-text ${permission.is_active}`}>
                        {permission.is_active === true ? (
                          <FaCheckCircle className="status-icon active-icon" />
                        ) : (
                          <FaTimesCircle className="status-icon inactive-icon" />
                        )}
                      </span>
                    </td>

                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, permission.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${permission.id}`} anchorEl={anchorEl} open={menuId === permission.id} onClose={handleClose}>
                        <Link className="Link" to={`/permission/update-permission/${permission.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(permission.id)}>Delete</MenuItem>
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

export default PermissionsList;
