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

const RatesList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/financers/rates`);
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
        await axiosInstance.delete(`/financers/rates/${id}`);
        setData(data.filter((financer) => financer.id !== id));
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
          <input
            type="text"
            placeholder="Search.."
            onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('finance_rates'))}
          />
          <SearchOutlinedIcon />
        </div>
        <Link to="/financer-rates/add-rates">
          <button className="new-user-btn">+ New Rates</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Location</th>
                <th>Financer Name</th>
                <th>GC Rate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red' }}>
                    No Financer available
                  </td>
                </tr>
              ) : (
                currentRecords.map((financer, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{financer.branchDetails.name}</td>
                    <td>{financer.financeProviderDetails.name}</td>
                    <td>{financer.gcRate}</td>
                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, financer.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${financer.id}`} anchorEl={anchorEl} open={menuId === financer.id} onClose={handleClose}>
                        <Link className="Link" to={`/financer-rates/update-rates/${financer.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(financer.id)}>Delete</MenuItem>
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

export default RatesList;
