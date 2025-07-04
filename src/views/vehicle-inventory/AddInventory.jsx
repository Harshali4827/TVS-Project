import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormSwitch } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilCheckCircle, cilLocationPin, cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

function AddInventory() {
  const [formData, setFormData] = useState({
    model: '',
    unloadLocation: '',
    type: '',
    colors: [],
    batteryNumber: '',
    keyNumber: '',
    chassisNumber: '',
    motorNumber: '',
    chargerNumber: '',
    engineNumber: '',
    hasDamage: false,
    damages: [
      {
        description: '',
        images: []
      }
    ],
    vehicle_status: ''
  });
  const [errors, setErrors] = useState({});
  const [branches, setBranches] = useState([]);
  const [models, setModels] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchInventory(id);
    }
  }, [id]);

  const fetchInventory = async (id) => {
    try {
      const res = await axiosInstance.get(`/inventory/${id}`);
      setFormData(res.data.data.customer);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };
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
  useEffect(() => {
    const fetchColorsForModel = async () => {
      if (formData.model) {
        try {
          const response = await axiosInstance.get(`/colors/model/${formData.model}`);
          setAvailableColors(response.data.data.colors || []);
          setFormData((prev) => ({ ...prev, colors: [] }));
        } catch (error) {
          console.error('Failed to fetch colors:', error);
          setAvailableColors([]);
        }
      } else {
        setAvailableColors([]);
      }
    };

    fetchColorsForModel();
  }, [formData.model]);
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
    if (name === 'colors') {
      const selectedOptions = Array.from(e.target.selectedOptions);
      const selectedColorIds = selectedOptions.map((option) => option.value);
      setFormData((prev) => ({ ...prev, colors: selectedColorIds }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleDamageDescriptionChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      damages: [
        {
          ...prev.damages[0],
          description: value
        }
      ]
    }));
    setErrors((prev) => ({ ...prev, damageDescription: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.model) formErrors.model = 'This field is required';
    if (!formData.unloadLocation) formErrors.unloadLocation = 'This field is required';
    if (!formData.type) formErrors.type = 'This field is required';
    if (!formData.chassisNumber) formErrors.chassisNumber = 'This field is required';

    // Validate damage description if hasDamage is true
    if (formData.hasDamage && (!formData.damages[0]?.description || formData.damages[0].description.trim() === '')) {
      formErrors.damageDescription = 'Damage description is required when damage exists';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Prepare the data to send
    const payload = {
      ...formData,
      // If no damage, send empty damages array
      damages: formData.hasDamage ? formData.damages : []
    };

    try {
      if (id) {
        await axiosInstance.patch(`/inventory/${id}`, payload);
        await showFormSubmitToast('Inventory updated successfully!', () => navigate('/vehicle-inventory/inventory-list'));
      } else {
        await axiosInstance.post('/inventory', payload);
        await showFormSubmitToast('Inventory added successfully!', () => navigate('/vehicle-inventory/inventory-list'));
      }
      navigate('/vehicle-inventory/inventory-list');
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/vehicle-inventory/inventory-list');
  };

  return (
    <div>
      <h4>{id ? 'Edit' : 'Add'} Vehicle Inward</h4>
      <div className="form-container">
        <div className="page-header">
          <form onSubmit={handleSubmit}>
            <div className="form-note">
              <span className="required">*</span> Field is mandatory
            </div>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Model Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormSelect name="model" value={formData.model} onChange={handleChange}>
                    <option value="">- Select a Model -</option>
                    {models.map((model) => (
                      <option key={model.id} value={model._id}>
                        {model.model_name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.model && <p className="error">{errors.model}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Color</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormSelect
                    name="colors"
                    value={formData.colors}
                    onChange={handleChange}
                    disabled={!formData.model || availableColors.length === 0}
                  >
                    <option value="">-Select a color-</option>
                    {availableColors.map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.name} ({color.hex_code})
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.colors && <p className="error">{errors.colors}</p>}
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
              {formData.type === 'ICE' && (
                <>
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Engine No.</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilLocationPin} />
                      </CInputGroupText>
                      <CFormInput type="text" name="engineNumber" value={formData.engineNumber} onChange={handleChange} />
                    </CInputGroup>
                    {errors.engineNumber && <p className="error">{errors.engineNumber}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Motor No.</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilLocationPin} />
                      </CInputGroupText>
                      <CFormInput type="text" name="motorNumber" value={formData.motorNumber} onChange={handleChange} />
                    </CInputGroup>
                    {errors.motorNumber && <p className="error">{errors.motorNumber}</p>}
                  </div>
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Key No.</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilLocationPin} />
                      </CInputGroupText>
                      <CFormInput type="text" name="keyNumber" value={formData.keyNumber} onChange={handleChange} />
                    </CInputGroup>
                    {errors.keyNumber && <p className="error">{errors.keyNumber}</p>}
                  </div>
                </>
              )}
              {formData.type === 'EV' && (
                <>
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Battery No.</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBuilding} />
                      </CInputGroupText>
                      <CFormInput type="text" name="batteryNumber" value={formData.batteryNumber} onChange={handleChange} />
                    </CInputGroup>
                    {errors.batteryNumber && <p className="error">{errors.batteryNumber}</p>}
                  </div>
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Charger Number</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBuilding} />
                      </CInputGroupText>
                      <CFormInput type="text" name="chargerNumber" value={formData.chargerNumber} onChange={handleChange} />
                    </CInputGroup>
                    {errors.chargerNumber && <p className="error">{errors.chargerNumber}</p>}
                  </div>
                </>
              )}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Chassis No.</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="chassisNumber" value={formData.chassisNumber} onChange={handleChange} />
                </CInputGroup>
                {errors.chassisNumber && <p className="error">{errors.chassisNumber}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Status</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect name="type" value={formData.vehicle_status} onChange={handleChange}>
                    <option value="">-Select-</option>
                    <option value="GO_DOWN">GO_DOWN</option>
                    <option value="ICDAMAGEDE">DAMAGED</option>
                    <option value="SOLD">SOLD</option>
                    <option value="UNDER_REPAIR">UNDER_REPAIR</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.vehicle_status && <p className="error">{errors.vehicle_status}</p>}
              </div>
              <div className="input-box">
                <span className="details">Has Damage?</span>
                <CFormSwitch
                  className="custom-switch"
                  name="hasDamage"
                  label={formData.hasDamage ? 'Yes' : 'No'}
                  checked={formData.hasDamage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, hasDamage: e.target.checked }))}
                />
              </div>
              {formData.hasDamage && (
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Damaged Description</span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilBuilding} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      name="damageDescription"
                      value={formData.damages[0]?.description || ''}
                      onChange={handleDamageDescriptionChange}
                    />
                  </CInputGroup>
                  {errors.damageDescription && <p className="error">{errors.damageDescription}</p>}
                </div>
              )}

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Branch Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormSelect name="unloadLocation" value={formData.unloadLocation} onChange={handleChange}>
                    <option value="">-Select-</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.unloadLocation && <p className="error">{errors.unloadLocation}</p>}
              </div>
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddInventory;
