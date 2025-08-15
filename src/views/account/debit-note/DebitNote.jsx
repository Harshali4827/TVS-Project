import '../../../css/table.css';
import {
  React,
  useState,
  useEffect,
  SearchOutlinedIcon,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  axiosInstance
} from 'utils/tableImports';
import tvsLogo from '../../../assets/images/logo.png';
import config from 'config';
import AddDebitNote from './AddDebitNote';

const DebitNote = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData || []);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleAddClick = (booking) => {
     console.log('Selected booking:', booking);
    setSelectedBooking(booking);
    setShowModal(true);
  };
  return (
    <div>
      <h4>Debit Note</h4>
    <div className="table-container">
      {error && <div className="error-message">{error}</div>}
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('financer'))} />
          <SearchOutlinedIcon />
        </div>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Booking ID</th>
                <th>Model Name</th>
                <th>Booking Date</th>
                <th>Customer Name</th>
                <th>Chassis Number</th>
                <th>Total</th>
                <th>Received</th>
                <th>Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ color: 'red' }}>
                    No ledger details available
                  </td>
                </tr>
              ) : (
                currentRecords.map((booking, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{booking.bookingNumber}</td>
                    <td>{booking.model?.model_name || ''}</td>
                    <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</td>
                    <td>{booking.customerDetails?.name || ''}</td>
                    <td>{booking.chassisNumber || ''}</td>
                    <td>{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</td>
                    <td>{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</td>
                    <td>{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</td>
                    <td>
                      <button className="action-button" onClick={() => handleAddClick(booking)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <AddDebitNote show={showModal} onClose={() => setShowModal(false)} bookingData={selectedBooking} />
        </div>
      </div>
      <PaginationOptions />
    </div>
    </div>
  );
};

export default DebitNote;
