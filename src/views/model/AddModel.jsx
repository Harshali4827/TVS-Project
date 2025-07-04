import React, { useEffect, useState } from 'react';
import '../../css/form.css'
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBike, cilCheckCircle } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import FormButtons from 'utils/FormButtons';
import axiosInstance from 'axiosInstance';

function AddModel() {
const [formData,setFormData] = useState({
  model_name:'',
  type:''
  })
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const {id} = useParams();

  useEffect(() => {
    if(id){
      fetchModel(id);
    }
  },[id])
   const fetchModel = async (id) => {
    try{
      const res = await axiosInstance.get(`/models/id/${id}`)
      setFormData(res.data.data.model);
    } catch(error){
      console.error('Error fetching condition:', error);
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

    if (!formData.model_name) formErrors.model_name = 'This field is required';
    if (!formData.type) formErrors.type = 'Type is required';
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      if(id){
        await axiosInstance.patch(`/models/base-models/${id}`, formData);
        await showFormSubmitToast('Model updated successfully!',() => navigate('/model/model-list'));
      }else{
        await axiosInstance.post('/models', formData);
        await showFormSubmitToast('Model added successfully!',() => navigate('/model/model-list'));
      }
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error)
    }
  };

  const handleCancel = () => {
    navigate('/model/model-list');
  };
  return (
    <div>
       <h4>{id ? 'Edit' : 'Add'} Model</h4>
    <div className="form-container">
      <div className="page-header">
        <form  onSubmit={handleSubmit}>
          <div className="form-note">
            <span className="required">*</span> Field is mandatory
          </div>
          <div className="user-details">

            <div className="input-box">
              <div className="details-container">
                <span className="details">Model name</span>
                <span className="required">*</span>
              </div>
              <CInputGroup>
                <CInputGroupText className="input-icon">
                  <CIcon icon={cilBike} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleChange}
                />
              </CInputGroup>
              {errors.model_name && <p className="error">{errors.model_name}</p>}
            </div>
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
                  <option value="EV">EV</option>
                  <option value="ICE">ICE</option>
                </CFormSelect>
              </CInputGroup>
              {errors.type && <p className="error">{errors.type}</p>}
            </div>
           <FormButtons onCancel={handleCancel}/>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
export default AddModel;
