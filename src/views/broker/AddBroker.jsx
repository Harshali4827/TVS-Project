import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import './broker.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSwitch, CFormSelect, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilEnvelopeClosed, cilLocationPin, cilMobile, cilUser, cilPlus, cilMinus } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

function AddBroker() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    otp_required: false,
    branchesData: [
      {
        branch: '',
        commissionType: '',
        fixedCommission: '',
        commissionRange: '',
        isActive: true
      }
    ]
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

  // const fetchBroker = async (id) => {
  //   try {
  //     const res = await axiosInstance.get(`/brokers/${id}`);
  //     const apiData = res.data.data;

  //     setFormData({
  //       name: apiData.name,
  //       mobile: apiData.mobile,
  //       email: apiData.email,
  //       otp_required:apiData.otp_required,
  //       branchesData: apiData.branches.map((branch) => ({
  //         branch: branch.branch._id,
  //         commissionType: branch.commissionType,
  //         fixedCommission: branch.fixedCommission,
  //         commissionRange: branch.commissionRange,
  //         isActive: branch.isActive
  //       }))
  //     });
  //   } catch (error) {
  //     console.error('Error fetching broker:', error);
  //   }
  // };
    const fetchBroker = async (id) => {
    try {
      const res = await axiosInstance.get(`/brokers/${id}`);
      const apiData = res.data.data;

      setFormData({
        name: apiData.name,
        mobile: apiData.mobile,
        email: apiData.email,
        otp_required: apiData.otp_required || false, 
        branchesData: apiData.branches.map((branch) => ({
          branch: branch.branch._id,
          commissionType: branch.commissionType,
          fixedCommission: branch.fixedCommission,
          commissionRange: branch.commissionRange,
          isActive: branch.isActive
        }))
      });
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

  const handleBranchChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBranchesData = [...formData.branchesData];
    updatedBranchesData[index] = {
      ...updatedBranchesData[index],
      [name]: value
    };

    if (name === 'commissionType') {
      if (value === 'FIXED') {
        updatedBranchesData[index].commissionRange = '';
      } else if (value === 'VARIABLE') {
        updatedBranchesData[index].fixedCommission = '';
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      branchesData: updatedBranchesData
    }));
  };

  const addBranch = () => {
    setFormData((prevData) => ({
      ...prevData,
      branchesData: [
        ...prevData.branchesData,
        {
          branch: '',
          commissionType: '',
          fixedCommission: '',
          commissionRange: '',
          isActive: true
        }
      ]
    }));
  };

  const removeBranch = (index) => {
    if (formData.branchesData.length <= 1) return;

    const updatedBranchesData = [...formData.branchesData];
    updatedBranchesData.splice(index, 1);

    setFormData((prevData) => ({
      ...prevData,
      branchesData: updatedBranchesData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.name) formErrors.name = 'This field is required';
    if (!formData.mobile) formErrors.mobile = 'This field is required';
    if (!formData.email) formErrors.email = 'This field is required';

    formData.branchesData.forEach((branchData, index) => {
      if (!branchData.branch) {
        formErrors[`branch-${index}`] = 'Branch is required';
      }
      if (!branchData.commissionType) {
        formErrors[`commissionType-${index}`] = 'Commission type is required';
      }
      if (branchData.commissionType === 'FIXED' && !branchData.fixedCommission) {
        formErrors[`fixedCommission-${index}`] = 'Fixed commission is required';
      }
      if (branchData.commissionType === 'VARIABLE' && !branchData.commissionRange) {
        formErrors[`commissionRange-${index}`] = 'Commission range is required';
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const payload = {
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      otp_required: formData.otp_required,
      branchesData: formData.branchesData.map((branch) => ({
        branch: branch.branch,
        commissionType: branch.commissionType.toUpperCase(),
        fixedCommission: branch.commissionType === 'FIXED' ? branch.fixedCommission : undefined,
        commissionRange: branch.commissionType === 'VARIABLE' ? branch.commissionRange : undefined,
        isActive: branch.isActive
      }))
    };
    try {
      if (id) {
        await axiosInstance.put(`/brokers/${id}`, payload);
        await showFormSubmitToast('Broker updated successfully!', () => navigate('/broker/broker-list'));
      } else {
        await axiosInstance.post('/brokers', payload);
        await showFormSubmitToast('Broker added successfully!', () => navigate('/broker/broker-list'));
      }
      navigate('/broker/broker-list');
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
              <span className="details">OTP Required?</span>
              <CFormSwitch
                className="custom-switch"
                id="otpRequiredSwitch"
                name="otp_required"
                label={formData.otp_required ? 'Yes' : 'No'}
                checked={formData.otp_required}
                onChange={(e) => {
                  setFormData((prev) => ({ 
                    ...prev, 
                    otp_required: e.target.checked 
                  }));
                }}
                value={formData.otp_required}
              />
            </div>
              <div className="branches-section">
                <h5>Branch Details</h5>
                {formData.branchesData.map((branchData, index) => (
                  <div key={index} className="branch-card">
                    <div className="branch-header">
                      <span>Branch {index + 1}</span>
                      {formData.branchesData.length > 1 && (
                        <CButton color="danger" size="sm" onClick={() => removeBranch(index)}>
                          <CIcon icon={cilMinus} style={{ height: '15px' }} />
                        </CButton>
                      )}
                    </div>
                    <div className="user-details">
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Branch</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilLocationPin} />
                          </CInputGroupText>
                          <CFormSelect name="branch" value={branchData.branch} onChange={(e) => handleBranchChange(index, e)}>
                            <option value="">-Select-</option>
                            {branches.map((branch) => (
                              <option key={branch._id} value={branch._id}>
                                {branch.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                        {errors[`branch-${index}`] && <p className="error">{errors[`branch-${index}`]}</p>}
                      </div>

                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Commission Type</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilBuilding} />
                          </CInputGroupText>
                          <CFormSelect
                            name="commissionType"
                            value={branchData.commissionType}
                            onChange={(e) => handleBranchChange(index, e)}
                          >
                            <option value="">-Select-</option>
                            <option value="FIXED">Fixed</option>
                            <option value="VARIABLE">Variable</option>
                          </CFormSelect>
                        </CInputGroup>
                        {errors[`commissionType-${index}`] && <p className="error">{errors[`commissionType-${index}`]}</p>}
                      </div>

                      {branchData.commissionType === 'FIXED' && (
                        <div className="input-box">
                          <div className="details-container">
                            <span className="details">Fixed Commission</span>
                            <span className="required">*</span>
                          </div>
                          <CInputGroup>
                            <CInputGroupText className="input-icon">
                              <CIcon icon={cilBuilding} />
                            </CInputGroupText>
                            <CFormInput
                              type="number"
                              name="fixedCommission"
                              value={branchData.fixedCommission}
                              onChange={(e) => handleBranchChange(index, e)}
                            />
                          </CInputGroup>
                          {errors[`fixedCommission-${index}`] && <p className="error">{errors[`fixedCommission-${index}`]}</p>}
                        </div>
                      )}

                      {branchData.commissionType === 'VARIABLE' && (
                        <div className="input-box">
                          <div className="details-container">
                            <span className="details">Price Range</span>
                            <span className="required">*</span>
                          </div>
                          <CInputGroup>
                            <CInputGroupText className="input-icon">
                              <CIcon icon={cilBuilding} />
                            </CInputGroupText>
                            <CFormSelect
                              name="commissionRange"
                              value={branchData.commissionRange}
                              onChange={(e) => handleBranchChange(index, e)}
                            >
                              <option value="">-Select-</option>
                              <option value="1-20000">1 - 20000</option>
                              <option value="20001-40000">20001-40000</option>
                              <option value="40001-60000">40001-60000</option>
                              <option value="60001">60001 above</option>
                            </CFormSelect>
                          </CInputGroup>
                          {errors[`commissionRange-${index}`] && <p className="error">{errors[`commissionRange-${index}`]}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div>
                  <CButton color="primary" onClick={addBranch}>
                    <CIcon icon={cilPlus} style={{ height: '15px' }} />
                  </CButton>
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

export default AddBroker;
