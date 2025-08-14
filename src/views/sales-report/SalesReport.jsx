import '../../css/table.css';
import '../../css/salesReport.css';
import { React, useState, useEffect, SearchOutlinedIcon, useTableFilter, usePagination, axiosInstance } from 'utils/tableImports';

const SalesReport = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/bookings/stats`);
      setStats(response.data.data.counts);
      setData(response.data.data.salesExecutiveStats);
      setFilteredData(response.data.data.salesExecutiveStats);
    } catch (error) {
      console.log('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="stats-container">
              <div className="stat-card">
                <h3>Today</h3>
                <p>{stats.today}</p>
              </div>
              <div className="stat-card">
                <h3>This Week</h3>
                <p>{stats.thisWeek}</p>
              </div>
              <div className="stat-card">
                <h3>This Month</h3>
                <p>{stats.thisMonth}</p>
              </div>
            </div>

            <div className="table-header">
              <div className="search-icon-data">
                <input type="text" placeholder="Search by name..." onChange={(e) => handleFilter(e.target.value, ['salesExecutiveName'])} />
                <SearchOutlinedIcon />
              </div>
            </div>

            <div className="table-responsive">
              <div className="table-wrapper">
                <table className="responsive-table" style={{ overflow: 'auto' }}>
                  <thead className="table-header-fixed">
                    <tr>
                      <th>Sr.no</th>
                      <th>Sales Executive</th>
                      <th>Email</th>
                      <th>Bookings Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ color: 'red' }}>
                          No sales executives found
                        </td>
                      </tr>
                    ) : (
                      currentRecords.map((executive, index) => (
                        <tr key={executive.salesExecutiveId}>
                          <td>{index + 1}</td>
                          <td>{executive.salesExecutiveName}</td>
                          <td>{executive.salesExecutiveEmail}</td>
                          <td>{executive.count}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* <PaginationOptions /> */}
          </>
        )}
      </div>
    </div>
  );
};

export default SalesReport;
