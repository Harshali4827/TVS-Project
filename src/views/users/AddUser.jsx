
// import React, { useState, useEffect } from 'react';
// import '../../css/form.css';
// import '../../css/permission.css';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormCheck,
//   CButtonGroup,
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showError, showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
// import axiosInstance from 'axiosInstance';
// import { jwtDecode } from 'jwt-decode';

// function AddUser() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     mobile: '',
//     branch: '',
//     roleId: '',
//     discount: '',
//     permissions: []
//   });

//   const [roles, setRoles] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [permissionsData, setPermissionsData] = useState([]);
//   const [groupedPermissions, setGroupedPermissions] = useState({});
//   const [availableActions, setAvailableActions] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showPermissions, setShowPermissions] = useState(false);
//   const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         if (decoded && decoded.user_id) {
//           setFormData((prevData) => ({
//             ...prevData,
//             created_by: decoded.user_id
//           }));
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (id) {
//       fetchUser(id);
//     }
//     fetchRoles();
//     fetchBranches();
//     fetchAllPermissions();
//   }, [id]);

//   const fetchUser = async (id) => {
//     try {
//       const res = await axiosInstance.get(`/users/${id}`);
//       const userData = res.data.data;
//       const normalizedData = {
//         name: userData.name,
//         email: userData.email,
//         mobile: userData.mobile,
//         branch: userData.branchDetails?._id || '',
//         roleId: userData.roles[0]?._id || '',
//         discount: userData.discount || '',
//         permissions: userData.permissions?.map(p => p._id) || []
//       };
//       setFormData(normalizedData);
//       if (normalizedData.roleId) {
//         setShowPermissions(true);
//       }
//     } catch (error) {
//       console.error('Error fetching users', error);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const response = await axiosInstance.get('/roles');
//       setRoles(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching roles:', error);
//       showFormSubmitError(error);
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching branches:', error);
//       showError(error);
//     }
//   };

//   const fetchAllPermissions = async () => {
//     try {
//       const res = await axiosInstance.get('/permissions');
//       setPermissionsData(res.data.data);
      
//       const grouped = res.data.data.reduce((acc, permission) => {
//         const module = permission.module;
//         if (!acc[module]) {
//           acc[module] = [];
//         }
//         acc[module].push({
//           action: permission.action,
//           id: permission._id
//         });
//         return acc;
//       }, {});

//       setGroupedPermissions(grouped);

//       const actions = [...new Set(res.data.data.map((p) => p.action))];
//       setAvailableActions(actions);
//     } catch (error) {
//       console.error('Error fetching permissions:', error);
//     }
//   };

//   const fetchRolePermissions = async (roleId) => {
//     setIsLoadingPermissions(true);
//     try {
//       const res = await axiosInstance.get(`/roles/${roleId}`);
//       const rolePermissions = res.data.data.permissions || [];
//       setFormData(prev => ({
//         ...prev,
//         permissions: rolePermissions.map(p => p._id)
//       }));
//     } catch (error) {
//       console.error('Error fetching role permissions:', error);
//     } finally {
//       setIsLoadingPermissions(false);
//     }
//   };

//   const handleChange = async (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

//     if (name === 'roleId') {
//       setShowPermissions(true);
//       if (value) {
//         await fetchRolePermissions(value);
//       } else {
//         setFormData(prev => ({ ...prev, permissions: [] }));
//       }
//     }
//   };

//   const toggleAction = (module, action) => {
//     setFormData((prev) => {
//       const permission = permissionsData.find((p) => p.module === module && p.action === action);
//       let newPermissions = [...prev.permissions];

//       if (permission) {
//         const permIndex = newPermissions.indexOf(permission._id);
//         if (permIndex >= 0) {
//           newPermissions.splice(permIndex, 1);
//         } else {
//           newPermissions.push(permission._id);
//         }
//       }

//       return { ...prev, permissions: newPermissions };
//     });
//   };

//   const handleGlobalAction = (actionType) => {
//     setFormData((prev) => {
//       let newPermissions = [];

//       if (actionType === 'none') {
//         return { ...prev, permissions: [] };
//       }

//       if (actionType === 'selectAll') {
//         newPermissions = permissionsData.map(p => p._id);
//       }

//       if (actionType === 'viewOnly') {
//         newPermissions = permissionsData
//           .filter(p => p.action === 'READ')
//           .map(p => p._id);
//       }

//       return { ...prev, permissions: newPermissions };
//     });
//   };

//   const isPermissionEnabled = (module, action) => {
//     const permission = permissionsData.find((p) => p.module === module && p.action === action);
//     return permission && formData.permissions.includes(permission._id);
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
//     if (!formData.branch) newErrors.branch = 'Branch is required';
//     if (!formData.roleId) newErrors.roleId = 'Role is required';

//     const selectedRole = roles.find(role => role._id === formData.roleId);
//     if (selectedRole?.name === 'SALES_EXECUTIVE') {
//       if (formData.discount === '' || formData.discount === null) {
//         newErrors.discount = 'Discount is required for Sales Executive';
//       } else if (isNaN(Number(formData.discount))) {
//         newErrors.discount = 'Discount must be a number';
//       } else if (Number(formData.discount) < 0) {
//         newErrors.discount = 'Discount must be positive';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     const payload = {
//       name: formData.name,
//       email: formData.email,
//       mobile: formData.mobile,
//       branch: formData.branch,
//       roleId: formData.roleId,
//       ...(formData.discount !== '' && { discount: Number(formData.discount) }),
//       permissions: formData.permissions
//     };

//     try {
//       if (id) {
//         await axiosInstance.put(`/users/${id}`, payload);
//         await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
//       } else {
//         await axiosInstance.post('/auth/register', payload);
//         await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       showFormSubmitError(error);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/users/users-list');
//   };

//   return (
//     <div>
//       <h4>{id ? 'Edit' : 'Add'} User</h4>
//       <div className="form-container">
//         <div className="page-header">
//           <form onSubmit={handleSubmit}>
//             <div className="form-note">
//               <span className="required">*</span> Field is mandatory
//             </div>
            
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Name</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="text" 
//                     name="name" 
//                     value={formData.name} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//                 {errors.name && <p className="error">{errors.name}</p>}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Email</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilEnvelopeClosed} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="email" 
//                     name="email" 
//                     value={formData.email} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//                 {errors.email && <p className="error">{errors.email}</p>}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Branch</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilLocationPin} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="branch" 
//                     value={formData.branch} 
//                     onChange={handleChange}
//                   >
//                     <option value="">-Select-</option>
//                     {branches.map((branch) => (
//                       <option key={branch._id} value={branch._id}>
//                         {branch.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.branch && <p className="error">{errors.branch}</p>}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Role</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="roleId" 
//                     value={formData.roleId} 
//                     onChange={handleChange}
//                   >
//                     <option value="">-Select-</option>
//                     {roles.map((role) => (
//                       <option key={role._id} value={role._id}>
//                         {role.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.roleId && <p className="error">{errors.roleId}</p>}
//               </div>
              
//               {roles.find((role) => role._id === formData.roleId)?.name === 'SALES_EXECUTIVE' && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Discount</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilDollar} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="number" 
//                       name="discount" 
//                       value={formData.discount} 
//                       onChange={handleChange} 
//                       min="0"
//                     />
//                   </CInputGroup>
//                   {errors.discount && <p className="error">{errors.discount}</p>}
//                 </div>
//               )}

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Mobile number</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilPhone} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="tel" 
//                     name="mobile" 
//                     value={formData.mobile} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//                 {errors.mobile && <p className="error">{errors.mobile}</p>}
//               </div>
//             </div>

