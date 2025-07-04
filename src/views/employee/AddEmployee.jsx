import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    branch: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchEmployee(id);
    }
  }, [id]);
  const fetchEmployee = async (id) => {
    try {
      const res = await axiosInstance.get(`/employees/${id}`);
      setFormData(res.data.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get('/roles');
        setRoles(response.data.data || []);
      } catch (error) {
        console.error('Error fetching roles:', error);
        showFormSubmitError(error);
      }
    };

    fetchRoles();
  }, []);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
        showError(error);
      }
    };

    fetchBranches();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.name) formErrors.name = 'This field is required';
    if (!formData.contact) formErrors.contact = 'This field is required';
    if (!formData.email) formErrors.email = 'This field is required';
    if (!formData.branch) formErrors.branch = 'This field is required';
    if (!formData.role) formErrors.role = 'This field is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/employees/${id}`, formData);
        await showFormSubmitToast('Employee updated successfully!', () => navigate('/employee/employee-list'));

        navigate('/employee/employee-list');
      } else {
        await axiosInstance.post('/employees', formData);
        await showFormSubmitToast('Emploee added successfully!', () => navigate('/employee/employee-list'));

        navigate('/employee/employee-list');
      }
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/employee/employee-list');
  };
  return (
    <div>
      <h4>{id ? 'Edit' : 'Add'} Employee</h4>
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
                  <CFormInput type="text" name="name" value={formData.name} onChange={handleChange} />
                </CInputGroup>
                {errors.name && <p className="error">{errors.name}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Contact Number</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput type="text" name="contact" value={formData.contact} onChange={handleChange} />
                </CInputGroup>
                {errors.contact && <p className="error">{errors.contact}</p>}
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
                  <CFormInput type="text" name="email" value={formData.email} onChange={handleChange} />
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
                  <CFormSelect name="branch" value={formData.branch} onChange={handleChange}>
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
                  <CFormSelect name="role" value={formData.role} onChange={handleChange}>
                    <option value="">-Select-</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.role && <p className="error">{errors.role}</p>}
              </div>
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddEmployee;
