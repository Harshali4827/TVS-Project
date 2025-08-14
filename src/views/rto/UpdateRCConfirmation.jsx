import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CBackdrop,
  CAlert
} from '@coreui/react';
import '../../css/receipt.css';
import axiosInstance from 'axiosInstance';

const UpdateRCConfirmation = ({ show, onClose, rcData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!rcData || !rcData._id) {
        throw new Error('Invalid RC data');
      }

      const response = await axiosInstance.patch(`/rtoProcess/${rcData._id}`, {
        rcConfirmation: true
      });

      setSuccess('RC Confirmation status successfully updated!');
      console.log('RC Confirmation update response:', response.data);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('RC update error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update RC status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      setError(null);
      setSuccess(null);
    }
  }, [show, rcData]);

  return (
    <>
      <CBackdrop visible={show} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
      <CModal visible={show} onClose={onClose} size="lg" alignment="center">
        <CModalHeader className="text-white" style={{ backgroundColor: '#243c7c' }}>
          <CModalTitle className="text-white">RTO RC CONFIRMATION</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}

          <div className="booking-header mb-2 p-1 bg-light rounded">
            <h5 className="mb-0">
              Booking Number: <strong>{rcData?.bookingId?.bookingNumber || ''}</strong>
            </h5>
          </div>
          <hr></hr>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Customer Name</label>
              <CFormInput type="text" value={rcData?.bookingId?.customerName || ''} readOnly className="bg-light" />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Chassis Number</label>
              <CFormInput type="text" value={rcData?.bookingId?.chassisNumber || ''} readOnly className="bg-light" />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter className="d-flex justify-content-between">
          <div>
            <CButton color="primary" onClick={handleSubmit} className="me-2" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'UPDATE RC CINFIRMATION'}
            </CButton>
            <CButton color="info" variant="outline">
              View Ledger
            </CButton>
          </div>
          <CButton color="secondary" onClick={onClose} disabled={isLoading}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default UpdateRCConfirmation;
