import React, { useEffect, useState, useMemo } from 'react';
import '../../css/form.css';

import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSwitch,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilListRich, cilUser } from '@coreui/icons';

import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

const MODULES = [
  'Users',
  'Role',
  'Location',
  'Model',
  'Accessory',
  'Headers',
  'Documents',
  'Terms & Conditions',
  'Offers',
  'Customers',
  'Quotation'
];

const ACTIONS = ['create', 'read', 'update', 'delete'];

const slugify = (label) =>
  label
    .toLowerCase()
    .replace(/\s*&\s*/g, ' & ')
    .replace(/\s+/g, '_')
    .replace(/&/g, 'and');

function CreateRole() {
  const navigate = useNavigate();
  const { id } = useParams();

  const initialPermissions = useMemo(() => MODULES.map((m) => ({ resource: slugify(m), actions: [] })), []);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: initialPermissions
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) fetchRole(id);
  }, [id]);

  const fetchRole = async (roleId) => {
    try {
      const res = await axiosInstance.get(`/roles/${roleId}`);
      const serverPerms = res.data.data.permissions ?? [];
      const merged = MODULES.map((m) => {
        const slug = slugify(m);
        const found = serverPerms.find((p) => p.resource === slug);
        return found ? { resource: slug, actions: found.actions } : { resource: slug, actions: [] };
      });

      setFormData({
        ...res.data.data,
        permissions: merged
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
  const toggleAction = (rowIndex, action) => {
    setFormData((prev) => {
      const permissions = [...prev.permissions];
      const actions = new Set(permissions[rowIndex].actions);

      actions.has(action) ? actions.delete(action) : actions.add(action);

      permissions[rowIndex].actions = Array.from(actions);
      return { ...prev, permissions };
    });
  };

  /* ---------------- validation ------------------------------------- */
  const validate = () => {
    const { name, permissions } = formData;
    const errs = {};

    if (!name.trim()) errs.name = 'Role name is required';
    const invalidRows = permissions.filter((p) => !p.actions.length);
    if (invalidRows.length === permissions.length) errs.permissions = 'Please grant at least one permission';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ---------------- submit ----------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const filteredPermissions = formData.permissions.filter((p) => p.actions.length > 0);

    const payload = {
      ...formData,
      permissions: filteredPermissions
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
            </div>

            {/* ------------ Permissions table ------------- */}
            <div className="permissions-container">
              <h6 className="mb-3">Permissions</h6>

              <CTable bordered responsive hover small className="permission-table">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Module</CTableHeaderCell>
                    {ACTIONS.map((a) => (
                      <CTableHeaderCell key={a} scope="col" className="text-center">
                        {a.charAt(0).toUpperCase() + a.slice(1)}
                      </CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {MODULES.map((module, rowIdx) => (
                    <CTableRow key={module}>
                      <CTableHeaderCell scope="row">{module}</CTableHeaderCell>
                      {ACTIONS.map((action) => (
                        <CTableDataCell key={action} className="text-center">
                          <CFormCheck
                            type="checkbox"
                            checked={formData.permissions[rowIdx].actions.includes(action)}
                            onChange={() => toggleAction(rowIdx, action)}
                            aria-label={`${module}-${action}`}
                          />
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
