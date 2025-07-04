import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSwitch, CFormSelect } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilEnvelopeClosed, cilLocationPin, cilMobile, cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

function AddBroker() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    branch: '',
    commissionType: '',
    fixedCommission: '',
    minCommission: '',
    maxCommission: '',
    isActive: ''
  });
  const [errors, setErrors] = useState({});
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchBroker(id);
    }
  }, [id]);
  const fetchBroker = async (id) => {
    try {
      const res = await axiosInstance.get(`/brokers/${id}`);
      setFormData(res.data.data);
    } catch (error) {
      console.error('Error fetching broker:', error);
    }
  };
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
    if (!formData.mobile) formErrors.mobile = 'This field is required';
    if (!formData.email) formErrors.email = 'This field is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    const payload = {
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      branchData: {
        branch: formData.branch,
        commissionType: formData.commissionType.toUpperCase(),
        fixedCommission: formData.fixedCommission,
        minCommission: formData.minCommission,
        maxCommission: formData.maxCommission,
        isActive: true
      }
    };
    // Clean up empty fields based on commissionType
    if (payload.branchData.commissionType === 'FIXED') {
      delete payload.branchData.minCommission;
      delete payload.branchData.maxCommission;
    } else if (payload.branchData.commissionType === 'VARIABLE') {
      delete payload.branchData.fixedCommission;
    }

    try {
      if (id) {
        await axiosInstance.patch(`/brokers/${id}`, payload);
        await showFormSubmitToast('Broker updated successfully!', () => navigate('/broker/broker-list'));

        navigate('/broker/broker-list');
      } else {
        await axiosInstance.post('/brokers', payload);
        await showFormSubmitToast('Broker added successfully!', () => navigate('/broker/broker-list'));

        navigate('/broker/broker-list');
      }
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/broker/broker-list');
  };
  return (
    <div>
      <h4>{id ? 'Edit' : 'Add'} Broker</h4>
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
                  <span className="details">Mobile Number</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilMobile} />
                  </CInputGroupText>
                  <CFormInput type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
                </CInputGroup>
                {errors.mobile && <p className="error">{errors.mobile}</p>}
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
                  <span className="details">Commision Type</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormSelect name="commissionType" value={formData.commissionType} onChange={handleChange}>
                    <option value="">-Select-</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Variable">Variable</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.commissionType && <p className="error">{errors.commissionType}</p>}
              </div>

              {formData.commissionType === 'Fixed' && (
                <>
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Fixed Commision Type</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBuilding} />
                      </CInputGroupText>
                      <CFormInput type="text" name="fixedCommission" value={formData.fixedCommission} onChange={handleChange} />
                    </CInputGroup>
                    {errors.fixedCommission && <p className="error">{errors.fixedCommission}</p>}
                  </div>
                </>
              )}

              {formData.commissionType === 'Variable' && (
                <>
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Min. Commision Price</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBuilding} />
                      </CInputGroupText>
                      <CFormInput type="text" name="minCommission" value={formData.minCommission} onChange={handleChange} />
                    </CInputGroup>
                    {errors.minCommission && <p className="error">{errors.minCommission}</p>}
                  </div>
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Max. Commision Price</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBuilding} />
                      </CInputGroupText>
                      <CFormInput type="text" name="maxCommission" value={formData.maxCommission} onChange={handleChange} />
                    </CInputGroup>
                    {errors.maxCommission && <p className="error">{errors.maxCommission}</p>}
                  </div>
                </>
              )}
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddBroker;
