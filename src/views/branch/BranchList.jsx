import config from 'config';
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

const BranchList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/branches`);
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
        await axiosInstance.delete(`/branches/${id}`);
        setData(data.filter((branch) => branch.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleToggleStatus = async (branchId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axiosInstance.patch(`/branches/${branchId}/status`, {
        is_active: newStatus
      });

      // Update both data and filteredData states
      const updateStatus = (branches) => branches.map((branch) => (branch.id === branchId ? { ...branch, is_active: newStatus } : branch));

      setData((prev) => updateStatus(prev));
      setFilteredData((prev) => updateStatus(prev));

      showSuccess(`Branch ${newStatus ? 'activated' : 'deactivated'} successfully`);
      handleClose();
    } catch (error) {
      console.error('Status toggle error:', error);
      showError(error.response?.data?.message || 'Failed to update branch status');
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('branch'))} />
          <SearchOutlinedIcon />
        </div>
        <div className="buttons"></div>
        <Link to="/branch/add-branch">
          <button className="new-user-btn">+ New Branch</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Branch name</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Pincode</th>
                <th>Phone</th>
                <th>Email</th>
                <th>GST Number</th>
                <th>Logo1</th>
                <th>Logo2</th>
                <th>Is active</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4">No branch available</td>
                </tr>
              ) : (
                currentRecords.map((branch, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{branch.name}</td>
                    <td>{branch.address}</td>
                    <td>{branch.city}</td>
                    <td>{branch.state}</td>
                    <td>{branch.pincode}</td>
                    <td>{branch.phone}</td>
                    <td>{branch.email}</td>
                    <td>{branch.gst_number}</td>
                    <td>
                      {branch.logo1 && (
                        <img src={`${config.baseURL || ''}${branch.logo1}`} alt="Logo 1" style={{ maxWidth: '100px', maxHeight: '50px' }} />
                      )}
                    </td>
                    <td>
                      {branch.logo2 && (
                        <img src={`${config.baseURL || ''}${branch.logo2}`} alt="Logo 2" style={{ maxWidth: '100px', maxHeight: '50px' }} />
                      )}
                    </td>
                    <td>
                      <span className={`status-text ${branch.is_active}`}>
                        {branch.is_active === true ? (
                          <>
                            <FaCheckCircle className="status-icon active-icon" />
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="status-icon inactive-icon" />
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, branch.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${branch.id}`} anchorEl={anchorEl} open={menuId === branch.id} onClose={handleClose}>
                        <Link className="Link" to={`/branch/update-branch/${branch.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(branch.id)}>Delete</MenuItem>
                        <MenuItem onClick={() => handleToggleStatus(branch.id, branch.is_active)}>
                          {branch.is_active ? 'Deactivate' : 'Activate'}
                        </MenuItem>
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

export default BranchList;
