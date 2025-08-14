// import React, { useState, useEffect } from 'react';
// import '../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilUser } from '@coreui/icons';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
// import axiosInstance from 'axiosInstance';
// import FormButtons from 'utils/FormButtons';

// function UploadKYC() {
//   const [formData, setFormData] = useState({
//     bookingId: '',
//     aadharFront: '',
//     aadharBack: '',
//     panCard: '',
//     vPhoto: '',
//     chasisNoPhoto: '',
//     addressProof1: '',
//     addressProof2: ''
//   });
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const location = useLocation();

//   useEffect(() => {
//     if (location.state) {
//       setFormData((prev) => ({
//         ...prev,
//         bookingId: location.state.bookingId,
//         customerName: location.state.customerName,
//         address: location.state.address
//       }));
//     }
//   }, [location.state]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let formErrors = {};

//     if (!formData.name) formErrors.name = 'This field is required';

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     try {
//       if (id) {
//         await axiosInstance.put(`/financers/providers/${id}`, formData);
//         await showFormSubmitToast('Financer updated successfully!', () => navigate('/financer/financer-list'));

//         navigate('/financer/financer-list');
//       } else {
//         await axiosInstance.post(`/kyc/${bookingId}/submit`, formData);
//         await showFormSubmitToast('Financer added successfully!', () => navigate('/financer/financer-list'));

//         navigate('/financer/financer-list');
//       }
//     } catch (error) {
//       console.error('Error details:', error);
//       showFormSubmitError(error);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/financer/financer-list');
//   };
//   return (
//     <div>
//       <h4>Customer KYC Details</h4>
//       <div className="form-container">
//         <div className="page-header">
//           <form onSubmit={handleSubmit}>
//             <div className="form-note">
//               <span className="required">*</span> Field is mandatory
//             </div>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Booking ID</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="name" value={formData.bookingId} onChange={handleChange} />
//                 </CInputGroup>
//                 {errors.bookingId && <p className="error">{errors.bookingId}</p>}
//               </div>
//               <div className="input-box">
//                 <span className="details">Customer Name</span>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="text" value={formData.customerName} onChange={handleChange} />
//                 </CInputGroup>
//               </div>

//               <div className="input-box">
//                 <span className="details">Address</span>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="text" value={formData.address} onChange={handleChange} />
//                 </CInputGroup>
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Aadhar Front</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="file" name="name" value={formData.aadharFront} onChange={handleChange} />
//                 </CInputGroup>
//                 {errors.aadharFront && <p className="error">{errors.aadharFront}</p>}
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Aadhar Back</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="file"
//                     name="aadharBack
// "
//                     value={formData.aadharBack}
//                     onChange={handleChange}
//                   />
//                 </CInputGroup>
//                 {errors.aadharBack && <p className="error">{errors.aadharBack}</p>}
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Pan Card</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="file" name="panCard" value={formData.panCard} onChange={handleChange} />
//                 </CInputGroup>
//                 {errors.panCard && <p className="error">{errors.panCard}</p>}
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">V_Photo</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="file" name="vPhoto" value={formData.vPhoto} onChange={handleChange} />
//                 </CInputGroup>
//                 {errors.vPhoto && <p className="error">{errors.vPhoto}</p>}
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Chassis No.Photo</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="file" name="chasisNoPhoto" value={formData.chasisNoPhoto} onChange={handleChange} />
//                 </CInputGroup>
//                 {errors.chasisNoPhoto && <p className="error">{errors.chasisNoPhoto}</p>}
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Address Proof</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="file" name="addressProof1" value={formData.addressProof1} onChange={handleChange} />
//                 </CInputGroup>
//                 {errors.addressProof1 && <p className="error">{errors.addressProof1}</p>}
//               </div>
//               <div className="input-box">
//                 <span className="details">Address Proof 2</span>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="file" name="addressProof2" value={formData.addressProof2} onChange={handleChange} />
//                 </CInputGroup>
//               </div>
//             </div>
//             <FormButtons onCancel={handleCancel} />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default UploadKYC;

import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCamera, cilCarAlt, cilCreditCard, cilFingerprint, cilHome, cilLocationPin, cilTag, cilUser } from '@coreui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

