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

const DeclarationList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/declarations`);
      setData(response.data.data.declarations);
      setFilteredData(response.data.data.declarations);
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
  const handleToggleActive = async (declarationId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axiosInstance.patch(`/declarations/${declarationId}/status`, {
        status: newStatus
      });

      const updateStatus = (declarations) =>
        declarations.map((declaration) => (declaration.id === declarationId ? { ...declaration, status: newStatus } : declaration));

      setData((prev) => updateStatus(prev));
      setFilteredData((prev) => updateStatus(prev));

      showSuccess(`Declaration ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      handleClose();
    } catch (error) {
      console.error('Error toggling declaration status:', error);
      showError('Failed to update declaration status');
    }
  };
  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/declarations/${id}`);
        setData(data.filter((condition) => condition.id !== id));
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
      <h4>Declaration</h4>
      <div className="table-container">
        <div className="table-header">
          <div className="search-icon-data">
            <input
              type="text"
              placeholder="Search.."
              onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('conditions'))}
            />
            <SearchOutlinedIcon />
          </div>
          <div className="buttons"></div>
          <Link to="/add-declaration">
            <button className="new-user-btn">+ New</button>
          </Link>
        </div>
        <div className="table-responsive">
          <div className="table-wrapper">
            <table className="responsive-table" style={{ overflow: 'auto' }}>
              <thead className="table-header-fixed">
                <tr>
                  <th>Sr.no</th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Form Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="4">No model available</td>
                  </tr>
                ) : (
                  currentRecords.map((condition, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{condition.title}</td>
                      <td>{condition.content}</td>
                      <td>{condition.formType}</td>
                      <td>{condition.priority}</td>
                      <td>
                        <span className={`status-text ${condition.status}`}>
                          {condition.status === 'active' ? (
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
                        <button className="action-button" onClick={(event) => handleClick(event, condition._id)}>
                          Action
                        </button>
                        <Menu id={`action-menu-${condition._id}`} anchorEl={anchorEl} open={menuId === condition._id} onClose={handleClose}>
                          <Link className="Link" to={`/update-declaration/${condition._id}`}>
                            <MenuItem>Edit</MenuItem>
                          </Link>
                          <MenuItem onClick={() => handleDelete(condition._id)}>Delete</MenuItem>
                          <MenuItem onClick={() => handleToggleActive(condition._id, condition.status)}>
                            {condition.status === 'active' ? 'Deactivate' : 'Activate'}
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
    </div>
  );
};

export default DeclarationList;
