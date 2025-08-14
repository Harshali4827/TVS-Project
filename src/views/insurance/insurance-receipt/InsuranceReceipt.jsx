import React, { useState, useEffect } from 'react';
import '../../../css/invoice.css';
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'utils/tableImports';
import '../../../css/table.css';
import InsuranceModel from './InsuranceModel';
function InsuranceReceipt() {
  const [activeTab, setActiveTab] = useState(0);
  // const [ledgerData, setLedgerData] = useState([]);
  // const [bookingsData, setBookingsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const {
    data: bookingsData,
    setData: setBookingsData,
    filteredData: filteredBookings,
    setFilteredData: setFilteredBookings,
    handleFilter: handleBookingsFilter
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
      setBookingsData(response.data.data.bookings);
      setFilteredBookings(response.data.data.bookings);
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
            Exchange Agent
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 3} onClick={() => setActiveTab(3)}>
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
                    <th>Customer Name</th>
                    <th>Chassis Number</th>
                    <th>Insurance Date</th>
                    <th>Policy Number</th>
                    <th>PSA Pollicy No</th>
                    <th>CMS Policy No</th>
                    <th>Premium Amount</th>
                    <th>Valid Upto</th>
                    <th>Model</th>
                    <th>Vehicle Reg No</th>
                    <th>Insurance Company</th>
                    <th>MobileNO</th>
                    <th>Payment Mode</th>
                    <th>Status</th>
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
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <button className="action-button" onClick={() => handleAddClick(booking)}>
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  <InsuranceModel show={showModal} onClose={() => setShowModal(false)} bookingData={selectedBooking} />
                </tbody>
              </table>
            </div>
          </div>
        </CTabPane>

        <CTabPane visible={activeTab === 1} className="p-3">
          <h5>Sub Dealer</h5>
          <div className="table-header">
            <div className="search-icon-data">
              <input type="text" placeholder="Search.." onChange={(e) => handleLedgerFilter(e.target.value, ['branchName'])} />
              <SearchOutlinedIcon />
            </div>
          </div>
          <div className="table-responsive">
            <div className="table-wrapper">
              <table className="responsive-table" style={{ overflow: 'auto' }}>
                <thead className="table-header-fixed">
                  <tr>
                    <th>Sr.no</th>
                    <th>Location</th>
                    <th>Total</th>
                    <th>Received</th>
                    <th>Balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ color: 'red' }}>
                        No booking available
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((booking, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{booking.branchName}</td>
                        <td>{booking.totalDebit}</td>
                        <td>{booking.totalCredit}</td>
                        <td>{booking.finalBalance}</td>
                        <td>
                          <button className="action-button" onClick={() => handleAddClick(booking)}>
                            Add
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

        <CTabPane visible={activeTab === 2} className="p-3">
          <h5>Exchange Agent</h5>
        </CTabPane>
        <CTabPane visible={activeTab === 3} className="p-3">
          <h5>Pending List</h5>
        </CTabPane>
      </CTabContent>
    </div>
  );
}

export default InsuranceReceipt;