function UploadKYC() {
  const [formData, setFormData] = useState({
    bookingId: '',
    customerName: '',
    address: '',
    aadharFront: null,
    aadharBack: null,
    panCard: null,
    vPhoto: null,
    chasisNoPhoto: null,
    addressProof1: null,
    addressProof2: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        bookingId: location.state.bookingId,
        customerName: location.state.customerName,
        address: location.state.address
      }));
    }
  }, [location.state]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const requiredFields = {
      aadharFront: 'Aadhar Front is required',
      aadharBack: 'Aadhar Back is required',
      panCard: 'PAN Card is required',
      vPhoto: 'Voter Photo is required',
      chasisNoPhoto: 'Chassis Photo is required',
      addressProof1: 'Address Proof is required'
    };

    let formErrors = {};
    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]) {
        formErrors[field] = message;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      await axiosInstance.post(`/kyc/${formData.bookingId}/submit`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      await showFormSubmitToast('KYC documents uploaded successfully!');
      navigate('/booking-list');
    } catch (error) {
      console.error('Error uploading KYC:', error);
      showFormSubmitError(error.response?.data?.message || 'Failed to upload KYC documents');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/booking-list');
  };

  return (
    <div>
      <h4>Customer KYC Details</h4>
      <div className="form-container">
        <div className="page-header">
          <form onSubmit={handleSubmit}>
            <div className="form-note">
              <span className="required">*</span> Field is mandatory
            </div>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Booking ID</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilTag} />
                  </CInputGroupText>
                  <CFormInput type="text" name="bookingId" value={formData.bookingId} onChange={handleTextChange} readOnly />
                </CInputGroup>
                {errors.bookingId && <p className="error">{errors.bookingId}</p>}
              </div>

              <div className="input-box">
                <span className="details">Customer Name</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="customerName" value={formData.customerName} onChange={handleTextChange} readOnly />
                </CInputGroup>
              </div>

              <div className="input-box">
                <span className="details">Address</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLocationPin} />
                  </CInputGroupText>
                  <CFormInput type="text" name="address" value={formData.address} onChange={handleTextChange} readOnly />
                </CInputGroup>
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Aadhar Front</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilFingerprint} />
                  </CInputGroupText>
                  <CFormInput type="file" name="aadharFront" onChange={handleFileChange} accept="image/*,.pdf" />
                </CInputGroup>
                {errors.aadharFront && <p className="error">{errors.aadharFront}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Aadhar Back</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilFingerprint} />
                  </CInputGroupText>
                  <CFormInput type="file" name="aadharBack" onChange={handleFileChange} accept="image/*,.pdf" />
                </CInputGroup>
                {errors.aadharBack && <p className="error">{errors.aadharBack}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Pan Card</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilCreditCard} />
                  </CInputGroupText>
                  <CFormInput type="file" name="panCard" onChange={handleFileChange} accept="image/*,.pdf" />
                </CInputGroup>
                {errors.panCard && <p className="error">{errors.panCard}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">V_Photo</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilCamera} />
                  </CInputGroupText>
                  <CFormInput type="file" name="vPhoto" onChange={handleFileChange} accept="image/*" />
                </CInputGroup>
                {errors.vPhoto && <p className="error">{errors.vPhoto}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Chassis No.Photo</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilCarAlt} />
                  </CInputGroupText>
                  <CFormInput type="file" name="chasisNoPhoto" onChange={handleFileChange} accept="image/*" />
                </CInputGroup>
                {errors.chasisNoPhoto && <p className="error">{errors.chasisNoPhoto}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Address Proof</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilHome} />
                  </CInputGroupText>
                  <CFormInput type="file" name="addressProof1" onChange={handleFileChange} accept="image/*,.pdf" />
                </CInputGroup>
                {errors.addressProof1 && <p className="error">{errors.addressProof1}</p>}
              </div>

              <div className="input-box">
                <span className="details">Address Proof 2</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilHome} />
                  </CInputGroupText>
                  <CFormInput type="file" name="addressProof2" onChange={handleFileChange} accept="image/*,.pdf" />
                </CInputGroup>
              </div>
            </div>
            <FormButtons onCancel={handleCancel} submitText={isSubmitting ? 'Uploading...' : 'Submit'} disabled={isSubmitting} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadKYC;
