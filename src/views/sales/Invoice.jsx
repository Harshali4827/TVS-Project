import React, { useState, useEffect } from 'react';
import '../../css/invoice.css';
import { CFormInput, CInputGroup, CInputGroupText, CButton, CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCarAlt, cilDollar, cilMoney, cilPrint, cilReload } from '@coreui/icons';
import axiosInstance from 'axiosInstance';

function Invoice() {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    chassisNumber: '',
    amount: ''
  });
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const fetchInvoiceDetails = async (chassisNumber) => {
    if (!chassisNumber) {
      setError('Please enter a chassis number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.get(`bookings/chassis/${chassisNumber}`);
      if (response.data.success) {
        setInvoiceData(response.data.data);
      } else {
        setError('No booking found for this chassis number');
        setInvoiceData(null);
      }
    } catch (err) {
      setError('Failed to fetch invoice details');
      setInvoiceData(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'chassisNumber') {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      setTypingTimeout(
        setTimeout(() => {
          if (value.trim().length > 0) {
            fetchInvoiceDetails(value);
          } else {
            setInvoiceData(null);
            setError('');
          }
        }, 500)
      );
    }
  };

  const handleClear = () => {
    setFormData({ chassisNumber: '', amount: '' });
    setInvoiceData(null);
    setError('');
  };

  const generateInvoiceHTML = (data) => {
    const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';

    const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';

    const currentDate = new Date().toLocaleDateString('en-GB');
    const dob = data.customerDetails.dob ? new Date(data.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
    const priceComponentsWithGST = data.priceComponents.map((component) => {
      const gstRate = parseFloat(component.header.metadata.gst_rate) / 100 || 0;

      const unitCost = component.originalValue;
      const taxableValue = unitCost / (1 + gstRate);
      const totalGST = unitCost - taxableValue;
      const cgstAmount = totalGST / 2;
      const sgstAmount = totalGST / 2;
      const discount = component.discountedValue < component.originalValue ? component.originalValue - component.discountedValue : 0;
      const lineTotal = component.discountedValue;
      const gstAmount = cgstAmount + sgstAmount;

      return {
        ...component,
        unitCost,
        taxableValue,
        cgstAmount,
        sgstAmount,
        gstAmount,
        gstRate,
        discount,
        lineTotal
      };
    });

    const totalTaxable = priceComponentsWithGST.reduce((sum, item) => sum + item.taxableValue, 0);
    const totalGST = priceComponentsWithGST.reduce((sum, item) => sum + item.gstAmount, 0);
    const insuranceComponent = data.priceComponents.find(
      (comp) => comp.header.header_key === 'INSURCANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS'
    );
    const insuranceCharges = insuranceComponent ? insuranceComponent.originalValue : 0;

    const rtoComponent = data.priceComponents.find((comp) => comp.header.header_key === 'RTO TAX & REGISTRATION');
    const rtoCharges = rtoComponent ? rtoComponent.originalValue : 0;
    const hpCharges = data.hypothecationCharges || 0;
    const totalA = priceComponentsWithGST.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalB = insuranceCharges + rtoCharges + hpCharges;
    const grandTotal = totalA + totalB;

    return `
 <!DOCTYPE html>
<html>
<head>
  <title>GST Invoice</title>
  <style>
    body {
      font-family: "Courier New", Courier, monospace;
      margin: 0;
      padding: 10mm;
      font-size: 14px;
      color: ##555555;;
    }
    .page {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2mm;
    }
    .header-left {
      width: 70%;
    }
    .header-right {
      width: 30%;
      text-align: right;
    }
    .logo {
      height: 50px;
      margin-bottom: 2mm;
    }
    .dealer-info {
      text-align: left;
      font-size: 14px;
      line-height: 1.2;
    }
    .rto-type {
      text-align: left;
      margin: 1mm 0;
      font-weight: bold;
    }
    .customer-info-container {
      display: flex;
      font-size:14px;
    }

    .customer-info-left {
      width: 50%;
    }
    .customer-info-right {
      width: 50%;
    }
    .customer-info-row {
      margin: 1mm 0;
      line-height: 1.2;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      margin: 2mm 0;
    }
    th, td {
      padding: 1mm;
      border: 1px solid #000;
      vertical-align: top;
    }
    .no-border { 
      border: none !important; 
      font-size:14px;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .bold { 
    font-weight: bold; 
    }
    .section-title {
      font-weight: bold;
      margin: 1mm 0;
    }
    .signature-box {
      margin-top: 5mm;
      font-size: 9pt;
    }
    .signature-line {
      border-top: 1px dashed #000;
      width: 40mm;
      display: inline-block;
      margin: 0 5mm;
    }
    .footer {
      font-size: 8pt;
      text-align: justify;
      line-height: 1.2;
      margin-top: 3mm;
    }
    .divider {
      border-top: 2px solid #AAAAAA;
    }
    .totals-table {
      width: 100%;
      border-collapse: collapse;
      margin: 2mm 0;
    }
    .totals-table td {
      border: none;
      padding: 1mm;
    }
      .total-divider {
      border-top: 2px solid #AAAAAA;
      height: 1px;
      margin: 2px 0;
    }
    .broker-info{
       display:flex;
       justify-content:space-between;
       padding:1px;
    }
    .note{
       padding:1px
       margin:2px;
       }
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      body {
        padding: 5mm;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header Section -->
    <div class="header">
      <div class="header-left">
        <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
        <div class="dealer-info">
          Authorized Main Dealer: TVS Motor Company Ltd.<br>
          Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
          Upnagar, Nashik Road, Nashik, 7498993672<br>
          GSTIN: ${data.branch.gst_number}<br>
          GANDHI TVS PIMPALGAON
        </div>
      </div>
      <div class="header-right">
        <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
        <div>Date: ${currentDate}</div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="rto-type">RTO TYPE: ${data.rto}</div>
    <div class="divider"></div>

    <!-- Customer Information -->
    <div class="customer-info-container">
      <div class="customer-info-left">
        <div class="customer-info-row"><strong>Invoice Number:</strong> ${data.bookingNumber}</div>
        <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
        <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</div>
        <div class="customer-info-row"><strong>Taluka:</strong> ${data.customerDetails.taluka}</div>
        <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
         <div class="customer-info-row"><strong>Exchange Mode:</strong> ${data.exchange ? 'YES' : 'NO'}</div>
          <div class="customer-info-row"><strong>Aadhar No.:</strong> ${data.customerDetails.aadharNumber}</div>
          <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
      </div>
      <div class="customer-info-right">
        <div class="customer-info-row"><strong>GSTIN:</strong> ${data.gstin || ' '}</div>
       <div class="customer-info-row"><strong>District:</strong> ${data.customerDetails.district || 'N/A'}</div>
        <div class="customer-info-row"><strong>Pincode:</strong> ${data.customerDetails.pincode || 'N/A'}</div>
        <div class="customer-info-row"><strong>D.O.B:</strong> ${dob}</div>
        <div class="customer-info-row"><strong>Payment Mode:</strong> ${data.payment?.type || 'CASH'}</div>
         <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
        <div class="customer-info-row"><strong>Sales Representative Name:</strong> ${data.salesExecutive?.name || 'N/A'}</div>
      </div>
    </div>
    <div class="divider"></div>

    <!-- Purchase Details -->
    <div class="section-title">Purchase Details:</div>
    <table class="no-border">
      <tr>
        <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${data.model.model_name}</td>
         <td class="no-border"><strong>Battery No:</strong> ${data.batteryNumber || '000'}</td>
      </tr>
      <tr>
        <td class="no-border"><strong>Chasis No:</strong> ${data.chassisNumber}</td>
        <td class="no-border"><strong>Colour:</strong> ${data.color?.name || ''}</td>
      </tr>
       <tr>
        <td class="no-border"><strong>Engine No:</strong> ${data.engineNumber}</td>
        <td class="no-border"><strong>Key No.:</strong> ${data.keyNumber || '000'}</td>
      </tr>
    </table>
    <!-- Price Breakdown Table -->
    <table>
      <tr>
        <th style="width:25%">Particulars</th>
        <th style="width:8%">HSN CODE</th>
        <th style="width:8%">Unit Cost</th>
        <th style="width:8%">Taxable</th>
        <th style="width:5%">CGST</th>
        <th style="width:8%">CGST AMOUNT</th>
        <th style="width:5%">SGST</th>
        <th style="width:8%">SGST AMOUNT</th>
        <th style="width:7%">DISCOUNT</th>
        <th style="width:10%">LINE TOTAL</th>
      </tr>

      ${priceComponentsWithGST
        .map(
          (component) => `
        <tr>
          <td>${component.header.header_key}</td>
          <td>${component.header.metadata.hsn_code}</td>
          <td >${component.originalValue.toFixed(2)}</td>
          <td >${component.taxableValue.toFixed(2)}</td>
          <td >${(component.gstRate * 50).toFixed(2)}%</td>
          <td >${component.cgstAmount.toFixed(2)}</td>
          <td >${(component.gstRate * 50).toFixed(2)}%</td>
          <td >${component.sgstAmount.toFixed(2)}</td>
          <td >${component.discount || '0.00'}</td>
          <td >${component.lineTotal.toFixed(2)}</td>
        </tr>
      `
        )
        .join('')}
    </table>

    <!-- Totals Section - No Borders -->
     <table class="totals-table">
      <tr>
        <td class="no-border" style="width:80%"><strong>Total(A)</strong></td>
        <td class="no-border text-right"><strong>${totalA.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td colspan="2" class="no-border"><div class="total-divider"></div></td>
      </tr>
      <tr>
        <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
        <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
        <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>HP CHARGES</strong></td>
        <td class="no-border text-right"><strong>${hpCharges.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td colspan="2" class="no-border"><div class="total-divider"></div></td>
      </tr>
      <tr>
        <td class="no-border"><strong>TOTAL(B)</strong></td>
        <td class="no-border text-right"><strong>${totalB.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>GRAND TOTAL(A) + (B)</strong></td>
        <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
      </tr>
    </table>
    <div class="broker-info">
      <div><strong>Ex. Broker/ Sub Dealer:</strong>${exchangeBrokerName}</div>
      <div><strong>Ex. Veh No:</strong>${exchangeVehicleNumber}</div>
    </div>
    <div class="note"><strong>Notes:</strong></div>
   <div class="divider"></div>
   <div style="margin-top:2mm;">
  <div><strong>ACC.DETAILS: </strong>
    ${data.accessories
      .map((accessory) => (accessory.accessory ? accessory.accessory.name : ''))
      .filter((name) => name)
      .join(', ')}
  </div>
</div>
    <div class="divider"></div>

    <!-- Footer Declarations -->
    <div class="footer">
      <p><strong>DECLARATIONS:</strong> Declaration- I/We Authorize the Dealer to register the vehicle at RTO in my/our name .2) Getting the vehicle insured from insurance company is my entire responsibility & there will be no liability on dealer for any loss. 3) Getting the vehicle registered from RTO is solely my responsibility & exclusively I/we shall/will be responsible for any loss/penalty/legal charge from RTO/Police for not getting the vehicle registered or for delayed registration. 4) Registration Number allotted by RTO will be acceptable to me else I will pre book for choice number at RTO at my own. Dealership has no role in RTO Number allocation 5) I had been informed & understood the T&C about warranty policy as laid by TVS MOTOR CO. LTD & I agree to abide the same 6) I/We agree that the price at the time of delivery will be applicable. 7) I am being informed about the price breakup, I had understood & agreed upon the same & then had booked the vehicle 9)I am bound to pay an interest @24% p.a. as penalty if payment is delayed for more than 5 days from the date of booking. 8) Subject to sanguimer Jurisdication. I accept that vehicle once sold by dealer shall not be taken back /replaced for any reason.</p>
    </div>

    <!-- Signature Section - Adjusted to fit properly -->
    <div class="signature-box">
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Customer's Signature</div>
        </div>
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Sales Executive</div>
        </div>
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Manager</div>
        </div>
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Accountant</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  };

  //   const generateHelmetInvoiceHTML = (data) => {
  //     const invoiceDate = new Date(data.createdAt).toLocaleDateString('en-GB');

  //     return `
  // <!DOCTYPE html>
  // <html>
  // <head>
  //     <title>Helmet Invoice</title>
  //     <style>
  //         html, body {
  //             height: 100%;
  //             margin: 0;
  //             padding: 0;
  //             background-color: #f5f5f5;
  //             display: flex;
  //             justify-content: center;
  //             align-items: center;
  //         }
  //         .invoice-wrapper {
  //             width: 210mm;
  //             background: white;
  //             box-shadow: 0 0 10px rgba(0,0,0,0.1);
  //             margin: 20px 0;
  //         }
  //         .invoice-body {
  //             font-family: Arial, sans-serif;
  //             margin: 0;
  //             padding: 10mm;
  //             font-size: 12px;
  //             color: #000;
  //         }
  //         .header-container {
  //             display: flex;
  //             justify-content: space-between;
  //         }
  //         .left-header {
  //             display: flex;
  //             flex-direction: column;
  //         }
  //         .invoice-title {
  //             font-size: 16px;
  //             font-weight: bold;
  //             text-align: right;
  //             align-self: flex-start;
  //         }
  //         .info-container {
  //             display: flex;
  //             justify-content: space-between;
  //             margin-bottom: 3mm;
  //         }
  //         .dealer-info, .customer-info {
  //             text-align: left;
  //             line-height: 1.2;
  //             font-size: 14px;
  //             width: 48%;
  //         }
  //         .divider {
  //             border-top: 2px solid #AAAAAA;
  //             margin: 1mm 0;
  //         }

  //         table {
  //             width: 100%;
  //             border-collapse: collapse;
  //             margin: 2mm 0;
  //             font-size: 12px;
  //         }

  //         th, td {
  //             border: none;
  //             padding: 1mm 2mm;
  //             text-align: left;
  //         }

  //         .table-border thead tr {
  //             border-bottom: 2px solid #AAAAAA;
  //         }

  //         .table-border tbody tr:nth-child(2) {
  //             border-top: 2px solid #AAAAAA;
  //         }
  //         .text-right {
  //             text-align: left;
  //         }
  //         .text-center {
  //             text-align: center;
  //         }
  //         .bold {
  //             font-weight: bold;
  //         }
  //         .part-details {
  //             margin-top: 5mm;
  //             font-size: 12px;
  //         }
  //         .signature {
  //             margin-top: 10mm;
  //             font-size: 14px;
  //             display: flex;
  //             justify-content: space-between;
  //         }
  //         .last-text {
  //             text-align: center;
  //             font-size: 14px;
  //             font-weight: bold;
  //         }
  //         .footer {
  //             margin-top: 5mm;
  //             font-size: 14px;
  //         }
  //         .logo {
  //             height: 70px;
  //         }
  //         @page {
  //             size: A4;
  //             margin: 0;
  //         }
  //         @media print {
  //             html, body {
  //                 background: none;
  //                 display: block;
  //             }
  //             .invoice-wrapper {
  //                 box-shadow: none;
  //                 margin: 0;
  //             }
  //         }
  //     </style>
  // </head>
  // <body>
  //     <div class="invoice-wrapper">
  //         <div class="invoice-body">
  //             <div class="header-container">
  //                 <div class="left-header">
  //                     <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="Dealer Logo">
  //                     <div>Invoice No: ${data.bookingNumber || '21731'}</div>
  //                     <div>Invoice Date: ${invoiceDate || '06/07/2025'}</div>
  //                 </div>
  //                 <div class="invoice-title">TAX Invoice</div>
  //             </div>

  //             <div class="divider"></div>

  //             <div class="info-container">
  //                 <div class="dealer-info">
  //                     <div class="bold">GANDHI MOTORS</div>
  //                     <div>'JOGPREET' ASHER ESTATE UPNAGAR, NASHIK ROAD, NASHIK 422101.422101</div>
  //                     <div>Phone:</div>
  //                     <div>GSTIN NO.-27AATC68896K1ZN</div>
  //                 </div>
  //                 <div class="customer-info">
  //                     <div>${data.customerDetails.salutation || 'MR/Mrs/MS.'} ${data.customerDetails.name || 'Mr. NIKHIL GANGURDE'}</div>
  //                     <div>Address: ${data.customerDetails.address || ''}</div>
  //                     <div>Mobile: ${data.customerDetails.mobile1 || ''}</div>
  //                     <div>Aadhar: ${data.customerDetails.aadharNumber || ''}</div>
  //                     <div>Bill Type: ${data.payment.type || ''}</div>
  //                 </div>
  //             </div>

  //             <div class="divider"></div>

  //             <table class="table-border">
  //                 <thead>
  //                     <tr>
  //                         <th>Particulars</th>
  //                         <th>HSN Code</th>
  //                         <th>Qty</th>
  //                         <th>Unit Cost</th>
  //                         <th>Taxable</th>
  //                         <th>CGST%</th>
  //                         <th>Amount</th>
  //                         <th>SGST%</th>
  //                         <th>Amount</th>
  //                     </tr>
  //                 </thead>
  //                 <tbody>
  //                     <tr>
  //                         <td>ISI HELMET</td>
  //                         <td>6501010</td>
  //                         <td >2</td>
  //                         <td >400.00</td>
  //                         <td >677.96</td>
  //                         <td >9%</td>
  //                         <td >61.01</td>
  //                         <td >9%</td>
  //                         <td >61.01</td>
  //                     </tr>
  //                     <tr>
  //                         <td colspan="4" class="bold">Total</td>
  //                         <td class="text-right bold">677.96</td>
  //                         <td class="text-right bold"></td>
  //                         <td class="text-right bold">61.01</td>
  //                         <td class="text-right bold"></td>
  //                         <td class="text-right bold">61.01</td>
  //                     </tr>
  //                     <tr>
  //                         <td colspan="8" class="text-right bold">GRAND TOTAL</td>
  //                         <td class="text-right bold">799.98</td>
  //                     </tr>
  //                     <tr>
  //                         <td colspan="8" >ROUND OFF</td>
  //                         <td >+0.02</td>
  //                     </tr>
  //                     <tr>
  //                         <td colspan="8" class="text-right bold">NET TOTAL</td>
  //                         <td class="text-right bold">₹ 800</td>
  //                     </tr>
  //                 </tbody>
  //             </table>

  //             <div class="divider"></div>
  //             <table class="table-border">
  //                 <thead>
  //                     <tr>
  //                         <th>PART DESCRIPTION</th>
  //                         <th>FRAME NO</th>
  //                         <th>ENGINE NO</th>
  //                         <th>CWI BOOKLET NO</th>
  //                     </tr>
  //                 </thead>
  //                 <tbody>
  //                     <tr>
  //                         <td>${data.model.model_name || 'RADEON 110 DRUM ES OBD II'}</td>
  //                         <td>${data.chassisNumber || 'MD625BK2XS1A02383'}</td>
  //                         <td>${data.engineNumber || 'BK2AS1702363'}</td>
  //                         <td></td>
  //                     </tr>
  //                 </tbody>
  //             </table>

  //             <div class="footer">
  //                 Message from Dealer:- Certified that goods covered by this bill suffered tax at hands of supplier.
  //                 Vehicle once sold shall not be taken back /replaced for any reason.
  //             </div>

  //             <div class="divider"></div>

  //             <div class="signature">
  //                 <div>(${data.customerDetails.salutation || 'MR/Mrs/MS.'} ${data.customerDetails.name || 'Mr. NIKHIL GANGURDE'})</div>
  //                 <div class="bold">For (GANDHI MOTORS)<br> Authorised Signatory</div>
  //             </div>
  //             <div class="last-text">Subject To Nashik Jurisdiction</div>
  //              <div class="divider"></div>
  //         </div>
  //     </div>
  // </body>
  // </html>
  //     `;
  //   };

  const generateHelmetInvoiceHTML = (data) => {
    const invoiceDate = new Date(data.createdAt).toLocaleDateString('en-GB');

    const helmetComponent = data.priceComponents.find((c) => c.header.header_key === 'TVS HELMET');

    const qty = 2;
    const unitCost = helmetComponent ? helmetComponent.originalValue : 0;
    const gstRate = helmetComponent ? parseFloat(helmetComponent.header.metadata.gst_rate) / 100 : 0;
    const taxableValue = helmetComponent ? unitCost / (1 + gstRate) : 0;
    const totalGST = helmetComponent ? unitCost - taxableValue : 0;
    const cgstAmount = totalGST / 2;
    const sgstAmount = totalGST / 2;
    const roundOff = Math.round(unitCost) - unitCost;
    const netTotal = Math.round(unitCost);

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Helmet Invoice</title>
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .invoice-wrapper {
            width: 210mm;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        .invoice-body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 10mm;
            font-size: 12px;
            color: #000;
        }
        .header-container {
            display: flex;
            justify-content: space-between;
        }
        .left-header {
            display: flex;
            flex-direction: column;
        }
        .invoice-title {
            font-size: 16px;
            font-weight: bold;
            text-align: right;
            align-self: flex-start;
        }
        .info-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3mm;
        }
        .dealer-info, .customer-info {
            text-align: left;
            line-height: 1.2;
            font-size: 14px;
            width: 48%;
        }
        .divider {
            border-top: 2px solid #AAAAAA;
            margin: 1mm 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2mm 0;
            font-size: 12px;
        }
        th, td {
            border: none;
            padding: 1mm 2mm;
            text-align: left;
        }
        .table-border thead tr {
            border-bottom: 2px solid #AAAAAA;
        }
        .table-border tbody tr:nth-child(2) {
            border-top: 2px solid #AAAAAA;
        }
        .text-center {
            text-align: center;
        }
        .bold {
            font-weight: bold;
        }
        .part-details {
            margin-top: 5mm;
            font-size: 12px;
        }
        .signature {
            margin-top: 10mm;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
        }
        .last-text {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
        }
        .footer {
            margin-top: 5mm;
            font-size: 14px;
        }
        .logo {
            height: 70px;
        }
        @page {
            size: A4;
            margin: 0;
        }
        @media print {
            html, body {
                background: none;
                display: block;
            }
            .invoice-wrapper {
                box-shadow: none;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-wrapper">
        <div class="invoice-body">
            <div class="header-container">
                <div class="left-header">
                    <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="Dealer Logo">
                    <div>Invoice No: ${data.bookingNumber || '21731'}</div>
                    <div>Invoice Date: ${invoiceDate}</div>
                </div>
                <div class="invoice-title">TAX Invoice</div>
            </div>
        
            <div class="divider"></div>
        
            <div class="info-container">
                <div class="dealer-info">
                    <div class="bold">GANDHI MOTORS</div>
                    <div>'JOGPREET' ASHER ESTATE UPNAGAR, NASHIK ROAD, NASHIK 422101.</div>
                    <div>Phone:</div>
                    <div>GSTIN NO.-27AATC68896K1ZN</div>
                </div>
                <div class="customer-info">
                    <div>${data.customerDetails.salutation || 'MR/Mrs/MS.'} ${data.customerDetails.name || ''}</div>
                    <div>Address: ${data.customerDetails.address || ''}</div>
                    <div>Mobile: ${data.customerDetails.mobile1 || ''}</div>
                    <div>Aadhar: ${data.customerDetails.aadharNumber || ''}</div>
                    <div>Bill Type: ${data.payment?.type || ''}</div>
                </div>
            </div>
        
            <div class="divider"></div>
        
            <table class="table-border">
                <thead>
                    <tr>
                        <th>Particulars</th>
                        <th>HSN Code</th>
                        <th>Qty</th>
                        <th>Unit Cost</th>
                        <th>Taxable</th>
                        <th>CGST%</th>
                        <th>Amount</th>
                        <th>SGST%</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${helmetComponent ? helmetComponent.header.header_key : 'TVS HELMET'}</td>
                        <td>${helmetComponent ? helmetComponent.header.metadata.hsn_code : '000000'}</td>
                        <td >${qty}</td>
                        <td >${unitCost.toFixed(2)}</td>
                        <td >${taxableValue.toFixed(2)}</td>
                        <td >${((gstRate * 100) / 2).toFixed(2)}%</td>
                        <td >${cgstAmount.toFixed(2)}</td>
                        <td >${((gstRate * 100) / 2).toFixed(2)}%</td>
                        <td >${sgstAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="bold">Total</td>
                        <td class="text-right bold">${taxableValue.toFixed(2)}</td>
                        <td class="text-right bold"></td>
                        <td class="text-right bold">${cgstAmount.toFixed(2)}</td>
                        <td class="text-right bold"></td>
                        <td class="text-right bold">${sgstAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="8" class="text-right bold">GRAND TOTAL</td>
                        <td class="text-right bold">${unitCost.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="8" >ROUND OFF</td>
                        <td >${roundOff >= 0 ? '+' : ''}${roundOff.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="8" class="text-right bold">NET TOTAL</td>
                        <td class="text-right bold">₹ ${netTotal}</td>
                    </tr>
                </tbody>
            </table>
        
            <div class="divider"></div>
            <table class="table-border">
                <thead>
                    <tr>
                        <th>PART DESCRIPTION</th>
                        <th>FRAME NO</th>
                        <th>ENGINE NO</th>
                        <th>CWI BOOKLET NO</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${data.model?.model_name || ''}</td>
                        <td>${data.chassisNumber || ''}</td>
                        <td>${data.engineNumber || ''}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        
            <div class="footer">
                Message from Dealer:- Certified that goods covered by this bill suffered tax at hands of supplier. 
                Vehicle once sold shall not be taken back /replaced for any reason.
            </div>
        
            <div class="divider"></div>
        
            <div class="signature">
                <div>(${data.customerDetails.salutation || 'MR/Mrs/MS.'} ${data.customerDetails.name || ''})</div>
                <div class="bold">For (GANDHI MOTORS)<br> Authorised Signatory</div>
            </div>
            <div class="last-text">Subject To Nashik Jurisdiction</div>
            <div class="divider"></div>
        </div>
    </div>
</body>
</html>
  `;
  };

  const handlePrint = () => {
    if (!invoiceData) {
      setError('Please fetch invoice details first');
      return;
    }
    const printWindow = window.open('', '_blank');
    // printWindow.document.write(generateInvoiceHTML(invoiceData));
    if (activeTab === 3) {
      printWindow.document.write(generateHelmetInvoiceHTML(invoiceData));
    } else {
      printWindow.document.write(generateInvoiceHTML(invoiceData));
    }
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };
  return (
    <div className="container">
      <h4 className="mb-4">Invoice</h4>

      <CNav variant="tabs">
        <CNavItem>
          <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
            Customer GST Invoice
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
            RTO Invoice
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)}>
            Downpayment Receipt
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 3} onClick={() => setActiveTab(3)}>
            Helmet Invoice
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        {/* Customer GST Invoice Tab */}
        <CTabPane visible={activeTab === 0} className="p-3">
          <h5>Customer GST Invoice</h5>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon className="icon" icon={cilCarAlt} />
            </CInputGroupText>
            <CFormInput
              placeholder="Enter Chassis Number"
              name="chassisNumber"
              value={formData.chassisNumber}
              onChange={handleChange}
              disabled={loading}
            />
            {loading && (
              <CInputGroupText>
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </CInputGroupText>
            )}
          </CInputGroup>

          {error && <div className="text-danger mb-3">{error}</div>}

          <div className="d-flex gap-2">
            <CButton color="primary" onClick={handlePrint} disabled={!invoiceData || loading}>
              <CIcon icon={cilPrint} className="me-2" />
              Print
            </CButton>
            <CButton color="secondary" onClick={handleClear} disabled={loading}>
              <CIcon icon={cilReload} className="me-2" />
              Clear
            </CButton>
          </div>
        </CTabPane>

        {/* RTO Invoice Tab */}
        <CTabPane visible={activeTab === 1} className="p-3">
          <h5>RTO Invoice</h5>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon className="icon" icon={cilCarAlt} />
            </CInputGroupText>
            <CFormInput
              placeholder="Enter Chassis Number"
              name="chassisNumber"
              value={formData.chassisNumber}
              onChange={handleChange}
              disabled={loading}
            />
            {loading && (
              <CInputGroupText>
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </CInputGroupText>
            )}
          </CInputGroup>

          {error && <div className="text-danger mb-3">{error}</div>}

          <div className="d-flex gap-2">
            <CButton color="primary" onClick={handlePrint} disabled={!invoiceData || loading}>
              <CIcon icon={cilPrint} className="me-2" />
              Print
            </CButton>
            <CButton color="secondary" onClick={handleClear} disabled={loading}>
              <CIcon icon={cilReload} className="me-2" />
              Clear
            </CButton>
          </div>
        </CTabPane>

        {/* Downpayment Receipt Tab */}
        <CTabPane visible={activeTab === 2} className="p-3">
          <h5>Downpayment Receipt</h5>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon className="icon" icon={cilCarAlt} />
            </CInputGroupText>
            <CFormInput
              placeholder="Enter Chassis Number"
              name="chassisNumber"
              value={formData.chassisNumber}
              onChange={handleChange}
              disabled={loading}
            />
            {loading && (
              <CInputGroupText>
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </CInputGroupText>
            )}
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon className="icon" icon={cilDollar} />
            </CInputGroupText>
            <CFormInput placeholder="Enter Amount" name="amount" value={formData.amount} onChange={handleChange} />
          </CInputGroup>
          <div className="d-flex gap-2">
            <CButton color="primary" onClick={handlePrint} disabled={!invoiceData || loading}>
              <CIcon icon={cilPrint} className="me-2" />
              Print
            </CButton>
            <CButton color="secondary" onClick={handleClear} disabled={loading}>
              <CIcon icon={cilReload} className="me-2" />
              Clear
            </CButton>
          </div>
        </CTabPane>

        {/* Helmet Invoice Tab */}
        <CTabPane visible={activeTab === 3} className="p-3">
          <h5>Helmet Invoice</h5>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon className="icon" icon={cilCarAlt} />
            </CInputGroupText>
            <CFormInput
              placeholder="Enter Chassis Number"
              name="chassisNumber"
              value={formData.chassisNumber}
              onChange={handleChange}
              disabled={loading}
            />
            {loading && (
              <CInputGroupText>
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </CInputGroupText>
            )}
          </CInputGroup>
          <div className="d-flex gap-2">
            <CButton color="primary" onClick={handlePrint} disabled={!invoiceData || loading}>
              <CIcon icon={cilPrint} className="me-2" />
              Print
            </CButton>
            <CButton color="secondary" onClick={handleClear} disabled={loading}>
              <CIcon icon={cilReload} className="me-2" />
              Clear
            </CButton>
          </div>
        </CTabPane>
      </CTabContent>
    </div>
  );
}

export default Invoice;
