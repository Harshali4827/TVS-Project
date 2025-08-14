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

const RtoList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData || []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/rtos`);
      setData(response.data?.data || []);
      setFilteredData(response.data?.data || []);
    } catch (error) {
      console.log('Error fetching data', error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
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

  const handleToggleRtoStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      await axiosInstance.patch(`/rtos/${id}/status`, {
        is_active: newStatus
      });
      fetchData();
    } catch (error) {
      console.error('Error updating RTO status:', error);
      showError('Failed to update RTO status', error);
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/rtos/${id}`);
        setData(data.filter((rto) => rto?.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('rto'))} />
          <SearchOutlinedIcon />
        </div>
        <Link to="/rto/add-rto">
          <button className="new-user-btn">+ New RTO</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>RTO Code</th>
                <th>RTO Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!currentRecords?.length ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red' }}>
                    No RTO details are available
                  </td>
                </tr>
              ) : (
                currentRecords.map((rto, index) => (
                  <tr key={rto?.id || index}>
                    <td>{index + 1}</td>
                    <td>{rto?.rto_code || ''}</td>
                    <td>{rto?.rto_name || ''}</td>
                    <td>
                      <CFormSwitch checked={rto.is_active} onChange={() => handleToggleRtoStatus(rto.id, rto.is_active)} />
                    </td>

                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, rto?.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${rto?.id}`} anchorEl={anchorEl} open={menuId === rto?.id} onClose={handleClose}>
                        <Link className="Link" to={`/rto/update-rto/${rto?.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(rto?.id)}>Delete</MenuItem>
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

export default RtoList;
