// import React, { useState, useEffect } from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton,
//   CForm,
//   CFormInput,
//   CFormSelect,
//   CRow,
//   CCol,
//   CBackdrop,
//   CAlert
// } from '@coreui/react';
// import axiosInstance from 'axiosInstance';
// import tvsLogo from '../../assets/images/logo.png';
// import config from 'config';

// const ExchangeLedgerModel = ({ show, onClose, brokerData,refreshData  }) => {
//   const [formData, setFormData] = useState({
//     brokerId: brokerData?.broker?._id || '',
//     bookingId: '',
//     totalAmount: brokerData?.totalCredit || 0,
//     balanceAmount: brokerData?.totalDebit || 0,
//     type: '',
//     modeOfPayment: '',
//     amount: '',
//     remark: '',
//     cashLocation: '',
//     bank: ''
//   });

//   const [cashLocations, setCashLocations] = useState([]);
//   const [bankLocations, setBankLocations] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     if (name === 'amount') {
//       const amountValue = parseFloat(value) || 0;
//       setFormData(prev => ({
//         ...prev,
//         balanceAmount: parseFloat(prev.totalAmount) - amountValue
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       let paymentData = {
//         brokerId: formData.brokerId,
//         bookingId: formData.bookingId,
//         type: formData.type,
//         modeOfPayment: formData.modeOfPayment,
//         amount: parseFloat(formData.amount),
//         remark: formData.remark
//       };

//       switch (formData.modeOfPayment) {
//         case 'Cash':
//           paymentData.cashLocation = formData.cashLocation;
//           break;
//         case 'Bank':
//           paymentData.bank = formData.bank;
//           break;
//         default:
//           break;
//       }

//       const response = await axiosInstance.post(
//         `/broker-ledger/${formData.brokerId}/transactions`, 
//         paymentData
//       );
     
//       setSuccess('Payment successfully recorded!');
//       if (refreshData) {
//         refreshData();
//       }
//       onClose(),
//       setFormData({
//          brokerId: brokerData?.broker?._id || '',
//         bookingId: '',
//         totalAmount: brokerData?.totalCredit || 0,
//         balanceAmount: brokerData?.totalDebit || 0,
//         type: '',
//         modeOfPayment: '',
//         amount: '',
//         remark: '',
//         cashLocation: '',
//         bank: ''
//       });
//     } catch (err) {
//       console.error('Payment error:', err);
//       setError(err.response?.data?.message || 'Failed to process payment. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchCashLocations = async () => {
//       try {
//         const response = await axiosInstance.get('/cash-locations');
//         setCashLocations(response.data.data.cashLocations);
//       } catch (error) {
//         console.error('Error fetching cash locations:', error);
//       }
//     };

//     const fetchBankLocations = async () => {
//       try {
//         const response = await axiosInstance.get('/banks');
//         setBankLocations(response.data.data.banks);
//       } catch (error) {
//         console.error('Error fetching bank locations:', error);
//       }
//     };

//     if (show) {
//       fetchCashLocations();
//       fetchBankLocations();
//       setFormData({
//         brokerId: brokerData?.broker?._id || '',
//         bookingId: '',
//         totalAmount: brokerData?.totalCredit || 0,
//         balanceAmount: brokerData?.totalDebit || 0,
//         type: '',
//         modeOfPayment: '',
//         amount: '',
//         remark: '',
//         cashLocation: '',
//         bank: ''
//       });
//       setError(null);
//       setSuccess(null);
//     }
//   }, [show, brokerData]);

//   const renderPaymentSpecificFields = () => {
//     switch (formData.modeOfPayment) {
//       case 'Cash':
//         return (
//           <CCol md={6}>
//             <label className="form-label">Cash Location</label>
//             <CFormSelect 
//               name="cashLocation" 
//               value={formData.cashLocation} 
//               onChange={handleChange} 
//               required 
//               disabled={isLoading}
//             >
//               <option value="">Select Cash Location</option>
//               {cashLocations.map(location => (
//                 <option key={location._id} value={location._id}>
//                   {location.name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </CCol>
//         );
//       case 'Bank':
//         return (
//           <CCol md={6}>
//             <label className="form-label">Bank</label>
//             <CFormSelect 
//               name="bank" 
//               value={formData.bank} 
//               onChange={handleChange} 
//               required 
//               disabled={isLoading}
//             >
//               <option value="">Select Bank</option>
//               {bankLocations.map(bank => (
//                 <option key={bank._id} value={bank._id}>
//                   {bank.name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </CCol>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <CBackdrop visible={show} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
//       <CModal visible={show} onClose={onClose} size="lg" alignment="center">
//         <CModalHeader className="text-white" style={{ backgroundColor: '#243c7c' }}>
//           <CModalTitle className="text-white">Broker Payment</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {error && <CAlert color="danger">{error}</CAlert>}
//           {success && <CAlert color="success">{success}</CAlert>}

//           <div className="booking-header mb-2 p-1 bg-light rounded">
//             <h5 className="mb-0">
//               Broker: <strong>{brokerData?.broker?.name || ''}</strong>
//             </h5>
//           </div>
//           <hr />

//           <CRow className="mb-3">
//             <CCol md={6}>
//               <label className="form-label">Total Credit (₹)</label>
//               <CFormInput 
//                 type="number" 
//                 name="totalAmount" 
//                 value={formData.totalAmount} 
//                 readOnly 
//                 className="bg-light font-weight-bold" 
//               />
//             </CCol>
//             <CCol md={6}>
//               <label className="form-label">Balance (₹)</label>
//               <CFormInput
//                 type="number"
//                 name="balanceAmount"
//                 value={formData.balanceAmount}
//                 readOnly
//                 className={`bg-light font-weight-bold ${
//                   parseFloat(formData.balanceAmount) > 0 ? 'text-danger' : 'text-success'
//                 }`}
//               />
//             </CCol>
//           </CRow>

//           <CForm onSubmit={handleSubmit}>
//             <CRow className="mb-3">
//               <CCol md={6}>
//                 <label className="form-label">Booking</label>
//                 <CFormSelect
//   name="bookingId"
//   value={formData.bookingId}
//   onChange={handleChange}
//   disabled={isLoading}
// >
//   <option value="">-- Select Booking --</option>
//   {brokerData?.bookings
//     ?.filter(booking => booking.exchangeDetails?.status === 'PENDING')
//     .map(booking => (
//       <option key={booking._id} value={booking._id}>
//         {booking.bookingNumber} - {booking.customerName} ({booking.exchangeDetails?.vehicleNumber})
//       </option>
//     ))}
// </CFormSelect>

//               </CCol>
//               <CCol md={6}>
//                 <label className="form-label">Transaction Type</label>
//                 <CFormSelect
//                   name="type"
//                   value={formData.type}
//                   onChange={handleChange}
//                   required
//                   disabled={isLoading}
//                 >
//                   <option value="">-- Select Type --</option>
//                   <option value="CREDIT">Credit</option>
//                   <option value="DEBIT">Debit</option>
//                 </CFormSelect>
//               </CCol>
//             </CRow>

//             <CRow className="mb-3">
//               <CCol md={6}>
//                 <label className="form-label">Mode of Payment</label>
//                 <CFormSelect
//                   name="modeOfPayment"
//                   value={formData.modeOfPayment}
//                   onChange={handleChange}
//                   required
//                   disabled={isLoading}
//                 >
//                   <option value="">-- Select Mode --</option>
//                   <option value="Cash">Cash</option>
//                   <option value="Bank">Bank</option>
//                   <option value="Exchange">Exchange</option>
//                   <option value="UPI">UPI</option>
//                   <option value="Pay Order">Pay Order</option>
//                 </CFormSelect>
//               </CCol>
//               <CCol md={6}>
//                 <label className="form-label">Amount (₹)</label>
//                 <CFormInput
//                   type="number"
//                   name="amount"
//                   value={formData.amount}
//                   onChange={handleChange}
//                   required
//                   min="0"
//                   step="0.01"
//                   disabled={isLoading}
//                 />
//               </CCol>
//             </CRow>

//             <CRow className="mb-3">
//               {renderPaymentSpecificFields()}
//               <CCol md={6}>
//                 <label className="form-label">Remark</label>
//                 <CFormInput
//                   type="text"
//                   name="remark"
//                   value={formData.remark}
//                   onChange={handleChange}
//                   placeholder="Enter remarks..."
//                   disabled={isLoading}
//                 />
//               </CCol>
//             </CRow>
//           </CForm>
//         </CModalBody>
//         <CModalFooter className="d-flex justify-content-between">
//           <div>
//             <CButton 
//               color="primary" 
//               onClick={handleSubmit} 
//               className="me-2" 
//               disabled={isLoading}
//             >
//               {isLoading ? 'Processing...' : 'Save Payment'}
//             </CButton>
//           </div>
//           <CButton 
//             color="secondary" 
//             onClick={onClose} 
//             disabled={isLoading}
//           >
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </>
//   );
// };

// export default ExchangeLedgerModel;




import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CBackdrop,
  CAlert,
  CFormCheck
} from '@coreui/react';
import axiosInstance from 'axiosInstance';
import tvsLogo from '../../assets/images/logo.png';
import config from 'config';

