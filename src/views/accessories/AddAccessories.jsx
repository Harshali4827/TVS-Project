import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilLocationPin, cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';
import '../../css/offer.css';

function AddAccessories() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    part_number: '',
    applicable_models: [],
    part_number_status: 'active',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [models, setModels] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchAccessory(id);
    }
  }, [id]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axiosInstance.get('/models');
        setModels(response.data.data.models);
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    };

    fetchModels();
  }, []);

  const fetchAccessory = async (id) => {
    try {
      const res = await axiosInstance.get(`/accessories/${id}`);
      setFormData({
        ...res.data.data.accessory,
        applicable_models: res.data.data.accessory.applicable_models || []
      });
    } catch (error) {
      console.error('Error fetching accessory:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleModelSelect = (modelId) => {
    setFormData((prevData) => {
      const isSelected = prevData.applicable_models.includes(modelId);
      return {
        ...prevData,
        applicable_models: isSelected ? prevData.applicable_models.filter((id) => id !== modelId) : [...prevData.applicable_models, modelId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.name) formErrors.name = 'This field is required';
    if (!formData.price) formErrors.price = 'This field is required';
    if (formData.applicable_models.length === 0) {
      formErrors.applicable_models = 'Please select at least one compatible model';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        part_number: formData.part_number,
        applicable_models: formData.applicable_models,
        part_number_status: 'active',
        status: 'active'
      };

      if (id) {
        await axiosInstance.put(`/accessories/${id}`, payload);
        await showFormSubmitToast('Accessory updated successfully!');
        navigate('/accessories/accessories-list');
      } else {
        await axiosInstance.post('/accessories', payload);
        await showFormSubmitToast('Accessory added successfully!');
        navigate('/accessories/accessories-list');
      }
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/accessories/accessories-list');
  };

  return (
    <div>
      <h4>{id ? 'Edit' : 'Add'} Accessories</h4>
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
                <span className="details">Description</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="description" value={formData.description} onChange={handleChange} />
                </CInputGroup>
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Price</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormInput type="text" name="price" value={formData.price} onChange={handleChange} />
                </CInputGroup>
                {errors.price && <p className="error">{errors.price}</p>}
              </div>

              <div className="input-box">
                <span className="details">Part Number</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormInput type="text" name="part_number" value={formData.part_number} onChange={handleChange} />
                </CInputGroup>
              </div>
            </div>

            <div className="offer-container">
              <form className="permissions-form">
                <h4>
                  Compatible Models <span className="required">*</span>
                </h4>
                <div className="permissions-grid">
                  {models.map((model) => {
                    const modelId = model._id || model.id;
                    const isSelected = formData.applicable_models.includes(modelId);
                    return (
                      <div key={modelId} className="permission-item">
                        <label>
                          <input type="checkbox" checked={isSelected} onChange={() => handleModelSelect(modelId)} />
                          {model.model_name}
                        </label>
                      </div>
                    );
                  })}

                  {errors.applicable_models && <p className="error">{errors.applicable_models}</p>}
                </div>
              </form>
            </div>

            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAccessories;
