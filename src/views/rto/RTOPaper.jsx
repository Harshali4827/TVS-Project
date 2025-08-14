// import React, { useState, useEffect } from 'react';
// import { CBadge, CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, showError, useTableFilter } from 'utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import KYCDocuments from './KYCDocuments';

// function RTOPaper() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showKycModal, setShowKycModal] = useState(false);
//   const [kycData, setKycData] = useState(null);
//   const [kycBookingId, setKycBookingId] = useState(null);

//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPendings,
//     setFilteredData: setFilteredPendings,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);

//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/rtoProcess/rtopaperspending`);
//       setPendingData(response.data.data);
//       setFilteredPendings(response.data.data);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };

//   useEffect(() => {
//     fetchLocationData();
//   }, []);

//   const fetchLocationData = async () => {
//     try {
//       const response = await axiosInstance.get(`/insurance`);
//       setApprovedData(response.data.data);
//       setFilteredApproved(response.data.data);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };

//   const handleViewKYC = async (booking) => {
//     try {
//       const BookingId = booking.bookingId?.id || booking.id;
//       setKycBookingId(BookingId);
//       console.log('Actual booking ID to be used:', BookingId);
//       const response = await axiosInstance.get(`/kyc/${BookingId}/documents`);

//       const kycDataWithStatus = {
//         ...response.data.data,
//         status: booking.documentStatus?.kyc?.status || 'PENDING',
//         // customerName: booking.customerDetails.name,
//         chassisNumber: booking.chassisNumber,
//         bookingNumber: booking.bookingNumber
//       };

//       setKycData(kycDataWithStatus);
//       setShowKycModal(true);
//     } catch (error) {
//       console.log('Error fetching KYC details', error);
//       showError(error);
//     }
//   };

//   const refreshData = () => {
//     fetchData();
//     fetchLocationData();
//   };

//   return (
//     <div>
//       <h4>RTO Paper Pending</h4>
//       <div className="container-table">
//         <CNav variant="tabs">
//           <CNavItem>
//             <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
//               RTO PAPER PENDING
//             </CNavLink>
//           </CNavItem>
//           <CNavItem>
//             <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
//               COMPLETED
//             </CNavLink>
//           </CNavItem>
//         </CNav>

