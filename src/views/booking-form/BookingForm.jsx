import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormSwitch, CFormCheck } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBank,
  cilBarcode,
  cilBike,
  cilBirthdayCake,
  cilBriefcase,
  cilCalendar,
  cilCarAlt,
  cilChartLine,
  cilCreditCard,
  cilEnvelopeClosed,
  cilFactory,
  cilFingerprint,
  cilHome,
  cilInstitution,
  cilListRich,
  cilLocationPin,
  cilMap,
  cilMoney,
  cilPaint,
  cilPeople,
  cilPhone,
  cilShieldAlt,
  cilSwapVertical,
  cilTask,
  cilUser
} from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import FormButtons from 'utils/FormButtons';

function BookingForm() {
  const [formData, setFormData] = useState({
    // Tab 1
    model_id: '',
    model_color: '',
    customer_type: '',
    rto_type: 'MH',
    branch: '',
    optionalComponents: [],
    sales_executive: '',
    gstin: '',
    rtoAmount: '',

    salutation: '',
    name: '',
    pan_no: '',
    dob: '',
    occupation: '',
    address: '',
    taluka: '',
    district: '',
    pincode: '',
    mobile1: '',
    mobile2: '',
    aadhar_number: '',
    nomineeName: '',
    nomineeRelation: '',
    nomineeAge: '',

    // booking_date: new Date().toISOString().split('T')[0],

    type: 'cash',
    financer_id: '',
    scheme: '',
    emi_plan: '',
    gcApplicable: false,
    gcAmount: '',

    discountType: 'fixed',
    value: 0,

    selected_accessories: [],
    hpa: true,

    is_exchange: false,
    broker_id: '',
    exchange_price: '',
    vehicle_number: '',
    chassis_number: ''
  });

  const [errors, setErrors] = useState({});
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [salesExecutives, setSalesExecutives] = useState([]);
  const [financers, setFinancers] = useState([]);
  const [selectedBranchName, setSelectedBranchName] = useState('');
  const [modelDetails, setModelDetails] = useState(null);
  const [accessoriesTotal, setAccessoriesTotal] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedModelHeaders, setSelectedModelHeaders] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchCustomer(id);
    }
  }, [id]);

  const fetchCustomer = async (id) => {
    try {
      const res = await axiosInstance.get(`/accessories/${id}`);
      setFormData(res.data.data.customer);
    } catch (error) {
      console.error('Error fetching accessories:', error);
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
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
        showFormSubmitError(error.message);
      }
    };
    fetchBranches();
  }, []);
  useEffect(() => {
    const fetchSalesExecutive = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setSalesExecutives(response.data.data || []);
      } catch (error) {
        console.error('Error fetching sales executive:', error);
        showFormSubmitError(error.message);
      }
    };
    fetchSalesExecutive();
  }, []);

  const fetchModelHeaders = async (modelId) => {
    try {
      const response = await axiosInstance.get(`/models/${modelId}`);
      setSelectedModelHeaders(response.data.data.model.prices || []);
      setModelDetails(response.data.data.model);

      const accessoriesTotal = calculateAccessoriesTotal(response.data.data.model.prices);
      setAccessoriesTotal(accessoriesTotal);

      // Fetch colors for this model
      fetchModelColors(modelId);
    } catch (error) {
      console.error('Failed to fetch model headers:', error);
      setSelectedModelHeaders([]);
      setModelDetails(null);
      setAccessoriesTotal(0);
    }
  };

  const calculateAccessoriesTotal = (prices) => {
    if (!prices || !Array.isArray(prices)) return 0;
    const accessoriesTotalHeader = prices.find((item) => item.header_key === 'ACCESSORIES TOTAL');
    return accessoriesTotalHeader ? accessoriesTotalHeader.value : 0;
  };

  const fetchAccessories = async (modelId) => {
    try {
      const response = await axiosInstance.get(`/accessories/model/${modelId}`);
      setAccessories(response.data.data.accessories || []);
    } catch (error) {
      console.error('Failed to fetch accessories:', error);
      setAccessories([]);
    }
  };

  const fetchModelColors = async (modelId) => {
    try {
      const response = await axiosInstance.get(`colors/model/${modelId}`);
      setColors(response.data.data.colors || []);
    } catch (error) {
      console.error('Failed to fetch model colors:', error);
      setColors([]);
    }
  };

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await axiosInstance.get('/brokers');
        setBrokers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching broker:', error);
        showFormSubmitError(error.message);
      }
    };
    fetchBrokers();
  }, []);

  useEffect(() => {
    const fetchFinancer = async () => {
      try {
        const response = await axiosInstance.get('/financers/providers');
        setFinancers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching financers:', error);
        showFormSubmitError(error.message);
      }
    };
    fetchFinancer();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

    if (name === 'model_id') {
      fetchModelHeaders(value);
      fetchAccessories(value);
      const selectedModel = models.find((model) => model._id === value);
      setFormData((prev) => ({
        ...prev,
        model_name: selectedModel ? selectedModel.model_name : '',
        model_id: value
      }));
    }
  };

  const handleHeaderSelection = (headerId, isChecked) => {
    setFormData((prev) => {
      if (isChecked) {
        return {
          ...prev,
          optionalComponents: [...prev.optionalComponents, headerId]
        };
      } else {
        return {
          ...prev,
          optionalComponents: prev.optionalComponents.filter((id) => id !== headerId)
        };
      }
    });
  };

  const handleAccessorySelection = (accessoryId, isChecked) => {
    setFormData((prev) => {
      if (isChecked) {
        return {
          ...prev,
          selected_accessories: [...prev.selected_accessories, accessoryId]
        };
      } else {
        return {
          ...prev,
          selected_accessories: prev.selected_accessories.filter((id) => id !== accessoryId)
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    console.log('Submit handler called');
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Form data:', formData);
    // Validate required fields
    const requiredFields = ['model_id', 'model_color', 'branch', 'customer_type', 'name', 'address', 'mobile1', 'aadhar_number', 'pan_no'];

    let formErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        formErrors[field] = 'This field is required';
      }
    });

    // Additional validation for B2B customers
    if (formData.customer_type === 'B2B' && !formData.gstin) {
      formErrors.gstin = 'GSTIN is required for B2B customers';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);

      // Scroll to first error
      const firstErrorField = Object.keys(formErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }

    // Prepare the API request body
    const requestBody = {
      model_id: formData.model_id,
      // model_color: colors.find((c) => c.name === formData.model_color)?._id,
      model_color: formData.model_color,
      customer_type: formData.customer_type,
      rto_type: formData.rto_type,
      branch: formData.branch,
      optionalComponents: formData.optionalComponents,
      sales_executive: formData.sales_executive, // Make sure this is included
      customer_details: {
        salutation: formData.salutation,
        name: formData.name,
        pan_no: formData.pan_no,
        dob: formData.dob,
        occupation: formData.occupation,
        address: formData.address,
        taluka: formData.taluka,
        district: formData.district,
        pincode: formData.pincode,
        mobile1: formData.mobile1,
        mobile2: formData.mobile2,
        aadhar_number: formData.aadhar_number,
        nomineeName: formData.nomineeName,
        nomineeRelation: formData.nomineeRelation,
        nomineeAge: formData.nomineeAge ? parseInt(formData.nomineeAge) : undefined
      },
      payment: {
        type: formData.type.toUpperCase(),
        ...(formData.type.toLowerCase() === 'finance' && {
          financer_id: formData.financer_id,
          scheme: formData.scheme,
          emi_plan: formData.emi_plan,
          gcApplicable: formData.gcApplicable === false,
          gcAmount: formData.gcAmount ? parseFloat(formData.gcAmount) : 0
        })
      },
      discount: {
        type: formData.discountType,
        value: formData.value ? parseFloat(formData.value) : 0
      },
      accessories: {
        selected: formData.selected_accessories.map((id) => ({ id }))
      },
      hpa: formData.hpa === true,
      exchange: {
        is_exchange: formData.is_exchange === false,
        ...(formData.is_exchange === false && {
          broker_id: formData.broker_id,
          exchange_price: formData.exchange_price ? parseFloat(formData.exchange_price) : 0,
          vehicle_number: formData.vehicle_number || '',
          chassis_number: formData.chassis_number || ''
        })
      }
    };

    // Add GSTIN if customer is B2B
    if (formData.customer_type === 'B2B') {
      requestBody.gstin = formData.gstin;
    }

    // Add RTO amount if applicable
    if (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') {
      requestBody.rtoAmount = formData.rtoAmount;
    }

    console.log('Request payload:', JSON.stringify(requestBody, null, 2));

    try {
      const response = await axiosInstance.post('/bookings', requestBody);
      console.log('API response:', response);
      if (response.data.success) {
        await showFormSubmitToast('Booking created successfully!', () => navigate('/bookings'));
        navigate('/bookings');
      } else {
        console.error('Submission failed:', response.data);
        showFormSubmitError(response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        const errorMsg =
          error.response.data.message ||
          (error.response.data.errors && Object.values(error.response.data.errors).join(', ')) ||
          'Error submitting booking';
        showFormSubmitError(errorMsg);
      } else {
        showFormSubmitError(error.message || 'Network error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/accessories/accessories-list');
  };

  return (
    <div>
      <h4>Booking Form</h4>
      <div className="form-container">
        <div className="page-header">
          <form onSubmit={handleSubmit} id="bookingForm">
            <div className="form-note">
              <span className="required">*</span> Field is mandatory
            </div>

            {activeTab === 1 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Model Name</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBike} />
                      </CInputGroupText>
                      <CFormSelect name="model_id" value={formData.model_id} onChange={handleChange}>
                        <option value="">- Select a Model -</option>
                        {models.map((model) => (
                          <option key={model.id} value={model._id}>
                            {model.model_name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.model_id && <p className="error">{errors.model_id}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Location</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilLocationPin} />
                      </CInputGroupText>
                      <CFormSelect
                        name="branch"
                        value={formData.branch}
                        onChange={(e) => {
                          const selectedBranch = branches.find((b) => b._id === e.target.value);
                          setFormData((prev) => ({ ...prev, branch: e.target.value }));
                          setSelectedBranchName(selectedBranch ? selectedBranch.name : '');
                        }}
                      >
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
                    <span className="details">Customer Type</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect name="customer_type" value={formData.customer_type} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="B2B">B2B</option>
                        <option value="B2C">B2C</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>

                  {formData.customer_type === 'B2B' && (
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">GST Number</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilBarcode} />
                        </CInputGroupText>
                        <CFormInput type="text" name="gstin" value={formData.gstin} onChange={handleChange} />
                      </CInputGroup>
                      {errors.gstin && <p className="error">{errors.gstin}</p>}
                    </div>
                  )}

                  <div className="input-box">
                    <span className="details">RTO</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCarAlt} />
                      </CInputGroupText>
                      <CFormSelect name="rto_type" value={formData.rto_type} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="MH">MH</option>
                        <option value="BH">BH</option>
                        <option value="CRTM">CRTM</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>

                  {(formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && (
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">RTO Amount</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilMoney} />
                        </CInputGroupText>
                        <CFormInput type="text" name="rtoAmount" value={formData.rtoAmount} onChange={handleChange} />
                      </CInputGroup>
                      {errors.rtoAmount && <p className="error">{errors.rtoAmount}</p>}
                    </div>
                  )}

                  <div className="input-box">
                    <span className="details">HPA Applicable</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilShieldAlt} />
                      </CInputGroupText>
                      <CFormSelect name="hpa" value={formData.hpa} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>
                </div>

                {/* Model Headers Section */}
                {selectedModelHeaders.length > 0 && (
                  <div className="model-headers-section">
                    <h5>Model Options</h5>
                    <div className="headers-list">
                      {selectedModelHeaders.map((header) => (
                        <div key={header.header_id} className="header-item">
                          <CFormCheck
                            id={`header-${header.header_id}`}
                            label={`${header.header_key}`}
                            checked={formData.optionalComponents.includes(header.header_id)}
                            onChange={(e) => handleHeaderSelection(header.header_id, e.target.checked)}
                            disabled={header.is_mandatory}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="booking-button-row">
                  <button type="button" className="btn btn-primary" onClick={() => setActiveTab(2)}>
                    Next
                  </button>
                </div>
              </>
            )}
            {activeTab === 2 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Vehicle Model</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBike} />
                      </CInputGroupText>
                      <CFormInput type="text" name="model_id" value={formData.model_name || ''} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Color</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPaint} />
                      </CInputGroupText>
                      <CFormSelect name="model_color" value={formData.model_color || ''} onChange={handleChange}>
                        <option value="">-Select-</option>
                        {colors.map((color) => (
                          <option key={color._id} value={color.id}>
                            {' '}
                            {color.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Booking Date</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCalendar} />
                      </CInputGroupText>
                      <CFormInput type="date" value={formData.booking_date || new Date().toISOString().split('T')[0]} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Sales Executive</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      {/* <CFormSelect name="sales_executive" value={formData.sales_executive || ''} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="John Doe">John Doe</option>
                        <option value="Ravi Patel">Ravi Patel</option>
                        <option value="Sara Khan">Sara Khan</option>
                      </CFormSelect> */}
                      <CFormSelect name="sales_executive" value={formData.sales_executive || ''} onChange={handleChange}>
                        <option value="">-Select-</option>
                        {salesExecutives.map((sales) => (
                          <option key={sales._id} value={sales._id}>
                            {' '}
                            {sales.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                  </div>

                  {/* <div className="input-box">
                    <span className="details">Dealer / Sub-dealer</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilFactory} />
                      </CInputGroupText>
                      <CFormInput value={selectedBranchName} readOnly disabled />
                    </CInputGroup>
                  </div> */}
                </div>
                <div className="booking-button-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab(1)}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setActiveTab(3)}>
                    Next
                  </button>
                </div>
              </>
            )}
            {activeTab === 3 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <span className="details">Salutation</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect name="salutation" value={formData.salutation} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Miss">Miss</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Full Name</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput name="name" value={formData.name} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Address</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilHome} />
                      </CInputGroupText>
                      <CFormInput name="address" value={formData.address} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Taluka</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilMap} />
                      </CInputGroupText>
                      <CFormInput name="taluka" value={formData.taluka} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">District</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilMap} />
                      </CInputGroupText>
                      <CFormInput name="district" value={formData.district} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Pin Code</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput name="pincode" value={formData.pincode} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Contact Number</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPhone} />
                      </CInputGroupText>
                      <CFormInput name="mobile1" value={formData.mobile1} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Alternate Contact Number</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPhone} />
                      </CInputGroupText>
                      <CFormInput name="mobile2" value={formData.mobile2} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Aadhaar Number</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilFingerprint} />
                      </CInputGroupText>
                      <CFormInput name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">PAN Number</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCreditCard} />
                      </CInputGroupText>
                      <CFormInput name="pan_no" value={formData.pan_no} onChange={handleChange} />
                    </CInputGroup>
                    {errors.pan_no && <p className="error">{errors.pan_no}</p>}
                  </div>

                  <div className="input-box">
                    <span className="details">Birth Date</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCalendar} />
                      </CInputGroupText>
                      <CFormInput type="date" name="dob" value={formData.dob} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Occupation</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBriefcase} />
                      </CInputGroupText>
                      <CFormSelect name="occupation" value={formData.occupation} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="Student">Student</option>
                        <option value="Business">Business</option>
                        <option value="Service">Service</option>
                        <option value="Farmer">Farmer</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Nominee Name</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Nominee Relationship</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPeople} />
                      </CInputGroupText>
                      <CFormInput name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Nominee Age</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBirthdayCake} />
                      </CInputGroupText>
                      <CFormInput name="nomineeAge" value={formData.nomineeAge} onChange={handleChange} />
                    </CInputGroup>
                  </div>
                </div>

                <div className="booking-button-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab(2)}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setActiveTab(4)}>
                    Next
                  </button>
                </div>
              </>
            )}

            {activeTab === 4 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <span className="details">Exchange Mode</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilSwapVertical} />
                      </CInputGroupText>
                      <CFormSelect name="is_exchange" value={formData.is_exchange} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>
                  {formData.is_exchange === 'true' && (
                    <>
                      <div className="input-box">
                        <span className="details">Exchange Broker</span>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilPeople} />
                          </CInputGroupText>
                          <CFormSelect name="broker_id" value={formData.broker_id} onChange={handleChange}>
                            <option value="">-Select-</option>
                            {brokers.map((broker) => (
                              <option key={broker._id} value={broker._id}>
                                {broker.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                      </div>

                      <div className="input-box">
                        <span className="details">Exchange Vehicle Number</span>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilBike} />
                          </CInputGroupText>
                          <CFormInput name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} />
                        </CInputGroup>
                      </div>

                      <div className="input-box">
                        <span className="details">Exchange Price</span>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilMoney} />
                          </CInputGroupText>
                          <CFormInput name="exchange_price" value={formData.exchange_price} onChange={handleChange} />
                        </CInputGroup>
                      </div>

                      <div className="input-box">
                        <span className="details">Exchange Chassis Number</span>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilBarcode} />
                          </CInputGroupText>
                          <CFormInput name="chassis_number" value={formData.chassis_number} onChange={handleChange} />
                        </CInputGroup>
                      </div>
                    </>
                  )}

                  <div className="input-box">
                    <span className="details">Payment Type</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBank} />
                      </CInputGroupText>
                      <CFormSelect name="type" value={formData.type} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="cash">Cash</option>
                        <option value="finance">Finance</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>

                  {/* {formData.payment_type === 'Cash' && (
                    <>
                      <div className="input-box">
                        <span className="details">Amount</span>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilMoney} />
                          </CInputGroupText>
                          <CFormInput name="finance_amount" value={formData.finance_amount} onChange={handleChange} />
                        </CInputGroup>
                      </div>
                    </>
                  )} */}

                  {formData.type === 'finance' && (
                    <>
                      <div className="input-box">
                        <span className="details">Financer Name</span>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilInstitution} />
                          </CInputGroupText>
                          <CFormSelect name="financer_id" value={formData.financer_id} onChange={handleChange}>
                            <option value="">-Select-</option>
                            {financers.map((financer) => (
                              <option key={financer._id} value={financer._id}>
                                {financer.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                      </div>

                      <div className="input-box">
                        <span className="details">Finance Scheme</span>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilListRich} />
                          </CInputGroupText>
                          <CFormInput name="scheme" value={formData.scheme} onChange={handleChange} />
                        </CInputGroup>
                      </div>

                      <div className="input-box">
                        <span className="details">EMI Scheme</span>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilChartLine} />
                          </CInputGroupText>
                          <CFormInput name="emi_plan" value={formData.emi_plan} onChange={handleChange} />
                        </CInputGroup>
                      </div>
                      <div className="input-box">
                        <span className="details">GC Applicable</span>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilTask} />
                          </CInputGroupText>
                          <CFormSelect name="gcApplicable" value={formData.gcApplicable} onChange={handleChange}>
                            <option value="">-Select-</option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </CFormSelect>
                        </CInputGroup>
                      </div>

                      {formData.gcApplicable === 'true' && (
                        <>
                          <div className="input-box">
                            <span className="details">GC Applicable Amount</span>
                            <CInputGroup>
                              <CInputGroupText className="input-icon">
                                <CIcon icon={cilMoney} />
                              </CInputGroupText>
                              <CFormInput name="gcAmount" value={formData.gcAmount} onChange={handleChange} />
                            </CInputGroup>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
                <div className="booking-button-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab(3)}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setActiveTab(5)}>
                    Next
                  </button>
                </div>
              </>
            )}
            {activeTab === 5 && (
              <>
                <div>
                  <h5>Accessories</h5>
                  {accessories.length > 0 ? (
                    <>
                      <div className="accessories-list">
                        {accessories.map((accessory) => (
                          <div key={accessory._id} className="accessory-item">
                            <CFormCheck
                              id={`accessory-${accessory._id}`}
                              label={`${accessory.name} - ₹${accessory.price}`}
                              checked={formData.selected_accessories.includes(accessory._id)}
                              onChange={(e) => handleAccessorySelection(accessory._id, e.target.checked)}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="accessories-total">
                        <h6>Accessories Total: ₹{accessoriesTotal}</h6>
                      </div>
                    </>
                  ) : (
                    <p>No accessories available for this model</p>
                  )}
                </div>
                <div className="booking-button-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab(4)}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setActiveTab(6)}>
                    Next
                  </button>
                </div>
              </>
            )}
            {activeTab === 6 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <span className="details">Discount Amount</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilChartLine} />
                      </CInputGroupText>
                      <CFormInput name="value" value={formData.value} onChange={handleChange} />
                    </CInputGroup>
                  </div>
                </div>
                <div>
                  {selectedModelHeaders.length > 0 && (
                    <div className="model-options-section">
                      <h5 className="section-title">Model Options</h5>
                      <div className="options-grid">
                        {selectedModelHeaders.map((header) => (
                          <div key={header.header_id} className={`option-card ${header.is_mandatory ? 'mandatory' : ''}`}>
                            <div className="option-header">
                              <CFormCheck
                                id={`header-${header.header_id}`}
                                checked={formData.optionalComponents.includes(header.header_id)}
                                onChange={(e) => handleHeaderSelection(header.header_id, e.target.checked)}
                                disabled={header.is_mandatory}
                              />
                              <label htmlFor={`header-${header.header_id}`}>
                                <span className="option-name">{header.header_key}</span>
                              </label>
                            </div>

                            <div className="option-details">
                              <span className="price">₹{header.value.toLocaleString()}</span>
                              {header.metadata?.gst_rate > 0 && <span className="gst-rate">(incl. {header.metadata.gst_rate}% GST)</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="booking-button-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab(5)}>
                    Back
                  </button>
                  {/* <button type="submit" className="btn btn-primary" form="bookingForm">
                    Apply for Approval
                  </button> */}
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Apply for Approval'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
