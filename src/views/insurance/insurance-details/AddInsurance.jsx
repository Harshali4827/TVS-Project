import React, { useState, useEffect } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormSwitch } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilLocationPin, cilMobile, cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

function AddInsurance() {
  const [formData, setFormData] = useState({
    provider_name: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchInsuranceProvider(id);
    }
  }, [id]);
  const fetchInsuranceProvider = async (id) => {
    try {
      const res = await axiosInstance.get(`/insurance-providers/${id}`);
      setFormData(res.data.data);
    } catch (error) {
      console.error('Error fetching insurance providers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.provider_name) formErrors.provider_name = 'This field is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/insurance-providers/${id}`, formData);
        await showFormSubmitToast('Insurance Provider updated successfully!', () => navigate('/insurance-list'));

        navigate('/insurance-list');
      } else {
        await axiosInstance.post('/insurance-receipt', formData);
        await showFormSubmitToast('Insurance data added successfully!', () => navigate('/insurance-list'));

        navigate('/insurance-list');
      }
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/insurance-list');
  };
  return (
    <div>
      <h4>{id ? 'Edit' : 'Add'} Insurance</h4>
      <div className="form-container">
        <div className="page-header">
          <form onSubmit={handleSubmit}>
            <div className="form-note">
              <span className="required">*</span> Field is mandatory
            </div>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Customer Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="C_Name" value={formData.C_Name} onChange={handleChange} />
                </CInputGroup>
                {errors.C_Name && <p className="error">{errors.C_Name}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Chassis Number</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="Chasis_No" value={formData.Chasis_No} onChange={handleChange} />
                </CInputGroup>
                {errors.Chasis_No && <p className="error">{errors.Chasis_No}</p>}
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
                  <CFormInput type="text" name="provider_name" value={formData.provider_name} onChange={handleChange} />
                </CInputGroup>
                {errors.provider_name && <p className="error">{errors.provider_name}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Model</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="Model" value={formData.Model} onChange={handleChange} />
                </CInputGroup>
                {errors.Model && <p className="error">{errors.Model}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Vehicle Reg No.</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="vehicleRegNo" value={formData.vehicleRegNo} onChange={handleChange} />
                </CInputGroup>
                {errors.vehicleRegNo && <p className="error">{errors.vehicleRegNo}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Insurance Premium Amount</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="PremiumAmount" value={formData.PremiumAmount} onChange={handleChange} />
                </CInputGroup>
                {errors.PremiumAmount && <p className="error">{errors.PremiumAmount}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Insurance Date</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="Insurance_Date" value={formData.Insurance_Date} onChange={handleChange} />
                </CInputGroup>
                {errors.Insurance_Date && <p className="error">{errors.Insurance_Date}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Policy No</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="PolicyNo" value={formData.PolicyNo} onChange={handleChange} />
                </CInputGroup>
                {errors.PolicyNo && <p className="error">{errors.PolicyNo}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">PSA policy No</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="PSAPollicyNo" value={formData.PSAPollicyNo} onChange={handleChange} />
                </CInputGroup>
                {errors.PSAPollicyNo && <p className="error">{errors.PSAPollicyNo}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">CMS Policy No</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="CMSpolicyNo" value={formData.CMSpolicyNo} onChange={handleChange} />
                </CInputGroup>
                {errors.CMSpolicyNo && <p className="error">{errors.CMSpolicyNo}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">ValidUp to</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="date" name="validUpto" value={formData.validUpto} onChange={handleChange} />
                </CInputGroup>
                {errors.validUpto && <p className="error">{errors.validUpto}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Company</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="InsuranceCompany" value={formData.InsuranceCompany} onChange={handleChange} />
                </CInputGroup>
                {errors.InsuranceCompany && <p className="error">{errors.InsuranceCompany}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Payment Mode</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect name="type" value={formData.PaymentMode} onChange={handleChange}>
                    <option value="">-Select-</option>
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                    <option value="card">Card</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.PaymentMode && <p className="error">{errors.PaymentMode}</p>}
              </div>
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddInsurance;
