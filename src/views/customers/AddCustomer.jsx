import React, { useState,useEffect } from 'react';
import '../../css/form.css'
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormSwitch } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilCheckCircle, cilClipboard, cilEnvelopeClosed, cilGarage,cilListRich, cilLocationPin, cilMap, cilPhone, cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

function AddCustomer() {
const [formData,setFormData] = useState({
    name:'',
    address:'',
    taluka:'',
    district:'',
    mobile1:'',
    mobile2:''
  })
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const {id} = useParams();
  
  useEffect(() => {
    if(id){
      fetchCustomer(id);
    }
  },[id])
   const fetchCustomer = async (id) => {
    try{
      const res = await axiosInstance.get(`/customers/${id}`)
      setFormData(res.data.data.customer);
    } catch(error){
      console.error('Error fetching customers:', error);
    }
   }

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.name) formErrors.name = 'This field is required';
    if (!formData.address) formErrors.address = 'This field is required';
    if (!formData.taluka) formErrors.taluka = 'This fieldrequired';
    if (!formData.district) formErrors.district = 'This field is required';
    if (!formData.mobile1) formErrors.mobile1 = 'This field is required';
    if (!formData.mobile2) formErrors.mobile2 = 'This field is required';
  
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      if(id){
        await axiosInstance.patch(`/customers/${id}`, formData);
        await showFormSubmitToast('Customer updated successfully!', 
          () => navigate('/customers/customers-list'));
  
        navigate('/customers/customers-list');
      } else{
        await axiosInstance.post('/customers', formData);
        await showFormSubmitToast('Customer added successfully!', 
          () => navigate('/customers/customers-list'));
  
        navigate('/customers/customers-list');
      }
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error)
    }
  };

  const handleCancel = () => {
    navigate('/customers/customers-list');
  };
  return (
    <div>
     <h4>{id ? 'Edit' : 'Add'} Customer</h4>
    <div className="form-container">
      <div className="page-header">
        <form  onSubmit={handleSubmit}>
          <div className="form-note">
            <span className="required">*</span> Field is mandatory
          </div>
          <div className="user-details">

          <div className="input-box">
              <div className="details-container">
                <span className="details">Type</span>
                <span className="required">*</span>
              </div>
              <CInputGroup>
                <CInputGroupText className="input-icon">
                  <CIcon icon={cilCheckCircle} />
                </CInputGroupText>
                <CFormSelect name="type" value={formData.type} onChange={handleChange}>
                  <option value="">-Select-</option>
                  <option value="EV">B2B</option>
                  <option value="ICE">B2C</option>
                </CFormSelect>
              </CInputGroup>
              {errors.type && <p className="error">{errors.type}</p>}
            </div>
            <div className="input-box">
            <div className="details-container">
              <span className="details">Purchase History</span>
              <span className="required">*</span>
              </div>
              <CInputGroup>
                <CInputGroupText className="input-icon">
                  <CIcon icon={cilLocationPin} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </CInputGroup>
              {errors.address && <p className="error">{errors.address}</p>}
            </div>
            <div className="input-box">
            <div className="details-container">
              <span className="details">Preferred Financier</span>
              <span className="required">*</span>
              </div>
              <CInputGroup>
                <CInputGroupText className="input-icon">
                  <CIcon icon={cilBuilding} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="taluka"
                  value={formData.taluka}
                  onChange={handleChange}
                />
              </CInputGroup>
              {errors.taluka && <p className="error">{errors.taluka}</p>}
            </div>
            <div className="input-box">
            <div className="details-container">
              <span className="details">Loyalty Points
              </span>
              <span className="required">*</span>
              </div>
              <CInputGroup>
                <CInputGroupText className="input-icon">
                  <CIcon icon={cilLocationPin} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                />
              </CInputGroup>
              {errors.district && <p className="error">{errors.district}</p>}
            </div>
          </div>
         <FormButtons onCancel={handleCancel}/>
        </form>
      </div>
    </div>
    </div>
  );
}
export default AddCustomer;
