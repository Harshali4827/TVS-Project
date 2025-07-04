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

const InventoryList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/inward`);
      setData(response.data.data.vehicles);
      setFilteredData(response.data.data.vehicles);
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
        await axiosInstance.delete(`/inventory/${id}`);
        setData(data.filter((vehicle) => vehicle.id !== id));
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
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('vehicle'))} />
          <SearchOutlinedIcon />
        </div>
        <Link to="/vehicle-inventory/add-inventory">
          <button className="new-user-btn">+ New Inward</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Model Name</th>
                <th>Color</th>
                <th>Type</th>
                <th>Engine No</th>
                <th>Motor No</th>
                <th>Key No</th>
                <th>Battery No</th>
                <th>Chassis No</th>
                <th>Purchase Date</th>
                <th>Is Damaged Approved?</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red' }}>
                    No inventory details available
                  </td>
                </tr>
              ) : (
                currentRecords.map((vehicle, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.colors.join(',')}</td>
                    <td>{vehicle.type}</td>
                    <td>{vehicle.engineNumber}</td>
                    <td>{vehicle.motorNumber}</td>
                    <td>{vehicle.keyNumber}</td>
                    <td>{vehicle.batteryNumber}</td>
                    <td>{vehicle.chassisNumber}</td>
                    <td>{vehicle.createdAt}</td>
                    <td>{vehicle.hasDamage === true ? 'Yes' : 'No'}</td>
                    <td>{vehicle.status}</td>
                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, vehicle.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${vehicle.id}`} anchorEl={anchorEl} open={menuId === vehicle.id} onClose={handleClose}>
                        <Link className="Link" to={`/vehicle/update-vehicle/${vehicle.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(vehicle.id)}>Delete</MenuItem>
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

export default InventoryList;