//         <CTabContent>
//           <CTabPane visible={activeTab === 0} className="p-3">
//             <h5>RTO PAPER PENDING REPORT</h5>
//             <div className="table-header">
//               <div className="search-icon-data">
//                 <input
//                   type="text"
//                   placeholder="Search.."
//                   onChange={(e) => handlePendingFilter(e.target.value, getDefaultSearchFields('receipts'))}
//                 />
//                 <SearchOutlinedIcon />
//               </div>
//             </div>
//             <div className="table-responsive">
//               <div className="table-wrapper">
//                 <table className="responsive-table" style={{ overflow: 'auto' }}>
//                   <thead className="table-header-fixed">
//                     <tr>
//                       <th>Sr.no</th>
//                       <th>Booking ID</th>
//                       <th>Model Name</th>
//                       <th>Chassis Number</th>
//                       <th>Customer Name</th>
//                       <th>Contact Number1</th>
//                       <th>RTO Paper</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredPendings.length === 0 ? (
//                       <tr>
//                         <td colSpan="8" style={{ color: 'red' }}>
//                           No data available
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredPendings.map((booking, index) => (
//                         <tr key={index}>
//                           <td>{index + 1}</td>
//                           <td>{booking.bookingId?.bookingNumber || ''}</td>
//                           <td>{booking.bookingId?.model?.model_name || ''}</td>
//                           <td>{booking.bookingId?.chassisNumber || ''}</td>
//                           <td>{booking.bookingId?.customerName || ''}</td>
//                           <td>{booking.bookingId?.customerMobile || ''}</td>
//                           <td>
//                             <CBadge color={booking.rtoPaperStatus === 'Not Submitted' ? 'danger' : 'secondary'} shape="rounded-pill">
//                               {booking.rtoPaperStatus || 'Pending'}
//                             </CBadge>
//                           </td>
//                           <td>
//                             <button className="action-button" onClick={() => handleViewKYC(booking)}>
//                               View
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </CTabPane>

//           <CTabPane visible={activeTab === 1} className="p-3">
//             <h5>RTO PAPER COMPLETED REPORT</h5>
//             <div className="table-header">
//               <div className="search-icon-data">
//                 <input type="text" placeholder="Search.." onChange={(e) => handleApprovedFilter(e.target.value, ['branchName'])} />
//                 <SearchOutlinedIcon />
//               </div>
//             </div>
//             <div className="table-responsive">
//               <div className="table-wrapper">
//                 <table className="responsive-table" style={{ overflow: 'auto' }}>
//                   <thead className="table-header-fixed">
//                     <tr>
//                       <th>Sr.no</th>
//                       <th>Booking ID</th>
//                       <th>Model Name</th>
//                       <th>Insurance Date</th>
//                       <th>Customer Name</th>
//                       <th>Contact Number1</th>
//                       <th>RTO Paper</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredApproved.length === 0 ? (
//                       <tr>
//                         <td colSpan="8" style={{ color: 'red' }}>
//                           No data available
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredApproved.map((item, index) => (
//                         <tr key={index}>
//                           <td>{index + 1}</td>
//                           <td>{item.booking?.bookingNumber || ''}</td>
//                           <td>{item.booking?.model?.id || ''}</td>
//                           <td>{item.insuranceDate ? new Date(item.insuranceDate).toLocaleDateString('en-GB') : ''}</td>
//                           <td>{item.booking?.fullCustomerName || ''}</td>
//                           <td>{item.booking?.chassisNumber || ''}</td>
//                           <td>{item.booking?.insuranceStatus || ''}</td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </CTabPane>
//         </CTabContent>
//       </div>

//       {/* KYC Documents Modal */}
//       <KYCDocuments
//         open={showKycModal}
//         onClose={() => setShowKycModal(false)}
//         kycData={kycData}
//         refreshData={refreshData}
//         bookingId={kycBookingId}
//       />
//     </div>
//   );
// }

// export default RTOPaper;

import React, { useState, useEffect } from 'react';
import { CBadge, CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, showError, useTableFilter } from 'utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import KYCDocuments from './KYCDocuments';

function RTOPaper() {
  const [activeTab, setActiveTab] = useState(0);
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycData, setKycData] = useState(null);
  const [selectedRtoId, setSelectedRtoId] = useState(null);

  const {
    data: pendingData,
    setData: setPendingData,
    filteredData: filteredPendings,
    setFilteredData: setFilteredPendings,
    handleFilter: handlePendingFilter
  } = useTableFilter([]);

  const {
    data: approvedData,
    setData: setApprovedData,
    filteredData: filteredApproved,
    setFilteredData: setFilteredApproved,
    handleFilter: handleApprovedFilter
  } = useTableFilter([]);

  useEffect(() => {
    fetchData();
    fetchLocationData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/rtoProcess/rtopaperspending`);
      setPendingData(response.data.data);
      setFilteredPendings(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const fetchLocationData = async () => {
    try {
      const response = await axiosInstance.get(`/rtoProcess/rtopaperapproved`);
      setApprovedData(response.data.data);
      setFilteredApproved(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const handleViewKYC = async (booking) => {
    try {
      const BookingId = booking.bookingId?.id || booking.id;
      setSelectedRtoId(booking._id); // Store the RTO ID from the clicked row

      const response = await axiosInstance.get(`/kyc/${BookingId}/documents`);

      const kycDataWithStatus = {
        ...response.data.data,
        status: booking.documentStatus?.kyc?.status || 'PENDING',
        chassisNumber: booking.bookingId?.chassisNumber,
        bookingNumber: booking.bookingId?.bookingNumber,
        customerName: booking.bookingId?.customerName
      };

      setKycData(kycDataWithStatus);
      setShowKycModal(true);
    } catch (error) {
      console.log('Error fetching KYC details', error);
      showError(error);
    }
  };

  const refreshData = () => {
    fetchData();
    fetchLocationData();
  };

  return (
    <div>
      <h4>RTO Paper Pending</h4>
      <div className="container-table">
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
              RTO PAPER PENDING
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
              COMPLETED
            </CNavLink>
          </CNavItem>
        </CNav>

        <CTabContent>
          <CTabPane visible={activeTab === 0} className="p-3">
            <h5>RTO PAPER PENDING REPORT</h5>
            <div className="table-header">
              <div className="search-icon-data">
                <input
                  type="text"
                  placeholder="Search.."
                  onChange={(e) => handlePendingFilter(e.target.value, getDefaultSearchFields('receipts'))}
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
                      <th>Chassis Number</th>
                      <th>Customer Name</th>
                      <th>Contact Number1</th>
                      <th>RTO Paper</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPendings.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ color: 'red' }}>
                          No data available
                        </td>
                      </tr>
                    ) : (
                      filteredPendings.map((booking, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{booking.bookingId?.bookingNumber || ''}</td>
                          <td>{booking.bookingId?.model?.model_name || ''}</td>
                          <td>{booking.bookingId?.chassisNumber || ''}</td>
                          <td>{booking.bookingId?.customerName || ''}</td>
                          <td>{booking.bookingId?.customerMobile || ''}</td>
                          <td>
                            <CBadge color={booking.rtoPaperStatus === 'Not Submitted' ? 'danger' : 'secondary'} shape="rounded-pill">
                              {booking.rtoPaperStatus || 'Pending'}
                            </CBadge>
                          </td>
                          <td>
                            <button className="action-button" onClick={() => handleViewKYC(booking)}>
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CTabPane>

          <CTabPane visible={activeTab === 1} className="p-3">
            <h5>RTO PAPER COMPLETED REPORT</h5>
            <div className="table-header">
              <div className="search-icon-data">
                <input type="text" placeholder="Search.." onChange={(e) => handleApprovedFilter(e.target.value, ['branchName'])} />
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
                      <th>Chassis Number</th>
                      <th>Customer Name</th>
                      <th>Contact Number1</th>
                      <th>RTO Paper</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApproved.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ color: 'red' }}>
                          No data available
                        </td>
                      </tr>
                    ) : (
                      filteredApproved.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.bookingId?.bookingNumber || ''}</td>
                          <td>{item.bookingId?.model?.model_name || ''}</td>
                          <td>{item.bookingId?.chassisNumber || ''}</td>
                          <td>{item.bookingId?.customerName || ''}</td>
                          <td>{item.bookingId?.customerMobile || ''}</td>
                          <td>
                            <CBadge color={item.rtoPaperStatus === 'Submitted' ? 'success' : 'danger'} shape="rounded-pill">
                              {item.rtoPaperStatus || 'Pending'}
                            </CBadge>
                          </td>
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

      <KYCDocuments
        open={showKycModal}
        onClose={() => setShowKycModal(false)}
        kycData={kycData}
        refreshData={refreshData}
        rtoId={selectedRtoId}
      />
    </div>
  );
}

export default RTOPaper;
