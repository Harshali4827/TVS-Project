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
  FaTimesCircle,
  FaCheckCircle
} from 'utils/tableImports';

const CategoryList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/accessory-categories`);
      setData(response.data.data.categories);
      setFilteredData(response.data.data.categories);
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
        await axiosInstance.delete(`/accessory-categories/${id}`);
        setData(data.filter((category) => category.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/accessory-categories/${id}/status`, {
        status: newStatus
      });
      setData(data.map((category) => (category._id === id ? { ...category, status: newStatus } : category)));
      setFilteredData(filteredData.map((category) => (category._id === id ? { ...category, status: newStatus } : category)));
      showSuccess(`Status updated to ${newStatus}`);
      handleClose();
    } catch (error) {
      console.log('Error updating status', error);
      showError('Failed to update status');
    }
  };
  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('category'))} />
          <SearchOutlinedIcon />
        </div>
        <Link to="/categories/add-category">
          <button className="new-user-btn">+ New Category</button>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red' }}>
                    No category available
                  </td>
                </tr>
              ) : (
                currentRecords.map((category, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, category.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${category.id}`} anchorEl={anchorEl} open={menuId === category.id} onClose={handleClose}>
                        <Link className="Link" to={`/categories/update-category/${category._id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(category._id)}>Delete</MenuItem>
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

export default CategoryList;
