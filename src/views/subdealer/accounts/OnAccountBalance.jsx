import config from 'config';
import '../../../css/table.css';
import {
  React,
  useEffect,
  SearchOutlinedIcon,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  axiosInstance,
  showError,
  Link
} from 'utils/tableImports';
import tvsLogo from '../../../assets/images/logo.png';
const OnAccountBalance = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/subdealers/financials/all`);
      setData(response.data.data.subdealers);
      setFilteredData(response.data.data.subdealers);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

 const handleViewLedger = async (subdealer) => {
  try {
    const res = await axiosInstance.get(`/subdealersonaccount/${subdealer._id}/on-account/receipts`);
    const ledgerData = res.data.docs;
    const ledgerUrl = `${config.baseURL}/ledger.html?ledgerId=${subdealer._id}`;
    
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
                <div><strong>Subdealer Name:</strong> ${ledgerData[0]?.subdealer?.name || subdealer.name || ''}</div>
                <div><strong>Ledger Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th width="15%">Date</th>
                    <th width="35%">Description</th>
                    <th width="15%">Reference No</th>
                    <th width="10%" class="text-right">Credit (₹)</th>
                    <th width="10%" class="text-right">Debit (₹)</th>
                    <th width="15%" class="text-right">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${ledgerData
                    .map((receipt) => {
                      let rows = '';
                      
                      // First row: Receipt entry (credit for the full amount)
                      const receiptCredit = receipt.amount;
                      runningBalance += receiptCredit;
                      totalCredit += receiptCredit;
                      
                      rows += `
                        <tr>
                          <td>${new Date(receipt.receivedDate).toLocaleDateString('en-GB')}</td>
                          <td>
                            On Account Receipt<br>
                            Payment Mode: ${receipt.paymentMode}<br>
                            ${receipt.remark ? `Remark: ${receipt.remark}` : ''}
                          </td>
                          <td>${receipt.refNumber || ''}</td>
                          <td class="text-right">${receiptCredit.toLocaleString('en-IN')}</td>
                          <td class="text-right">0</td>
                          <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
                        </tr>
                      `;
                      
                      // Allocation rows (debit entries for allocated amounts)
                      if (receipt.allocations && receipt.allocations.length > 0) {
                        receipt.allocations.forEach((allocation) => {
                          const allocationDebit = allocation.amount;
                          runningBalance -= allocationDebit;
                          totalDebit += allocationDebit;
                          
                          rows += `
                            <tr>
                              <td>${new Date(allocation.allocatedAt).toLocaleDateString('en-GB')}</td>
                              <td>
                                Allocation to Booking<br>
                                Customer: ${allocation.booking?.customerDetails?.name || 'N/A'}<br>
                                Booking No: ${allocation.booking?.bookingNumber || 'N/A'}
                              </td>
                              <td>${allocation.ledger?.transactionReference || receipt.refNumber || ''}</td>
                              <td class="text-right">0</td>
                              <td class="text-right">${allocationDebit.toLocaleString('en-IN')}</td>
                              <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
                            </tr>
                          `;
                        });
                      }
                      
                      return rows;
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
    showError('Failed to load ledger. Please try again.');
  }
};
  return (
    <div>
      <h4>OnAccount Balance</h4>
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input
            type="text"
            placeholder="Search.."
            onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('insurance_provider'))}
          />
          <SearchOutlinedIcon />
        </div>
       <Link to="/subdealer-account/add-amount">
          <button className="new-user-btn">+ New Balance</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Name</th>
                <th>Total Bookings</th>
                <th>Total Amount</th>
                <th>Total Received</th>
                <th>Total Balance</th>
                <th>OnAccount Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red' }}>
                    No insurance provider available
                  </td>
                </tr>
              ) : (
                currentRecords.map((subdealer, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{subdealer.name}</td>
                    <td>{subdealer.financials.bookingSummary.totalBookings}</td>
                    <td>{subdealer.financials.bookingSummary.totalBookingAmount}</td>
                    <td>{subdealer.financials.bookingSummary.totalReceivedAmount}</td>
                    <td>{subdealer.financials.bookingSummary.totalBalanceAmount}</td>
                    <td>{subdealer.financials.onAccountSummary.totalBalance}</td>
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
      </div>
      <PaginationOptions />
    </div>
    </div>
  );
};

export default OnAccountBalance;
