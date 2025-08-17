import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  SearchOutlinedIcon,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  showError,
  axiosInstance,
  showSuccess
} from 'utils/tableImports';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload, cilPrint } from '@coreui/icons';
import config from 'config';
import ViewBooking from './BookingDetails';
import KYCView from './KYCView';
import FinanceView from './FinanceView';
import ChassisNumberModal from './ChassisModel';

const BookingList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [kycModalVisible, setKycModalVisible] = useState(false);
  const [kycBookingId, setKycBookingId] = useState(null);
  const [kycData, setKycData] = useState(null);
  const [financeModalVisible, setFinanceModalVisible] = useState(false);
  const [financeBookingId, setFinanceBookingId] = useState(null);
  const [financeData, setFinanceData] = useState(null);
  const [showChassisModal, setShowChassisModal] = useState(false);
  const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
  const [chassisLoading, setChassisLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState();
  const [isUpdateChassis, setIsUpdateChassis] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/bookings`);
      setData(response.data.data.bookings);
      setFilteredData(response.data.data.bookings);
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

  const handleViewBooking = async (id) => {
    try {
      const response = await axiosInstance.get(`/bookings/${id}`);
      setSelectedBooking(response.data.data);
      setViewModalVisible(true);
      handleClose();
    } catch (error) {
      console.log('Error fetching booking details', error);
      showError('Failed to fetch booking details');
    }
  };

  const handleViewKYC = async (bookingId) => {
    try {
      console.log('Fetching KYC for booking ID:', bookingId);
      setKycBookingId(bookingId);
      const booking = data.find((b) => b._id === bookingId);
      if (!booking) {
        showError('Booking not found');
        return;
      }
      const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);
      console.log('KYC Response:', response.data);

      const kycDataWithStatus = {
        ...response.data.data,
        status: booking.documentStatus?.kyc?.status || 'PENDING',
        customerName: booking.customerDetails.name,
        address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
      };

      setKycData(kycDataWithStatus);
      setKycModalVisible(true);
      handleClose();
    } catch (error) {
      console.log('Error fetching KYC details', error);
      showError('Failed to fetch KYC details');
    }
  };

  const handleViewFinanceLetter = async (bookingId) => {
    try {
      setActionLoadingId(bookingId);
      setFinanceBookingId(bookingId);

      const booking = data.find((b) => b._id === bookingId);
      if (!booking) {
        showError('Booking not found');
        return;
      }

      const financeDataWithStatus = {
        status: booking.documentStatus?.financeLetter?.status || 'PENDING',
        customerName: booking.customerDetails.name,
        bookingId: booking._id
      };

      setFinanceData(financeDataWithStatus);
      setFinanceModalVisible(true);
      handleClose();
    } catch (error) {
      console.log('Error viewing finance letter', error);
      showError(error.response?.data?.message || 'Failed to view finance letter');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateChassis = (bookingId) => {
    setSelectedBookingForChassis(bookingId);
    setIsUpdateChassis(true);
    setShowChassisModal(true);
    handleClose();
  };

  const handleAllocateChassis = async (bookingId) => {
    setSelectedBookingForChassis(bookingId);
    setShowChassisModal(true);
    handleClose();
  };

  const handleSaveChassisNumber = async (payload) => {
  try {
    setChassisLoading(true);
    const url = isUpdateChassis 
      ? `/bookings/${selectedBookingForChassis}/allocate`
      : `/bookings/${selectedBookingForChassis}/allocate`;
    
    const formData = new FormData();
    formData.append('chassisNumber', payload.chassisNumber);
    
    if (isUpdateChassis) {
      formData.append('reason', payload.reason);
    }
    
    if (payload.claimDetails) {
      formData.append('hasClaim', 'true');
      formData.append('priceClaim', payload.claimDetails.price);
      formData.append('description', payload.claimDetails.description);
      
      payload.claimDetails.documents.forEach((file, index) => {
        formData.append(`documents`, file);
      });
    } else {
      formData.append('hasClaim', 'false');
    }

    await axiosInstance.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    showSuccess(`Chassis number ${isUpdateChassis ? 'updated' : 'allocated'} successfully!`);
    fetchData();
    setShowChassisModal(false);
    setIsUpdateChassis(false);
  } catch (error) {
    console.error(`Error ${isUpdateChassis ? 'updating' : 'allocating'} chassis number:`, error);
    showError(error.response?.data?.message || `Failed to ${isUpdateChassis ? 'update' : 'allocate'} chassis number`);
  } finally {
    setChassisLoading(false);
  }
};
  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('booking'))} />
          <SearchOutlinedIcon />
        </div>
        <Link to="/booking-form">
          <button className="new-user-btn">+ New Booking</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Booking ID</th>
                <th>Model Name</th>
                <th>Type</th>
                <th>Color</th>
                <th>Fullname</th>
                <th>Contact1</th>
                <th>Booking Date</th>
                <th>Upload Finance</th>
                <th>Upload KYC</th>
                <th>Status</th>
                <th>Chassis Number</th>
                <th>Print</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red' }}>
                    No booking available
                  </td>
                </tr>
              ) : (
                currentRecords.map((booking, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{booking.bookingNumber}</td>
                    <td>{booking.model.model_name}</td>
                    <td>{booking.model.type}</td>
                    <td>{booking.color?.name || ''}</td>
                    <td>{booking.customerDetails.name}</td>
                    <td>{booking.customerDetails.mobile1}</td>
                    <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : 'N/A'}</td>

                    <td>
                      {booking.payment.type === 'FINANCE' && (
                        <>
                          {booking.documentStatus.financeLetter.status === 'NOT_UPLOADED' ||
                          booking.documentStatus.financeLetter.status === 'REJECTED' ? (
                            <Link
                              to={`/upload-finance/${booking.id}`}
                              state={{
                                bookingId: booking.id,
                                customerName: booking.customerDetails.name,
                                address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
                              }}
                            >
                              <button className="upload-kyc-btn icon-only">
                                <CIcon icon={cilCloudUpload} />
                              </button>
                            </Link>
                          ) : null}
                          {booking.documentStatus.financeLetter.status !== 'NOT_UPLOADED' && (
                            <span className={`status-badge ${booking.documentStatus.financeLetter.status.toLowerCase()}`}>
                              {booking.documentStatus.financeLetter.status}
                            </span>
                          )}
                        </>
                      )}
                    </td>

                    <td>
                      {booking.documentStatus.kyc.status === 'NOT_UPLOADED' ? (
                        <Link
                          to={`/upload-kyc/${booking.id}`}
                          state={{
                            bookingId: booking.id,
                            customerName: booking.customerDetails.name,
                            address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
                          }}
                        >
                          <button className="upload-kyc-btn icon-only">
                            <CIcon icon={cilCloudUpload} />
                          </button>
                        </Link>
                      ) : (
                        <div className="d-flex align-items-center">
                          <span className={`status-badge ${booking.documentStatus.kyc.status.toLowerCase()}`}>
                            {booking.documentStatus.kyc.status}
                          </span>
                          {booking.documentStatus.kyc.status === 'REJECTED' && (
                            <Link
                              to={`/upload-kyc/${booking.id}`}
                              state={{
                                bookingId: booking.id,
                                customerName: booking.customerDetails.name,
                                address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
                              }}
                              className="ms-2"
                            >
                              <button className="upload-kyc-btn icon-only">
                                <CIcon icon={cilCloudUpload} />
                              </button>
                            </Link>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                    </td>
                    <td>{booking.chassisNumber}</td>
                    <td>
                      {booking.formPath && (
                        <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
                          <button className="upload-kyc-btn icon-only">
                            <CIcon icon={cilPrint} />
                          </button>
                        </a>
                      )}
                    </td>
                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, booking.id)}>
                        Action
                      </button>

                      <Menu id={`action-menu-${booking.id}`} anchorEl={anchorEl} open={menuId === booking.id} onClose={handleClose}>
                        <MenuItem onClick={() => handleViewBooking(booking.id)}>View Booking</MenuItem>
                        <Link className="Link" to={`/booking-form/${booking.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        {booking.payment.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
                          <MenuItem onClick={() => handleViewFinanceLetter(booking._id)}>View Finance Letter</MenuItem>
                        )}
                        {booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && (
                          <MenuItem onClick={() => handleViewKYC(booking.id)}>View KYC</MenuItem>
                        )}

                        {booking.status === 'APPROVED' && (
  (booking.payment?.type === 'CASH' || 
   (booking.payment?.type === 'FINANCE' && 
    booking.documentStatus?.financeLetter?.status == 'APPROVED')) && (
    <MenuItem onClick={() => handleAllocateChassis(booking.id)}>Allocate Chassis</MenuItem>
  )
)}

                         {booking.status === 'ALLOCATED' && (
    <MenuItem onClick={() => handleUpdateChassis(booking.id)}>Update Chassis</MenuItem>
  )}
                      </Menu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <PaginationOptions />
      <ViewBooking open={viewModalVisible} onClose={() => setViewModalVisible(false)} booking={selectedBooking} refreshData={fetchData} />
      <KYCView
        open={kycModalVisible}
        onClose={() => {
          setKycModalVisible(false);
          setKycBookingId(null);
        }}
        kycData={kycData}
        refreshData={fetchData}
        bookingId={kycBookingId}
      />
      <FinanceView
        open={financeModalVisible}
        onClose={() => {
          setFinanceModalVisible(false);
          setFinanceBookingId(null);
        }}
        financeData={financeData}
        refreshData={fetchData}
        bookingId={financeBookingId}
      />
      <ChassisNumberModal
    show={showChassisModal}
    onClose={() => {
      setShowChassisModal(false);
      setIsUpdateChassis(false);
    }}
    onSave={handleSaveChassisNumber}
    isLoading={chassisLoading}
    booking={data.find((b) => b._id === selectedBookingForChassis)}
    isUpdate={isUpdateChassis}
  />
    </div>
  );
};

export default BookingList;
