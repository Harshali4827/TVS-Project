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
  axiosInstance
} from 'utils/tableImports';
import QRCode from 'react-qr-code';
import * as XLSX from 'xlsx';
import '../../css/importCsv.css';
import ImportCSV from 'views/csv/ImportCSV';
import ImportInwardCSV from 'views/csv/ImportInwardCSV';
const InventoryList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');

  useEffect(() => {
    fetchData();
    fetchBranches();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/vehicles`);
      setData(response.data.data.vehicles);
      setFilteredData(response.data.data.vehicles);
      console.log(response.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      console.log('Error fetching branches', error);
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
        await axiosInstance.delete(`/vehicles/${id}`);
        setData(data.filter((vehicle) => vehicle.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/vehicles/${id}/status`, {
        status: newStatus
      });
      fetchData();
    } catch (error) {
      console.log('Error updating status:', error);
      showError(error);
    } finally {
      handleClose();
    }
  };

  // Import CSV function
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      // Process the imported data here
      console.log(jsonData);
      // You might want to send this data to your API or merge with existing data
    };

    reader.readAsArrayBuffer(file);
  };
  const handleImportSuccess = () => {
    fetchData(selectedBranchId);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('inward'))} />
          <SearchOutlinedIcon />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="new-user-btn" onClick={() => setCsvDialogOpen(true)}>
            Export CSV
          </button>
          <ImportInwardCSV endpoint="/vehicles/import-csv" onSuccess={handleImportSuccess} buttonText="Import CSV" />
          <Link to="/inward-stock">
            <button className="new-user-btn">+ New Stock</button>
          </Link>
        </div>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Unload Location</th>
                <th>Inward Date</th>
                <th>Type</th>
                <th>Vehicle Model</th>
                <th>Color</th>
                <th>Battery No</th>
                <th>Key No</th>
                <th>Chassis No</th>
                <th>Engine No</th>
                <th>Motor No</th>
                <th>Charger No</th>
                <th>QR Code</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="15" style={{ color: 'red' }}>
                    No inward details available
                  </td>
                </tr>
              ) : (
                currentRecords.map((vehicle, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{vehicle.unloadLocation?.name || ''}</td>
                    <td>{new Date(vehicle.createdAt).toLocaleDateString()}</td>
                    <td>{vehicle.type}</td>
                    <td>{vehicle.modelName || ''}</td>
                    <td>{vehicle.color?.name || vehicle.color?.id}</td>
                    <td>{vehicle.batteryNumber}</td>
                    <td>{vehicle.keyNumber}</td>
                    <td>{vehicle.chassisNumber}</td>
                    <td>{vehicle.engineNumber}</td>
                    <td>{vehicle.motorNumber}</td>
                    <td>{vehicle.chargerNumber}</td>
                    <td>
                      {vehicle.qrCode ? <QRCode value={vehicle.qrCode} size={50} bgColor="#FFFFFF" fgColor="#000000" level="H" /> : 'N/A'}
                    </td>
                    <td>
                      {/* {vehicle.status} */}
                       <span className={`status-badge ${vehicle.status.toLowerCase()}`}>{vehicle.status}</span>
                    </td>
                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, vehicle.id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${vehicle.id}`} anchorEl={anchorEl} open={menuId === vehicle.id} onClose={handleClose}>
                        <Link className="Link" to={`/update-inward/${vehicle.id}`}>
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(vehicle.id)}>Delete</MenuItem>
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
      {csvDialogOpen && (
        <div className="modal-backdrop">
          <div className="header-modal-content">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
            >
              <option value="">-- Select Model Type --</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </select>

            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
            >
              <option value="">-- Select Branch --</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setCsvDialogOpen(false)} className="custom-modal-button custom-modal-button-cancel">
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!selectedType) {
                    showError('Please select a type.');
                    return;
                  }
                  if (!selectedBranchId) {
                    showError('Please select a branch.');
                    return;
                  }
                  try {
                    const response = await axiosInstance.get(`/vehicles/export-csv?&type=${selectedType}&branch_id=${selectedBranchId}`, {
                      responseType: 'blob'
                    });

                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `exported_data_${selectedType}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    setCsvDialogOpen(false);
                    setSelectedType('');
                    setSelectedBranchId('');
                  } catch (error) {
                    console.error('CSV export failed:', error);
                    showError('Failed to export CSV.');
                    setCsvDialogOpen(false);
                  }
                }}
                className="custom-modal-button custom-modal-button-confirm"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
