import React, { useEffect, useState, useRef } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import '../../css/table.css';
import '../../css/importCsv.css';
import './uploadChallan.css';
import { getDefaultSearchFields, useTableFilter } from 'utils/tableFilters';
import { usePagination } from 'utils/pagination.jsx';
import axiosInstance from 'axiosInstance';
import { confirmDelete, showError, showSuccess } from 'utils/sweetAlerts';

const UploadChallan = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [fileInputs, setFileInputs] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef({});

  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);

  useEffect(() => {
    fetchData();
    fetchBranches();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/transfers`);
      const transfers = response.data.data.transfers || [];
      setData(transfers);
      setFilteredData(transfers);
    
      const inputs = {};
      transfers.forEach(transfer => {
        inputs[transfer._id] = null;
      });
      setFileInputs(inputs);
    } catch (error) {
      console.log('Error fetching data', error);
      showError(error.response?.data?.message || 'Failed to fetch transfers');
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      console.log('Error fetching branches', error);
      showError(error.response?.data?.message || 'Failed to fetch branches');
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
        await axiosInstance.delete(`/transfers/${id}`);
        setData(data.filter((transfer) => transfer._id !== id));
        showSuccess('Transfer deleted successfully!');
      } catch (error) {
        console.log(error);
        showError(error.response?.data?.message || 'Failed to delete transfer');
      }
    }
  };

  const handleFileChange = (transferId, e) => {
    setFileInputs(prev => ({
      ...prev,
      [transferId]: e.target.files[0]
    }));
  };

  const handleUploadClick = (transferId) => {
    fileInputRef.current[transferId]?.click();
  };

  const handleUpload = async (transferId) => {
    if (!fileInputs[transferId]) {
      showError('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('challan', fileInputs[transferId]);

      await axiosInstance.post(`/transfers/${transferId}/challan`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      showSuccess('Challan uploaded successfully!');
      fetchData(); 
    } catch (error) {
      console.error('Error uploading challan:', error);
      showError(error.response?.data?.message || 'Failed to upload challan');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h4>Upload Stock Transfer Challan</h4>
    <div className="table-container">
      <div className="table-transfer">
        <div className="search-icon-data">
          <input 
            type="text" 
            placeholder="Search.." 
            onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('transfers'))} 
          />
          <SearchOutlinedIcon />
        </div>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-transfer-fixed">
              <tr>
                <th>Sr.no</th>
                <th>From Branch</th>
                <th>To Branch</th>
                <th>Transfer Date</th>
                <th>Model</th>
                <th>Color</th>
                <th>Chassis Number</th>
                <th>Challan Status</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="9">No transfers available</td>
                </tr>
              ) : (
                currentRecords.map((transfer, index) => (
                  <>
                    <tr key={`transfer-${index}`}>
                      <td rowSpan={transfer.items?.length + 1 || 1}>{index + 1}</td>
                      <td rowSpan={transfer.items?.length + 1 || 1}>{transfer.fromBranchDetails?.name || 'N/A'}</td>
                      <td rowSpan={transfer.items?.length + 1 || 1}>{transfer.toBranchDetails?.name || 'N/A'}</td>
                      <td rowSpan={transfer.items?.length + 1 || 1}>
                        {transfer.transferDate ? new Date(transfer.transferDate).toLocaleDateString('en-GB') : 'N/A'}
                      </td>
                    </tr>
                    
                    {transfer.items?.map((item, itemIndex) => (
                      <tr key={`item-${index}-${itemIndex}`}>
                        <td>{item.vehicle?.modelName || item.vehicle?.model?.model_name || 'N/A'}</td>
                        <td>{item.vehicle?.color?.name || 'N/A'}</td>
                        <td>{item.vehicle?.chassisNumber || 'N/A'}</td>
                        {itemIndex === 0 && (
                          <td rowSpan={transfer.items.length} style={{ maxWidth: '200px' }}>
                            {transfer.challanStatus === 'pending' ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <input
                                  type="file"
                                  ref={el => fileInputRef.current[transfer._id] = el}
                                  onChange={(e) => handleFileChange(transfer._id, e)}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  style={{ display: 'none' }}
                                />
                                <button
                                  onClick={() => handleUploadClick(transfer._id)}
                                  className="upload-button"
                                  disabled={uploading}
                                >
                                 Upload Challan
                                </button>
                                {fileInputs[transfer._id] && (
                                  <div>
                                    <span>{fileInputs[transfer._id].name}</span>
                                    <button
                                      onClick={() => handleUpload(transfer._id)}
                                      className="action-button primary"
                                      disabled={uploading}
                                    >
                                      {uploading ? 'Uploading...' : 'Upload'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : transfer.challanDocument ? (
                              <div className="document-preview">
                                {transfer.challanDocument.endsWith('.pdf') ? (
                                  <iframe 
                                    src={`${axiosInstance.defaults.baseURL}/${transfer.challanDocument}`}
                                    width="150"
                                    height="100"
                                    style={{ border: 'none' }}
                                    title="Challan Document"
                                  />
                                ) : (
                                  <img 
                                    src={`${axiosInstance.defaults.baseURL}/${transfer.challanDocument}`}
                                    alt="Challan Document"
                                    style={{ maxWidth: '150px', maxHeight: '100px' }}
                                  />
                                )}
                                <a 
                                  href={`${axiosInstance.defaults.baseURL}/${transfer.challanDocument}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="view-full"
                                >
                                  View Full
                                </a>
                              </div>
                            ) : (
                              <span>No Document</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </>
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

export default UploadChallan;