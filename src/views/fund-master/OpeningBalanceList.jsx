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
} from 'utils/tableImports';

const OpeningBalanceList = () => {
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
        await axiosInstance.delete(`/branches/${id}/opening-balance`);
        setData(data.filter((branch) => branch.id !== id));
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
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('branch'))} />
          <SearchOutlinedIcon />
        </div>
        <Link to="/add-balance">
          <button className="new-user-btn">+ New</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Location</th>
                <th>Opening Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red' }}>
                    No balance available
                  </td>
                </tr>
              ) : (
                currentRecords.map((branch, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{branch.name}</td>
                     <td>{branch.opening_balance}</td>
                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, branch.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${branch.id}`} anchorEl={anchorEl} open={menuId === branch.id} onClose={handleClose}>
                        <Link className="Link" to={`/update-balance/${branch.id}`}>
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

export default OpeningBalanceList;
