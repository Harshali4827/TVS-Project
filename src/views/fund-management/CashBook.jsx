
// import React, { useState, useEffect } from 'react';
// import '../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect } from '@coreui/react';
// import tvsLogo from '../../assets/images/logo.png';
// import CIcon from '@coreui/icons-react';
// import { cilLocationPin, cilUser } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
// import axiosInstance from 'axiosInstance';
// import FormButtons from 'utils/FormButtons';

// function CashBook() {
//   const [formData, setFormData] = useState({
//     branchId: '',
//     date: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [branches, setBranches] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const response = await axiosInstance.get('/branches');
//         setBranches(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching branches:', error);
//         showFormSubmitError(error);
//       }
//     };

//     fetchBranches();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//   };

//   const generateCashBook = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axiosInstance.get(
//         `/vouchers/branch/${formData.branchId}/cashbook/${formData.date}`
//       );

//       if (response.data.success) {
//         // Calculate totals
//         let totalCredit = 0;
//         let totalDebit = 0;
        
//         response.data.data.forEach(entry => {
//           if (entry.voucherType === 'credit') {
//             totalCredit += entry.amount || 0;
//           } else if (entry.voucherType === 'debit') {
//             totalDebit += entry.amount || 0;
//           }
//         });

//         // Get branch details
//         const selectedBranch = branches.find(b => b._id === formData.branchId) || {};
        
//         // Open a new tab with the cash book
//         const cashBookWindow = window.open('', '_blank');
        
//         // Generate HTML for the cash book
//         const cashBookHTML = `
//           <html>
//             <head>
//               <title>Cash Book - ${selectedBranch.name || ''} - ${formData.date}</title>
//               <style>
//                 body { 
//                 font-family: Courier New;
//     }
//                 .header { 
//                 display:flex;
//                 justify-content:space-between; 
//                 }
//                 .logo {
//             width: 30mm;
//             height: auto;
//             margin-right: 5mm;
//           }
              
//                 .header h1 { margin: 0; font-size: 24px;}
//                 .header2{
//                   border-top:2px solid #AAAAAA;
//                   display:flex;
//                   justify-content:space-between;
//                 }
//                 table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//                 th, td { border: 1px solid #000; padding: 8px; text-align: left; }
//                 th { background-color: #f2f2f2; text-align: center; }
//                 .total-row { font-weight: bold; }
//                 .signature { 
//                 text-align: right; }
//                 .balance {
//                  font-weight: bold; 
//                 color:red;
//                  }
//                 .date { text-align: right; margin-bottom: 10px; }
//               </style>
//             </head>
//             <body>
//             <div class="header">
//                 <img src="${tvsLogo}" class="logo" alt="TVS Logo">
//                    <h1>GANDHI TVS</h1>
//             </div>
//                 <div class="header-text">
//                   <h1>GANDHI TVS</h1>
//                   <p>Authorised Main Dealer: TVS Motor Company Ltd.</p>
//                   <p>Registered office:</p>
//                 </div>

//               <div class="header2">
//                     <div>
//                       <h4>CASH BOOK</h4>
//                       <p>Location: ${selectedBranch.name || ''}</p>
//                      </div>
//                    <div>
//                           Date: ${new Date(formData.date).toLocaleDateString('en-IN')}
//                           <div class="balance">
//                             OPENING BALANCE: ${(totalCredit - totalDebit).toLocaleString('en-IN')}
//                          </div>
//              </div>
//               </div>
              
              

//               <table>
//                 <thead>
//                   <tr>
//                     <th>Receipt/VC No</th>
//                     <th>Voucher Type</th>
//                     <th>Account Head</th>
//                     <th>Narration</th>
//                     <th>Credit</th>
//                     <th>Debit</th>
//                     <th>Balance</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${response.data.data.map((entry, index) => {
//                     // Calculate running balance (simplified - you may need proper logic)
//                     const balance = totalCredit - totalDebit;
//                     return `
//                       <tr>
//                         <td>${entry.voucherId || '-'}</td>
//                         <td>${entry.voucherCategory || entry.voucherType || '-'}</td>
//                         <td>${entry.recipientName || '-'}</td>
//                         <td>${entry.remark || '-'} ${entry.paymentMode === 'cash' ? 'CASH AT CIDCO BRANCH' : ''}</td>
//                         <td>${entry.voucherType === 'credit' ? entry.amount.toLocaleString('en-IN') : '0'}</td>
//                         <td>${entry.voucherType === 'debit' ? entry.amount.toLocaleString('en-IN') : '0'}</td>
//                         <td>${balance.toLocaleString('en-IN')}</td>
//                       </tr>
//                     `;
//                   }).join('')}
//                   <tr class="total-row">
//                     <td colspan="4">Total</td>
//                     <td>${totalCredit.toLocaleString('en-IN')}</td>
//                     <td>${totalDebit.toLocaleString('en-IN')}</td>
//                     <td></td>
//                   </tr>
//                 </tbody>
//               </table>

