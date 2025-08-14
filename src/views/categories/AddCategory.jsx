import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilList, cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

function AddCategory() {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchCategory(id);
    }
  }, [id]);
  const fetchCategory = async (id) => {
    try {
      const res = await axiosInstance.get(`/accessory-categories/${id}`);
      setFormData(res.data.data.category);
    } catch (error) {
      console.error('Error fetching category:', error);
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

    if (!formData.name) formErrors.name = 'This field is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/accessory-categories/${id}`, formData);
        await showFormSubmitToast('Category updated successfully!', () => navigate('/categories/categories-list'));

        navigate('/categories/categories-list');
      } else {
        await axiosInstance.post('/accessory-categories', formData);
        await showFormSubmitToast('Category added successfully!', () => navigate('/categories/categories-list'));

        navigate('/categories/categories-list');
      }
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/categories/categories-list');
  };
  return (
    <div>
      <h4>{id ? 'Edit' : 'Add'} Accessory Category</h4>
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
                <span className="details">Desciption</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilList} />
                  </CInputGroupText>
                  <CFormInput type="text" name="description" value={formData.description} onChange={handleChange} />
                </CInputGroup>
              </div>
              <FormButtons onCancel={handleCancel} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddCategory;
