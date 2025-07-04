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

const AccessoriesList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/accessories`);
      setData(response.data.data.accessories);
      setFilteredData(response.data.data.accessories);
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

  const handleTogglePartStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      await axiosInstance.put(`/accessories/${id}/part-number-status`, {
        part_number_status: newStatus
      });
      fetchData();
    } catch (error) {
      console.error('Error updating part number status:', error);
      showError('Failed to update part number status');
    }
  };
  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/accessories/${id}`);
        setData(data.filter((accessories) => accessories.id !== id));
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
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('accessories'))} />
          <SearchOutlinedIcon />
        </div>
        <Link to="/accessories/add-accessories">
          <button className="new-user-btn">+ New Accessory</button>
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
                <th>Price</th>
                <th>Part Number</th>
                <th>Part Number Status</th>
                <th>Compatible Models</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red' }}>
                    No accessories available
                  </td>
                </tr>
              ) : (
                currentRecords.map((accessories, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{accessories.name}</td>
                    <td>{accessories.description}</td>
                    <td>{accessories.price}</td>
                    <td>{accessories.part_number}</td>
                    {/* <td>{accessories.part_number_status}</td> */}
                    <td>
                      <CFormSwitch
                        className="custom-switch"
                        checked={accessories.part_number_status === 'active'}
                        onChange={() =>
                          handleTogglePartStatus(accessories.id, accessories.part_number_status === 'active' ? 'active' : 'inactive')
                        }
                      />
                    </td>

                    <td>{accessories.applicable_models.join(', ')}</td>
                    <td>
                      <span className={`status-text ${accessories.status}`}>
                        {accessories.status === 'active' ? (
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
                      <button className="action-button" onClick={(event) => handleClick(event, accessories.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${accessories.id}`} anchorEl={anchorEl} open={menuId === accessories.id} onClose={handleClose}>
                        <Link className="Link" to={`/accessories/update-accessories/${accessories.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(accessories.id)}>Delete</MenuItem>
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

export default AccessoriesList;
