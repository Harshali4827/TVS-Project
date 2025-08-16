// import '../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   Menu,
//   MenuItem,
//   SearchOutlinedIcon,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance,
// } from 'utils/tableImports';

// const OpeningBalanceList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

//   const { currentRecords, PaginationOptions } = usePagination(filteredData);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/branches`);
//       setData(response.data.data);
//       setFilteredData(response.data.data);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleDelete = async (id) => {
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/branches/${id}/opening-balance`);
//         setData(data.filter((branch) => branch.id !== id));
//         fetchData();
//         showSuccess();
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };
//   return (
//     <div className="table-container">
//       <div className="table-header">
//         <div className="search-icon-data">
//           <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('branch'))} />
//           <SearchOutlinedIcon />
//         </div>
//         <Link to="/add-balance">
//           <button className="new-user-btn">+ New</button>
//         </Link>
//       </div>
//       <div className="table-responsive">
//         <div className="table-wrapper">
//           <table className="responsive-table" style={{ overflow: 'auto' }}>
//             <thead className="table-header-fixed">
//               <tr>
//                 <th>Sr.no</th>
//                 <th>Location</th>
//                 <th>Opening Balance</th>
//                 <th>History</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentRecords.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" style={{ color: 'red' }}>
//                     No balance available
//                   </td>
//                 </tr>
//               ) : (
//                 currentRecords.map((branch, index) => (
//                   <tr key={index}>
//                     <td>{index + 1}</td>
//                     <td>{branch.name}</td>
//                      <td>{branch.opening_balance}</td>
//                      <td>
//   {branch.opening_balance}
//   <div className="balance-history-tooltip">
//     {branch.opening_balance_history?.length > 0 && (
//       <span title={`Last updated: ${new Date(branch.opening_balance_history[0].date).toLocaleString()}`}>
//         ⓘ
//       </span>
//     )}
//   </div>
// </td>
//                     <td>
//                       <button className="action-button" onClick={(event) => handleClick(event, branch.id)}>
//                         Action
//                       </button>
//                       <Menu id={`action-menu-${branch.id}`} anchorEl={anchorEl} open={menuId === branch.id} onClose={handleClose}>
//                         <Link className="Link" to={`/update-balance/${branch.id}`}>
//                           <MenuItem>Edit</MenuItem>
//                         </Link>
//                         <MenuItem onClick={() => handleDelete(branch.id)}>Delete</MenuItem>
//                       </Menu>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <PaginationOptions />
//     </div>
//   );
// };

// export default OpeningBalanceList;



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
  const [loading, setLoading] = useState(false);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/branches`);
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
      showError(error.response?.data?.message || 'Failed to fetch branches');
    } finally {
      setLoading(false);
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

  const handleViewHistory = (branchId) => {
    const branch = data.find(b => b.id === branchId);
    if (branch?.opening_balance_history?.length > 0) {
      const historyText = branch.opening_balance_history.map(entry => 
        `${new Date(entry.date).toLocaleString()}: ${entry.amount} (${entry.note})`
      ).join('\n');
      alert(`Opening Balance History for ${branch.name}:\n\n${historyText}`);
    } else {
      alert('No history available for this branch');
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    const branch = data.find(b => b.id === id);
    const result = await confirmDelete(
      `Are you sure you want to reset the opening balance for ${branch.name}?`
    );
    
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/branches/${id}/opening-balance`);
        fetchData();
        showSuccess(`Opening balance for ${branch.name} has been reset`);
      } catch (error) {
        showError(error.response?.data?.message || 'Failed to reset balance');
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
            onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('branch'))} 
          />
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
              {loading ? (
                <tr>
                  <td colSpan="4">Loading branches...</td>
                </tr>
              ) : currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red' }}>
                    No branches available
                  </td>
                </tr>
              ) : (
                currentRecords.map((branch, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{branch.name}</td>
                    <td>
                      {branch.opening_balance}
                      {branch.opening_balance_history?.length > 0 && (
                        <span 
                          className="balance-history-icon"
                          title={`Last updated: ${new Date(branch.opening_balance_history[0].date).toLocaleString()}`}
                          onClick={() => handleViewHistory(branch.id)}
                        >
                          ⓘ
                        </span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="action-button" 
                        onClick={(event) => handleClick(event, branch.id)}
                      >
                        Action
                      </button>
                      <Menu 
                        id={`action-menu-${branch.id}`} 
                        anchorEl={anchorEl} 
                        open={menuId === branch.id} 
                        onClose={handleClose}
                      >
                        <Link className="Link" to={`/update-balance/${branch.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleViewHistory(branch.id)}>
                          View History
                        </MenuItem>
                        <MenuItem onClick={() => handleDelete(branch.id)}>
                          Reset Balance
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
  );
};

export default OpeningBalanceList;