// import React, { useState, useEffect } from 'react';
// import '../../../css/invoice.css';
// import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'utils/tableImports';
// import '../../../css/table.css';
// function Summary() {
//   const [activeTab, setActiveTab] = useState(0);
//   const {
//     data: bookingsData,
//     setData: setBookingsData,
//     filteredData: filteredBookings,
//     setFilteredData: setFilteredBookings,
//     handleFilter: handleBookingsFilter
//   } = useTableFilter([]);

//   const {
//     data: subdealerData,
//     setData: setSubdealerData,
//     filteredData: filteredSubdealer,
//     setFilteredData: setFilteredSubdealer,
//     handleFilter: handleSubdealerFilter
//   } = useTableFilter([]);
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/bookings`);
//      const subdealerBookings = response.data.data.bookings.filter(
//         booking => booking.bookingType === 'SUBDEALER'
//       );
//       setBookingsData(subdealerBookings)
//       setFilteredBookings(subdealerBookings);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };
//   useEffect(() => {
//     fetchSubdealerData();
//   }, []);

//   const fetchSubdealerData = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealers/financials/all`);
//       setSubdealerData(response.data.data.subdealers);
//       setFilteredSubdealer(response.data.data.subdealers);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };
//   return (
//     <div className="container-table">
//       <CNav variant="tabs">
//         <CNavItem>
//           <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
//             Customer
//           </CNavLink>
//         </CNavItem>
//         <CNavItem>
//           <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
//             Sub Dealer
//           </CNavLink>
//         </CNavItem>
//         <CNavItem>
//           <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)}>
//             Complete Payment
//           </CNavLink>
//         </CNavItem>
//         <CNavItem>
//           <CNavLink active={activeTab === 3} onClick={() => setActiveTab(3)}>
//             Pending List
//           </CNavLink>
//         </CNavItem>
//       </CNav>

