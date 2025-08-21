// import React, { useState, useEffect } from 'react';
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CRow,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CButton,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CForm,
//   CFormLabel,
//   CFormInput,
//   CFormSelect,
//   CSpinner,
//   CAlert,
//   CBadge
// } from '@coreui/react';
// import axiosInstance from 'axiosInstance';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilCheckCircle } from '@coreui/icons';

// function SubdealerCustomerManagement() {
//   const [subdealers, setSubdealers] = useState([]);
//   const [selectedSubdealer, setSelectedSubdealer] = useState('');
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [subdealerData, setSubdealerData] = useState(null);
  
//   // Modal state
//   const [visible, setVisible] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [bookingData, setBookingData] = useState({
//     bookingId: '',
//     amount: '',
//     status: 'PENDING_APPROVAL'
//   });
//   const [submitting, setSubmitting] = useState(false);

//   // Fetch subdealers on component mount
//   useEffect(() => {
//     const fetchSubdealers = async () => {
//       try {
//         const response = await axiosInstance.get('/subdealers');
//         setSubdealers(response.data.data.subdealers || []);
//       } catch (error) {
//         console.error('Error fetching subdealers:', error);
//         setError('Failed to load subdealers');
//       }
//     };
    
//     fetchSubdealers();
//   }, []);

//   // Fetch bookings when subdealer is selected
//   useEffect(() => {
//     if (selectedSubdealer) {
//       fetchSubdealerFinancialSummary();
//     } else {
//       setBookings([]);
//       setSubdealerData(null);
//     }
//   }, [selectedSubdealer]);

//   const fetchSubdealerFinancialSummary = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await axiosInstance.get(`/subdealers/${selectedSubdealer}/financial-summary`);
//       setSubdealerData(response.data.data);
      
//       // Set all bookings from recentTransactions
//       setBookings(response.data.data.recentTransactions || []);
//     } catch (error) {
//       console.error('Error fetching subdealer financial summary:', error);
//       setError('Failed to load financial data for this subdealer');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubdealerChange = (e) => {
//     setSelectedSubdealer(e.target.value);
//   };

//   const openAddModal = (customerName) => {
//     setSelectedCustomer({ name: customerName });
//     setBookingData({
//       bookingId: '',
//       amount: '',
//       status: 'PENDING_APPROVAL'
//     });
//     setVisible(true);
//   };

//   const handleBookingChange = (e) => {
//     const { name, value } = e.target;
//     setBookingData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmitBooking = async () => {
//     if (!bookingData.bookingId || !bookingData.amount) {
//       setError('Booking ID and Amount are required');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       await axiosInstance.post('/bookings', {
//         customerName: selectedCustomer.name,
//         subdealerId: selectedSubdealer,
//         bookingNumber: bookingData.bookingId,
//         totalAmount: parseFloat(bookingData.amount),
//         status: bookingData.status
//       });

//       setSuccess('Booking added successfully!');
//       setVisible(false);
      
//       // Refresh data
//       fetchSubdealerFinancialSummary();
//     } catch (error) {
//       console.error('Error adding booking:', error);
//       setError('Failed to add booking');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       PENDING_APPROVAL: { color: 'warning', text: 'Pending' },
//       APPROVED: { color: 'success', text: 'Approved' },
//       ALLOCATED: { color: 'info', text: 'Allocated' }
//     };
    
//     const config = statusConfig[status] || { color: 'secondary', text: status };
//     return <CBadge color={config.color}>{config.text}</CBadge>;
//   };

//   return (
//     <CRow>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <h5>Subdealer Booking Management</h5>
//           </CCardHeader>
//           <CCardBody>
//             {error && (
//               <CAlert color="danger" dismissible onClose={() => setError('')}>
//                 {error}
//               </CAlert>
//             )}
            
//             {success && (
//               <CAlert color="success" dismissible onClose={() => setSuccess('')}>
//                 {success}
//               </CAlert>
//             )}

