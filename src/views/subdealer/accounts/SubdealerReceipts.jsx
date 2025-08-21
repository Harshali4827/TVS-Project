import React, { useState, useEffect } from 'react';
import '../../../css/invoice.css'
import {CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'utils/tableImports';
import '../../../css/table.css';
import SubdealerReceiptModal from './SubdealerReceiptModel';

function SubdealerReceipts() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]); 

  const {
    data: pendingBookingsData,
    setData: setPendingBookingsData,
    filteredData: filteredPendingBookings,
    setFilteredData: setFilteredPendingBookings,
    handleFilter: handlePendingBookingsFilter
  } = useTableFilter([]);

  // For Complete Payment tab (balanceAmount === 0)
  const {
    data: completedBookingsData,
    setData: setCompletedBookingsData,
    filteredData: filteredCompletedBookings,
    setFilteredData: setFilteredCompletedBookings,
    handleFilter: handleCompletedBookingsFilter
  } = useTableFilter([]);

  const {
    data: ledgerData,
    setData: setLedgerData,
    filteredData: filteredLedger,
    setFilteredData: setFilteredLedger,
    handleFilter: handleLedgerFilter
  } = useTableFilter([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/bookings`);
      // const bookings = response.data.data.bookings;
       const bookings = response.data.data.bookings.filter(
        booking => booking.bookingType === "SUBDEALER" && booking.payment.type === "FINANCE"
      );
      setAllBookings(bookings);

      const pendingBookings = bookings.filter((booking) => booking.balanceAmount !== 0);
      setPendingBookingsData(pendingBookings);
      setFilteredPendingBookings(pendingBookings);

      const completedBookings = bookings.filter((booking) => booking.balanceAmount === 0);
      setCompletedBookingsData(completedBookings);
      setFilteredCompletedBookings(completedBookings);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      const response = await axiosInstance.get(`/ledger/summary/branch`);
      setLedgerData(response.data.data.byBranch);
      setFilteredLedger(response.data.data.byBranch);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const handleAddClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };
  
  return (
    <div className="container-table">
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
           Pending Payment
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}> {/* Fixed this line */}
            Complete Payment
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        <CTabPane visible={activeTab === 0} className="p-3">
          <h5>Pending Finance Payment</h5>
          <div className="table-header">
            <div className="search-icon-data">
              <input
                type="text"
                placeholder="Search.."
                onChange={(e) => handlePendingBookingsFilter(e.target.value, getDefaultSearchFields('receipts'))}
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
                  {filteredPendingBookings.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ color: 'red' }}>
                        No pending bookings available
                      </td>
                    </tr>
                  ) : (
                    filteredPendingBookings.map((booking, index) => (
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
                  <SubdealerReceiptModal show={showModal} onClose={() => setShowModal(false)} bookingData={selectedBooking} />
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
                onChange={(e) => handleCompletedBookingsFilter(e.target.value, getDefaultSearchFields('receipts'))}
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
                  {filteredCompletedBookings.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ color: 'red' }}>
                        No completed payments available
                      </td>
                    </tr>
                  ) : (
                    filteredCompletedBookings.map((booking, index) => (
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
      </CTabContent>
    </div>
  );
}

export default SubdealerReceipts;