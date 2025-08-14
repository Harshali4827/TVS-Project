import React, { useState, useEffect } from 'react';
import { CBadge, CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, showError, showSuccess, useTableFilter } from 'utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import Swal from 'sweetalert2';

function StockVerification() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    data: pendingData,
    setData: setPendingData,
    filteredData: filteredPendings,
    setFilteredData: setFilteredPendings,
    handleFilter: handlePendingFilter
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
      const response = await axiosInstance.get('/vehicles/status/not_approved');
      setPendingData(response.data.data.vehicles || []);
      setFilteredPendings(response.data.data.vehicles || []);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const fetchLocationData = async () => {
    try {
      const response = await axiosInstance.get('/vehicles/status/in_stock');
      setApprovedData(response.data.data.vehicles || []);
      setFilteredApproved(response.data.data.vehicles || []);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const handleSelectVehicle = (vehicleId, isChecked) => {
    if (isChecked) {
      setSelectedVehicles([...selectedVehicles, vehicleId]);
    } else {
      setSelectedVehicles(selectedVehicles.filter((id) => id !== vehicleId));
    }
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVehicles(filteredPendings.map((vehicle) => vehicle._id));
    } else {
      setSelectedVehicles([]);
    }
  };
  // const verifyVehicles = async () => {
  //   if (selectedVehicles.length === 0) {
  //     showError('Please select at least one vehicle to verify');
  //     return;
  //   }

  //   setIsVerifying(true);
  //   try {
  //     await axiosInstance.post('/vehicles/approve', {
  //       vehicleIds: selectedVehicles
  //     });

  //     showSuccess('Vehicles verified successfully!');
  //     setSelectedVehicles([]);
  //     fetchData();
  //     fetchLocationData();
  //   } catch (error) {
  //     console.error('Error verifying vehicles:', error);
  //     showError(error);
  //   } finally {
  //     setIsVerifying(false);
  //   }
  // };
  // const handleVerifySingle = async (vehicleId) => {
  //   setIsVerifying(true);
  //   try {
  //     await axiosInstance.post('/vehicles/approve', {
  //       vehicleIds: [vehicleId]
  //     });

  //     showSuccess('Vehicle verified successfully!');
  //     fetchData();
  //     fetchLocationData();
  //   } catch (error) {
  //     console.error('Error verifying vehicle:', error);
  //     showError(error);
  //   } finally {
  //     setIsVerifying(false);
  //   }
  // };
  const verifyVehicles = async () => {
    if (selectedVehicles.length === 0) {
      showError('Please select at least one vehicle to verify');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to verify ${selectedVehicles.length} vehicle(s). This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, verify them!'
    });

    if (!result.isConfirmed) return;

    setIsVerifying(true);
    try {
      await axiosInstance.post('/vehicles/approve', {
        vehicleIds: selectedVehicles
      });

      showSuccess('Vehicles verified successfully!');
      setSelectedVehicles([]);
      fetchData();
      fetchLocationData();
    } catch (error) {
      console.error('Error verifying vehicles:', error);
      showError(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifySingle = async (vehicleId) => {
    const result = await Swal.fire({
      title: 'Confirm Verification',
      html: `Are you sure you want to verify this vehicle?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, verify it!'
    });

    if (!result.isConfirmed) return;

    setIsVerifying(true);
    try {
      await axiosInstance.post('/vehicles/approve', {
        vehicleIds: [vehicleId]
      });

      showSuccess('Vehicle verified successfully!');
      fetchData();
      fetchLocationData();
    } catch (error) {
      console.error('Error verifying vehicle:', error);
      showError(error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <h4>Inward Stock Verification</h4>
      <div className="container-table">
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
              PENDING VERIFICATION
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
              VERIFIED STOCK
            </CNavLink>
          </CNavItem>
        </CNav>

        <CTabContent>
          <CTabPane visible={activeTab === 0} className="p-3">
            <h5>PENDING VERIFICATION REPORT</h5>
            <div className="table-header">
              <div className="search-icon-data">
                <input
                  type="text"
                  placeholder="Search.."
                  onChange={(e) => handlePendingFilter(e.target.value, getDefaultSearchFields('receipts'))}
                />
                <SearchOutlinedIcon />
              </div>
              {selectedVehicles.length > 0 && (
                <button className="btn btn-primary verify-all-btn" onClick={verifyVehicles} disabled={isVerifying}>
                  {isVerifying ? 'Verifying...' : `Verify Selected (${selectedVehicles.length})`}
                </button>
              )}
            </div>
            <div className="table-responsive">
              <div className="table-wrapper">
                <table className="responsive-table" style={{ overflow: 'auto' }}>
                  <thead className="table-header-fixed">
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedVehicles.length === filteredPendings.length && filteredPendings.length > 0}
                        />
                      </th>
                      <th>Sr.no</th>
                      <th>Type</th>
                      <th>Model Name</th>
                      <th>Color</th>
                      <th>Chassis Number</th>
                      <th>Load Location</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPendings.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ color: 'red' }}>
                          No data available
                        </td>
                      </tr>
                    ) : (
                      filteredPendings.map((vehicle, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedVehicles.includes(vehicle._id)}
                              onChange={(e) => handleSelectVehicle(vehicle._id, e.target.checked)}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{vehicle.type}</td>
                          <td>{vehicle.modelName || ''}</td>
                          <td>{vehicle.color?.name || ''}</td>
                          <td>{vehicle.chassisNumber}</td>
                          <td>{vehicle.unloadLocation?.name || ''}</td>
                          <td>
                            <button className="action-button" onClick={() => handleVerifySingle(vehicle._id)} disabled={isVerifying}>
                              {isVerifying ? 'Verifying...' : 'Verify'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CTabPane>

          <CTabPane visible={activeTab === 1} className="p-3">
            <h5>VERIFIED STOCK</h5>
            <div className="table-header">
              <div className="search-icon-data">
                <input type="text" placeholder="Search.." onChange={(e) => handleApprovedFilter(e.target.value, ['branchName'])} />
                <SearchOutlinedIcon />
              </div>
            </div>
            <div className="table-responsive">
              <div className="table-wrapper">
                <table className="responsive-table" style={{ overflow: 'auto' }}>
                  <thead className="table-header-fixed">
                    <tr>
                      <th>Sr.no</th>
                      <th>Type</th>
                      <th>Model Name</th>
                      <th>Color</th>
                      <th>Chassis Number</th>
                      <th>Load Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApproved.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ color: 'red' }}>
                          No data available
                        </td>
                      </tr>
                    ) : (
                      filteredApproved.map((vehicle, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{vehicle.type}</td>
                          <td>{vehicle.modelName || ''}</td>
                          <td>{vehicle.color?.name || ''}</td>
                          <td>{vehicle.chassisNumber}</td>
                          <td>{vehicle.unloadLocation?.name || ''}</td>
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

export default StockVerification;