//               <div class="balance">
//                 CLOSING BALANCE: ${(totalCredit - totalDebit).toLocaleString('en-IN')}
//               </div>

//               <div class="signature">
//                 <p>For, Gandhi TVS</p>
//                 <p>Authorised Signatory</p>
//               </div>
//             </body>
//           </html>
//         `;

//         // Write the HTML to the new window
//         cashBookWindow.document.open();
//         cashBookWindow.document.write(cashBookHTML);
//         cashBookWindow.document.close();
        
//         // Optionally print the cash book
//         // cashBookWindow.print();
//       } else {
//         showFormSubmitToast('No data found for the selected branch and date');
//       }
//     } catch (error) {
//       console.error('Error generating cash book:', error);
//       showFormSubmitError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let formErrors = {};
    
//     if (!formData.branchId) formErrors.branchId = 'This field is required';
//     if (!formData.date) formErrors.date = 'This field is required';

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     await generateCashBook();
//   };

//   const handleCancel = () => {
//     navigate('/insurance-provider/provider-list');
//   };

//   return (
//     <div>
//       <h4>Cash Account Master</h4>
//       <div className="form-container">
//         <div className="page-header">
//           <form onSubmit={handleSubmit}>
//             <div className="form-note">
//               <span className="required">*</span> Field is mandatory
//             </div>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Location</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilLocationPin} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="branchId" 
//                     value={formData.branchId} 
//                     onChange={handleChange}
//                     disabled={isLoading}
//                   >
//                     <option value="">-Select-</option>
//                     {branches.map((branch) => (
//                       <option key={branch._id} value={branch._id}>
//                         {branch.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.branchId && <p className="error">{errors.branchId}</p>}
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Date</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="date" 
//                     name="date" 
//                     value={formData.date} 
//                     onChange={handleChange} 
//                     disabled={isLoading}
//                   />
//                 </CInputGroup>
//                 {errors.date && <p className="error">{errors.date}</p>}
//               </div>
//               <FormButtons onCancel={handleCancel} isLoading={isLoading} />
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CashBook;



