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
//   FaCheckCircle,
//   FaTimesCircle
// } from 'utils/tableImports';

// const BrokerList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

//   const { currentRecords, PaginationOptions } = usePagination(filteredData);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/brokers`);
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
//         await axiosInstance.delete(`/brokers/${id}`);
//         setData(data.filter((broker) => broker.id !== id));
//         fetchData();
//         showSuccess();
//       } catch (error) {
//         console.log(error);
//         showError();
//       }
//     }
//   };

//   return (
//     <div className="table-container">
//       <div className="table-header">
//         <div className="search-icon-data">
//           <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('broker'))} />
//           <SearchOutlinedIcon />
//         </div>
//         <Link to="/broker/add-broker">
//           <button className="new-user-btn">+ New Broker</button>
//         </Link>
//       </div>
//       <div className="table-responsive">
//         <div className="table-wrapper">
//           <table className="responsive-table" style={{ overflow: 'auto' }}>
//             <thead className="table-header-fixed">
//               <tr>
//                 <th>Sr.no</th>
//                 <th>Name</th>
//                 <th>Mobile Number</th>
//                 <th>Email</th>
//                 <th>Branch</th>
//                 <th>Commision Type</th>
//                 <th>Fixed Commision Type</th>
//                 <th>Price Range</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentRecords.length === 0 ? (
//                 <tr>
//                   <td colSpan="11" style={{ color: 'red' }}>
//                     No Broker available
//                   </td>
//                 </tr>
//               ) : (
//                 currentRecords.map((broker, index) => {
//                   const branchInfo = broker.branches?.[0] || {};
//                   const branch = branchInfo.branch || {};

//                   return (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>{broker.name}</td>
//                       <td>{broker.mobile}</td>
//                       <td>{broker.email}</td>
//                       <td>{broker.branches[0]?.branch?.name || ''}</td>
//                       <td>{broker.branches[0]?.commissionType || 'N/A'}</td>
//                       <td>{broker.branches[0]?.fixedCommission ?? ''}</td>
//                       <td>{broker.branches[0]?.commissionRange ?? ''}</td>
//                       <td>
//                         <span className={`status-badge ${broker.isActive ? 'active' : 'inactive'}`}>
//                           {broker.isActive ? (
//                             <>
//                               <FaCheckCircle className="status-icon active-icon" />
//                             </>
//                           ) : (
//                             <>
//                               <FaTimesCircle className="status-icon inactive-icon" />
//                             </>
//                           )}
//                         </span>
//                       </td>
//                       <td>
//                         <button className="action-button" onClick={(event) => handleClick(event, broker.id)}>
//                           Action
//                         </button>
//                         <Menu id={`action-menu-${broker.id}`} anchorEl={anchorEl} open={menuId === broker.id} onClose={handleClose}>
//                           <Link className="Link" to={`/broker/update-broker/${broker.id}`}>
//                             <MenuItem>Edit</MenuItem>
//                           </Link>
//                           <MenuItem onClick={() => handleDelete(broker.id)}>Delete</MenuItem>
//                         </Menu>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <PaginationOptions />
//     </div>
//   );
// };

// export default BrokerList;

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
  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/brokers/${id}`);
        setData(data.filter((broker) => broker.id !== id));
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
                <th>Commission Type</th>
                <th>Fixed Commission</th>
                <th>Price Range</th>
                <th>OTP Required?</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ color: 'red' }}>
                    No Broker available
                  </td>
                </tr>
              ) : (
                currentRecords.flatMap((broker, index) => {
                  console.log(`Broker ID: ${broker.id}, isActive: ${broker.isActive}`);
                  const otp_required = broker.branches.some((branch) => branch.otp_required);
                  return broker.branches.map((branch, branchIndex) => (
                    <tr key={`${broker.id}-${branchIndex}`}>
                      {branchIndex === 0 ? (
                        <>
                          <td rowSpan={broker.branches.length}>{index + 1}</td>
                          <td rowSpan={broker.branches.length}>{broker.name}</td>
                          <td rowSpan={broker.branches.length}>{broker.mobile}</td>
                          <td rowSpan={broker.branches.length}>{broker.email}</td>
                        </>
                      ) : null}

                      <td>{branch.branch?.name || ''}</td>
                      <td>{branch.commissionType || 'N/A'}</td>
                      <td>{branch.commissionType === 'FIXED' ? branch.fixedCommission : ''}</td>
                      <td>{branch.commissionType === 'VARIABLE' ? branch.commissionRange : ''}</td>

                      {branchIndex === 0 ? (
                        <>
                          <td rowSpan={broker.branches.length}>
                            {otp_required ? (
                              <FaCheckCircle className="status-icon active-icon" />
                            ) : (
                              <FaTimesCircle className="status-icon inactive-icon" />
                            )}
                          </td>
                          <td rowSpan={broker.branches.length}>
                            <button className="action-button" onClick={(event) => handleClick(event, broker.id)}>
                              Action
                            </button>
                            <Menu id={`action-menu-${broker.id}`} anchorEl={anchorEl} open={menuId === broker.id} onClose={handleClose}>
                              <Link className="Link" to={`/broker/update-broker/${broker.id}`}>
                                <MenuItem>Edit</MenuItem>
                              </Link>
                              <MenuItem onClick={() => handleDelete(broker.id)}>Delete</MenuItem>
                            </Menu>
                          </td>
                        </>
                      ) : null}
                    </tr>
                  ));
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
