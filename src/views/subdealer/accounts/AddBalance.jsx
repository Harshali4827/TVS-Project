import React, { useState, useEffect } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormSwitch } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBank, cilBuilding, cilLocationPin, cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

function AddBalance() {
  const [formData, setFormData] = useState({
    subdealer: '',
    refNumber:'',
    amount:'',
    paymentMode:'',
    bank:'',
    remark:'',
  });
  const [errors, setErrors] = useState({});
  const [subdealers, setSubdealers] = useState([]);
  const [banks, setBanks] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchInsuranceProvider(id);
    }
    fetchSubdealers();
  }, [id]);
  const fetchInsuranceProvider = async (id) => {
    try {
      const res = await axiosInstance.get(`/insurance-providers/${id}`);
      setFormData(res.data.data);
    } catch (error) {
      console.error('Error fetching insurance providers:', error);
    }
  };
    const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get('/subdealers');
      setSubdealers(response.data.data.subdealers || []);
    } catch (error) {
      console.error('Error fetching subdealers:', error);
      showError(error);
    }
  };
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axiosInstance.get('/banks');
        setBanks(response.data.data.banks || []);
      } catch (error) {
        console.error('Error fetching banks:', error);
        showError(error);
      }
    };

    fetchBanks();
  }, []);

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
        await showFormSubmitToast('Insurance Provider updated successfully!', () => navigate('/insurance-provider/provider-list'));

        navigate('/insurance-provider/provider-list');
      } else {
        await axiosInstance.post('/insurance-providers', formData);
        await showFormSubmitToast('Insurance Provider added successfully!', () => navigate('/insurance-provider/provider-list'));

        navigate('/insurance-provider/provider-list');
      }
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/insurance-provider/provider-list');
  };
  return (
    <div>
      <h4>{id ? 'Edit' : 'Add'} On Account Balance</h4>
      <div className="form-container">
        <div className="page-header">
          <form onSubmit={handleSubmit}>
            <div className="form-note">
              <span className="required">*</span> Field is mandatory
            </div>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Subdealer Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                 <CFormSelect 
                                       name="subdealer" 
                                       value={formData.subdealer} 
                                       onChange={handleChange}
                                     >
                                       <option value="">-Select-</option>
                                       {subdealers.map((subdealer) => (
                                         <option key={subdealer._id} value={subdealer._id}>
                                           {subdealer.name}
                                         </option>
                                       ))}
                                     </CFormSelect>
                </CInputGroup>
                {errors.provider_name && <p className="error">{errors.provider_name}</p>}
              </div>
               <div className="input-box">
                <div className="details-container">
                  <span className="details">UTR Number</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="refNumber" value={formData.refNumber} onChange={handleChange} />
                </CInputGroup>
                {errors.refNumber && <p className="error">{errors.refNumber}</p>}
              </div>
               <div className="input-box">
                <div className="details-container">
                  <span className="details">Amount</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="number" name="amount" value={formData.amount} onChange={handleChange} />
                </CInputGroup>
                {errors.amount && <p className="error">{errors.amount}</p>}
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
                 <CFormSelect name="paymentMode" value={formData.paymentMode} onChange={handleChange} >
                    <option value=''>-Select-</option>
                    <option value='Cash'>Cash</option>
                    <option value='Bank'>Bank</option>
                    <option value='UPI'>UPI</option>
                    <option value='RTGS'>RTGS</option>
                    <option value='Cheque'>Cheque</option>
                    <option value='Pay Order'>Pay Order</option>
                    <option value='Other'>Other</option>
                 </CFormSelect>
                </CInputGroup>
                {errors.paymentMode && <p className="error">{errors.paymentMode}</p>}
              </div>
              {formData.paymentMode === 'Bank' && (
                              <div className="input-box">
                                <div className="details-container">
                                  <span className="details">Bank Location</span>
                                  <span className="required">*</span>
                                </div>
                                <CInputGroup>
                                  <CInputGroupText className="input-icon">
                                    <CIcon icon={cilBank} />
                                  </CInputGroupText>
                                  <CFormSelect name="bank" value={formData.bank} onChange={handleChange}>
                                    <option value="">-Select-</option>
                                    {banks.map((bank) => (
                                      <option key={bank._id} value={bank.name}>
                                        {bank.name}
                                      </option>
                                    ))}
                                  </CFormSelect>
                                </CInputGroup>
                                {errors.bank && <p className="error">{errors.bank}</p>}
                              </div>
                            )}
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddBalance;