//       <CTabContent>
//         <CTabPane visible={activeTab === 0} className="p-3">
//           <h5>Customer</h5>
//           <div className="table-header">
//             <div className="search-icon-data">
//               <input
//                 type="text"
//                 placeholder="Search.."
//                 onChange={(e) => handleBookingsFilter(e.target.value, getDefaultSearchFields('receipts'))}
//               />
//               <SearchOutlinedIcon />
//             </div>
//           </div>
//           <div className="table-responsive">
//             <div className="table-wrapper">
//               <table className="responsive-table" style={{ overflow: 'auto' }}>
//                 <thead className="table-header-fixed">
//                   <tr>
//                     <th>Sr.no</th>
//                     <th>Booking ID</th>
//                     <th>Model Name</th>
//                     <th>Booking Date</th>
//                     <th>Customer Name</th>
//                     <th>Chassis Number</th>
//                     <th>Total</th>
//                     <th>Received</th>
//                     <th>Balance</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredBookings.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" style={{ color: 'red' }}>
//                         No booking available
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredBookings.map((booking, index) => (
//                       <tr key={index}>
//                         <td>{index + 1}</td>
//                         <td>{booking.bookingNumber}</td>
//                         <td>{booking.model.model_name}</td>
//                         <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</td>
//                         <td>{booking.customerDetails.name}</td>
//                         <td>{booking.chassisNumber}</td>
//                         <td>{booking.discountedAmount || '0'}</td>
//                         <td>{booking.receivedAmount || '0'}</td>
//                         <td>{booking.balanceAmount || '0'}</td>
//                       </tr>
//                     ))
//                   )}
//         {/* <ReceiptModal show={showModal} onClose={() => setShowModal(false)} bookingData={selectedBooking} /> */}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </CTabPane>

//         <CTabPane visible={activeTab === 1} className="p-3">
//           <h5>Sub Dealer</h5>
//           <div className="table-header">
//             <div className="search-icon-data">
//               <input type="text" placeholder="Search.." onChange={(e) => handleLedgerFilter(e.target.value, ['branchName'])} />
//               <SearchOutlinedIcon />
//             </div>
//           </div>
//           <div className="table-responsive">
//             <div className="table-wrapper">
//               <table className="responsive-table" style={{ overflow: 'auto' }}>
//                 <thead className="table-header-fixed">
//                   <tr>
//                     <th>Sr.no</th>
//                    <th>Name</th>
//                    <th>Total Bookings</th>
//                    <th>Total Amount</th>
//                    <th>Total Received</th>
//                    <th>Total Balance</th>
//                    <th>OnAccount Balance</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredSubdealer.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" style={{ color: 'red' }}>
//                         No subdealer available
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredSubdealer.map((subdealer, index) => (
//                       <tr key={index}>
//                         <td>{index + 1}</td>
//                      <td>{subdealer.name}</td>
//                     <td>{subdealer.financials.bookingSummary.totalBookings}</td>
//                     <td>{subdealer.financials.bookingSummary.totalBookingAmount}</td>
//                     <td>{subdealer.financials.bookingSummary.totalReceivedAmount}</td>
//                     <td>{subdealer.financials.bookingSummary.totalBalanceAmount}</td>
//                     <td>{subdealer.financials.onAccountSummary.totalBalance}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </CTabPane>

//         <CTabPane visible={activeTab === 2} className="p-3">
//           <h5>Complete Payment</h5>
//           <div className="table-header">
//             <div className="search-icon-data">
//               <input
//                 type="text"
//                 placeholder="Search.."
//                 onChange={(e) => handleBookingsFilter(e.target.value, getDefaultSearchFields('receipts'))}
//               />
//               <SearchOutlinedIcon />
//             </div>
//           </div>
//           <div className="table-responsive">
//             <div className="table-wrapper">
//               <table className="responsive-table" style={{ overflow: 'auto' }}>
//                 <thead className="table-header-fixed">
//                   <tr>
//                     <th>Sr.no</th>
//                     <th>Booking ID</th>
//                     <th>Model Name</th>
//                     <th>Booking Date</th>
//                     <th>Customer Name</th>
//                     <th>Chassis Number</th>
//                     <th>Total</th>
//                     <th>Received</th>
//                     <th>Balance</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredBookings.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" style={{ color: 'red' }}>
//                         No booking available
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredBookings.map((booking, index) => (
//                       <tr key={index}>
//                         <td>{index + 1}</td>
//                         <td>{booking.bookingNumber}</td>
//                         <td>{booking.model.model_name}</td>
//                         <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</td>
//                         <td>{booking.customerDetails.name}</td>
//                         <td>{booking.chassisNumber}</td>
//                         <td>{booking.discountedAmount || '0'}</td>
//                         <td>{booking.receivedAmount || '0'}</td>
//                         <td>{booking.balanceAmount || '0'}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </CTabPane>
//         <CTabPane visible={activeTab === 3} className="p-3">
//           <h5>Pending List</h5>
//         </CTabPane>
//       </CTabContent>
//     </div>
//   );
// }

// export default Summary;





import React, { useState, useEffect } from 'react';
import '../../../css/invoice.css';
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'utils/tableImports';
import '../../../css/table.css';

function Summary() {
  const [activeTab, setActiveTab] = useState(0);
  const {
    data: bookingsData,
    setData: setBookingsData,
    filteredData: filteredBookings,
    setFilteredData: setFilteredBookings,
    handleFilter: handleBookingsFilter
  } = useTableFilter([]);

  const {
    data: subdealerData,
    setData: setSubdealerData,
    filteredData: filteredSubdealer,
    setFilteredData: setFilteredSubdealer,
    handleFilter: handleSubdealerFilter
  } = useTableFilter([]);
  
  // State for complete payments (balance = 0)
  const [completePayments, setCompletePayments] = useState([]);
  const [filteredCompletePayments, setFilteredCompletePayments] = useState([]);
  
  // State for pending payments (balance ≠ 0)
  const [pendingPayments, setPendingPayments] = useState([]);
  const [filteredPendingPayments, setFilteredPendingPayments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/bookings`);
      const subdealerBookings = response.data.data.bookings.filter(
        booking => booking.bookingType === 'SUBDEALER'
      );
      
      setBookingsData(subdealerBookings);
      setFilteredBookings(subdealerBookings);
      
      // Filter complete payments (balance = 0)
      const complete = subdealerBookings.filter(booking => 
        parseFloat(booking.balanceAmount || 0) === 0
      );
      setCompletePayments(complete);
      setFilteredCompletePayments(complete);
      
      // Filter pending payments (balance ≠ 0)
      const pending = subdealerBookings.filter(booking => 
        parseFloat(booking.balanceAmount || 0) !== 0
      );
      setPendingPayments(pending);
      setFilteredPendingPayments(pending);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchSubdealerData();
  }, []);

  const fetchSubdealerData = async () => {
    try {
      const response = await axiosInstance.get(`/subdealers/financials/all`);
      setSubdealerData(response.data.data.subdealers);
      setFilteredSubdealer(response.data.data.subdealers);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  // Handler for filtering complete payments
  const handleCompletePaymentsFilter = (searchValue) => {
    handleBookingsFilter(searchValue, getDefaultSearchFields('receipts'), completePayments, setFilteredCompletePayments);
  };

  // Handler for filtering pending payments
  const handlePendingPaymentsFilter = (searchValue) => {
    handleBookingsFilter(searchValue, getDefaultSearchFields('receipts'), pendingPayments, setFilteredPendingPayments);
  };

  return (
    <div className="container-table">
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
            Customer
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
            Sub Dealer
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)}>
            Complete Payment
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 3} onClick={() => setActiveTab(3)}>
            Pending List
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        {/* Customer Tab (unchanged) */}
        <CTabPane visible={activeTab === 0} className="p-3">
          <h5>Customer</h5>
          <div className="table-header">
            <div className="search-icon-data">
              <input
                type="text"
                placeholder="Search.."
                onChange={(e) => handleBookingsFilter(e.target.value, getDefaultSearchFields('receipts'))}
              />
              <SearchOutlinedIcon />
            </div>
          </div>
          <div className="table-responsive">
            <div className="table-wrapper">
              <table className="responsive-table" style={{ overflow: 'auto' }}>
                <thead className="table-header-fixed">
                  <tr>
                    <th>Sr.no</th>
                    <th>Booking ID</th>
                    <th>Model Name</th>
                    <th>Booking Date</th>
                    <th>Customer Name</th>
                    <th>Chassis Number</th>
                    <th>Total</th>
                    <th>Received</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ color: 'red' }}>
                        No booking available
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{booking.bookingNumber}</td>
                        <td>{booking.model.model_name}</td>
                        <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</td>
                        <td>{booking.customerDetails.name}</td>
                        <td>{booking.chassisNumber}</td>
                        <td>{booking.discountedAmount || '0'}</td>
                        <td>{booking.receivedAmount || '0'}</td>
                        <td>{booking.balanceAmount || '0'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CTabPane>

        {/* Sub Dealer Tab (unchanged) */}
        <CTabPane visible={activeTab === 1} className="p-3">
          <h5>Sub Dealer</h5>
          <div className="table-header">
            <div className="search-icon-data">
              <input type="text" placeholder="Search.." onChange={(e) => handleSubdealerFilter(e.target.value, ['branchName'])} />
              <SearchOutlinedIcon />
            </div>
          </div>
          <div className="table-responsive">
            <div className="table-wrapper">
              <table className="responsive-table" style={{ overflow: 'auto' }}>
                <thead className="table-header-fixed">
                  <tr>
                    <th>Sr.no</th>
                   <th>Name</th>
                   <th>Total Bookings</th>
                   <th>Total Amount</th>
                   <th>Total Received</th>
                   <th>Total Balance</th>
                   <th>OnAccount Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubdealer.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ color: 'red' }}>
                        No subdealer available
                      </td>
                    </tr>
                  ) : (
                    filteredSubdealer.map((subdealer, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                     <td>{subdealer.name}</td>
                    <td>{subdealer.financials.bookingSummary.totalBookings}</td>
                    <td>{subdealer.financials.bookingSummary.totalBookingAmount}</td>
                    <td>{subdealer.financials.bookingSummary.totalReceivedAmount}</td>
                    <td>{subdealer.financials.bookingSummary.totalBalanceAmount}</td>
                    <td>{subdealer.financials.onAccountSummary.totalBalance}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CTabPane>

        {/* Complete Payment Tab (balance = 0) */}
        <CTabPane visible={activeTab === 2} className="p-3">
          <h5>Complete Payment</h5>
          <div className="table-header">
            <div className="search-icon-data">
              <input
                type="text"
                placeholder="Search.."
                onChange={(e) => handleCompletePaymentsFilter(e.target.value)}
              />
              <SearchOutlinedIcon />
            </div>
          </div>
          <div className="table-responsive">
            <div className="table-wrapper">
              <table className="responsive-table" style={{ overflow: 'auto' }}>
                <thead className="table-header-fixed">
                  <tr>
                    <th>Sr.no</th>
                    <th>Booking ID</th>
                    <th>Model Name</th>
                    <th>Booking Date</th>
                    <th>Customer Name</th>
                    <th>Chassis Number</th>
                    <th>Total</th>
                    <th>Received</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompletePayments.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ color: 'red' }}>
                        No complete payments available
                      </td>
                    </tr>
                  ) : (
                    filteredCompletePayments.map((booking, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{booking.bookingNumber}</td>
                        <td>{booking.model.model_name}</td>
                        <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</td>
                        <td>{booking.customerDetails.name}</td>
                        <td>{booking.chassisNumber}</td>
                        <td>{booking.discountedAmount || '0'}</td>
                        <td>{booking.receivedAmount || '0'}</td>
                        <td style={{color: 'green'}}>{booking.balanceAmount || '0'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CTabPane>
        
        {/* Pending List Tab (balance ≠ 0) */}
        <CTabPane visible={activeTab === 3} className="p-3">
          <h5>Pending List</h5>
          <div className="table-header">
            <div className="search-icon-data">
              <input
                type="text"
                placeholder="Search.."
                onChange={(e) => handlePendingPaymentsFilter(e.target.value)}
              />
              <SearchOutlinedIcon />
            </div>
          </div>
          <div className="table-responsive">
            <div className="table-wrapper">
              <table className="responsive-table" style={{ overflow: 'auto' }}>
                <thead className="table-header-fixed">
                  <tr>
                    <th>Sr.no</th>
                    <th>Booking ID</th>
                    <th>Model Name</th>
                    <th>Booking Date</th>
                    <th>Customer Name</th>
                    <th>Chassis Number</th>
                    <th>Total</th>
                    <th>Received</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPendingPayments.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ color: 'red' }}>
                        No pending payments available
                      </td>
                    </tr>
                  ) : (
                    filteredPendingPayments.map((booking, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{booking.bookingNumber}</td>
                        <td>{booking.model.model_name}</td>
                        <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</td>
                        <td>{booking.customerDetails.name}</td>
                        <td>{booking.chassisNumber}</td>
                        <td>{booking.discountedAmount || '0'}</td>
                        <td>{booking.receivedAmount || '0'}</td>
                        <td style={{color: 'red'}}>{booking.balanceAmount || '0'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CTabPane>
      </CTabContent>
    </div>
  );
}

export default Summary;