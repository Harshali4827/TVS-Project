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

const AllRoles = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/roles`);
      const filteredRoles = response.data.data.filter((role) => role.name.toLowerCase() !== 'superadmin');
      setData(filteredRoles);
      setFilteredData(filteredRoles);
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
        await axiosInstance.delete(`/roles/${id}`);
        setData(data.filter((role) => role.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  // Group permissions by module for display
  const groupPermissionsByModule = (permissions) => {
    if (!permissions || !permissions.length) return {};

    return permissions.reduce((acc, permission) => {
      const module = permission.module || permission.resource;
      if (!acc[module]) {
        acc[module] = [];
      }
      acc[module].push(permission.action);
      return acc;
    }, {});
  };

  return (
    <div>
      <h4>All Roles</h4>
      <div className="table-container">
        <div className="table-header">
          <div className="search-icon-data">
            <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('roles'))} />
            <SearchOutlinedIcon />
          </div>
          <div className="buttons"></div>
          <Link to="/roles/create-role">
            <button className="new-user-btn">+ New Role</button>
          </Link>
        </div>
        <div className="table-responsive">
          <div className="table-wrapper">
            <table className="responsive-table" style={{ overflow: 'auto' }}>
              <thead className="table-header-fixed">
                <tr>
                  <th>Sr.no</th>
                  <th>Role name</th>
                  <th>Description</th>
                  <th>Modules</th>
                  <th>Actions</th>
                  {/* <th>Status</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="7">No roles available</td>
                  </tr>
                ) : (
                  currentRecords.map((role, index) => {
                    const groupedPermissions = groupPermissionsByModule(role.permissions);
                    const modules = Object.keys(groupedPermissions);

                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{role.name}</td>
                        <td>{role.description || '-'}</td>
                        <td>
                          {modules.length > 0 ? (
                            <div className="permission-modules">
                              {modules.map((module, idx) => (
                                <div key={idx} className="module-item">
                                  {module}
                                </div>
                              ))}
                            </div>
                          ) : (
                            'No modules'
                          )}
                        </td>
                        <td>
                          {modules.length > 0 ? (
                            <div className="permission-actions">
                              {modules.map((module, idx) => (
                                <div key={idx} className="action-item">
                                  {groupedPermissions[module].join(', ')}
                                </div>
                              ))}
                            </div>
                          ) : (
                            'No actions'
                          )}
                        </td>
                        {/* <td>
                          <span className={`status-badge ${role.is_active ? 'active' : 'inactive'}`}>
                            {role.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td> */}
                        <td>
                          <button className="action-button" onClick={(event) => handleClick(event, role._id)}>
                            Action
                          </button>
                          <Menu id={`action-menu-${role._id}`} anchorEl={anchorEl} open={menuId === role._id} onClose={handleClose}>
                            <Link className="Link" to={`/roles/update-role/${role._id}`}>
                              <MenuItem>Edit</MenuItem>
                            </Link>
                            <MenuItem onClick={() => handleDelete(role._id)}>Delete</MenuItem>
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

      <style jsx>{`
        .permission-modules,
        .permission-actions {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .module-item,
        .action-item {
          padding: 2px 0;
        }
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        .status-badge.active {
          background-color: #e6f7ee;
          color: #00a854;
        }
        .status-badge.inactive {
          background-color: #fff1f0;
          color: #f5222d;
        }
      `}</style>
    </div>
  );
};

export default AllRoles;

// import { ExpandLess, ExpandMore } from '@mui/icons-material';
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
//   axiosInstance
// } from 'utils/tableImports';

// // ... (other imports remain same)

// const AllRoles = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const { currentRecords, PaginationOptions } = usePagination(filteredData);
//   const [expandedModules, setExpandedModules] = useState({});

//   const toggleModule = (roleId, module) => {
//     setExpandedModules((prev) => ({
//       ...prev,
//       [`${roleId}-${module}`]: !prev[`${roleId}-${module}`]
//     }));
//   };

//   // Group permissions by module with counts
//   const groupPermissionsByModule = (permissions) => {
//     if (!permissions || !permissions.length) return {};

//     return permissions.reduce((acc, permission) => {
//       const module = permission.module || permission.resource;
//       if (!acc[module]) {
//         acc[module] = {
//           actions: [],
//           count: 0
//         };
//       }
//       acc[module].actions.push(permission.action);
//       acc[module].count++;
//       return acc;
//     }, {});
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // const fetchData = async () => {
//   //   try {
//   //     const response = await axiosInstance.get(`/roles`);
//   //     setData(response.data.data);
//   //     setFilteredData(response.data.data);
//   //   } catch (error) {
//   //     console.log('Error fetching data', error);
//   //   }
//   // };

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/roles`);
//       const filteredRoles = response.data.data.filter((role) => role.name.toLowerCase() !== 'superadmin');
//       setData(filteredRoles);
//       setFilteredData(filteredRoles);
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
//         await axiosInstance.delete(`/roles/${id}`);
//         setData(data.filter((role) => role.id !== id));
//         fetchData();
//         showSuccess();
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };

