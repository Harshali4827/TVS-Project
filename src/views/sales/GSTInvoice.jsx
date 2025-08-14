import React, { useState, useEffect } from 'react';
import axiosInstance from 'axiosInstance';
import { CFormInput, CInputGroup, CInputGroupText, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import tvsLogo from '../../assets/images/logo.png';
import { cilCarAlt, cilPrint, cilReload } from '@coreui/icons';

function GSTInvoice() {
  const [formData, setFormData] = useState({
    chassisNumber: ''
  });
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInvoiceDetails = async () => {
    if (!formData.chassisNumber) {
      setError('Please enter a chassis number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.get(`bookings/chassis/${formData.chassisNumber}`);
      if (response.data.success) {
        setInvoiceData(response.data.data);
      } else {
        setError('No booking found for this chassis number');
      }
    } catch (err) {
      setError('Failed to fetch invoice details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({ chassisNumber: '' });
    setInvoiceData(null);
    setError('');
  };

  const handlePrint = () => {
    if (!invoiceData) {
      setError('Please fetch invoice details first');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(generateInvoiceHTML(invoiceData));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const generateInvoiceHTML = (data, tvsLogo) => {
    const currentDate = new Date().toLocaleDateString('en-GB');
    const gstAmount = (data.totalAmount * 0.18).toFixed(2); // Assuming 18% GST

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>GST Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 10mm; }
          .header { text-align: center; margin-bottom: 5mm; }
          .dealer-info { text-align: center; font-size: 10pt; margin-bottom: 5mm; }
          .invoice-title { text-align: center; font-weight: bold; font-size: 14pt; margin: 5mm 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 5mm; }
          td { padding: 2mm; vertical-align: top; }
          .border-top { border-top: 1px solid #000; }
          .border-bottom { border-bottom: 1px solid #000; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .bold { font-weight: bold; }
          .signature-box { margin-top: 10mm; }
          .signature-line { border-top: 1px dashed #000; width: 150px; display: inline-block; margin: 0 20px; }
          .footer { margin-top: 10mm; font-size: 10pt; text-align: justify; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>GANDHI MOTORS PVT LTD</h2>
          <div class="dealer-info">
            Authorized Main Dealer: TVS Motor Company Ltd.<br>
            Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
            Upnagar, Nashik Road, Nashik, 7498993672<br>
            GSTIN: ${data.branch.gst_number}<br>
            GANDHI TVS PIMPALGAON
          </div>
          <div><strong>RTO TYPE:</strong> ${data.rto}</div>
          <div><strong>TIVS</strong></div>
          <div>Date: ${currentDate}</div>
        </div>

        <div class="border-top border-bottom" style="padding: 5mm 0;">
          <table>
            <tr>
              <td><strong>Invoice Number:</strong> ${data.bookingNumber}</td>
              <td class="text-right"><strong>Date:</strong> ${currentDate}</td>
            </tr>
            <tr>
              <td colspan="2"><strong>Customer Name:</strong> ${data.customerDetails.name}</td>
            </tr>
            <tr>
              <td colspan="2"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</td>
            </tr>
            <tr>
              <td><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</td>
              <td class="text-right"><strong>GSTIN:</strong> ${data.gstin || 'N/A'}</td>
            </tr>
          </table>
        </div>

        <table class="border-top border-bottom">
          <tr>
            <td><strong>Model Name:</strong> ${data.model.model_name}</td>
            <td><strong>Chasis No:</strong> ${data.chassisNumber}</td>
          </tr>
          <tr>
            <td><strong>Engine No:</strong> ${data.engineNumber}</td>
            <td><strong>Battery No:</strong> ${data.batteryNumber || '000'}</td>
          </tr>
          <tr>
            <td><strong>Color:</strong> ${data.color.name}</td>
            <td><strong>Key No:</strong> ${data.keyNumber || '000'}</td>
          </tr>
        </table>

        <table style="width: 100%; margin-top: 5mm;" class="border-top border-bottom">
          <tr>
            <th class="border-bottom" style="width: 60%;">Particulars</th>
            <th class="border-bottom text-right">Amount (₹)</th>
          </tr>
          <tr>
            <td>${data.model.model_name} Ex Showroom</td>
            <td class="text-right">${data.model.prices[0].value.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Standard Fittings</td>
            <td class="text-right">${data.accessories[0].price.toFixed(2)}</td>
          </tr>
          <tr>
            <td>PDI & Incidental Charges</td>
            <td class="text-right">${data.accessories[1].price.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Insurance Charges</td>
            <td class="text-right">0.00</td>
          </tr>
          <tr>
            <td>RTO Tax & Registration</td>
            <td class="text-right">${data.rtoAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="bold">Sub Total</td>
            <td class="text-right bold">${data.totalAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td>GST @18%</td>
            <td class="text-right">${gstAmount}</td>
          </tr>
          <tr>
            <td class="bold">Grand Total</td>
            <td class="text-right bold">${(parseFloat(data.totalAmount) + parseFloat(gstAmount)).toFixed(2)}</td>
          </tr>
        </table>

        <div class="footer">
          <p><strong>Declaration:</strong> I/We Authorize the Dealer to register the vehicle at RTO in my/our name. Getting the vehicle insured from insurance company is my responsibility. Registration Number allotted by RTO will be acceptable to me. Dealership has no role in RTO number allocation. I accept that vehicle once sold by dealer shall not be taken back/replaced for any reason.</p>
        </div>

        <div class="signature-box">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <div class="signature-line"></div>
              <div>Customer's Signature</div>
            </div>
            <div>
              <div class="signature-line"></div>
              <div>Sales Executive</div>
            </div>
            <div>
              <div class="signature-line"></div>
              <div>Manager</div>
            </div>
            <div>
              <div class="signature-line"></div>
              <div>Accountant</div>
            </div>
          </div>
        </div>

        <div class="text-center" style="margin-top: 10mm;">
          <strong>Subject To Sangamner Jurisdiction</strong>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="container">
      <h4 className="mb-4">Customer GST Invoice</h4>

      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon className="icon" icon={cilCarAlt} />
        </CInputGroupText>
        <CFormInput placeholder="Enter Chassis Number" name="chassisNumber" value={formData.chassisNumber} onChange={handleChange} />
        <CButton color="primary" onClick={fetchInvoiceDetails} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Details'}
        </CButton>
      </CInputGroup>

      {error && <div className="text-danger mb-3">{error}</div>}

      <div className="d-flex gap-2">
        <CButton color="primary" onClick={handlePrint} disabled={!invoiceData}>
          <CIcon icon={cilPrint} className="me-2" />
          Print Invoice
        </CButton>
        <CButton color="secondary" onClick={handleClear}>
          <CIcon icon={cilReload} className="me-2" />
          Clear
        </CButton>
      </div>
    </div>
  );
}

export default GSTInvoice;
