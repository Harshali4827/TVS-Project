import { CFormSwitch } from '@coreui/react';
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

const ProviderList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/insurance-providers`);
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

  const handleToggleActive = async (providerId, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      await axiosInstance.patch(`/insurance-providers/${providerId}/status`, {
        is_active: newStatus
      });

      setData((prevData) => prevData.map((provider) => (provider.id === providerId ? { ...provider, is_active: newStatus } : provider)));

      setFilteredData((prevData) =>
        prevData.map((provider) => (provider.id === providerId ? { ...provider, is_active: newStatus } : provider))
      );
    } catch (error) {
      console.error('Error toggling provider status:', error);
      showError('Failed to update provider status');
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/insurance-providers/${id}`);
        setData(data.filter((branch) => branch.id !== id));
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
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('branch'))} />
          <SearchOutlinedIcon />
        </div>
        <Link to="/insurance-provider/add-provider">
          <button className="new-user-btn">+ New Provider</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red' }}>
                    No insurance provider available
                  </td>
                </tr>
              ) : (
                currentRecords.map((branch, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{branch.provider_name}</td>
                    <td>
                      <CFormSwitch
                        className="custom-switch"
                        checked={branch.is_active}
                        onChange={() => handleToggleActive(branch.id, branch.is_active)}
                      />
                    </td>

                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, branch.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${branch.id}`} anchorEl={anchorEl} open={menuId === branch.id} onClose={handleClose}>
                        <Link className="Link" to={`/insurance-provider/update-provider/${branch.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(branch.id)}>Delete</MenuItem>
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

export default ProviderList;
