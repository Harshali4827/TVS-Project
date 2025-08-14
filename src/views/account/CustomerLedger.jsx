import React, { useEffect, useRef } from 'react';
import './CustomerLedger.css';

const LedgerPrintView = ({ ledgerData, bookingData }) => {
  const printRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
      .format(value)
      .replace('₹', '₹ ');
  };

  return (
    <div ref={printRef} className="ledger-container">
      <div className="ledger-header">
        <h2>Customer Ledger</h2>
        <h4>GANDHI TVS</h4>
        <p>Authorise Main Dealer : TVS Motor Company Ltd.</p>
        <p>Registered office:- JOGPREET , ASHER ESTATE, UPNAGAR, NASHIK ROAD NASHIK</p>
        <p>Phone: 9923660777</p>
      </div>

      <div className="customer-info">
        <div>
          <strong>Customer Name:</strong> {ledgerData.customerDetails?.name || bookingData.customerDetails?.name}
        </div>
        <div>
          <strong>Ledger Date:</strong> {ledgerData.ledgerDate || new Date().toLocaleDateString('en-GB')}
        </div>
        <div>
          <strong>Customer Address:</strong> {ledgerData.customerDetails?.address || bookingData.customerDetails?.address}
        </div>
        <div>
          <strong>Phone:</strong> {ledgerData.customerDetails?.phone || bookingData.customerDetails?.phone}
        </div>
        <div>
          <strong>Aadhar:</strong> {ledgerData.customerDetails?.aadharNo || bookingData.customerDetails?.aadharNo || '-'}
        </div>
        <div>
          <strong>PAN:</strong> {ledgerData.customerDetails?.panNo || bookingData.customerDetails?.panNo || '-'}
        </div>
        <div>
          <strong>Chassis No:</strong> {ledgerData.vehicleDetails?.chassisNo || bookingData.chassisNumber}
        </div>
        <div>
          <strong>Engine No:</strong> {ledgerData.vehicleDetails?.engineNo || bookingData.engineNumber}
        </div>
        <div>
          <strong>Model/Color:</strong> {ledgerData.vehicleDetails?.model || 'N/A'} / {ledgerData.vehicleDetails?.color || 'N/A'}
        </div>
        <div>
          <strong>Finance Name:</strong> {ledgerData.financeDetails?.financer || bookingData.financeName || '-'}
        </div>
        <div>
          <strong>Sale Executive:</strong> {ledgerData.salesExecutive || bookingData.saleExecutive || '-'}
        </div>
      </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Receipt/VC No Status</th>
            <th>Credit (₹)</th>
            <th>Debit (₹)</th>
            <th>Balance (₹)</th>
          </tr>
        </thead>
        <tbody>
          {ledgerData.entries?.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.description}</td>
              <td>{entry.receiptNo}</td>
              <td>{entry.status}</td>
              <td className="text-end">{entry.credit ? formatCurrency(entry.credit) : '-'}</td>
              <td className="text-end">{entry.debit ? formatCurrency(entry.debit) : '-'}</td>
              <td className="text-end">{formatCurrency(entry.balance)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="totals-row">
            <td colSpan="3" className="text-end">
              <strong>Totals:</strong>
            </td>
            <td className="text-end">
              <strong>{formatCurrency(ledgerData.totals?.totalCredit)}</strong>
            </td>
            <td className="text-end">
              <strong>{formatCurrency(ledgerData.totals?.totalDebit)}</strong>
            </td>
            <td className="text-end">
              <strong>{formatCurrency(ledgerData.totals?.finalBalance)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="ledger-footer">
        <p>For, Gandhi TVS</p>
        <p>Authorised Signatory</p>
        <p>https://gandhitvs.co.in/Update/Ledger.aspx</p>
      </div>
    </div>
  );
};

export default LedgerPrintView;
