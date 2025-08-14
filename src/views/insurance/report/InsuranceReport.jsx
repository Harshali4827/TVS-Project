import React, { useState, useEffect } from 'react';
import { CBadge, CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'utils/tableImports';
import '../../../css/invoice.css';
import '../../../css/table.css';
import AddInsurance from './AddInsurance';
import ViewInsuranceModal from './ViewInsurance';

function InsuranceReport() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
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
    data: laterData,
    setData: setLaterData,
    filteredData: filteredLater,
    setFilteredData: setFilteredLater,
    handleFilter: handleLaterFilter
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
      const response = await axiosInstance.get(`/bookings/insurance-status/AWAITING`);
      setPendingData(response.data.data.docs);
      setFilteredPendings(response.data.data.docs);
    } catch (error) {
      console.log('Error fetching pending data', error);
    }
  };

  const fetchCompleteData = async () => {
    try {
      const response = await axiosInstance.get(`/insurance/status/COMPLETED`);
      setApprovedData(response.data.data);
      setFilteredApproved(response.data.data);
    } catch (error) {
      console.log('Error fetching approved data', error);
    }
  };

  const fetchLaterData = async () => {
    try {
      const response = await axiosInstance.get(`/insurance/status/LATER`);
      setLaterData(response.data.data);
      setFilteredLater(response.data.data);
    } catch (error) {
      console.log('Error fetching approved data', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCompleteData();
    fetchLaterData();
  }, [refreshKey]);

  const handleAddClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleViewClick = async (item) => {
    try {
      const response = await axiosInstance.get(`/insurance/${item.id}`);
      setSelectedInsurance(response.data.data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching insurance details:', error);
    }
  };

  const handleUpdateClick = async (item) => {
    try {
      const response = await axiosInstance.get(`/insurance/${item.id}`);
      setSelectedInsurance(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching insurance details:', error);
    }
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
            Pending Insurance
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
            Complete Insurance
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)}>
            Update Later
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        <CTabPane visible={activeTab === 0} className="p-3">
          <h5>INSURANCE PENDING REPORT</h5>
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
                    <th>Insurance Status</th>
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
                        <td>{booking.bookingNumber}</td>
                        <td>{booking.modelDetails?.model_name || ''}</td>
                        <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</td>
                        <td>{booking.customerDetails.name}</td>
                        <td>{booking.chassisNumber}</td>
                        <td>
                          <CBadge color={booking.insuranceStatus === 'AWAITING' ? 'danger' : 'success'} shape="rounded-pill">
                            {booking.insuranceStatus}
                          </CBadge>
                        </td>
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

        <CTabPane visible={activeTab === 1} className="p-3">
          <h5>INSURANCE COMPLETED REPORT</h5>
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
                    <th>Insurance Date</th>
                    <th>Insurance Provider</th>
                    <th>Customer Name</th>
                    <th>Chassis Number</th>
                    <th>Insurance Status</th>
                    <th>Action</th>
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
                        <td>{item.booking?.bookingNumber || ''}</td>
                        <td>{item.booking?.model?.model_name || ''}</td>
                        <td>{item.insuranceDate ? new Date(item.insuranceDate).toLocaleDateString('en-GB') : ''}</td>
                        <td>{item.insuranceProviderDetails.provider_name}</td>
                        <td>{item.booking?.customerName || ''}</td>
                        <td>{item.booking?.chassisNumber || ''}</td>
                        <td>
                          <CBadge color={item.status === 'COMPLETED' ? 'success' : 'danger'} shape="rounded-pill">
                            {item.status}
                          </CBadge>
                        </td>
                        <td>
                          <button className="action-button" onClick={() => handleViewClick(item)}>
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

        <CTabPane visible={activeTab === 2} className="p-3">
          <h5> LATER INSURANCE REPORT</h5>
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
                    <th>Insurance Date</th>
                    <th>Customer Name</th>
                    <th>Chassis Number</th>
                    <th>Insurance Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLater.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ color: 'red' }}>
                        No data available
                      </td>
                    </tr>
                  ) : (
                    filteredLater.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.booking?.bookingNumber || ''}</td>
                        <td>{item.booking?.model?.model_name || ''}</td>
                        <td>{item.insuranceDate ? new Date(item.insuranceDate).toLocaleDateString('en-GB') : ''}</td>
                        <td>{item.booking?.customerName || ''}</td>
                        <td>{item.booking?.chassisNumber || ''}</td>
                        <td>
                          <CBadge color={item.status === 'COMPLETED' ? 'success' : 'danger'} shape="rounded-pill">
                            {item.status}
                          </CBadge>
                        </td>
                        <td>
                          <button className="action-button" onClick={() => handleUpdateClick(item)}>
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
      </CTabContent>

      {/* <AddInsurance show={showModal} onClose={handleModalClose} bookingData={selectedBooking} onSuccess={handleRefresh} /> */}

      <AddInsurance
        show={showModal}
        onClose={handleModalClose}
        bookingData={selectedBooking}
        insuranceData={selectedInsurance}
        onSuccess={handleRefresh}
      />
      <ViewInsuranceModal show={showViewModal} onClose={() => setShowViewModal(false)} insuranceData={selectedInsurance} />
    </div>
  );
}

export default InsuranceReport;
