import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  SearchOutlinedIcon,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  axiosInstance,
  Menu,
  MenuItem
} from 'utils/tableImports';
import tvsLogo from '../../assets/images/logo.png';
import config from 'config';
import ExchangeLedgerModel from './ExchangeLedgerModel';

const ExchangeLedger = () => {
  const [anchorEl, setAnchorEl] = useState(null);
    const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedledger, setSelectedledger] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/broker-ledger/summary`);
      setData(response.data.data.docs);
      setFilteredData(response.data.data.docs);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };
 const handleAddClick = (ledger) => {
  setSelectedledger(ledger);
  setShowModal(true);
};
  const handleViewLedger = async (ledger) => {
    try {
      const res = await axiosInstance.get(`/broker-ledger/${ledger.broker?._id}/statement`);
      const ledgerData = res.data.data;
      const ledgerUrl = `${config.baseURL}/ledger.html?ledgerId=${ledger._id}`;
       let totalCredit = 0;
    let totalDebit = 0;

    ledgerData.transactions?.forEach((entry) => {
      if (entry.type === 'CREDIT') {
        totalCredit += entry.amount;
      } else if (entry.type === 'DEBIT') {
        totalDebit += entry.amount;
      }
    });
    const finalBalance = totalDebit - totalCredit;

      const win = window.open('', '_blank');
      win.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Customer Ledger</title>
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
                  <div><strong>Broker Name:</strong> ${ledgerData.broker?.name || ''}</div>
                  <div><strong>Ledger Date:</strong> ${ledgerData.ledgerDate || new Date().toLocaleDateString('en-GB')}</div>
                </div>
                
                <table>
                  <thead>
                    <tr>
                      <th width="15%">Date</th>
                      <th width="35%">Description</th>
                      <th width="15%">Receipt/VC No</th>
                      <th width="10%" class="text-right">Credit (₹)</th>
                      <th width="10%" class="text-right">Debit (₹)</th>
                      <th width="15%" class="text-right">Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${ledgerData.transactions
                      ?.map(
                        (entry) => `
                      <tr>
                        <td>${new Date(entry.date).toLocaleDateString()}</td>
                        <td>
                          Booking No: ${entry.booking?.bookingNumber || '-'}<br>
                           Customer: ${entry.booking?.customerName || '-'}<br>
                           Chassis Number:${entry.booking?.chassisNumber || '-'}
                           ${entry.mode}
                        </td>
                        <td>${entry.receiptNo || ''}</td>
                       <td class="text-right">${entry.type === 'CREDIT' ? entry.amount.toLocaleString('en-IN') : '-'}</td>
                       <td class="text-right">${entry.type === 'DEBIT' ? entry.amount.toLocaleString('en-IN') : '-'}</td>
                       <td class="text-right">
                     
                       </td>
                      </tr>
                    `
                      )
                      .join('')}
                    <tr>
                      <td colspan="3" class="text-left"><strong>Total</strong></td>
                      <td class="text-right"><strong>${totalCredit.toLocaleString('en-IN')}</strong></td>
                      <td class="text-right"><strong>${totalDebit.toLocaleString('en-IN')}</strong></td>
                      <td class="text-right"><strong>${finalBalance.toLocaleString('en-IN')}</strong></td>
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
    <div>
      <h4>Exchange Ledger</h4>
      <div className="table-container">
        {error && <div className="error-message">{error}</div>}
        <div className="table-header">
          <div className="search-icon-data">
            <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('financer'))} />
            <SearchOutlinedIcon />
          </div>
        </div>
        <div className="table-responsive">
          <div className="table-wrapper">
            <table className="responsive-table" style={{ overflow: 'auto' }}>
              <thead className="table-header-fixed">
                <tr>
                  <th>Sr.no</th>
                  <th>Exchange Broker Name</th>
                  <th>Debit</th>
                  <th>Credit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ color: 'red' }}>
                      No ledger details available
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((ledger, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{ledger.broker.name}</td>
                      <td>{ledger.totalDebit || ''}</td>
                      <td>{ledger.totalCredit || ''}</td>
                      <td>
                        <button className="action-button" onClick={() => handleAddClick(ledger)}>
                          Add
                        </button>
                        <button style={{ marginLeft: '4px' }} className="action-button" onClick={() => handleViewLedger(ledger)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <ExchangeLedgerModel 
                 show={showModal} 
                 onClose={() => setShowModal(false)} 
                 brokerData={selectedledger} 
                 refreshData={fetchData} 
                />

            </table>
          </div>
        </div>
        <PaginationOptions />
      </div>
    </div>
  );
};

export default ExchangeLedger;
