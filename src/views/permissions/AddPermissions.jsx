

import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormCheck } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilList, cilUser, cilLockLocked, cilTask, cilPencil, cilTrash, cilEyedropper } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

function AddPermission() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    module: '',
    actions: {
      create: false,
      view: false,
      update: false,
      delete: false
    }
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  // List of available modules in your application
  const availableModules = ['User Management', 'Role Management', 'Permission Management', 'Financer Management', 'Content Management'];

  useEffect(() => {
    if (id) {
      fetchPermission(id);
    }
  }, [id]);

  const fetchPermission = async (id) => {
    try {
      const res = await axiosInstance.get(`/permissions/${id}`);
      setFormData(res.data.data);
    } catch (error) {
      console.error('Error fetching permission:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleActionChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      actions: {
        ...prevData.actions,
        [name]: checked
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.name) formErrors.name = 'Name is required';
    if (!formData.module) formErrors.module = 'Module is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/permissions/${id}`, formData);
        await showFormSubmitToast('Permission updated successfully!', () => navigate('/permissions/list'));
      } else {
        await axiosInstance.post('/permissions', formData);
        await showFormSubmitToast('Permission added successfully!', () => navigate('/permissions/list'));
      }
      navigate('/permissions/list');
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/permissions/list');
  };

  return (
    <div>
      <h4>{id ? 'Edit' : 'Add'} Permission</h4>
      <div className="form-container">
        <div className="page-header">
          <form onSubmit={handleSubmit}>
            <div className="form-note">
              <span className="required">*</span> Field is mandatory
            </div>
            <div className="user-details">
              {/* Name Field */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Permission Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., manage_users" />
                </CInputGroup>
                {errors.name && <p className="error">{errors.name}</p>}
              </div>

              {/* Description Field */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Description</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilList} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this permission allows"
                  />
                </CInputGroup>
              </div>

              {/* Module Selection */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Module</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilList} />
                  </CInputGroupText>
                  <CFormSelect name="module" value={formData.module} onChange={handleChange} aria-label="Select module">
                    <option value="">Select a module</option>
                    {availableModules.map((module, index) => (
                      <option key={index} value={module}>
                        {module}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.module && <p className="error">{errors.module}</p>}
              </div>

              {/* Actions Section */}
              <div>
                <div className="details-container">
                  <span className="details">Allowed Actions</span>
                </div>
                <div className="actions-container">
                  <div className="action-item">
                    <CFormCheck
                      id="create-action"
                      name="create"
                      label="Create"
                      checked={formData.actions.create}
                      onChange={handleActionChange}
                    />
                    <CIcon icon={cilTask} className="action-icon" />
                  </div>
                  <div className="action-item">
                    <CFormCheck id="view-action" name="view" label="View" checked={formData.actions.view} onChange={handleActionChange} />
                    <CIcon icon={cilEyedropper} className="action-icon" />
                  </div>
                  <div className="action-item">
                    <CFormCheck
                      id="update-action"
                      name="update"
                      label="Update"
                      checked={formData.actions.update}
                      onChange={handleActionChange}
                    />
                    <CIcon icon={cilPencil} className="action-icon" />
                  </div>
                  <div className="action-item">
                    <CFormCheck
                      id="delete-action"
                      name="delete"
                      label="Delete"
                      checked={formData.actions.delete}
                      onChange={handleActionChange}
                    />
                    <CIcon icon={cilTrash} className="action-icon" />
                  </div>
                </div>
              </div>
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPermission;
