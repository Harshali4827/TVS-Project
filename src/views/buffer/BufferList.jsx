import {
  CFormSwitch,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormTextarea,
  CFormInput
} from '@coreui/react';
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

const BufferList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);

  // Modals state
  const [unfreezeModalVisible, setUnfreezeModalVisible] = useState(false);
  const [extendTimeModalVisible, setExtendTimeModalVisible] = useState(false);

  // Selected user
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Form states
  const [unfreezeReason, setUnfreezeReason] = useState('');
  const [extendTimeData, setExtendTimeData] = useState({
    additionalHours: 24,
    reason: ''
  });

  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/users/frozen-sales-executives`);
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  // Action menu handlers
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  // Unfreeze handlers
  const handleUnfreezeClick = (userId) => {
    setSelectedUserId(userId);
    setUnfreezeModalVisible(true);
  };

  const confirmUnfreeze = async () => {
    if (!unfreezeReason.trim()) {
      showError('Please enter a reason for unfreezing');
      return;
    }

    try {
      await axiosInstance.post(`/users/${selectedUserId}/unfreeze`, {
        userId: selectedUserId,
        reason: unfreezeReason
      });

      updateUserStatus(selectedUserId, false);
      showSuccess('User unfrozen successfully');
      setUnfreezeModalVisible(false);
      setUnfreezeReason('');
      fetchData();
    } catch (error) {
      console.error('Error unfreezing user:', error);
      showError('Failed to unfreeze user');
    }
  };

  // Extend time handlers
  const handleExtendTimeClick = (userId) => {
    setSelectedUserId(userId);
    setExtendTimeModalVisible(true);
  };

  const confirmExtendTime = async () => {
    if (!extendTimeData.reason.trim()) {
      showError('Please enter a reason for extending time');
      return;
    }

    if (extendTimeData.additionalHours <= 0) {
      showError('Additional hours must be greater than 0');
      return;
    }

    try {
      await axiosInstance.post(`/users/${selectedUserId}/extend-deadline`, {
        additionalHours: extendTimeData.additionalHours,
        reason: extendTimeData.reason
      });

      showSuccess('Buffer time extended successfully');
      setExtendTimeModalVisible(false);
      setExtendTimeData({ additionalHours: 24, reason: '' });
      fetchData();
    } catch (error) {
      console.error('Error extending buffer time:', error);
      showError('Failed to extend buffer time');
    }
  };

  // Helper functions
  const updateUserStatus = (userId, isFrozen) => {
    const updateFn = (user) => (user.id === userId ? { ...user, isFrozen } : user);
    setData((prev) => prev.map(updateFn));
    setFilteredData((prev) => prev.map(updateFn));
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="table-container">
      {/* Unfreeze Reason Modal */}
      <CModal visible={unfreezeModalVisible} onClose={() => setUnfreezeModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Unfreeze User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Please provide the reason for unfreezing this user:</p>
          <CFormTextarea
            value={unfreezeReason}
            onChange={(e) => setUnfreezeReason(e.target.value)}
            placeholder="Enter reason (e.g., Documents have been submitted)"
            rows={3}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setUnfreezeModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={confirmUnfreeze}>
            Confirm Unfreeze
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Extend Time Modal */}
      <CModal visible={extendTimeModalVisible} onClose={() => setExtendTimeModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Extend Buffer Time</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Additional Hours</label>
            <CFormInput
              type="number"
              value={extendTimeData.additionalHours}
              onChange={(e) =>
                setExtendTimeData({
                  ...extendTimeData,
                  additionalHours: parseInt(e.target.value) || 0
                })
              }
              min="1"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Reason</label>
            <CFormTextarea
              value={extendTimeData.reason}
              onChange={(e) =>
                setExtendTimeData({
                  ...extendTimeData,
                  reason: e.target.value
                })
              }
              placeholder="Additional time needed for document collection"
              rows={3}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setExtendTimeModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={confirmExtendTime}>
            Extend Time
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Table UI remains the same */}
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('user'))} />
          <SearchOutlinedIcon />
        </div>
      </div>

      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table">
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Branch</th>
                <th>Frozen</th>
                <th>Buffer Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ color: 'red' }}>
                    No frozen users available
                  </td>
                </tr>
              ) : (
                currentRecords.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>{user.branchDetails?.name || 'N/A'}</td>
                    <td>{user.isFrozen ? <FaCheckCircle style={{ color: 'red' }} /> : <FaTimesCircle style={{ color: 'green' }} />}</td>
                    <td>{formatDate(user.documentBufferTime)}</td>
                    <td>
                      <button className="action-button" onClick={(e) => handleClick(e, user.id)}>
                        Action
                      </button>
                      <Menu anchorEl={anchorEl} open={menuId === user.id} onClose={handleClose}>
                        <MenuItem onClick={() => handleUnfreezeClick(user.id)}>Unfreeze</MenuItem>
                        <MenuItem onClick={() => handleExtendTimeClick(user.id)}>Extend Time</MenuItem>
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

export default BufferList;
