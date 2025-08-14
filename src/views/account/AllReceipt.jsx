import '../../css/table.css';
import {
  React,
  useEffect,
  SearchOutlinedIcon,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  axiosInstance
} from 'utils/tableImports';

const AllReceipt = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/vouchers`);
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const handleViewPdf = async (id) => {
    try {
      const response = await axiosInstance.get(`/vouchers/receipt/${id}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `receipt_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download receipt. Please try again.');
    }
  };

  return (
    <div>
      <h4>Cash Receipt</h4>
      <div className="table-container">
        <div className="table-header">
          <div className="search-icon-data">
            <input
              type="text"
              placeholder="Search.."
              onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('insurance_provider'))}
            />
            <SearchOutlinedIcon />
          </div>
        </div>
        <div className="table-responsive">
          <div className="table-wrapper">
            <table className="responsive-table" style={{ overflow: 'auto' }}>
              <thead className="table-header-fixed">
                <tr>
                  <th>Sr.no</th>
                  <th>Voucher ID</th>
                  <th>Recipient Name</th>
                  <th>Date</th>
                  <th>Voucher Type</th>
                  <th>Debit</th>
                  <th>Credit</th>
                  <th>Payment Mode</th>
                  <th>Bank Location</th>
                  <th>Cash Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ color: 'red' }}>
                      No cash receipt available
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.voucherId}</td>
                      <td>{item.recipientName}</td>
                      <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-GB') : ''}</td>
                      <td>{item.voucherType}</td>
                      <td>{item.voucherType === 'debit' ? item.amount : 0}</td>
                      <td>{item.voucherType === 'credit' ? item.amount : 0}</td>
                      <td>{item.paymentMode || ''}</td>
                      <td>{item.bankLocation || ''}</td>
                      <td>{item.cashLocation || ''}</td>
                      <td>
                        <button className="action-button" onClick={() => handleViewPdf(item._id)}>
                          VIEW
                        </button>
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
    </div>
  );
};

export default AllReceipt;
