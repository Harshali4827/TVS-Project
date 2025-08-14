import React, { useState, useEffect } from 'react';
import { CBadge, CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import { confirmVerify, showError, showFormSubmitError, showFormSubmitToast, showSuccess } from 'utils/sweetAlerts';

function HSRPOrdering() {
  const [activeTab, setActiveTab] = useState(0);
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
      const response = await axiosInstance.get(`/rtoProcess/hsrporderedpending`);
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
      const response = await axiosInstance.get(`/rtoProcess/hsrpordered`);
      setApprovedData(response.data.data);
      setFilteredApproved(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const handleVerify = async (item) => {
    try {
      const result = await confirmVerify();

      if (result.isConfirmed) {
        await axiosInstance.patch(`/rtoProcess/${item._id}`, {
          hsrbOrdering: true
        });
        await fetchData();
        await fetchLocationData();

        await showSuccess('HSRP Ordering verified successfully!');
      }
    } catch (error) {
      console.error('Error verifying HSRP Ordering:', error);
      showError(error, 'Failed to verify HSRP Ordering');
    }
  };
  return (
    <div>
      <h4>RTO PENDING HSRP ORDERING</h4>
      <div className="container-table">
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
              RTO PENDING HSRP ORDERING
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
              COMPLETED HSRP ORDERING
            </CNavLink>
          </CNavItem>
        </CNav>

        <CTabContent>
          <CTabPane visible={activeTab === 0} className="p-3">
            <h5>RTO PENDING HSRP ORDERING</h5>
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
                      <th>RTO Amount</th>
                      <th>Number Plate</th>
                      <th>Model Name</th>
                      <th>Chassis Number</th>
                      <th>Customer Name</th>
                      <th>Contact Number</th>
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
                          <td>{item.rtoAmount || 'N/A'}</td>
                          <td>{item.numberPlate || 'N/A'}</td>
                          <td>{item.bookingId?.model?.model_name || 'N/A'}</td>
                          <td>{item.bookingId?.chassisNumber || 'N/A'}</td>
                          <td>{item.bookingId?.customerName || 'N/A'}</td>
                          <td>{item.bookingId?.customerMobile || 'N/A'}</td>
                          <td>
                            <button className="action-button" onClick={() => handleVerify(item)}>
                              Verify
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
            <h5>RTO COMPLETED HSRP ORDERING</h5>
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
                      <th>RTO HSRP Ordering</th>
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
                          {/* <td>{item.hsrbOrdering === true ? 'ORDERED' : 'PENDING'}</td> */}
                          <td>
                            <CBadge color={item.hsrbOrdering ? 'success' : 'warning'} shape="rounded-pill">
                              {item.hsrbOrdering ? 'ORDERED' : 'PENDING'}
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

export default HSRPOrdering;