//             {showPermissions && (
//               <div className="permissions-section mt-4">
//                 <h5>Permissions</h5>
//                 <div className="permissions-actions mb-3">
//                   <CButtonGroup>
//                     <CButton color="secondary" onClick={() => handleGlobalAction('none')} variant="outline">
//                       None
//                     </CButton>
//                     <CButton color="secondary" onClick={() => handleGlobalAction('selectAll')} variant="outline">
//                       Select All
//                     </CButton>
//                     <CButton color="secondary" onClick={() => handleGlobalAction('viewOnly')} variant="outline">
//                       View Only
//                     </CButton>
//                   </CButtonGroup>
//                 </div>

//                 {isLoadingPermissions ? (
//                   <div className="text-center py-4">Loading permissions...</div>
//                 ) : (
//                   <div className="permissions-table-container">
//                     <div className="permission-table-wrapper">
//                       <CTable bordered responsive hover small className="permission-table">
//                         <CTableHead color="light" className="permission-table-header">
//                           <CTableRow>
//                             <CTableHeaderCell scope="col" className="sticky-module-header">Module</CTableHeaderCell>
//                             {availableActions.map((action) => (
//                               <CTableHeaderCell 
//                                 key={action} 
//                                 scope="col" 
//                                 className="text-center sticky-action-header"
//                               >
//                                 {action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()}
//                               </CTableHeaderCell>
//                             ))}
//                           </CTableRow>
//                         </CTableHead>
//                         <CTableBody className="permission-table-body">
//                           {Object.entries(groupedPermissions).map(([module, actions]) => (
//                             <CTableRow key={module}>
//                               <CTableHeaderCell scope="row" className="sticky-module-cell">{module}</CTableHeaderCell>
//                               {availableActions.map((action) => (
//                                 <CTableDataCell key={`${module}-${action}`} className="text-center">
//                                   {actions.some((a) => a.action === action) ? (
//                                     <CFormCheck
//                                       type="checkbox"
//                                       checked={isPermissionEnabled(module, action)}
//                                       onChange={() => toggleAction(module, action)}
//                                       aria-label={`${module}-${action}`}
//                                     />
//                                   ) : (
//                                     <span>-</span>
//                                   )}
//                                 </CTableDataCell>
//                               ))}
//                             </CTableRow>
//                           ))}
//                         </CTableBody>
//                       </CTable>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="button-row mt-4">
//               <button type="submit" className="simple-button primary-button">
//                 Save
//               </button>
//               <button type="button" className="simple-button secondary-button" onClick={handleCancel}>
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddUser;




