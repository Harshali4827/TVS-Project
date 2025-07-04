import { CFormSwitch } from '@coreui/react';
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

const BookingList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

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
                <th>Model Name</th>
                <th>Type</th>
                <th>Color</th>
                <th>Branch</th>
                <th>Customer Type</th>
                <th>RTO</th>
                <th>RTO Amount</th>
                <th>HPA</th>
                <th>Sales Executive</th>
                <th>Saluation</th>
                <th>Fullname</th>
                <th>Address</th>
                <th>Contact1</th>
                <th>Contact2</th>
                <th>Exchange Mode</th>
                <th>Exchange Broker</th>
                <th>Payment Type</th>
                <th>Financer Name</th>
                <th>Booking Date</th>
                <th>Status</th>
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
                    <td>{booking.model.model_name}</td>
                    <td>{booking.model.type}</td>
                    <td>{booking.color.name}</td>
                    <td>{booking.branch.name}</td>
                    <td>{booking.customerType}</td>
                    <td>{booking.rto}</td>
                    <td>{booking.rtoAmount}</td>
                    <td>{booking.hpa === true ? 'Yes' : 'No'}</td>
                    <td>{booking.sales_executive}</td>
                    <td>{booking.customerDetails.salutation}</td>
                    <td>{booking.customerDetails.name}</td>
                    <td>
                      {booking.customerDetails.address}, {booking.customerDetails.taluka}, {booking.customerDetails.district},
                      {booking.customerDetails.pincode}
                    </td>
                    <td>{booking.customerDetails.mobile1}</td>
                    <td>{booking.customerDetails.mobile2}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
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
                      <button className="action-button" onClick={(event) => handleClick(event, booking.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${booking.id}`} anchorEl={anchorEl} open={menuId === booking.id} onClose={handleClose}>
                        <Link className="Link" to={`/booking/update-booking/${booking.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(booking.id)}>Delete</MenuItem>
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
    </div>
  );
};

export default BookingList;
