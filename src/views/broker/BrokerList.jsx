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

const BrokerList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/brokers`);
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

  const handleDelete = async (brokerId, branchId) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/brokers/${brokerId}/branch/${branchId}`);
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
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('broker'))} />
          <SearchOutlinedIcon />
        </div>
        <Link to="/broker/add-broker">
          <button className="new-user-btn">+ New Broker</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Name</th>
                <th>Mobile Number</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Commision Type</th>
                <th>Fixed Commision Type</th>
                <th>Min Commision Price</th>
                <th>Max Commision Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ color: 'red' }}>
                    No Broker available
                  </td>
                </tr>
              ) : (
                currentRecords.map((broker, index) => {
                  const branchInfo = broker.branches?.[0] || {};
                  const branch = branchInfo.branch || {};

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{broker.name}</td>
                      <td>{broker.mobile}</td>
                      <td>{broker.email}</td>
                      <td>{branch.name || ''}</td>
                      <td>{branchInfo.commissionType || ''}</td>
                      <td>{branchInfo.fixedCommission ?? ''}</td>
                      <td>{branchInfo.minCommission ?? ''}</td>
                      <td>{branchInfo.maxCommission ?? ' '}</td>
                      <td>{branchInfo.isActive ? 'Active' : 'Inactive'}</td>
                      <td>
                        <button className="action-button" onClick={(event) => handleClick(event, broker.id)}>
                          Action
                        </button>
                        <Menu id={`action-menu-${broker.id}`} anchorEl={anchorEl} open={menuId === broker.id} onClose={handleClose}>
                          <Link className="Link" to={`/broker/update-broker/${broker.id}`}>
                            <MenuItem>Edit</MenuItem>
                          </Link>
                          <MenuItem onClick={() => handleDelete(broker.id, branchInfo.branch?.id)}>Delete</MenuItem>
                        </Menu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <PaginationOptions />
    </div>
  );
};

export default BrokerList;