import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import '../../css/permission.css';
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CButtonGroup,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showError, showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import { jwtDecode } from 'jwt-decode';

function AddUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    branch: '',
    roleId: '',
    discount: '',
    permissions: []
  });

  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [permissionsData, setPermissionsData] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [availableActions, setAvailableActions] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPermissions, setShowPermissions] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.user_id) {
          setFormData((prevData) => ({
            ...prevData,
            created_by: decoded.user_id
          }));
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
    fetchRoles();
    fetchBranches();
    fetchAllPermissions();
  }, [id]);

  const fetchUser = async (id) => {
    try {
      const res = await axiosInstance.get(`/users/${id}`);
      const userData = res.data.data;
      const normalizedData = {
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        branch: userData.branchDetails?._id || '',
        roleId: userData.roles[0]?._id || '',
        discount: userData.discount || '',
         permissions: userData.permissions?.map(p => p.permission) || []
      };
      setFormData(normalizedData);
      if (normalizedData.roleId) {
        setShowPermissions(true);
      }
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get('/roles');
      setRoles(response.data.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      showFormSubmitError(error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      showError(error);
    }
  };

  const fetchAllPermissions = async () => {
    try {
      const res = await axiosInstance.get('/permissions');
      setPermissionsData(res.data.data);
      
      const grouped = res.data.data.reduce((acc, permission) => {
        const module = permission.module;
        if (!acc[module]) {
          acc[module] = [];
        }
        acc[module].push({
          action: permission.action,
          id: permission._id
        });
        return acc;
      }, {});

      setGroupedPermissions(grouped);

      const actions = [...new Set(res.data.data.map((p) => p.action))];
      setAvailableActions(actions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const fetchRolePermissions = async (roleId) => {
  setIsLoadingPermissions(true);
  try {
    const res = await axiosInstance.get(`/roles/${roleId}`);
    const rolePermissions = res.data.data.permissions || [];
    setFormData(prev => ({
      ...prev,
      // Only add role permissions if they're not already in the user's permissions
      permissions: [...new Set([...prev.permissions, ...rolePermissions.map(p => p._id)])]
    }));
  } catch (error) {
    console.error('Error fetching role permissions:', error);
  } finally {
    setIsLoadingPermissions(false);
  }
};

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

    if (name === 'roleId') {
      setShowPermissions(true);
      if (value) {
        await fetchRolePermissions(value);
      } else {
        setFormData(prev => ({ ...prev, permissions: [] }));
      }
    }
  };
  const handleRoleChange = async (e) => {
  const { value } = e.target;
  setFormData(prev => ({ ...prev, roleId: value }));
  setErrors(prev => ({ ...prev, roleId: '' }));

  if (value) {
    setShowPermissions(true);
    // For new users, replace permissions with role permissions
    if (!id) {
      await fetchRolePermissions(value);
    }
    // For existing users, just show the current permissions
  } else {
    setFormData(prev => ({ ...prev, permissions: [] }));
  }
};

  const toggleAction = (module, action) => {
    setFormData((prev) => {
      const permission = permissionsData.find((p) => p.module === module && p.action === action);
      let newPermissions = [...prev.permissions];

      if (permission) {
        const permIndex = newPermissions.indexOf(permission._id);
        if (permIndex >= 0) {
          newPermissions.splice(permIndex, 1);
        } else {
          newPermissions.push(permission._id);
        }
      }

      return { ...prev, permissions: newPermissions };
    });
  };

  const handleGlobalAction = (actionType) => {
    setFormData((prev) => {
      let newPermissions = [];

      if (actionType === 'none') {
        return { ...prev, permissions: [] };
      }

      if (actionType === 'selectAll') {
        newPermissions = permissionsData.map(p => p._id);
      }

      if (actionType === 'viewOnly') {
        newPermissions = permissionsData
          .filter(p => p.action === 'READ')
          .map(p => p._id);
      }

      return { ...prev, permissions: newPermissions };
    });
  };

  const isPermissionEnabled = (module, action) => {
    const permission = permissionsData.find((p) => p.module === module && p.action === action);
    return permission && formData.permissions.includes(permission._id);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.roleId) newErrors.roleId = 'Role is required';

    const selectedRole = roles.find(role => role._id === formData.roleId);
    if (selectedRole?.name === 'SALES_EXECUTIVE') {
      if (formData.discount === '' || formData.discount === null) {
        newErrors.discount = 'Discount is required for Sales Executive';
      } else if (isNaN(Number(formData.discount))) {
        newErrors.discount = 'Discount must be a number';
      } else if (Number(formData.discount) < 0) {
        newErrors.discount = 'Discount must be positive';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      branch: formData.branch,
      roleId: formData.roleId,
      ...(formData.discount !== '' && { discount: Number(formData.discount) }),
      permissions: formData.permissions
    };

    try {
      if (id) {
        await axiosInstance.put(`/users/${id}`, payload);
        await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
      } else {
        await axiosInstance.post('/auth/register', payload);
        await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/users/users-list');
  };

  return (
    <div>
      <h4>{id ? 'Edit' : 'Add'} User</h4>
      <div className="form-container">
        <div className="page-header">
          <form onSubmit={handleSubmit}>
            <div className="form-note">
              <span className="required">*</span> Field is mandatory
            </div>
            
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                  />
                </CInputGroup>
                {errors.name && <p className="error">{errors.name}</p>}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Email</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilEnvelopeClosed} />
                  </CInputGroupText>
                  <CFormInput 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                  />
                </CInputGroup>
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Branch</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLocationPin} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="branch" 
                    value={formData.branch} 
                    onChange={handleChange}
                  >
                    <option value="">-Select-</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.branch && <p className="error">{errors.branch}</p>}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Role</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="roleId" 
                    value={formData.roleId} 
                    onChange={handleRoleChange}
                  >
                    <option value="">-Select-</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.roleId && <p className="error">{errors.roleId}</p>}
              </div>
              
              {roles.find((role) => role._id === formData.roleId)?.name === 'SALES_EXECUTIVE' && (
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Discount</span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilDollar} />
                    </CInputGroupText>
                    <CFormInput 
                      type="number" 
                      name="discount" 
                      value={formData.discount} 
                      onChange={handleChange} 
                      min="0"
                    />
                  </CInputGroup>
                  {errors.discount && <p className="error">{errors.discount}</p>}
                </div>
              )}

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Mobile number</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput 
                    type="tel" 
                    name="mobile" 
                    value={formData.mobile} 
                    onChange={handleChange} 
                  />
                </CInputGroup>
                {errors.mobile && <p className="error">{errors.mobile}</p>}
              </div>
            </div>

            {showPermissions && (
              <div className="permissions-section mt-4">
                <h5>Permissions</h5>
                <div className="permissions-actions mb-3">
                  <CButtonGroup>
                    <CButton color="secondary" onClick={() => handleGlobalAction('none')} variant="outline">
                      None
                    </CButton>
                    <CButton color="secondary" onClick={() => handleGlobalAction('selectAll')} variant="outline">
                      Select All
                    </CButton>
                    <CButton color="secondary" onClick={() => handleGlobalAction('viewOnly')} variant="outline">
                      View Only
                    </CButton>
                  </CButtonGroup>
                </div>

                {isLoadingPermissions ? (
                  <div className="text-center py-4">Loading permissions...</div>
                ) : (
                  <div className="permissions-table-container">
                    <div className="permission-table-wrapper">
                      <CTable bordered responsive hover small className="permission-table">
                        <CTableHead color="light" className="permission-table-header">
                          <CTableRow>
                            <CTableHeaderCell scope="col" className="sticky-module-header">Module</CTableHeaderCell>
                            {availableActions.map((action) => (
                              <CTableHeaderCell 
                                key={action} 
                                scope="col" 
                                className="text-center sticky-action-header"
                              >
                                {action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()}
                              </CTableHeaderCell>
                            ))}
                          </CTableRow>
                        </CTableHead>
                        <CTableBody className="permission-table-body">
                          {Object.entries(groupedPermissions).map(([module, actions]) => (
                            <CTableRow key={module}>
                              <CTableHeaderCell scope="row" className="sticky-module-cell">{module}</CTableHeaderCell>
                              {availableActions.map((action) => (
                                <CTableDataCell key={`${module}-${action}`} className="text-center">
                                  {actions.some((a) => a.action === action) ? (
                                    <CFormCheck
                                      type="checkbox"
                                      checked={isPermissionEnabled(module, action)}
                                      onChange={() => toggleAction(module, action)}
                                      aria-label={`${module}-${action}`}
                                    />
                                  ) : (
                                    <span>-</span>
                                  )}
                                </CTableDataCell>
                              ))}
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="button-row mt-4">
              <button type="submit" className="simple-button primary-button">
                Save
              </button>
              <button type="button" className="simple-button secondary-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;



