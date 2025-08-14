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
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance,
  FaCheckCircle,
  FaTimesCircle
} from 'utils/tableImports';
import Swal from 'sweetalert2';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload, cilPrint } from '@coreui/icons';
import config from 'config';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import BookingDetails from './BookingDetails';
import ViewBooking from './BookingDetails';

const BookingList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [kycActionLoadingId, setKycActionLoadingId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
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

  const handleUpdateBookingStatus = async (id, action, note) => {
    try {
      setActionLoadingId(id);

      await axiosInstance.post(`/bookings/${id}/${action}`, {
        approvalNote: note
      });

      fetchData();
      showSuccess(`Booking ${action} successfully!`);
    } catch (error) {
      console.log(error);
      // showError(`Failed to ${action} booking`);
      showError(error);
    } finally {
      setActionLoadingId(null);
      handleClose();
    }
  };

  const handleKycStatusUpdate = async (bookingId, status) => {
    try {
      setKycActionLoadingId(bookingId);

      const { value: verificationNote } = await Swal.fire({
        title: `Enter verification note for KYC ${status}`,
        input: 'text',
        inputLabel: 'Verification Note',
        inputPlaceholder: `${status} by admin`,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) {
            return 'Verification note is required!';
          }
        }
      });

      if (verificationNote) {
        const kycId = data.find((booking) => booking.id === bookingId)?.documentStatus?.kyc?.id;
        if (!kycId) {
          throw new Error('KYC ID not found');
        }

        await axiosInstance.post(`/kyc/${kycId}/verify`, {
          status,
          verificationNote
        });

        fetchData();
        showSuccess(`KYC ${status.toLowerCase()} successfully!`);
      }
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || `Failed to update KYC status`);
    } finally {
      setKycActionLoadingId(null);
      handleClose();
    }
  };

  const handleActionWithNote = async (id, action) => {
    const { value: note } = await Swal.fire({
      title: `Enter note for ${action}`,
      input: 'text',
      inputLabel: 'Approval Note',
      inputPlaceholder: `${action} by admin`,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Approval note is required!';
        }
      }
    });

    if (note) {
      handleUpdateBookingStatus(id, action, note);
    }
  };
  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/booking/${id}`);
        setData(data.filter((booking) => booking.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError();
      }
    }
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
                {/* <th>Branch</th>
                <th>Customer Type</th>
                <th>RTO</th>
                <th>RTO Amount</th>
                <th>HPA</th>
                <th>Sales Executive</th>
                <th>Saluation</th> */}
                <th>Fullname</th>
                {/* <th>Address</th> */}
                <th>Contact1</th>
                {/* <th>Contact2</th>
                <th>Exchange Mode</th>
                <th>Exchange Broker</th>
                <th>Payment Type</th>
                <th>Financer Name</th> */}
                <th>Booking Date</th>
                <th>Upload Finance</th>
                <th>Upload KYC</th>
                <th>Status</th>
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
                    <td>{booking._id}</td>
                    <td>{booking.model.model_name}</td>
                    <td>{booking.model.type}</td>
                    <td>{booking.color.name}</td>
                    {/* <td>{booking.branch.name}</td>
                    <td>{booking.customerType}</td>
                    <td>{booking.rto}</td>
                    <td>{booking.rtoAmount}</td>
                    <td>{booking.hpa === true ? 'Yes' : 'No'}</td>
                    <td>{booking.salesExecutive?.name || ''}</td>
                    <td>{booking.customerDetails.salutation}</td> */}
                    <td>{booking.customerDetails.name}</td>
                    {/* <td>
                      {booking.customerDetails.address}, {booking.customerDetails.taluka}, {booking.customerDetails.district},
                      {booking.customerDetails.pincode}
                    </td> */}
                    <td>{booking.customerDetails.mobile1}</td>
                    {/* <td>{booking.customerDetails.mobile2}</td>
                    <td>{booking.exchange === true ? 'Yes' : 'No'}</td>
                    <td>{(booking.exchange && booking.exchangeDetails?.broker?.name) || ''}</td>
                    <td>{booking.payment.type}</td>
                    <td>{booking.payment?.financer?.name || ''}</td> */}
                    <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : 'N/A'}</td>
                    <td>
                      {booking.payment.type === 'FINANCE' && (
                        <>
                          {booking.documentStatus.financeLetter.status === 'NOT_UPLOADED' ? (
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
                          ) : (
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
                        <span className={`status-badge ${booking.documentStatus.kyc.status.toLowerCase()}`}>
                          {booking.documentStatus.kyc.status}
                        </span>
                      )}
                    </td>
                    <td
                      className={`
  ${booking.status === 'DRAFT' && 'bg-gray-100 text-gray-800'}
  ${booking.status === 'PENDING_APPROVAL' && 'bg-blue-100 text-blue-800'}
  ${booking.status === 'APPROVED' && 'bg-green-100 text-green-800'} 
  ${booking.status === 'REJECTED' && 'bg-red-100 text-red-800'}
  ${booking.status === 'COMPLETED' && 'bg-purple-100 text-purple-800'}
  ${booking.status === 'CANCELLED' && 'bg-yellow-100 text-yellow-800'}
  px-3 py-2 rounded-md font-medium
`}
                    >
                      {booking.status}
                    </td>
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
                        <Link className="Link" to={`/booking-form/${booking.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        {booking.status !== 'APPROVED' && (
                          <MenuItem onClick={() => handleActionWithNote(booking.id, 'approve')} disabled={actionLoadingId === booking.id}>
                            {actionLoadingId === booking.id ? 'Approving...' : 'Approve'}
                          </MenuItem>
                        )}
                        {booking.status !== 'REJECTED' && (
                          <MenuItem onClick={() => handleActionWithNote(booking.id, 'reject')} disabled={actionLoadingId === booking.id}>
                            {actionLoadingId === booking.id ? 'Rejecting...' : 'Reject'}
                          </MenuItem>
                        )}
                        {booking.status !== 'COMPLETED' && (
                          <MenuItem onClick={() => handleActionWithNote(booking.id, 'complete')} disabled={actionLoadingId === booking.id}>
                            {actionLoadingId === booking.id ? 'Completing...' : 'Complete'}
                          </MenuItem>
                        )}
                        {booking.status !== 'CANCELLED' && (
                          <MenuItem onClick={() => handleActionWithNote(booking.id, 'cancel')} disabled={actionLoadingId === booking.id}>
                            {actionLoadingId === booking.id ? 'Cancelling...' : 'Cancel'}
                          </MenuItem>
                        )}

                        {booking.documentStatus?.kyc?.status === 'PENDING' && (
                          <>
                            <MenuItem
                              onClick={() => handleKycStatusUpdate(booking.id, 'APPROVED')}
                              disabled={kycActionLoadingId === booking.id}
                            >
                              {kycActionLoadingId === booking.id ? 'Verifying KYC...' : 'Verify KYC'}
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleKycStatusUpdate(booking.id, 'REJECTED')}
                              disabled={kycActionLoadingId === booking.id}
                            >
                              {kycActionLoadingId === booking.id ? 'Rejecting KYC...' : 'Reject KYC'}
                            </MenuItem>
                          </>
                        )}
                        <MenuItem onClick={() => handleDelete(booking.id)}>Delete</MenuItem>

                        <MenuItem onClick={() => handleViewBooking(booking.id)}>View</MenuItem>
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
    </div>
  );
};

export default BookingList;