//             <div className="mb-3">
//               <CFormLabel htmlFor="subdealerSelect">Select Subdealer</CFormLabel>
//               <CFormSelect 
//                 id="subdealerSelect" 
//                 value={selectedSubdealer} 
//                 onChange={handleSubdealerChange}
//               >
//                 <option value="">-- Select Subdealer --</option>
//                 {subdealers.map(subdealer => (
//                   <option key={subdealer._id} value={subdealer._id}>
//                     {subdealer.name} - {subdealer.location}
//                   </option>
//                 ))}
//               </CFormSelect>
//             </div>

//             {subdealerData && (
//               <CCard className="mb-4">
//                 <CCardHeader>
//                   <h6>Subdealer Summary: {subdealerData.subdealer.name}</h6>
//                 </CCardHeader>
//                 <CCardBody>
//                   <CRow>
//                     <CCol md={3}>
//                       <strong>Total Bookings:</strong> {subdealerData.bookingSummary.totalBookings}
//                     </CCol>
//                     <CCol md={3}>
//                       <strong>Total Amount:</strong> ₹{subdealerData.bookingSummary.totalBookingAmount.toLocaleString()}
//                     </CCol>
//                     <CCol md={3}>
//                       <strong>Received:</strong> ₹{subdealerData.bookingSummary.totalReceivedAmount.toLocaleString()}
//                     </CCol>
//                     <CCol md={3}>
//                       <strong>Outstanding:</strong> ₹{subdealerData.financialOverview.totalOutstanding.toLocaleString()}
//                     </CCol>
//                   </CRow>
//                 </CCardBody>
//               </CCard>
//             )}

//             {loading && (
//               <div className="text-center">
//                 <CSpinner />
//                 <p>Loading booking data...</p>
//               </div>
//             )}

//             {!loading && selectedSubdealer && bookings.length > 0 && (
//               <CTable striped hover responsive>
//                 <CTableHead>
//                   <CTableRow>
//                     <CTableHeaderCell>Booking #</CTableHeaderCell>
//                     <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                     <CTableHeaderCell>Total Amount (₹)</CTableHeaderCell>
//                     <CTableHeaderCell>Received (₹)</CTableHeaderCell>
//                     <CTableHeaderCell>Balance (₹)</CTableHeaderCell>
//                     <CTableHeaderCell>Date</CTableHeaderCell>
//                     <CTableHeaderCell>Action</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {bookings.map((booking, index) => (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
//                       <CTableDataCell>₹{booking.totalAmount.toLocaleString()}</CTableDataCell>
//                       <CTableDataCell>₹{booking.receivedAmount.toLocaleString()}</CTableDataCell>
//                       <CTableDataCell>₹{booking.balanceAmount.toLocaleString()}</CTableDataCell>
//                       <CTableDataCell>{new Date(booking.createdAt).toLocaleDateString()}</CTableDataCell>
//                       <CTableDataCell>
//                         <CButton 
//                           color="primary" 
//                           size="sm" 
//                           onClick={() => openAddModal(booking.customerDetails.name)}
//                         >
//                           <CIcon icon={cilPlus} style={{height:'25px'}}/>
//                         </CButton>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))}
//                 </CTableBody>
//               </CTable>
//             )}

//             {!loading && selectedSubdealer && bookings.length === 0 && (
//               <div className="text-center py-4">
//                 <p>No bookings found for this subdealer.</p>
//                 <CButton 
//                   color="primary" 
//                   onClick={() => openAddModal("New Customer")}
//                 >
//                   <CIcon icon={cilPlus} className="me-1" />
//                   Add First Booking
//                 </CButton>
//               </div>
//             )}
//           </CCardBody>
//         </CCard>
//       </CCol>

