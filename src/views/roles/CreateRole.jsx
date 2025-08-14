import React, { useEffect, useState, useMemo } from 'react';
import '../../css/form.css';
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CButtonGroup,
  CCol,
  CRow,
  CFormSwitch
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilListRich, cilUser } from '@coreui/icons';

import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

function CreateRole() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [permissionsData, setPermissionsData] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [availableActions, setAvailableActions] = useState([]);

  const initialPermissions = useMemo(() => {
    return Object.keys(groupedPermissions).map((module) => ({
      module,
      actions: []
    }));
  }, [groupedPermissions]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    permissions: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPermissions();
    if (id) fetchRole(id);
  }, [id]);
  const fetchPermissions = async () => {
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

  const fetchRole = async (roleId) => {
    try {
      const res = await axiosInstance.get(`/roles/${roleId}`);
      const serverPerms = res.data.data.permissions ?? [];
      if (permissionsData.length === 0) {
        await fetchPermissions();
      }
      const selectedPermissionIds = serverPerms.map((perm) => {
        if (typeof perm === 'object' && perm._id) {
          return perm._id;
        }
        return perm;
      });

      setFormData({
        ...res.data.data,
        permissions: selectedPermissionIds
      });
    } catch (error) {
      console.error('Error fetching role:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const toggleAction = (module, action) => {
    setFormData((prev) => {
      const permission = permissionsData.find((p) => p.module === module && p.action === action);
      let newPermissions = [...prev.permissions];

      if (permission) {
        const permIndex = newPermissions.findIndex((p) => p === permission._id);
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
        permissionsData.forEach((permission) => {
          newPermissions.push(permission._id);
        });
      }

      if (actionType === 'viewOnly') {
        permissionsData.forEach((permission) => {
          if (permission.action === 'READ') {
            newPermissions.push(permission._id);
          }
        });
      }

      return { ...prev, permissions: newPermissions };
    });
  };

  const validate = () => {
    const { name, permissions } = formData;
    const errs = {};

    if (!name.trim()) errs.name = 'Role name is required';
    if (permissions.length === 0) errs.permissions = 'Please grant at least one permission';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData
    };

    try {
      if (id) {
        await axiosInstance.put(`/roles/${id}`, payload);
        await showFormSubmitToast('Role updated successfully!', () => navigate('/roles/all-role'));
      } else {
        await axiosInstance.post('/roles', payload);
        await showFormSubmitToast('Role created successfully!', () => navigate('/roles/all-role'));
      }
    } catch (error) {
      console.error('Role save error:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => navigate('/roles/all-role');
  const isPermissionEnabled = (module, action) => {
    const permission = permissionsData.find((p) => p.module === module && p.action === action);

    if (permission && formData.permissions.includes(permission._id)) {
      return true;
    }

    return formData.permissions.includes(`${module}.${action}`);
  };

  return (
    <div>
      <h4>{id ? 'Edit' : 'Add'} Role</h4>

      <div className="form-container">
        <div className="page-header">
          <form onSubmit={handleSubmit}>
            <div className="form-note">
              <span className="required">*</span> Field is mandatory
            </div>

            {/* ------------ Details block ------------- */}
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Role Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="name" value={formData.name} onChange={handleChange} />
                </CInputGroup>
                {errors.name && <p className="error">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="input-box">
                <span className="details">Description</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilListRich} />
                  </CInputGroupText>
                  <CFormInput type="text" name="description" value={formData.description} onChange={handleChange} />
                </CInputGroup>
              </div>

              {/* <div className="input-box">
                <span className="details">Active Status</span>
                <CFormSwitch label={isActive ? 'Active' : 'Inactive'} checked={isActive} onChange={toggleActive} />
              </div> */}
            </div>

            {/* ------------ Permissions table ------------- */}
            <div className="permissions-container">
              <CRow className="mb-3 align-items-center">
                <CCol>
                  <h6 className="mb-0">Permissions</h6>
                </CCol>
                <CCol className="text-end">
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
                </CCol>
              </CRow>

              <CTable bordered responsive hover small className="permission-table">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Module</CTableHeaderCell>
                    {availableActions.map((action) => (
                      <CTableHeaderCell key={action} scope="col" className="text-center">
                        {action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()}
                      </CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {Object.entries(groupedPermissions).map(([module, actions]) => (
                    <CTableRow key={module}>
                      <CTableHeaderCell scope="row">{module}</CTableHeaderCell>
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

              {errors.permissions && (
                <p className="error" style={{ color: 'red' }}>
                  {errors.permissions}
                </p>
              )}
            </div>

            {/* ------------ Buttons ------------- */}
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateRole;
