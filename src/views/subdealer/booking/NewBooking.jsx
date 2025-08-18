import React, { useState, useEffect } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormSwitch, CFormCheck, CButton } from '@coreui/react';
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
    customer_type: 'B2C',
    rto_type: 'MH',
    subdealer: '',
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
  const [filteredModels, setFilteredModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [subdealers, setSubdealers] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [salesExecutives, setSalesExecutives] = useState([]);
  const [financers, setFinancers] = useState([]);
  const [selectedSubdealerName, setSelectedSubdealerName] = useState('');
  const [modelDetails, setModelDetails] = useState(null);
  const [accessoriesTotal, setAccessoriesTotal] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedModelHeaders, setSelectedModelHeaders] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [financerGcRates, setFinancerGcRates] = useState([]);
  const [selectedGcRate, setSelectedGcRate] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  const handleBrokerChange = (e) => {
    const brokerId = e.target.value;
    const broker = brokers.find(b => b._id === brokerId);
    setSelectedBroker(broker);
    setFormData(prev => ({ ...prev, broker_id: brokerId }));
    setErrors(prev => ({ ...prev, broker_id: '' }));
    setOtpSent(false);
    setOtpVerified(false);
    setOtp('');
  };

  const handleSendOtp = async () => {
    try {
      if (!selectedBroker) return;
      
      const response = await axiosInstance.post(`/brokers/${selectedBroker._id}/send-otp`);
      if (response.data.success) {
        setOtpSent(true);
        setOtpVerified(false);
        setOtp('');
        showFormSubmitToast('OTP sent successfully to broker');
      } else {
        showFormSubmitError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      showFormSubmitError(error.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (!selectedBroker || !otp) return;
      
      const response = await axiosInstance.post('/brokers/verify-otp', {
        brokerId: selectedBroker._id,
        otp
      });
      
      if (response.data.success) {
        setOtpVerified(true);
        setOtpError('');
        showFormSubmitToast('OTP verified successfully');
      } else {
        setOtpError(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError(error.response?.data?.message || 'Error verifying OTP');
    }
  };

  useEffect(() => {
    if (id) {
      fetchBookingDetails(id);
      setIsEditMode(true);
    }
  }, [id]);

  const fetchBookingDetails = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`/bookings/${bookingId}`);
    const bookingData = response.data.data;
 
    setFormData({
      model_id: bookingData.model?.id || '',
      model_color: bookingData.color?.id || '',
      customer_type: bookingData.customerType || 'B2C',
      rto_type: bookingData.rto || 'MH',
      subdealer: bookingData.subdealer?._id || '',
      optionalComponents: bookingData.priceComponents?.map((pc) => pc.header?._id).filter(Boolean) || [],
      sales_executive: bookingData.salesExecutive?._id || '',
      gstin: bookingData.gstin || '',
      rtoAmount: bookingData.rtoAmount || '',
      salutation: bookingData.customerDetails?.salutation || '',
      name: bookingData.customerDetails?.name || '',
      pan_no: bookingData.customerDetails?.panNo || '',
      dob: bookingData.customerDetails?.dob?.split('T')[0] || '',
      occupation: bookingData.customerDetails?.occupation || '',
      address: bookingData.customerDetails?.address || '',
      taluka: bookingData.customerDetails?.taluka || '',
      district: bookingData.customerDetails?.district || '',
      pincode: bookingData.customerDetails?.pincode || '',
      mobile1: bookingData.customerDetails?.mobile1 || '',
      mobile2: bookingData.customerDetails?.mobile2 || '',
      aadhar_number: bookingData.customerDetails?.aadharNumber || '',
      nomineeName: bookingData.customerDetails?.nomineeName || '',
      nomineeRelation: bookingData.customerDetails?.nomineeRelation || '',
      nomineeAge: bookingData.customerDetails?.nomineeAge || '',
      type: bookingData.payment?.type?.toLowerCase() || 'cash',
      financer_id: bookingData.payment?.financer?._id || '',
      scheme: bookingData.payment?.scheme || '',
      emi_plan: bookingData.payment?.emiPlan || '',
      gcApplicable: bookingData.payment?.gcApplicable || false,
      gcAmount: bookingData.payment?.gcAmount || '',
      discountType: bookingData.discounts[0]?.type?.toLowerCase() || 'fixed',
      value: bookingData.discounts[0]?.amount || 0,
      selected_accessories: bookingData.accessories?.map((a) => a.accessory?._id).filter(Boolean) || [],
      hpa: bookingData.hpa || false,
      is_exchange: bookingData.exchange ? 'true' : 'false',
      broker_id: bookingData.exchangeDetails?.broker?._id || '',
      exchange_price: bookingData.exchangeDetails?.price || '',
      vehicle_number: bookingData.exchangeDetails?.vehicleNumber || '',
      chassis_number: bookingData.exchangeDetails?.chassisNumber || ''
    });
 
    setSelectedSubdealerName(bookingData.subdealer?.name || '');
    setModelDetails(bookingData.model || null);
    setAccessoriesTotal(bookingData.accessoriesTotal || 0);
 
    if (bookingData.model?.id) {
      fetchModels(bookingData.customerType, bookingData.subdealer?._id);
      fetchModelHeaders(bookingData.model.id);
      fetchAccessories(bookingData.model.id);
      fetchModelColors(bookingData.model.id);
    }
  } catch (error) {
    console.error('Error fetching booking details:', error);
    showFormSubmitError('Failed to load booking details');
  }
};

  const validateTab1 = () => {
    const requiredFields = ['customer_type', 'model_id', 'subdealer'];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    if (formData.customer_type === 'B2B' && !formData.gstin) {
      newErrors.gstin = 'GSTIN is required for B2B customers';
    }

    if ((formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && !formData.rtoAmount) {
      newErrors.rtoAmount = 'RTO amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTab2 = () => {
    const requiredFields = ['model_color'];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTab4 = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = 'Payment type is required';
    }

    if (formData.is_exchange === 'true') {
      const exchangeFields = ['broker_id', 'exchange_price', 'vehicle_number', 'chassis_number'];
      exchangeFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = 'This field is required for exchange';
        }
      });
    
     
    }
    if (formData.type === 'finance') {
      const financeFields = ['financer_id', 'scheme', 'emi_plan'];
      financeFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = 'This field is required for finance';
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTab6 = () => {
    const newErrors = {};
    if (formData.value === '' || formData.value === null || formData.value === undefined) {
      newErrors.value = 'Discount value is required';
    } else if (isNaN(formData.value) || Number(formData.value) < 0) {
      newErrors.value = 'Discount must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMobileNumber = (mobile) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(mobile);
  };

  const validatePAN = (pan) => {
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return regex.test(pan);
  };

  const validateAadhar = (aadhar) => {
    const regex = /^\d{12}$/;
    return regex.test(aadhar);
  };

  const handleNextTab = () => {
    if (activeTab === 1) {
      if (!validateTab1()) {
        return;
      }
    } else if (activeTab === 2) {
      if (!validateTab2()) {
        return;
      }
    } else if (activeTab === 3) {
      const newErrors = {};
      const requiredFields = [
        'salutation',
        'name',
        'address',
        'mobile1',
        'aadhar_number',
        'pan_no',
        'dob',
        'occupation',
        'taluka',
        'district',
        'pincode',
        'nomineeName',
        'nomineeRelation',
        'nomineeAge'
      ];

      requiredFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = 'This field is required';
        }
      });

      if (formData.mobile1 && !validateMobileNumber(formData.mobile1)) {
        newErrors.mobile1 = 'Invalid mobile number';
      }
      if (formData.mobile2 && !validateMobileNumber(formData.mobile2)) {
        newErrors.mobile2 = 'Invalid mobile number';
      }
      if (formData.pan_no && !validatePAN(formData.pan_no)) {
        newErrors.pan_no = 'Invalid PAN number';
      }
      if (formData.aadhar_number && !validateAadhar(formData.aadhar_number)) {
        newErrors.aadhar_number = 'Invalid Aadhar number';
      }

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        const firstErrorField = Object.keys(newErrors)[0];
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        return;
      }
    } else if (activeTab === 4) {
      if (!validateTab4()) {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
        return;
      }
    } else if (activeTab === 6) {
      if (!validateTab6()) {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
        return;
      }
    }
    if (activeTab < 6) {
      setActiveTab((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomer(id);
    }
  }, [id]);

  useEffect(() => {
    fetchModels('B2C');
  }, []);

  const fetchCustomer = async (id) => {
    try {
      const res = await axiosInstance.get(`/accessories/${id}`);
      setFormData(res.data.data.customer);
    } catch (error) {
      console.error('Error fetching accessories:', error);
    }
  };

  const fetchModels = async (customerType = 'B2C', subdealerId = null) => {
    try {
      let endpoint = `/models/with-prices?customerType=${customerType}`;
      if (subdealerId) {
        endpoint += `&subdealer_id=${subdealerId}`;
      }

      const response = await axiosInstance.get(endpoint);
      const modelsWithMandatoryHeaders = response.data.data.models.map(model => {
        const mandatoryHeaders = model.prices
          .filter(price => price.header_id && price.header_key && price.header_key.includes('MANDATORY'))
          .map(price => price.header_id);
        
        return {
          ...model,
          mandatoryHeaders
        };
      });

      setModels(modelsWithMandatoryHeaders);
      setFilteredModels(modelsWithMandatoryHeaders);
    } catch (error) {
      console.error('Failed to fetch models:', error);
    }
  };

  useEffect(() => {
    const fetchSubdealers = async () => {
      try {
        const response = await axiosInstance.get('/subdealers');
        setSubdealers(response.data.data.subdealers || []);
      } catch (error) {
        console.error('Error fetching subdealers:', error);
        showFormSubmitError(error.message);
      }
    };
    fetchSubdealers();
  }, []);

  const fetchModelHeaders = async (modelId) => {
    try {
      const response = await axiosInstance.get(`/models/${modelId}`);
      const prices = response.data.data.model.prices || [];
      
      // Get mandatory headers for this model
      const selectedModel = models.find(model => model._id === modelId);
      const mandatoryHeaders = selectedModel?.mandatoryHeaders || [];
      
      // Set initial optional components to include mandatory headers
      setFormData(prev => ({
        ...prev,
        optionalComponents: [...prev.optionalComponents, ...mandatoryHeaders]
      }));
      
      setSelectedModelHeaders(prices);
      setModelDetails(response.data.data.model);

      const accessoriesTotal = calculateAccessoriesTotal(prices);
      setAccessoriesTotal(accessoriesTotal);
      fetchModelColors(modelId);
    } catch (error) {
      console.error('Failed to fetch model headers:', error);
      setSelectedModelHeaders([]);
      setModelDetails(null);
      setAccessoriesTotal(0);
    }
  };

  useEffect(() => {
    if (formData.type === 'finance' && formData.financer_id && formData.gcApplicable === true) {
      const fetchFinancerGcRates = async () => {
        try {
          const response = await axiosInstance.get(`/financers/providers/${formData.financer_id}/rates`);
          const rates = response.data.data.rates.map((rate) => ({
            id: rate._id,
            gcRate: rate.gcRate
          }));
          setFinancerGcRates(rates);
        } catch (error) {
          console.error('Error fetching financer GC rates:', error);
          setFinancerGcRates([]);
        }
      };
      fetchFinancerGcRates();
    } else {
      setFinancerGcRates([]);
      setSelectedGcRate('');
    }
  }, [formData.financer_id, formData.type, formData.gcApplicable]);

  const handleGcRateChange = (e) => {
    const gcRateValue = e.target.value;
    setSelectedGcRate(gcRateValue);
    setFormData((prev) => ({
      ...prev,
      gcAmount: gcRateValue
    }));
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
    
    if (name === 'customer_type') {
      fetchModels(value, formData.subdealer);
      setFormData((prev) => ({
        ...prev,
        model_id: '',
        model_name: ''
      }));
    } else if (name === 'subdealer') {
      const selectedSubdealer = subdealers.find((b) => b._id === value);
      setSelectedSubdealerName(selectedSubdealer ? selectedSubdealer.name : '');
      fetchModels(formData.customer_type, value);
      setFormData((prev) => ({
        ...prev,
        model_id: '',
        model_name: ''
      }));
    } else if (name === 'model_id') {
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
    e.preventDefault();
    setIsSubmitting(true);
    
    const requiredFields = ['model_id', 'model_color', 'subdealer', 'customer_type', 'name', 'address', 'mobile1', 'aadhar_number', 'pan_no'];
    let formErrors = {};
    
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        formErrors[field] = 'This field is required';
      }
    });

    if (formData.customer_type === 'B2B' && !formData.gstin) {
      formErrors.gstin = 'GSTIN is required for B2B customers';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      const firstErrorField = Object.keys(formErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }

    const requestBody = {
      model_id: formData.model_id,
      model_color: formData.model_color,
      customer_type: formData.customer_type,
      rto_type: formData.rto_type,
      subdealer: formData.subdealer,
      optionalComponents: formData.optionalComponents,
      sales_executive: formData.sales_executive,
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
        is_exchange: formData.is_exchange === 'true',
        ...(formData.is_exchange === 'true' && {
          broker_id: formData.broker_id,
          exchange_price: formData.exchange_price ? parseFloat(formData.exchange_price) : 0,
          vehicle_number: formData.vehicle_number || '',
          chassis_number: formData.chassis_number || '',
          ...(selectedBroker?.otp_required && otpVerified && { otp })
        })
      }
    };

    if (formData.customer_type === 'B2B') {
      requestBody.gstin = formData.gstin;
    }
    if (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') {
      requestBody.rtoAmount = formData.rtoAmount;
    }

    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(`/bookings/${id}`, requestBody);
      } else {
        response = await axiosInstance.post('/bookings', requestBody);
      }

      if (response.data.success) {
        const successMessage = isEditMode ? 'Booking updated successfully!' : 'Booking created successfully!';
        await showFormSubmitToast(successMessage, () => navigate('/subdealer-all-bookings'));
        navigate('/subdealer-all-bookings');
      } else {
        showFormSubmitError(response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response) {
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
  const isMandatoryHeader = (header) => {
    return header.header_key && (
      header.header_key.includes('MANDATORY') || 
      header.header_key.includes('STANDARD FITMENTS') ||
      header.header_key.includes('STEEL ACCESSORIES')
    );
  };

  return (
    <div>
      <h4>{isEditMode ? 'Edit Booking' : 'Create New Booking'}</h4>
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
                      <span className="details">Customer Type</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect name="customer_type" value={formData.customer_type} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="B2B">B2B</option>
                        <option value="B2C" selected>B2C</option>
                        <option value="CSD">CSD</option>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.customer_type && <p className="error">{errors.customer_type}</p>}
                  </div>
                  
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Subdealer</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilLocationPin} />
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
                    {errors.subdealer && <p className="error">{errors.subdealer}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Model Name</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBike} />
                      </CInputGroupText>
                      <CFormSelect 
                        name="model_id" 
                        value={formData.model_id} 
                        onChange={handleChange}
                        disabled={!formData.subdealer}
                      >
                        <option value="">- Select a Model -</option>
                        {models.map((model) => (
                          <option key={model._id} value={model._id}>
                            {model.model_name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.model_id && <p className="error">{errors.model_id}</p>}
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

                {selectedModelHeaders.length > 0 && (
                  <div className="model-headers-section">
                    <h5>Model Options</h5>
                    <div className="headers-list">
                      {selectedModelHeaders
                        .filter(header => header.header_id) // Filter out headers without IDs
                        .map((header) => {
                          const isMandatory = isMandatoryHeader(header);
                          const isChecked = isMandatory || formData.optionalComponents.includes(header.header_id);
                          
                          return (
                            <div key={header.header_id} className="header-item">
                              <CFormCheck
                                id={`header-${header.header_id}`}
                                label={`${header.header_key} (₹${header.value}) ${isMandatory ? '(Mandatory)' : ''}`}
                                checked={isChecked}
                                onChange={(e) => !isMandatory && handleHeaderSelection(header.header_id, e.target.checked)}
                                disabled={isMandatory}
                              />
                              {isMandatory && (
                                <input type="hidden" name={`mandatory-${header.header_id}`} value={header.header_id} />
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
                <div className="booking-button-row">
                  <button type="button" className="btn btn-primary" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

            {/* Rest of the tabs remain the same */}
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
                      <CFormSelect name="model_id" value={formData.model_id} onChange={handleChange} disabled={isEditMode}>
                        <option value="">- Select a Model -</option>
                        {models.map((model) => (
                          <option key={model._id} value={model._id}>
                            {model.model_name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.model_id && <p className="error">{errors.model_id}</p>}
                  </div>
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Color</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPaint} />
                      </CInputGroupText>
                      <CFormSelect name="model_color" value={formData.model_color || ''} onChange={handleChange}>
                        <option value="">-Select-</option>
                        {colors.map((color) => (
                          <option key={color._id} value={color.id}>
                            {color.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.model_color && <p className="error">{errors.model_color}</p>}
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
                </div>
                <div className="booking-button-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab(1)}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

            {/* Tabs 3-6 remain unchanged */}
            {activeTab === 3 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Salutation</span>
                      <span className="required">*</span>
                    </div>
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
                    {errors.salutation && <p className="error">{errors.salutation}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Full Name</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput name="name" value={formData.name} onChange={handleChange} />
                    </CInputGroup>
                    {errors.name && <p className="error">{errors.name}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Address</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilHome} />
                      </CInputGroupText>
                      <CFormInput name="address" value={formData.address} onChange={handleChange} />
                    </CInputGroup>
                    {errors.address && <p className="error">{errors.address}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Taluka</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilMap} />
                      </CInputGroupText>
                      <CFormInput name="taluka" value={formData.taluka} onChange={handleChange} />
                    </CInputGroup>
                    {errors.taluka && <p className="error">{errors.taluka}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">District</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilMap} />
                      </CInputGroupText>
                      <CFormInput name="district" value={formData.district} onChange={handleChange} />
                    </CInputGroup>
                    {errors.district && <p className="error">{errors.district}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Pin Code</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput name="pincode" value={formData.pincode} onChange={handleChange} />
                    </CInputGroup>
                    {errors.pincode && <p className="error">{errors.pincode}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Contact Number</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPhone} />
                      </CInputGroupText>
                      <CFormInput name="mobile1" value={formData.mobile1} onChange={handleChange} />
                    </CInputGroup>
                    {errors.mobile1 && <p className="error">{errors.mobile1}</p>}
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
                    <div className="details-container">
                      <span className="details">Aadhaar Number</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilFingerprint} />
                      </CInputGroupText>
                      <CFormInput name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} />
                    </CInputGroup>
                    {errors.aadhar_number && <p className="error">{errors.aadhar_number}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">PAN Number</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCreditCard} />
                      </CInputGroupText>
                      <CFormInput name="pan_no" value={formData.pan_no} onChange={handleChange} />
                    </CInputGroup>
                    {errors.pan_no && <p className="error">{errors.pan_no}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Birth Date</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCalendar} />
                      </CInputGroupText>
                      <CFormInput type="date" name="dob" value={formData.dob} onChange={handleChange} />
                    </CInputGroup>
                    {errors.dob && <p className="error">{errors.dob}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Occupation</span>
                      <span className="required">*</span>
                    </div>
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
                    {errors.occupation && <p className="error">{errors.occupation}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Nominee Name</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
                    </CInputGroup>
                    {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Nominee Relationship</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPeople} />
                      </CInputGroupText>
                      <CFormInput name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
                    </CInputGroup>
                    {errors.nomineeRelation && <p className="error">{errors.nomineeRelation}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Nominee Age</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBirthdayCake} />
                      </CInputGroupText>
                      <CFormInput name="nomineeAge" value={formData.nomineeAge} onChange={handleChange} />
                    </CInputGroup>
                    {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
                  </div>
                </div>

                <div className="booking-button-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab(2)}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

            {activeTab === 4 && (
              <>
                <div className="user-details">

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Payment Type</span>
                      <span className="required">*</span>
                    </div>
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
                    {errors.type && <p className="error">{errors.type}</p>}
                  </div>
                  {formData.type === 'finance' && (
                    <>
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Financer Name</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilInstitution} />
                          </CInputGroupText>
                          <CFormSelect name="financer_id" value={formData.financer_id} onChange={handleChange}>
                            <option value="">-Select Financer-</option>
                            {financers.map((financer) => (
                              <option key={financer._id} value={financer._id}>
                                {financer.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                        {errors.financer_id && <p className="error">{errors.financer_id}</p>}
                      </div>

                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">GC Applicable</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilTask} />
                          </CInputGroupText>
                          <CFormSelect
                            name="gcApplicable"
                            value={formData.gcApplicable}
                            onChange={(e) => {
                              const isApplicable = e.target.value === 'true';
                              setFormData((prev) => ({
                                ...prev,
                                gcApplicable: isApplicable,
                                gcAmount: isApplicable ? selectedGcRate : ''
                              }));
                              if (!isApplicable) setSelectedGcRate('');
                            }}
                          >
                            <option value="">-Select-</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </CFormSelect>
                        </CInputGroup>
                        {errors.gcApplicable && <p className="error">{errors.gcApplicable}</p>}
                      </div>

                      {formData.gcApplicable === true && financerGcRates.length > 0 && (
                        <div className="input-box">
                          <div className="details-container">
                            <span className="details">GC Rate</span>
                            <span className="required">*</span>
                          </div>
                          <CInputGroup>
                            <CInputGroupText className="input-icon">
                              <CIcon icon={cilMoney} />
                            </CInputGroupText>
                            <CFormInput value={`${financerGcRates[0].gcRate}%`} readOnly onChange={handleGcRateChange} />
                          </CInputGroup>
                        </div>
                      )}

                      {formData.gcApplicable === true && selectedGcRate && (
                        <div className="input-box">
                          <div className="details-container">
                            <span className="details">GC Amount</span>
                            <span className="required">*</span>
                          </div>
                          <CInputGroup>
                            <CInputGroupText className="input-icon">
                              <CIcon icon={cilMoney} />
                            </CInputGroupText>
                            <CFormInput
                              name="gcAmount"
                              value={formData.gcAmount}
                              onChange={handleChange}
                              placeholder="GC Amount will be auto-filled"
                            />
                          </CInputGroup>
                          {errors.gcAmount && <p className="error">{errors.gcAmount}</p>}
                        </div>
                      )}
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Finance Scheme</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilListRich} />
                          </CInputGroupText>
                          <CFormInput name="scheme" value={formData.scheme} onChange={handleChange} />
                        </CInputGroup>
                        {errors.scheme && <p className="error">{errors.scheme}</p>}
                      </div>

                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">EMI Scheme</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilChartLine} />
                          </CInputGroupText>
                          <CFormInput name="emi_plan" value={formData.emi_plan} onChange={handleChange} />
                        </CInputGroup>
                        {errors.emi_plan && <p className="error">{errors.emi_plan}</p>}
                      </div>
                    </>
                  )}
                </div>
                <div className="booking-button-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab(3)}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleNextTab}>
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
                  <button type="button" className="btn btn-primary" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

            {activeTab === 6 && (
              <>
                <div>
                  {selectedModelHeaders.length > 0 && (
                    <div className="model-headers-section">
                      <h5>Model Options</h5>
                      <div className="headers-list">
                        {selectedModelHeaders
                          .filter(header => header.header_id)
                          .map((header) => {
                            const isMandatory = isMandatoryHeader(header);
                            const isChecked = isMandatory || formData.optionalComponents.includes(header.header_id);
                            
                            return (
                              <div key={header.header_id} className="header-item">
                                <CFormCheck
                                  id={`header-${header.header_id}`}
                                  label={`${header.header_key} (₹${header.value}) ${isMandatory ? '(Mandatory)' : ''}`}
                                  checked={isChecked}
                                  onChange={(e) => !isMandatory && handleHeaderSelection(header.header_id, e.target.checked)}
                                  disabled={isMandatory}
                                />
                                {isMandatory && (
                                  <input type="hidden" name={`selected-${header.header_id}`} value={header.header_id} />
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
                <div className="booking-button-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab(5)}>
                    Back
                  </button>
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