//       {/* Add Booking Modal */}
//       <CModal visible={visible} onClose={() => setVisible(false)}>
//         <CModalHeader onClose={() => setVisible(false)}>
//           <CModalTitle>Add Payment for {selectedCustomer?.name}</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CForm>
//             <div className="mb-3">
//               <CFormLabel htmlFor="bookingId">Booking ID</CFormLabel>
//               <CFormInput
//                 type="text"
//                 id="bookingId"
//                 name="bookingId"
//                 value={bookingData.bookingId}
//                 onChange={handleBookingChange}
//                 placeholder="Enter booking ID"
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <CFormLabel htmlFor="amount">Amount (₹)</CFormLabel>
//               <CFormInput
//                 type="number"
//                 id="amount"
//                 name="amount"
//                 value={bookingData.amount}
//                 onChange={handleBookingChange}
//                 placeholder="Enter amount"
//                 required
//                 min="0"
//                 step="0.01"
//               />
//             </div>
//           </CForm>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setVisible(false)}>
//             Cancel
//           </CButton>
//           <CButton 
//             color="primary" 
//             onClick={handleSubmitBooking}
//             disabled={submitting}
//           >
//             {submitting ? (
//               <>
//                 <CSpinner component="span" size="sm" aria-hidden="true" />
//                 Adding...
//               </>
//             ) : (
//               <>
//                 <CIcon icon={cilCheckCircle} className="me-1" />
//                 Add Payment
//               </>
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </CRow>
//   );
// }

// export default SubdealerCustomerManagement;




import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CSpinner,
  CAlert,
  CBadge,
  CFormTextarea
} from '@coreui/react';
import axiosInstance from 'axiosInstance';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilCheckCircle } from '@coreui/icons';