import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CButton } from '@coreui/react';
import tvsLogo from '../../assets/images/logo.png';
import tvssangamner from '../../assets/images/tvssangamner.png';
import CIcon from '@coreui/icons-react';
import { cilLocationPin, cilSearch } from '@coreui/icons';
import { showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';

function CashBook() {
  const [formData, setFormData] = useState({
    branchId: '',
    date: ''
  });
  const [errors, setErrors] = useState({});
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
        showFormSubmitError(error);
      }
    };

    fetchBranches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  // const generateCashBook = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axiosInstance.get(
  //       `/vouchers/branch/${formData.branchId}/cashbook/${formData.date}`
  //     );

  //     if (response.data.success) {
  //       let totalCredit = 0;
  //       let totalDebit = 0;
  //       let runningBalance = 0; // Initialize running balance
        
  //       // Calculate totals and running balance
  //       const transactions = response.data.data.map(entry => {
  //         if (entry.voucherType === 'credit') {
  //           totalCredit += entry.amount || 0;
  //           runningBalance += entry.amount || 0;
  //         } else if (entry.voucherType === 'debit') {
  //           totalDebit += entry.amount || 0;
  //           runningBalance -= entry.amount || 0;
  //         }
          
  //         return {
  //           ...entry,
  //           balance: runningBalance
  //         };
  //       });

  //       const selectedBranch = branches.find(b => b._id === formData.branchId) || {};
  //       const openingBalance = transactions.length > 0 ? transactions[0].balance - (transactions[0].voucherType === 'credit' ? transactions[0].amount : -transactions[0].amount) : 0;
  //       const closingBalance = runningBalance;
        
  //       const cashBookWindow = window.open('', '_blank');
        
  //       const cashBookHTML = `
  //         <html>
  //           <head>
  //             <title>Cash Book - ${selectedBranch.name || ''} - ${formData.date}</title>
  //             <style>
  //               @page {
  //                 size: A4;
  //                 margin: 10mm;
  //               }
  //               body {
  //                 font-family: Courier New;
  //                 width: 210mm;
  //                 margin: 0 auto;
  //                 padding: 10mm;
  //               }
  //               .header {
  //                 display: flex;
  //                 justify-content: space-between;
  //                 align-items: center;
  //               }
  //               .logo {
  //                 width: 30mm;
  //                 height: auto;
  //               }
  //                 .header-text{
  //                 margin-top: -30px
  //                 }
  //               .header-text h1 {
  //                 font-size: 24px;
  //               }
  //               .header2 {
  //                 display: flex;
  //                 justify-content: space-between;
  //                 border-top: 2px solid #AAAAAA;
  //               }
  //               table {
  //                 width: 100%;
  //                 border-collapse: collapse;
  //                 margin: 15px 0;
  //                 font-size: 14px;
  //               }
  //               th, td {
  //                 border: 1px solid #000;
  //                 padding: 6px;
  //                 text-align: left;
  //               }
  //               th {
  //                 background-color: #f2f2f2;
  //                 text-align: center;
  //               }
  //               .total-row {
  //                 font-weight: bold;
  //               }
  //               .signature {
  //                 text-align: right;
  //                 margin-top: 10px;
  //               }
  //               .balance {
  //                 font-weight: bold;
  //                 color: red;
  //               }
  //             </style>
  //           </head>
  //           <body>
  //               <div class="header">
  //                         <img src="${tvsLogo}" class="logo" alt="TVS Logo">
  //                       <img src="${tvssangamner}" class="logo" alt="TVS Logo">
                       
  //                </div>

  //                <div class="header-text">
  //                <h2>GANDHI TVS</h2>
  //                 <p>Authorised Main Dealer: TVS Motor Company Ltd.</p>
  //                 <p>Registered office:</p>
  //                </div>


  //             <div class="header2">
  //               <div>
  //                 <h4>CASH BOOK</h4>
  //                 <p>Location: ${selectedBranch.name || ''}</p>
  //               </div>
  //               <div>
  //                 <p>Date: ${new Date(formData.date).toLocaleDateString('en-IN')}</p>
  //                 <p class="balance">OPENING BALANCE: ${openingBalance.toLocaleString('en-IN')}</p>
  //               </div>
  //             </div>

  //             <table>
  //               <thead>
  //                 <tr>
  //                   <th>Receipt/VC No</th>
  //                   <th>Voucher Type</th>
  //                   <th>Account Head</th>
  //                   <th>Narration</th>
  //                   <th>Credit</th>
  //                   <th>Debit</th>
  //                   <th>Balance</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 ${transactions.map(entry => `
  //                   <tr>
  //                     <td>${entry.voucherId || '-'}</td>
  //                     <td>${entry.voucherCategory || entry.voucherType || '-'}</td>
  //                     <td>${entry.recipientName || '-'}</td>
  //                     <td>${entry.remark || '-'} ${entry.paymentMode === 'cash' ? 'CASH AT CIDCO BRANCH' : ''}</td>
  //                     <td>${entry.voucherType === 'credit' ? entry.amount.toLocaleString('en-IN') : '0'}</td>
  //                     <td>${entry.voucherType === 'debit' ? entry.amount.toLocaleString('en-IN') : '0'}</td>
  //                     <td>${entry.balance.toLocaleString('en-IN')}</td>
  //                   </tr>
  //                 `).join('')}
  //                 <tr class="total-row">
  //                   <td colspan="4">Total</td>
  //                   <td>${totalCredit.toLocaleString('en-IN')}</td>
  //                   <td>${totalDebit.toLocaleString('en-IN')}</td>
  //                   <td></td>
  //                 </tr>
  //               </tbody>
  //             </table>

  //             <div class="balance">
  //               CLOSING BALANCE: ${closingBalance.toLocaleString('en-IN')}
  //             </div>

  //             <div class="signature">
  //               <p>For, Gandhi TVS</p>
  //               <p>Authorised Signatory</p>
  //             </div>
  //           </body>
  //         </html>
  //       `;

  //       cashBookWindow.document.open();
  //       cashBookWindow.document.write(cashBookHTML);
  //       cashBookWindow.document.close();
  //     } else {
  //       showFormSubmitToast('No data found for the selected branch and date');
  //     }
  //   } catch (error) {
  //     console.error('Error generating cash book:', error);
  //     showFormSubmitError(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };



  const generateCashBook = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/vouchers/branch/${formData.branchId}/cashbook/${formData.date}`
      );

      if (response.data.success) {
        let totalCredit = 0;
        let totalDebit = 0;
        let runningBalance = 0;
        
        const transactions = response.data.data.map(entry => {
          if (entry.voucherType === 'credit') {
            totalCredit += entry.amount || 0;
            runningBalance += entry.amount || 0;
          } else if (entry.voucherType === 'debit') {
            totalDebit += entry.amount || 0;
            runningBalance -= entry.amount || 0;
          }
          
          return {
            ...entry,
            balance: runningBalance
          };
        });

        const selectedBranch = branches.find(b => b._id === formData.branchId) || {};
        const openingBalance = transactions.length > 0 ? transactions[0].balance - (transactions[0].voucherType === 'credit' ? transactions[0].amount : -transactions[0].amount) : 0;
        const closingBalance = runningBalance;
        
        const cashBookWindow = window.open('', '_blank');
        
        const cashBookHTML = `
          <html>
            <head>
              <title>Cash Book - ${selectedBranch.name || ''} - ${formData.date}</title>
              <style>
                @page {
          size: A4;
          margin: 10mm;
        }
        body {
          font-family: Courier New;
          width: 210mm;
          margin: 0 auto;
          padding: 10mm;
        }
        .header-container {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo-left {
          width: 30mm;
          height: auto;
        }
        .logo-right {
          width: 30mm;
          height: auto;
        }
        .header-text {
          flex-grow: 1;
        }
        .header-text h1 {
          margin: 0;
          font-size: 24px;
        }
        .header-text p {
          margin: 2px 0;
          font-size: 14px;
        }
                .header2 {
          display: flex;
          justify-content: space-between;
          border-top: 2px solid #AAAAAA;
          padding-top: 5px;
          margin: 5px 0 15px 0;
        }
                .header2 div {
                  margin: 0;
                }
                .header2 h4 {
                  margin: 0 0 5px 0;
                }
                .header2 p {
                  margin: 0;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 15px 0;
                  font-size: 14px;
                }
                th, td {
                  border: 1px solid #000;
                  padding: 6px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                  text-align: center;
                }
                .total-row {
                  font-weight: bold;
                }
                .signature {
                  text-align: right;
                  margin-top: 10px;
                }
                .balance {
                  font-weight: bold;
                  color: red;
                }
              </style>
            </head>
            <body>
              <div class="header-container">
              <div>
             <img src="${tvsLogo}" class="logo-left" alt="TVS Logo">
                  <div class="header-text">
                      <h1>GANDHI TVS</h1>
                       <p>Authorised Main Dealer: TVS Motor Company Ltd.</p>
                      <p>Registered office:</p>
                     </div>
              </div>
              <div>
                <img src="${tvssangamner}" class="logo-right" alt="TVS Logo">
                </div>
      </div>

      <div class="header2">
        <div>
          <h4>CASH BOOK</h4>
          <p>Location: ${selectedBranch.name || ''}</p>
        </div>
        <div>
          <p>Date: ${new Date(formData.date).toLocaleDateString('en-IN')}</p>
          <p class="balance">OPENING BALANCE: ${openingBalance.toLocaleString('en-IN')}</p>
        </div>
      </div>

              <table>
                <thead>
                  <tr>
                    <th>Receipt/VC No</th>
                    <th>Voucher Type</th>
                    <th>Account Head</th>
                    <th>Narration</th>
                    <th>Credit</th>
                    <th>Debit</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  ${transactions.map(entry => `
                    <tr>
                      <td>${entry.voucherId || '-'}</td>
                      <td>${entry.voucherCategory || entry.voucherType || '-'}</td>
                      <td>${entry.recipientName || '-'}</td>
                      <td>${entry.remark || '-'} ${entry.paymentMode === 'cash' ? 'CASH AT CIDCO BRANCH' : ''}</td>
                      <td>${entry.voucherType === 'credit' ? entry.amount.toLocaleString('en-IN') : '0'}</td>
                      <td>${entry.voucherType === 'debit' ? entry.amount.toLocaleString('en-IN') : '0'}</td>
                      <td>${entry.balance.toLocaleString('en-IN')}</td>
                    </tr>
                  `).join('')}
                  <tr class="total-row">
                    <td colspan="4">Total</td>
                    <td>${totalCredit.toLocaleString('en-IN')}</td>
                    <td>${totalDebit.toLocaleString('en-IN')}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              <div class="balance">
                CLOSING BALANCE: ${closingBalance.toLocaleString('en-IN')}
              </div>

              <div class="signature">
                <p>For, Gandhi TVS</p>
                <p>Authorised Signatory</p>
              </div>
            </body>
          </html>
        `;

        cashBookWindow.document.open();
        cashBookWindow.document.write(cashBookHTML);
        cashBookWindow.document.close();
      } else {
        showFormSubmitToast('No data found for the selected branch and date');
      }
    } catch (error) {
      console.error('Error generating cash book:', error);
      showFormSubmitError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};
    
    if (!formData.branchId) formErrors.branchId = 'This field is required';
    if (!formData.date) formErrors.date = 'This field is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    await generateCashBook();
  };

  return (
    <div>
      <h4>Cash Account Master</h4>
      <div className="form-container">
        <div className="page-header">
          <form onSubmit={handleSubmit}>
            <div className="form-note">
              <span className="required">*</span> Field is mandatory
            </div>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Location</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLocationPin} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="branchId" 
                    value={formData.branchId} 
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">-Select-</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.branchId && <p className="error">{errors.branchId}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Date</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleChange} 
                    disabled={isLoading}
                  />
                </CInputGroup>
                {errors.date && <p className="error">{errors.date}</p>}
              </div>
              <div className="button-container">
                <CButton 
                  color="primary" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </CButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CashBook;