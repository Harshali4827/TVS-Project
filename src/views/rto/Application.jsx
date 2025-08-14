// import React, { useState, useEffect } from 'react';
// import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import UpdateRTO from './UpdateRTO';

// function Application() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
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
//       const response = await axiosInstance.get(`/bookings/pfbookings`);
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
//       const response = await axiosInstance.get(`/rtoProcess/application-numbers`);
//       setApprovedData(response.data.data);
//       setFilteredApproved(response.data.data);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };
//   const handleAddClick = (booking) => {
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };
//   return (
//     <div className="container-table">
//       <CNav variant="tabs">
//         <CNavItem>
//           <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
//             RTO PENDING
//           </CNavLink>
//         </CNavItem>
//         <CNavItem>
//           <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
//             COMPLETED
//           </CNavLink>
//         </CNavItem>
//       </CNav>

//       <CTabContent>
//         <CTabPane visible={activeTab === 0} className="p-3">
//           <h5>RTO PENDING REPORT</h5>
//           <div className="table-header">
//             <div className="search-icon-data">
//               <input
//                 type="text"
//                 placeholder="Search.."
//                 onChange={(e) => handlePendingFilter(e.target.value, getDefaultSearchFields('receipts'))}
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
//                     <th>Line Total</th>
//                     <th>Received</th>
//                     <th>Balance</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredPendings.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" style={{ color: 'red' }}>
//                         No data available
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredPendings.map((booking, index) => (
//                       <tr key={index}>
//                         <td>{index + 1}</td>
//                         <td>{booking.bookingNumber}</td>
//                         <td>{booking.model?.model_name || ''}</td>
//                         <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</td>
//                         <td>{booking.customerDetails.name}</td>
//                         <td>{booking.chassisNumber}</td>
//                         <td>{booking.discountedAmount || '0'}</td>
//                         <td>{booking.receivedAmount || '0'}</td>
//                         <td>{booking.balanceAmount || '0'}</td>
//                         <td>
//                           <button className="action-button" onClick={() => handleAddClick(booking)}>
//                             Update
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                   <UpdateRTO show={showModal} onClose={() => setShowModal(false)} bookingData={selectedBooking} />
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </CTabPane>

//         <CTabPane visible={activeTab === 1} className="p-3">
//           <h5>RTO COMPLETED REPORT</h5>
//           <div className="table-header">
//             <div className="search-icon-data">
//               <input type="text" placeholder="Search.." onChange={(e) => handleApprovedFilter(e.target.value, ['branchName'])} />
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
//                     <th>Chassis Number</th>
//                     <th>Customer Name</th>
//                     <th>Contact Number1</th>
//                     <th>RTO Application</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredApproved.length === 0 ? (
//                     <tr>
//                       <td colSpan="8" style={{ color: 'red' }}>
//                         No data available
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredApproved.map((item, index) => (
//                       <tr key={index}>
//                         <td>{index + 1}</td>
//                         <td>{item.bookingId?.bookingNumber}</td>
//                         <td>{item.bookingId?.model?.model_name || ''}</td>
//                         <td>{item.bookingId?.chassisNumber}</td>
//                         <td>{item.bookingId?.customerName}</td>
//                         <td>{item.bookingId?.customerMobile}</td>
//                         <td>{item.applicationNumber}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </CTabPane>
//       </CTabContent>
//     </div>
//   );
// }
// export default Application;

import React, { useState, useEffect } from 'react';
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import UpdateRTO from './UpdateRTO';

function Application() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/bookings/pfbookings`);
      setPendingData(response.data.data);
      setFilteredPendings(response.data.data);
    } catch (error) {
      console.log('Error fetching pending data', error);
    }
  };

  const fetchLocationData = async () => {
    try {
      const response = await axiosInstance.get(`/rtoProcess/application-numbers`);
      setApprovedData(response.data.data);
      setFilteredApproved(response.data.data);
    } catch (error) {
      console.log('Error fetching completed data', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLocationData();
  }, [refreshKey]);

  const handleAddClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleModalClose = () => {
    setShowModal(false);
    handleRefresh();
  };

  return (
    <div className="container-table">
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
            RTO PENDING
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
          <h5>RTO PENDING REPORT</h5>
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
                    <th>Booking Date</th>
                    <th>Customer Name</th>
                    <th>Chassis Number</th>
                    <th>Line Total</th>
                    <th>Received</th>
                    <th>Balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPendings.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ color: 'red' }}>
                        No data available
                      </td>
                    </tr>
                  ) : (
                    filteredPendings.map((booking, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{booking.bookingNumber}</td>
                        <td>{booking.model?.model_name || ''}</td>
                        <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</td>
                        <td>{booking.customerDetails.name}</td>
                        <td>{booking.chassisNumber}</td>
                        <td>{booking.discountedAmount || '0'}</td>
                        <td>{booking.receivedAmount || '0'}</td>
                        <td>{booking.balanceAmount || '0'}</td>
                        <td>
                          <button className="action-button" onClick={() => handleAddClick(booking)}>
                            Update
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
          <h5>RTO COMPLETED REPORT</h5>
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
                    <th>RTO Application</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApproved.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ color: 'red' }}>
                        No data available
                      </td>
                    </tr>
                  ) : (
                    filteredApproved.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.bookingId?.bookingNumber}</td>
                        <td>{item.bookingId?.model?.model_name || ''}</td>
                        <td>{item.bookingId?.chassisNumber}</td>
                        <td>{item.bookingId?.customerName}</td>
                        <td>{item.bookingId?.customerMobile}</td>
                        <td>{item.applicationNumber}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CTabPane>
      </CTabContent>

      <UpdateRTO show={showModal} onClose={handleModalClose} bookingData={selectedBooking} onSuccess={handleRefresh} />
    </div>
  );
}

export default Application;
