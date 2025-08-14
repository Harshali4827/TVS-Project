import '../../../css/table.css';
import {
  React,
  useEffect,
  Link,
  SearchOutlinedIcon,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  axiosInstance,
} from 'utils/tableImports';

const InsuranceList = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/insurance-providers`);
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  return (
    <div>
      <h4>Manage Insurance</h4>
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
          <Link to="/add-insurance">
            <button className="new-user-btn">+ New Insurance</button>
          </Link>
        </div>
        <div className="table-responsive">
          <div className="table-wrapper">
            <table className="responsive-table" style={{ overflow: 'auto' }}>
              <thead className="table-header-fixed">
                <tr>
                  <th>Sr.no</th>
                  <th>Customer Name</th>
                  <th>Chassis Number</th>
                  <th>Insurance Date</th>
                  <th>Policy Number</th>
                  <th>PSA Pollicy No</th>
                  <th>CMS Policy No</th>
                  <th>Premium Amount</th>
                  <th>Valid Upto</th>
                  <th>Model</th>
                  <th>Vehicle Reg No</th>
                  <th>Insurance Company</th>
                  <th>MobileNO</th>
                  <th>Payment Mode</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ color: 'red' }}>
                      No insurance provider available
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((branch, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{branch.provider_name}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <button className="action-button">Print</button>
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

export default InsuranceList;
