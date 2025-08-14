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

const ColorList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/colors`);
      setData(response.data.data.colors);
      setFilteredData(response.data.data.colors);
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
        await axiosInstance.delete(`/colors/${id}`);
        setData(data.filter((color) => color.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };
  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('color'))} />
          <SearchOutlinedIcon />
        </div>
        <Link to="/color/add-color">
          <button className="new-user-btn">+ New Color</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Color name</th>
                <th>Model</th>
                {/* <th>Status</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red' }}>
                    No colours available
                  </td>
                </tr>
              ) : (
                currentRecords.map((color, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{color.name}</td>
                    <td>{color.models && color.models.length > 0 ? color.models.map((model) => model.model_name).join(', ') : ''}</td>

                    {/* <td>
                      <span className={`status-badge ${color.status ? 'active' : 'inactive'}`}>
                        {color.status ? (
                          <>
                            <FaCheckCircle className="status-icon active-icon" />
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="status-icon inactive-icon" />
                          </>
                        )}
                      </span>
                    </td> */}
                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, color.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${color.id}`} anchorEl={anchorEl} open={menuId === color.id} onClose={handleClose}>
                        <Link className="Link" to={`/color/update-color/${color.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(color.id)}>Delete</MenuItem>
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

export default ColorList;