//   return (
//     <div>
//       <h4>All Roles</h4>
//       <div className="table-container">
//         <div className="table-header">
//           <div className="search-icon-data">
//             <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('roles'))} />
//             <SearchOutlinedIcon />
//           </div>
//           <div className="buttons"></div>
//           <Link to="/roles/create-role">
//             <button className="new-user-btn">+ New Role</button>
//           </Link>
//         </div>
//         <div className="table-responsive">
//           <div className="table-wrapper">
//             <table className="responsive-table">
//               <thead>
//                 <tr>
//                   <th>Sr.no</th>
//                   <th>Role name</th>
//                   <th>Description</th>
//                   <th>Modules</th>
//                   <th>Total Permissions</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentRecords.length === 0 ? (
//                   <tr>
//                     <td colSpan="7">No roles available</td>
//                   </tr>
//                 ) : (
//                   currentRecords.map((role, index) => {
//                     const groupedPermissions = groupPermissionsByModule(role.permissions);
//                     const modules = Object.keys(groupedPermissions);
//                     const totalPermissions = Object.values(groupedPermissions).reduce((sum, module) => sum + module.count, 0);

//                     return (
//                       <tr key={role._id}>
//                         <td>{index + 1}</td>
//                         <td>{role.name}</td>
//                         <td>{role.description || '-'}</td>
//                         <td>
//                           {modules.length > 0 ? (
//                             <div className="module-accordion">
//                               {modules.map((module) => (
//                                 <div key={module} className="module-item">
//                                   <div className="module-header" onClick={() => toggleModule(role._id, module)}>
//                                     {module} ({groupedPermissions[module].count})
//                                     {expandedModules[`${role._id}-${module}`] ? (
//                                       <ExpandLess fontSize="small" />
//                                     ) : (
//                                       <ExpandMore fontSize="small" />
//                                     )}
//                                   </div>
//                                   {expandedModules[`${role._id}-${module}`] && (
//                                     <div className="permission-chips">
//                                       {groupedPermissions[module].actions.map((action, i) => (
//                                         <span key={i} className="permission-chip">
//                                           {action}
//                                         </span>
//                                       ))}
//                                     </div>
//                                   )}
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             'No modules'
//                           )}
//                         </td>
//                         <td>{totalPermissions}</td>
//                         <td>
//                           <span className={`status-badge ${role.is_active ? 'active' : 'inactive'}`}>
//                             {role.is_active ? 'Active' : 'Inactive'}
//                           </span>
//                         </td>
//                         <td>{/* ... (action menu remains same) */}</td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <PaginationOptions />
//       </div>

//       <style jsx>{`
//         .module-accordion {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }
//         .module-header {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           cursor: pointer;
//           padding: 4px 0;
//           font-weight: 500;
//         }
//         .permission-chips {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 6px;
//           padding: 8px;
//           background: #f5f5f5;
//           border-radius: 4px;
//           margin-top: 4px;
//         }
//         .permission-chip {
//           background: #e0e0e0;
//           padding: 2px 8px;
//           border-radius: 12px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .status-badge {
//           padding: 4px 8px;
//           border-radius: 12px;
//           font-size: 12px;
//           font-weight: 500;
//         }
//         .status-badge.active {
//           background-color: #e6f7ee;
//           color: #00a854;
//         }
//         .status-badge.inactive {
//           background-color: #fff1f0;
//           color: #f5222d;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AllRoles;
