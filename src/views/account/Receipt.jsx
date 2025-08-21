import React, { useState, useEffect } from 'react';
import '../../css/invoice.css';
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'utils/tableImports';
import '../../css/table.css';
import ReceiptModal from './ReceiptModal';
function Receipt() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [completePayments, setCompletePayments] = useState([]);
  const [filteredCompletePayments, setFilteredCompletePayments] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [filteredPendingPayments, setFilteredPendingPayments] = useState([]);

  const {
    data: bookingsData,
    setData: setBookingsData,
    filteredData: filteredBookings,
    setFilteredData: setFilteredBookings,
    handleFilter: handleBookingsFilter
  } = useTableFilter([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/bookings`);
      const branchBookings = response.data.data.bookings.filter(
        booking => booking.bookingType === 'BRANCH'
      );
      setBookingsData(branchBookings)
      setFilteredBookings(branchBookings);

       const complete = branchBookings.filter(booking => 
        parseFloat(booking.balanceAmount || 0) === 0
      );
      setCompletePayments(complete);
      setFilteredCompletePayments(complete);

      const pending = branchBookings.filter(booking => 
        parseFloat(booking.balanceAmount || 0) !== 0
      );
      setPendingPayments(pending);
      setFilteredPendingPayments(pending);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };
  const handleAddClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCompletePaymentsFilter = (searchValue) => {
      handleBookingsFilter(searchValue, getDefaultSearchFields('receipts'), completePayments, setFilteredCompletePayments);
    };
  
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
            Complete Payment
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)}>
            Pending List
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ color: 'red' }}>
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
                        <td>
                          <button className="action-button" onClick={() => handleAddClick(booking)}>
                            Add
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  <ReceiptModal show={showModal} onClose={() => setShowModal(false)} bookingData={selectedBooking} />
                </tbody>
              </table>
            </div>
          </div>
        </CTabPane>

        <CTabPane visible={activeTab === 1} className="p-3">
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
                      <td colSpan="4" style={{ color: 'red' }}>
                        No booking available
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
                        <td style={{color:'green'}}>{booking.balanceAmount || '0'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CTabPane>
        <CTabPane visible={activeTab === 2} className="p-3">
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

export default Receipt;
