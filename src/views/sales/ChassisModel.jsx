import React, { useState, useEffect } from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CFormLabel, CButton, CFormSelect, CSpinner } from '@coreui/react';
import axiosInstance from 'axiosInstance';

const ChassisNumberModal = ({ show, onClose, onSave, isLoading, booking }) => {
  const [chassisNumber, setChassisNumber] = useState('');
  const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
  const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);

  useEffect(() => {
    if (show && booking) {
      fetchAvailableChassisNumbers();
    }
  }, [show, booking]);

  const fetchAvailableChassisNumbers = async () => {
    try {
      setLoadingChassisNumbers(true);
      const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
      setAvailableChassisNumbers(response.data.data.chassisNumbers || []);
    } catch (error) {
      console.error('Error fetching chassis numbers:', error);
      showError('Failed to fetch available chassis numbers');
    } finally {
      setLoadingChassisNumbers(false);
    }
  };

  const handleSubmit = () => {
    if (!chassisNumber.trim()) {
      alert('Please select a chassis number');
      return;
    }
    onSave(chassisNumber);
  };

  return (
    <CModal visible={show} onClose={onClose} alignment="center">
      <CModalHeader>
        <h5 className="modal-title">Allocate Chassis Number</h5>
      </CModalHeader>
      <CModalBody>
        <div className="mb-3">
          <CFormLabel>Model: {booking?.model?.model_name}</CFormLabel>
        </div>
        <div className="mb-3">
          <CFormLabel>Color: {booking?.color?.name}</CFormLabel>
        </div>
        <div className="mb-3">
          <CFormLabel htmlFor="chassisNumber">Available Chassis Numbers</CFormLabel>
          {loadingChassisNumbers ? (
            <div className="text-center">
              <CSpinner size="sm" />
              <span className="ms-2">Loading chassis numbers...</span>
            </div>
          ) : availableChassisNumbers.length > 0 ? (
            <CFormSelect id="chassisNumber" value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} required>
              <option value="">Select a chassis number</option>
              {availableChassisNumbers.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </CFormSelect>
          ) : (
            <div className="text-danger">No chassis numbers available for this model and color combination</div>
          )}
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </CButton>
        <CButton
          color="primary"
          onClick={handleSubmit}
          disabled={isLoading || loadingChassisNumbers || availableChassisNumbers.length === 0}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ChassisNumberModal;
