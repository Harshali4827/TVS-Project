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

const CashList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/cash-locations`);
      setData(response.data.data.cashLocations);
      setFilteredData(response.data.data.cashLocations);
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
        await axiosInstance.delete(`/cash-locations/${id}`);
        setData(data.filter((bank) => bank.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };
  const handleToggleActive = async (bankId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axiosInstance.patch(`/cash-locations/${bankId}/status`, {
        status: newStatus
      });
      setData((prev) => prev.map((bank) => (bank.id === bankId ? { ...bank, status: newStatus } : bank)));
      setFilteredData((prev) => prev.map((bank) => (bank.id === bankId ? { ...bank, status: newStatus } : bank)));

      showSuccess(`Bank ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      handleClose();
    } catch (error) {
      console.error('Error toggling bank status:', error);
      showError('Failed to update bank status');
    }
  };
  return (
    <div>
      <h4>Cash Account Master</h4>
      <div className="table-container">
        <div className="table-header">
          <div className="search-icon-data">
            <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('cash'))} />
            <SearchOutlinedIcon />
          </div>
          <Link to="/add-cash">
            <button className="new-user-btn">+ New Location</button>
          </Link>
        </div>
        <div className="table-responsive">
          <div className="table-wrapper">
            <table className="responsive-table" style={{ overflow: 'auto' }}>
              <thead className="table-header-fixed">
                <tr>
                  <th>Sr.no</th>
                  <th>Account Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ color: 'red' }}>
                      No Bank available
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((bank, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{bank.name}</td>
                      <td>{bank.branchDetails.name}</td>
                      <td>
                        <span className={`status-badge ${bank.status === 'active' ? 'active' : 'inactive'}`}>
                          {bank.status === 'active' ? (
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
                        <button className="action-button" onClick={(event) => handleClick(event, bank.id)}>
                          Action
                        </button>
                        <Menu id={`action-menu-${bank.id}`} anchorEl={anchorEl} open={menuId === bank.id} onClose={handleClose}>
                          <Link className="Link" to={`/update-cash/${bank.id}`}>
                            <MenuItem>Edit</MenuItem>
                          </Link>
                          <MenuItem onClick={() => handleToggleActive(bank.id, bank.status)}>
                            {bank.status === 'active' ? 'Deactivate' : 'Activate'}
                          </MenuItem>
                          <MenuItem onClick={() => handleDelete(bank.id)}>Delete</MenuItem>
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
    </div>
  );
};

export default CashList;