function SubdealerCustomerManagement() {
  const [subdealers, setSubdealers] = useState([]);
  const [selectedSubdealer, setSelectedSubdealer] = useState('');
  const [bookings, setBookings] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [subdealerData, setSubdealerData] = useState(null);
  
  // Modal state
  const [visible, setVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    remark: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch subdealers on component mount
  useEffect(() => {
    const fetchSubdealers = async () => {
      try {
        const response = await axiosInstance.get('/subdealers');
        setSubdealers(response.data.data.subdealers || []);
      } catch (error) {
        console.error('Error fetching subdealers:', error);
        setError('Failed to load subdealers');
      }
    };
    
    fetchSubdealers();
  }, []);

  // Fetch data when subdealer is selected
  useEffect(() => {
    if (selectedSubdealer) {
      fetchSubdealerFinancialSummary();
      fetchSubdealerReceipts();
    } else {
      setBookings([]);
      setReceipts([]);
      setSubdealerData(null);
      setSelectedReceipt('');
    }
  }, [selectedSubdealer]);

  const fetchSubdealerFinancialSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get(`/subdealers/${selectedSubdealer}/financial-summary`);
      setSubdealerData(response.data.data);
      
      // Set all bookings from recentTransactions
      setBookings(response.data.data.recentTransactions || []);
    } catch (error) {
      console.error('Error fetching subdealer financial summary:', error);
      setError('Failed to load financial data for this subdealer');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubdealerReceipts = async () => {
    try {
      // Fetch receipts for the selected subdealer
      const response = await axiosInstance.get(`/subdealersonaccount/${selectedSubdealer}/on-account/receipts`);
      setReceipts(response.data.docs || []);
    } catch (error) {
      console.error('Error fetching subdealer receipts:', error);
      setError('Failed to load receipt data');
    }
  };

  const handleSubdealerChange = (e) => {
    setSelectedSubdealer(e.target.value);
    setSelectedReceipt(''); // Reset selected receipt when subdealer changes
  };

  const handleReceiptChange = (e) => {
    setSelectedReceipt(e.target.value);
  };

  const openAddModal = (booking) => {
    setSelectedBooking(booking);
    setPaymentData({
      amount: '',
      remark: ''
    });
    setVisible(true);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitPayment = async () => {
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      setError('Valid amount is required');
      return;
    }

    if (!selectedReceipt) {
      setError('Please select a UTR receipt first');
      return;
    }

    if (!selectedBooking || !selectedBooking._id) {
      setError('Booking information is missing');
      return;
    }

    if (parseFloat(paymentData.amount) > getRemainingAmount(selectedReceipt)) {
      setError('Amount cannot exceed the remaining amount of the selected UTR');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        allocations: [
          {
            bookingId: selectedBooking._id,
            amount: parseFloat(paymentData.amount),
            remark: paymentData.remark || ''
          }
        ]
      };

      // Use the correct API endpoint for allocation with the proper payload structure
      await axiosInstance.post(`/subdealersonaccount/receipts/${selectedReceipt}/allocate`, payload);

      setSuccess('Payment allocated successfully!');
      setVisible(false);
      
      // Refresh data
      fetchSubdealerFinancialSummary();
      fetchSubdealerReceipts();
    } catch (error) {
      console.error('Error allocating payment:', error);
      setError('Failed to allocate payment: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const getRemainingAmount = (receiptId) => {
    const receipt = receipts.find(r => r._id === receiptId);
    if (!receipt) return 0;
    return receipt.amount - receipt.allocatedTotal;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING_APPROVAL: { color: 'warning', text: 'Pending' },
      APPROVED: { color: 'success', text: 'Approved' },
      ALLOCATED: { color: 'info', text: 'Allocated' }
    };
    
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  return (
    <div>
      <h4>Distribute OnAccount Balance</h4>
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h5>Subdealer Booking Management</h5>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" dismissible onClose={() => setError('')}>
                {error}
              </CAlert>
            )}
            
            {success && (
              <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                {success}
              </CAlert>
            )}

            {/* Subdealer and UTR selection in one row */}
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="subdealerSelect">Select Subdealer</CFormLabel>
                <CFormSelect 
                  id="subdealerSelect" 
                  value={selectedSubdealer} 
                  onChange={handleSubdealerChange}
                >
                  <option value="">-- Select Subdealer --</option>
                  {subdealers.map(subdealer => (
                    <option key={subdealer._id} value={subdealer._id}>
                      {subdealer.name} - {subdealer.location}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              
              <CCol md={6}>
                <CFormLabel htmlFor="receiptSelect">Select UTR/Receipt</CFormLabel>
                <CFormSelect 
                  id="receiptSelect" 
                  value={selectedReceipt} 
                  onChange={handleReceiptChange}
                  disabled={!selectedSubdealer}
                >
                  <option value="">-- Select UTR/Receipt --</option>
                  {receipts.map(receipt => {
                    const remainingAmount = receipt.amount - receipt.allocatedTotal;
                    return (
                      <option key={receipt._id} value={receipt._id} disabled={remainingAmount <= 0}>
                        {receipt.refNumber} - ₹{remainingAmount.toLocaleString()} remaining
                      </option>
                    );
                  })}
                </CFormSelect>
                <small className="text-muted">
                  Select a UTR to allocate payments against available funds
                </small>
              </CCol>
            </CRow>

            {subdealerData && (
              <CCard className="mb-4">
                <CCardHeader>
                  <h6>Subdealer Summary: {subdealerData.subdealer.name}</h6>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol md={3}>
                      <strong>Total Bookings:</strong> {subdealerData.bookingSummary.totalBookings}
                    </CCol>
                    <CCol md={3}>
                      <strong>Total Amount:</strong> ₹{subdealerData.bookingSummary.totalBookingAmount.toLocaleString()}
                    </CCol>
                    <CCol md={3}>
                      <strong>Received:</strong> ₹{subdealerData.bookingSummary.totalReceivedAmount.toLocaleString()}
                    </CCol>
                    <CCol md={3}>
                      <strong>Outstanding:</strong> ₹{subdealerData.financialOverview.totalOutstanding.toLocaleString()}
                    </CCol>
                  </CRow>
                  {receipts.length > 0 && (
                    <CRow className="mt-3">
                      <CCol>
                        <strong>OnAccount Balance:</strong> ₹{receipts.reduce((sum, receipt) => sum + (receipt.amount - receipt.allocatedTotal), 0).toLocaleString()}
                      </CCol>
                    </CRow>
                  )}
                </CCardBody>
              </CCard>
            )}

            {loading && (
              <div className="text-center">
                <CSpinner />
                <p>Loading booking data...</p>
              </div>
            )}

            {!loading && selectedSubdealer && bookings.length > 0 && (
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Booking #</CTableHeaderCell>
                    <CTableHeaderCell>Customer Name</CTableHeaderCell>
                    <CTableHeaderCell>Total Amount (₹)</CTableHeaderCell>
                    <CTableHeaderCell>Received (₹)</CTableHeaderCell>
                    <CTableHeaderCell>Balance (₹)</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {bookings.map((booking, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                      <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
                      <CTableDataCell>₹{booking.totalAmount.toLocaleString()}</CTableDataCell>
                      <CTableDataCell>₹{booking.receivedAmount.toLocaleString()}</CTableDataCell>
                      <CTableDataCell>₹{booking.balanceAmount.toLocaleString()}</CTableDataCell>
                      <CTableDataCell>{new Date(booking.createdAt).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell>
                        <CButton 
                          color="primary" 
                          size="sm" 
                          onClick={() => openAddModal(booking)}
                          disabled={!selectedReceipt}
                          title={!selectedReceipt ? "Please select a UTR first" : "Add payment"}
                        >
                          <CIcon icon={cilPlus} style={{height:'15px'}}/>
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}

            {!loading && selectedSubdealer && bookings.length === 0 && (
              <div className="text-center py-4">
                <p>No bookings found for this subdealer.</p>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Add Payment Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Allocate Payment</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Customer Name</CFormLabel>
              <CFormInput
                type="text"
                value={selectedBooking?.customerDetails?.name || ''}
                disabled
                readOnly
              />
            </div>
            
            <div className="mb-3">
              <CFormLabel>Booking Number</CFormLabel>
              <CFormInput
                type="text"
                value={selectedBooking?.bookingNumber || ''}
                disabled
                readOnly
              />
            </div>
            
            <div className="mb-3">
              <CFormLabel>Booking ID</CFormLabel>
              <CFormInput
                type="text"
                value={selectedBooking?._id || ''}
                disabled
                readOnly
              />
              <small className="text-muted">This will be sent to the server for allocation</small>
            </div>
            
            <div className="mb-3">
              <CFormLabel htmlFor="amount">Amount to Allocate (₹)</CFormLabel>
              <CFormInput
                type="number"
                id="amount"
                name="amount"
                value={paymentData.amount}
                onChange={handlePaymentChange}
                placeholder="Enter amount"
                required
                min="0.01"
                step="0.01"
                max={selectedReceipt ? getRemainingAmount(selectedReceipt) : undefined}
              />
              {selectedReceipt && (
                <small className="text-muted">
                  Maximum allocatable amount: ₹{getRemainingAmount(selectedReceipt).toLocaleString()}
                </small>
              )}
            </div>
            
            <div className="mb-3">
              <CFormLabel htmlFor="remark">Remark (Optional)</CFormLabel>
              <CFormTextarea
                id="remark"
                name="remark"
                value={paymentData.remark}
                onChange={handlePaymentChange}
                placeholder="Enter any remarks"
                rows={3}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton 
            color="primary" 
            onClick={handleSubmitPayment}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <CSpinner component="span" size="sm" aria-hidden="true" />
                Allocating...
              </>
            ) : (
              <>
                <CIcon icon={cilCheckCircle} className="me-1" />
                Allocate Payment
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
    </div>
  );
}

export default SubdealerCustomerManagement;