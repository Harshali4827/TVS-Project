import React, { useState, useEffect } from 'react';
import '../../../css/invoice.css'
import { CButton, CCol, CFormLabel, CFormSelect, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane } from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, usePagination, useTableFilter, showError } from 'utils/tableImports';
import '../../../css/table.css';
import tvsLogo from '../../../assets/images/logo.png';
import config from 'config';
function SubdealerLedger() {
  const [activeTab, setActiveTab] = useState(0);
  const [subdealers, setSubdealers] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [selectedSubdealer, setSelectedSubdealer] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState('');
  const [error, setError] = useState('');
  
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
    fetchSubdealers();
  }, []);

  useEffect(() => {
    if (selectedSubdealer) {
      fetchSubdealerReceipts();
    } else {
      setReceipts([]);
      setSelectedReceipt('');
    }
  }, [selectedSubdealer]); // Add this useEffect to fetch receipts when selectedSubdealer changes

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/subdealers`);
      setData(response.data.data.subdealers);
      setFilteredData(response.data.data.subdealers);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get('/subdealers');
      setSubdealers(response.data.data.subdealers || []);
    } catch (error) {
      console.error('Error fetching subdealers:', error);
      showError(error);
    }
  };

  const fetchSubdealerReceipts = async () => {
    try {
      const response = await axiosInstance.get(`/subdealersonaccount/${selectedSubdealer}/on-account/receipts`);
      setReceipts(response.data.docs || []);
      setError('');
    } catch (error) {
      console.error('Error fetching subdealer receipts:', error);
      setError('Failed to load receipt data');
      setReceipts([]);
    }
  };

  const handleSubdealerChange = (e) => {
    setSelectedSubdealer(e.target.value); // This was missing
    setSelectedReceipt('');
  };

  const handleReceiptChange = (e) => {
    setSelectedReceipt(e.target.value);
  };


  const handleViewLedger = async (subdealer) => {
  try {
    const res = await axiosInstance.get(`/subdealersonaccount/${subdealer._id}/on-account/receipts`);
    const ledgerData = res.data.docs; // Changed from res.data.data.docs to res.data.docs
    const ledgerUrl = `${config.baseURL}/ledger.html?ledgerId=${subdealer._id}`;
    
    // Calculate totals
    let totalCredit = 0;
    let totalDebit = 0;
    let runningBalance = 0;
    
    const win = window.open('', '_blank');
    win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Subdealer Ledger</title>
            <style>
              @page {
                size: A4;
                margin: 15mm 10mm;
              }
              body {
                font-family: Arial;
                width: 100%;
                margin: 0;
                padding: 0;
                font-size: 14px;
                line-height: 1.3;
                font-family: Courier New;
              }
              .container {
                width: 190mm;
                margin: 0 auto;
                padding: 5mm;
              }
              .header-container {
                display: flex;
                justify-content:space-between;
                margin-bottom: 3mm;
              }
              .header-text{
                font-size:20px;
                font-weight:bold;
              }
              .logo {
                width: 30mm;
                height: auto;
                margin-right: 5mm;
              } 
              .header {
                text-align: left;
              }
              .divider {
                border-top: 2px solid #AAAAAA;
                margin: 3mm 0;
              }
              .header h2 {
                margin: 2mm 0;
                font-size: 12pt;
                font-weight: bold;
              }
              .header div {
                font-size: 14px;
              }
              .customer-info {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2mm;
                margin-bottom: 5mm;
                font-size: 14px;
              }
              .customer-info div {
                display: flex;
              }
              .customer-info strong {
                min-width: 30mm;
                display: inline-block;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 5mm;
                font-size: 14px;
                page-break-inside: avoid;
              }
              th, td {
                border: 1px solid #000;
                padding: 2mm;
                text-align: left;
              }
              th {
                background-color: #f0f0f0;
                font-weight: bold;
              }
              .footer {
                margin-top: 10mm;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                font-size: 14px;
              }
              .footer-left {
                text-align: left;
              }
              .footer-right {
                text-align: right;
              }
              .qr-code {
                width: 35mm;
                height: 35mm;
              }
              .text-right {
                text-align: right;
              }
              .text-left {
                text-align: left;
              }
              .text-center {
                text-align: center;
              }
              @media print {
                body {
                  width: 190mm;
                  height: 277mm;
                }
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header-container">
                <img src="${tvsLogo}" class="logo" alt="TVS Logo">
                <div class="header-text"> GANDHI TVS</div>
              </div>
              <div class="header">
                <div>
                  Authorised Main Dealer: TVS Motor Company Ltd.<br>
                  Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
                  Upnagar, Nashik Road, Nashik - 422101<br>
                  Phone: 7498903672
                </div>
              </div>
              <div class="divider"></div>
              <div class="customer-info">
                <div><strong>Subdealer Name:</strong> ${subdealer.name || ''}</div>
                <div><strong>Ledger Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th width="15%">Date</th>
                    <th width="35%">Description</th>
                    <th width="15%">Reference Number</th>
                    <th width="10%" class="text-right">Credit (₹)</th>
                    <th width="10%" class="text-right">Debit (₹)</th>
                    <th width="15%" class="text-right">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${ledgerData
                    .map((entry) => {
                      // Calculate entry values
                      const creditAmount = entry.amount;
                      const debitAmount = 0;
                      runningBalance += creditAmount;
                      
                      // Update totals
                      totalCredit += creditAmount;
                      
                      return `
                      <tr>
                        <td>${new Date(entry.receivedDate).toLocaleDateString('en-GB')}</td>
                        <td>
                          Payment Mode: ${entry.paymentMode}<br>
                          ${entry.remark ? `${entry.remark}` : ''}
                        </td>
                        <td>${entry.refNumber || ''}</td>
                        <td class="text-right">${creditAmount.toLocaleString('en-IN')}</td>
                        <td class="text-right">${debitAmount.toLocaleString('en-IN')}</td>
                        <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
                      </tr>
                    `;
                    })
                    .join('')}
                  <tr>
                    <td colspan="3" class="text-left"><strong>Total</strong></td>
                    <td class="text-right"><strong>${totalCredit.toLocaleString('en-IN')}</strong></td>
                    <td class="text-right"><strong>${totalDebit.toLocaleString('en-IN')}</strong></td>
                    <td class="text-right"><strong>${runningBalance.toLocaleString('en-IN')}</strong></td>
                  </tr>
                </tbody>
              </table>
              
              <div class="footer">
                <div class="footer-left">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ledgerUrl)}" 
                       class="qr-code" 
                       alt="QR Code" />
                </div>
                <div class="footer-right">
                  <p>For, Gandhi TVS</p>
                  <p>Authorised Signatory</p>
                </div>
              </div>
            </div>
            
            <script>
              window.onload = function() {
                setTimeout(() => {
                  window.print();
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
  } catch (err) {
    console.error('Error fetching ledger:', err);
    setError('Failed to load ledger. Please try again.');
  }
};
  return (
    <div className="container-table">
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
           Sub Dealer
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
            Sub Dealer UTR
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        <CTabPane visible={activeTab === 0} className="p-3">
          <h5>Sub Dealer</h5>
          <div className="table-header">
            <div className="search-icon-data">
              <input
                type="text"
                placeholder="Search.."
                onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('subdealers'))}
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
                    <th>Name</th>
                    <th>Location</th>
                    <th>Rate Of Interest</th>
                    <th>Discount</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ color: 'red' }}>
                        No subdealers available
                      </td>
                    </tr>
                  ) : (
                    currentRecords.map((subdealer, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{subdealer.name}</td>
                        <td>{subdealer.location}</td>
                        <td>{subdealer.rateOfInterest}</td>
                        <td>{subdealer.discount}</td>
                        <td>{subdealer.type}</td>
                        <td>
                          <button className="action-button" onClick={() => handleViewLedger(subdealer)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <PaginationOptions />
          </div>
        </CTabPane>
        <CTabPane visible={activeTab === 1} className="p-3">
          <h5>Sub Dealer UTR</h5>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <CRow className="mb-3">
            <CCol md={5}>
              <CFormLabel htmlFor="subdealerSelect">Select Subdealer</CFormLabel>
              <CFormSelect
                id="subdealerSelect" 
                value={selectedSubdealer} 
                onChange={handleSubdealerChange}
              >
                <option value="">-- Select Subdealer --</option>
                {subdealers.map(subdealer => (
                  <option key={subdealer._id || subdealer.id} value={subdealer._id || subdealer.id}>
                    {subdealer.name} - {subdealer.location}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            
            <CCol md={5}>
              <CFormLabel htmlFor="receiptSelect">Select UTR/Receipt</CFormLabel>
              <CFormSelect 
                id="receiptSelect" 
                value={selectedReceipt} 
                onChange={handleReceiptChange}
                disabled={!selectedSubdealer || receipts.length === 0}
              >
                <option value="">-- Select UTR/Receipt --</option>
                {receipts.map(receipt => {
                  const remainingAmount = receipt.amount - (receipt.allocatedTotal || 0);
                  return (
                    <option key={receipt._id || receipt.id} value={receipt._id || receipt.id} disabled={remainingAmount <= 0}>
                      {receipt.refNumber || 'No reference'} - ₹{remainingAmount.toLocaleString()} remaining
                    </option>
                  );
                })}
              </CFormSelect>
              <small className="text-muted">
                {receipts.length === 0 && selectedSubdealer ? 'No receipts available' : 'Select a UTR to allocate payments'}
              </small>
            </CCol>
            <CCol md={2}>
              <CButton>View</CButton>
            </CCol>
          </CRow>
        </CTabPane>
      </CTabContent>
    </div>
  );
}

export default SubdealerLedger;