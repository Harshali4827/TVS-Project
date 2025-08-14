import React, { useState, useEffect } from 'react';
import { CBadge, CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import UpdateHSRPInstallation from './UpdateHSRPInstallation';
import UpdateRCConfirmation from './UpdateRCConfirmation';

function RCConfirmation() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
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
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/rtoProcess/rcpending`);
      setPendingData(response.data.data);
      setFilteredPendings(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };
  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      const response = await axiosInstance.get(`/rtoProcess/rccompleted`);
      setApprovedData(response.data.data);
      setFilteredApproved(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };
  const handleAddClick = (rcRecord) => {
    setSelectedBooking(rcRecord);
    setShowModal(true);
  };
  return (
    <div>
      <h4>RTO PENDING HSRP INSTALLATION</h4>
      <div className="container-table">
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
              RTO PENDING HSRP INSTALLATION
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
              COMPLETED HSRP INSTALLATION
            </CNavLink>
          </CNavItem>
        </CNav>

        <CTabContent>
          <CTabPane visible={activeTab === 0} className="p-3">
            <h5>RTO PENDING HSRP INSTALLATION</h5>
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
                      <th>Contact Number</th>
                      <th>RTO RC Confirmation</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPendings.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ color: 'red' }}>
                          No data available
                        </td>
                      </tr>
                    ) : (
                      filteredPendings.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.bookingId?.bookingNumber || 'N/A'}</td>
                          <td>{item.bookingId?.model?.model_name || 'N/A'}</td>
                          <td>{item.bookingId?.chassisNumber || 'N/A'}</td>
                          <td>{item.bookingId?.customerName || 'N/A'}</td>
                          <td>{item.bookingId?.customerMobile || 'N/A'}</td>
                          <td>
                            <CBadge color={item.rcConfirmation === false ? 'danger' : 'success'} shape="rounded-pill">
                              {item.rcConfirmation === false ? 'PENDING' : 'INSTALLED'}
                            </CBadge>
                          </td>
                          <td>
                            <button className="action-button" onClick={() => handleAddClick(item)}>
                              Update
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                    <UpdateRCConfirmation show={showModal} onClose={() => setShowModal(false)} rcData={selectedBooking} />
                  </tbody>
                </table>
              </div>
            </div>
          </CTabPane>

          <CTabPane visible={activeTab === 1} className="p-3">
            <h5>RTO COMPLETED HSRP INSTALLATION</h5>
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
                      <th>RTO HSRP Installation</th>
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
                          <td>{item.bookingId?.bookingNumber || 'N/A'}</td>
                          <td>{item.bookingId?.model?.model_name || 'N/A'}</td>
                          <td>{item.bookingId?.chassisNumber || 'N/A'}</td>
                          <td>{item.bookingId?.customerName || 'N/A'}</td>
                          <td>{item.bookingId?.customerMobile || 'N/A'}</td>
                          <td>
                            {' '}
                            <CBadge color={item.rcConfirmation === false ? 'danger' : 'success'} shape="rounded-pill">
                              {item.rcConfirmation === false ? 'PENDING' : 'CONFIRMED'}
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
    </div>
  );
}

export default RCConfirmation;
