import React, { useState, useEffect } from 'react';
import { CFormInput, CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import { axiosInstance, SearchOutlinedIcon, useTableFilter } from 'utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import { showError, showFormSubmitToast } from 'utils/sweetAlerts';

function RTOTax() {
  const [activeTab, setActiveTab] = useState(0);
  const [receiptNoSearch, setReceiptNoSearch] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const {
    data: pendingData,
    setData: setPendingData,
    filteredData: filteredPendings,
    setFilteredData: setFilteredPendings
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
      const response = await axiosInstance.get(`/rtoProcess/rtotaxpending`);
      setPendingData(response.data.data);
      setFilteredPendings(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const fetchLocationData = async () => {
    try {
      const response = await axiosInstance.get(`/rtoProcess/rtotaxcompleted`);
      setApprovedData(response.data.data);
      setFilteredApproved(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const handleRTOAmountChange = (id, value) => {
    const updatedData = filteredPendings.map((item) => (item._id === id ? { ...item, rtoAmount: value } : item));
    setFilteredPendings(updatedData);
  };

  const handleNumberPlateChange = (id, value) => {
    const updatedData = filteredPendings.map((item) => (item._id === id ? { ...item, numberPlate: value } : item));
    setFilteredPendings(updatedData);
  };

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleUpdateSelected = async () => {
    if (!receiptNumber) {
      showError('Please enter a receipt number');
      return;
    }

    if (selectedRows.length === 0) {
      showError('Please select at least one record to update');
      return;
    }

    try {
      const updates = filteredPendings
        .filter((item) => selectedRows.includes(item._id))
        .map((item) => ({
          rtoId: item._id,
          rtoAmount: item.rtoAmount || 0,
          numberPlate: item.numberPlate || ''
        }));

      const requestBody = {
        receiptNumber,
        updates
      };

      await axiosInstance.put('/rtoProcess/update-rto-details', requestBody);
      showFormSubmitToast('Selected records updated successfully!');
      setReceiptNumber('');
      setSelectedRows([]);
      fetchData();
    } catch (error) {
      console.error('Error updating RTO details:', error.response?.data || error.message);
      showError(`Failed to update RTO details: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleReceiptNoSearch = (e) => {
    setReceiptNoSearch(e.target.value);
    if (e.target.value === '') {
      setFilteredPendings(pendingData);
    } else {
      const filtered = pendingData.filter(
        (booking) =>
          booking.bookingId?.bookingNumber?.toString().includes(e.target.value) ||
          booking.bookingId?.chassisNumber?.includes(e.target.value)
      );
      setFilteredPendings(filtered);
    }
  };

  return (
    <div>
      <h4>RTO Pending Tax</h4>
      <div className="container-table">
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
              RTO PENDING TAX
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
              COMPLETED TAX
            </CNavLink>
          </CNavItem>
        </CNav>

        <CTabContent>
          <CTabPane visible={activeTab === 0} className="p-3">
            <h5>RTO PENDING TAX REPORT</h5>
            <div className="table-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CFormInput
                  type="text"
                  placeholder="Receipt Number"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  style={{ flex: 1, display: 'inline-block' }}
                />
                <button className="action-button" onClick={handleUpdateSelected} style={{ whiteSpace: 'nowrap' }}>
                  Update
                </button>
              </div>
              <div className="search-icon-data">
                <input type="text" placeholder="Search" value={receiptNoSearch} onChange={handleReceiptNoSearch} />
                <SearchOutlinedIcon />
              </div>
            </div>
            <div className="table-responsive">
              <div className="table-wrapper">
                <table className="responsive-table" style={{ overflow: 'auto' }}>
                  <thead className="table-header-fixed">
                    <tr>
                      <th>Select</th>
                      <th>Sr.no</th>
                      <th>Booking ID</th>
                      <th>RTO Amount</th>
                      <th>Number Plate</th>
                      <th>Model Name</th>
                      <th>Chassis Number</th>
                      <th>Customer Name</th>
                      <th>Contact Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPendings.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ color: 'red' }}>
                          No data available
                        </td>
                      </tr>
                    ) : (
                      filteredPendings.map((item, index) => (
                        <tr key={item._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(item._id)}
                              onChange={() => toggleRowSelection(item._id)}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{item.bookingId?.bookingNumber || 'N/A'}</td>
                          <td>
                            <input
                              type="number"
                              value={item.rtoAmount || ''}
                              onChange={(e) => handleRTOAmountChange(item._id, e.target.value)}
                              style={{ width: '80px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={item.numberPlate || ''}
                              onChange={(e) => handleNumberPlateChange(item._id, e.target.value)}
                              style={{ width: '100px' }}
                            />
                          </td>
                          <td>{item.bookingId?.model?.model_name || 'N/A'}</td>
                          <td>{item.bookingId?.chassisNumber || 'N/A'}</td>
                          <td>{item.bookingId?.customerName || 'N/A'}</td>
                          <td>{item.bookingId?.customerMobile || 'N/A'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CTabPane>

          <CTabPane visible={activeTab === 1} className="p-3">
            <h5>RTO COMPLETED TAX REPORT</h5>
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
                      <th>RTO Tax</th>
                      <th>Number Plate</th>
                      <th>Receipt Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApproved.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ color: 'red' }}>
                          No data available
                        </td>
                      </tr>
                    ) : (
                      filteredApproved.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>{item.bookingId?.bookingNumber || 'N/A'}</td>
                          <td>{item.bookingId?.model?.model_name || 'N/A'}</td>
                          <td>{item.bookingId?.chassisNumber || 'N/A'}</td>
                          <td>{item.bookingId?.customerName || 'N/A'}</td>
                          <td>{item.bookingId?.customerMobile || 'N/A'}</td>
                          <td>{item.rtoAmount || 'N/A'}</td>
                          <td>{item.numberPlate || 'N/A'}</td>
                          <td>{item.receiptNumber || 'N/A'}</td>
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

export default RTOTax;