const ExchangeLedgerModel = ({ show, onClose, brokerData, refreshData }) => {
  const [formData, setFormData] = useState({
    brokerId: brokerData?.broker?._id || '',
    bookingId: '',
    totalAmount: brokerData?.totalCredit || 0,
    balanceAmount: brokerData?.totalDebit || 0,
    type: '',
    modeOfPayment: '',
    amount: '',
    remark: '',
    cashLocation: '',
    bank: ''
  });

  const [cashLocations, setCashLocations] = useState([]);
  const [bankLocations, setBankLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [commissionInfo, setCommissionInfo] = useState(null);
  const [editFixedAmount, setEditFixedAmount] = useState(false);

  // Extract commission information when brokerData changes
  useEffect(() => {
    if (brokerData?.broker?.branches?.length > 0) {
      const activeBranch = brokerData.broker.branches.find(b => b.isActive);
      if (activeBranch) {
        setCommissionInfo({
          type: activeBranch.commissionType,
          range: activeBranch.commissionRange,
          fixedAmount: activeBranch.fixedCommission
        });
        
        // If commission is FIXED, set the amount in formData
        if (activeBranch.commissionType === 'FIXED' && activeBranch.fixedCommission) {
          setFormData(prev => ({
            ...prev,
            amount: activeBranch.fixedCommission
          }));
        }
      }
    }
  }, [brokerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'amount') {
      const amountValue = parseFloat(value) || 0;
      setFormData(prev => ({
        ...prev,
        balanceAmount: parseFloat(prev.totalAmount) - amountValue
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let paymentData = {
        brokerId: formData.brokerId,
        bookingId: formData.bookingId,
        type: formData.type,
        modeOfPayment: formData.modeOfPayment,
        amount: parseFloat(formData.amount),
        remark: formData.remark
      };

      switch (formData.modeOfPayment) {
        case 'Cash':
          paymentData.cashLocation = formData.cashLocation;
          break;
        case 'Bank':
          paymentData.bank = formData.bank;
          break;
        default:
          break;
      }

      const response = await axiosInstance.post(
        `/broker-ledger/${formData.brokerId}/transactions`, 
        paymentData
      );
     
      setSuccess('Payment successfully recorded!');
      if (refreshData) {
        refreshData();
      }
      onClose();
      setFormData({
        brokerId: brokerData?.broker?._id || '',
        bookingId: '',
        totalAmount: brokerData?.totalCredit || 0,
        balanceAmount: brokerData?.totalDebit || 0,
        type: '',
        modeOfPayment: '',
        amount: '',
        remark: '',
        cashLocation: '',
        bank: ''
      });
      setEditFixedAmount(false);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCashLocations = async () => {
      try {
        const response = await axiosInstance.get('/cash-locations');
        setCashLocations(response.data.data.cashLocations);
      } catch (error) {
        console.error('Error fetching cash locations:', error);
      }
    };

    const fetchBankLocations = async () => {
      try {
        const response = await axiosInstance.get('/banks');
        setBankLocations(response.data.data.banks);
      } catch (error) {
        console.error('Error fetching bank locations:', error);
      }
    };

    if (show) {
      fetchCashLocations();
      fetchBankLocations();
      setFormData({
        brokerId: brokerData?.broker?._id || '',
        bookingId: '',
        totalAmount: brokerData?.totalCredit || 0,
        balanceAmount: brokerData?.totalDebit || 0,
        type: '',
        modeOfPayment: '',
        amount: brokerData?.broker?.branches?.[0]?.commissionType === 'FIXED' 
          ? brokerData.broker.branches[0].fixedCommission 
          : '',
        remark: '',
        cashLocation: '',
        bank: ''
      });
      setError(null);
      setSuccess(null);
      setEditFixedAmount(false);
    }
  }, [show, brokerData]);

  const renderPaymentSpecificFields = () => {
    switch (formData.modeOfPayment) {
      case 'Cash':
        return (
          <CCol md={6}>
            <label className="form-label">Cash Location</label>
            <CFormSelect 
              name="cashLocation" 
              value={formData.cashLocation} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
            >
              <option value="">Select Cash Location</option>
              {cashLocations.map(location => (
                <option key={location._id} value={location._id}>
                  {location.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        );
      case 'Bank':
        return (
          <CCol md={6}>
            <label className="form-label">Bank</label>
            <CFormSelect 
              name="bank" 
              value={formData.bank} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
            >
              <option value="">Select Bank</option>
              {bankLocations.map(bank => (
                <option key={bank._id} value={bank._id}>
                  {bank.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <CBackdrop visible={show} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
      <CModal visible={show} onClose={onClose} size="lg" alignment="center">
        <CModalHeader className="text-white" style={{ backgroundColor: '#243c7c' }}>
          <CModalTitle className="text-white">Broker Payment</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}

          <div className="booking-header mb-2 p-1 bg-light rounded">
            <h5 className="mb-0">
              Broker: <strong>{brokerData?.broker?.name || ''}</strong>
            </h5>
            {commissionInfo && commissionInfo.type === 'VARIABLE' && (
              <div className="mt-2">
                <strong>Commission Range:</strong> {commissionInfo.range}
              </div>
            )}
            {commissionInfo && commissionInfo.type === 'FIXED' && (
              <div className="mt-2 d-flex align-items-center">
                <strong>Fixed Commission:</strong> 
                <span className="ms-2 me-2">₹{commissionInfo.fixedAmount}</span>
                <CFormCheck
                  type="checkbox"
                  id="editFixedAmount"
                  label="Edit Amount"
                  checked={editFixedAmount}
                  onChange={() => setEditFixedAmount(!editFixedAmount)}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
          <hr />

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Total Credit (₹)</label>
              <CFormInput 
                type="number" 
                name="totalAmount" 
                value={formData.totalAmount} 
                readOnly 
                className="bg-light font-weight-bold" 
              />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Balance (₹)</label>
              <CFormInput
                type="number"
                name="balanceAmount"
                value={formData.balanceAmount}
                readOnly
                className={`bg-light font-weight-bold ${
                  parseFloat(formData.balanceAmount) > 0 ? 'text-danger' : 'text-success'
                }`}
              />
            </CCol>
          </CRow>

          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Booking</label>
                <CFormSelect
                  name="bookingId"
                  value={formData.bookingId}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="">-- Select Booking --</option>
                  {brokerData?.bookings
                    ?.filter(booking => booking.exchangeDetails?.status === 'PENDING')
                    .map(booking => (
                      <option key={booking._id} value={booking._id}>
                        {booking.bookingNumber} - {booking.customerName} ({booking.exchangeDetails?.vehicleNumber})
                      </option>
                    ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <label className="form-label">Transaction Type</label>
                <CFormSelect
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">-- Select Type --</option>
                  <option value="CREDIT">Credit</option>
                  <option value="DEBIT">Debit</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Mode of Payment</label>
                <CFormSelect
                  name="modeOfPayment"
                  value={formData.modeOfPayment}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">-- Select Mode --</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                  <option value="Exchange">Exchange</option>
                  <option value="UPI">UPI</option>
                  <option value="Pay Order">Pay Order</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <label className="form-label">Amount (₹)</label>
                <CFormInput
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  disabled={isLoading || (commissionInfo?.type === 'FIXED' && !editFixedAmount)}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              {renderPaymentSpecificFields()}
              <CCol md={6}>
                <label className="form-label">Remark</label>
                <CFormInput
                  type="text"
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  placeholder="Enter remarks..."
                  disabled={isLoading}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter className="d-flex justify-content-between">
          <div>
            <CButton 
              color="primary" 
              onClick={handleSubmit} 
              className="me-2" 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Save Payment'}
            </CButton>
          </div>
          <CButton 
            color="secondary" 
            onClick={onClose} 
            disabled={isLoading}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default ExchangeLedgerModel;