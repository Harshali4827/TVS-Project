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
  axiosInstance
} from 'utils/tableImports';

const SubdealerList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/subdealers`);
      setData(response.data.data.subdealers);
      setFilteredData(response.data.data.subdealers);
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

const handleToggleActive = async (subdealerId, currentStatus) => {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

  try {
    await axiosInstance.patch(`/subdealers/${subdealerId}/status`, {
      status: newStatus
    });
    setData((prevData) =>
      prevData.map((subdealer) =>
        subdealer.id === subdealerId
          ? { ...subdealer, status: newStatus }
          : subdealer
      )
    );

    setFilteredData((prevData) =>
      prevData.map((subdealer) =>
        subdealer.id === subdealerId
          ? { ...subdealer, status: newStatus }
          : subdealer
      )
    );
  } catch (error) {
    console.error('Error toggling subdealer status:', error);
    showError('Failed to update subdealer status');
  }
};

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/subdealers/${id}`);
        setData(data.filter((subdealer) => subdealer.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };
  return (
    <div>
        <h4>Subdealer List</h4>
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input
            type="text"
            placeholder="Search.."
            onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('insurance_subdealer'))}
          />
          <SearchOutlinedIcon />
        </div>
        <Link to="/add-subdealer">
          <button className="new-user-btn">+ New Subdealer</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Name</th>
                <th>Location</th>
                <th>Rate Of Interest</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red' }}>
                    No subdealers available
                  </td>
                </tr>
              ) : (
                currentRecords.map((subdealer, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{subdealer.name}</td>
                    <td>{subdealer.location}</td>
                    <td>{subdealer.rateOfInterest}</td>
                    <td>{subdealer.discount}</td>
                    <td>{subdealer.type}</td>
                    <td>
                      <CFormSwitch
                            className="custom-switch"
                            checked={subdealer.status === 'active'}
                            onChange={() => handleToggleActive(subdealer.id, subdealer.status)}
                      />

                    </td>

                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, subdealer.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${subdealer.id}`} anchorEl={anchorEl} open={menuId === subdealer.id} onClose={handleClose}>
                        <Link className="Link" to={`/update-subdealer/${subdealer.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(subdealer.id)}>Delete</MenuItem>
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

export default SubdealerList;
