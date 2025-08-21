// import { 
// CModal, CModalHeader, CModalTitle, CModalBody, 
//   CModalFooter, CButton, CFormSelect, CFormInput, CFormLabel 
// } from '@coreui/react';
// import '../../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   Menu,
//   MenuItem,
//   SearchOutlinedIcon,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance
// } from 'utils/tableImports';

// // Import icons (you may need to install these or use your own)
// import FilterListIcon from '@mui/icons-material/FilterList';
// import ClearIcon from '@mui/icons-material/Clear';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import FileUploadIcon from '@mui/icons-material/FileUpload';
// import AddIcon from '@mui/icons-material/Add';

// const CommissionList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [exportModalVisible, setExportModalVisible] = useState(false);
//   const [importModalVisible, setImportModalVisible] = useState(false);
//   const [filterModalVisible, setFilterModalVisible] = useState(false);
//   const [subdealers, setSubdealers] = useState([]);
//   const [selectedSubdealer, setSelectedSubdealer] = useState('');
//   const [selectedModelType, setSelectedModelType] = useState('');
//   const [importSubdealer, setImportSubdealer] = useState('');
//   const [importModelType, setImportModelType] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [commissionData, setCommissionData] = useState([]);
//   const [isFilterApplied, setIsFilterApplied] = useState(false);
//   const [selectedSubdealerName, setSelectedSubdealerName] = useState('');
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const { currentRecords, PaginationOptions } = usePagination(filteredData);

//   useEffect(() => {
//     fetchSubdealers();
//   }, []);

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealers`);
//       setSubdealers(response.data.data.subdealers || []);
//     } catch (error) {
//       console.log('Error fetching subdealers', error);
//       showError('Failed to load subdealers');
//     }
//   };

//   const fetchCommissionData = async (subdealerId) => {
//     try {
//       const response = await axiosInstance.get(`/commission-master/subdealer/${subdealerId}`);
//       setCommissionData(response.data.data.commission_masters || []);
//       setFilteredData(response.data.data.commission_masters || []);
//       setIsFilterApplied(true);
//       setFilterModalVisible(false);
      
//       // Set the selected subdealer name for display
//       const selected = subdealers.find(s => s._id === subdealerId);
//       if (selected) {
//         setSelectedSubdealerName(selected.name || selected.companyName || selected.email);
//       }
//     } catch (error) {
//       console.log('Error fetching commission data', error);
//       showError('Failed to load commission details');
//     }
//   };

//   const handleApplyFilter = () => {
//     if (!selectedSubdealer) {
//       showError('Please select a subdealer');
//       return;
//     }
//     fetchCommissionData(selectedSubdealer);
//   };

//   const handleClearFilter = () => {
//     setSelectedSubdealer('');
//     setSelectedSubdealerName('');
//     setCommissionData([]);
//     setFilteredData([]);
//     setIsFilterApplied(false);
//   };

//   const handleExportCSV = async () => {
//     if (!selectedSubdealer || !selectedModelType) {
//       showError('Please select both subdealer and model type');
//       return;
//     }

//     try {
//       const response = await axiosInstance.get(
//         `/commission-master/export-template?subdealer_id=${selectedSubdealer}&model_type=${selectedModelType}`,
//         {
//           responseType: 'blob'
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `commission_template_${selectedModelType}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       setExportModalVisible(false);
//       setSelectedSubdealer('');
//       setSelectedModelType('');
//       showSuccess('CSV template downloaded successfully');
//     } catch (error) {
//       console.error('Error exporting CSV:', error);
//       showError('Failed to download CSV template');
//     }
//   };

//   const handleImportCSV = async () => {
//     if (!importSubdealer || !importModelType || !selectedFile) {
//       showError('Please select subdealer, model type, and choose a file');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('file', selectedFile);
//       formData.append('subdealer_id', importSubdealer);
//       formData.append('model_type', importModelType);
      
//       const response = await axiosInstance.post(
//         `/commission-master/import`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           }
//         }
//       );

//       setImportModalVisible(false);
//       setImportSubdealer('');
//       setImportModelType('');
//       setSelectedFile(null);
      
//       showSuccess('CSV imported successfully');
      
//       // Refresh the data if we're currently viewing the same subdealer
//       if (isFilterApplied && importSubdealer === selectedSubdealer) {
//         fetchCommissionData(selectedSubdealer);
//       }
//     } catch (error) {
//       console.error('Error importing CSV:', error);
//       showError('Failed to import CSV');
//     }
//   };

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleDelete = async (id) => {
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/commission-master/${id}`);
//         // Refresh the commission data
//         if (isFilterApplied && selectedSubdealer) {
//           fetchCommissionData(selectedSubdealer);
//         }
//         showSuccess();
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };
  
//   return (
//     <div>
//       <h4>
//         {isFilterApplied ? `Subdealer Commission - ${selectedSubdealerName}` : 'Subdealer Commission'}
//       </h4>
//       <div className="table-container">
//         <div className="table-header">
//           <div className="search-icon-data">
//             <input
//               type="text"
//               placeholder="Search.."
//               onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('insurance_provider'))}
//             />
//             <SearchOutlinedIcon />
//           </div>
//           <div className="button-group">
//             <button className="filter-btn icon-btn" onClick={() => setFilterModalVisible(true)} title="Filter">
//               <FilterListIcon /> Filter
//             </button>
//             {isFilterApplied && (
//               <button className="clear-filter-btn icon-btn" onClick={handleClearFilter} title="Clear Filter">
//                 <ClearIcon /> Clear
//               </button>
//             )}
//             <button className="import-csv-btn icon-btn" onClick={() => setImportModalVisible(true)} title="Import CSV">
//               <FileUploadIcon /> Import
//             </button>
//             <button className="export-csv-btn icon-btn" onClick={() => setExportModalVisible(true)} title="Export CSV">
//               <FileDownloadIcon /> Export
//             </button>
//             <Link to="/subdealer/add-commission">
//               <button className="new-user-btn icon-btn" title="Add New Commission">
//                 <AddIcon /> New Commission
//               </button>
//             </Link>
//           </div>
//         </div>
        
//         {!isFilterApplied ? (
//           <div className="no-filter-message">
//             <p>Please apply a filter to view commission data</p>
//           </div>
//         ) : (
//           <div className="table-responsive">
//             <div className="table-wrapper">
//               <table className="responsive-table" style={{ overflow: 'auto' }}>
//                 <thead className="table-header-fixed">
//                   <tr>
//                     <th>Sr.no</th>
//                     <th>Model Name</th>
//                     <th>Type</th>
//                     <th>Commission Rates</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentRecords.length === 0 ? (
//                     <tr>
//                       <td colSpan={5} style={{ color: 'red' }}>
//                         No commission data available for this subdealer
//                       </td>
//                     </tr>
//                   ) : (
//                     currentRecords.map((item, index) => (
//                       <tr key={index}>
//                         <td>{index + 1}</td>
//                         <td>{item.model_details?.display_name || 'N/A'}</td>
//                         <td>{item.model_details?.type || 'N/A'}</td>
//                         <td>
//                           {item.commission_rates && item.commission_rates.length > 0 ? (
//                             <details>
//                               <summary>View Rates ({item.commission_rates.length})</summary>
//                               <div style={{maxHeight: '200px', overflow: 'auto'}}>
//                                 {item.commission_rates.map((rate, idx) => (
//                                   <div key={idx} style={{padding: '5px', borderBottom: '1px solid #eee'}}>
//                                     <strong>{rate.header_id?.header_key || 'N/A'}:</strong> {rate.commission_rate}%
//                                   </div>
//                                 ))}
//                               </div>
//                             </details>
//                           ) : 'No rates'}
//                         </td>
//                         <td>
//                           <button className="action-button" onClick={(event) => handleClick(event, item.id)}>
//                             Action
//                           </button>
//                           <Menu id={`action-menu-${item.id}`} anchorEl={anchorEl} open={menuId === item.id} onClose={handleClose}>
//                             <Link className="Link" to={`/insurance-provider/update-provider/${item.id}`}>
//                               <MenuItem>Edit</MenuItem>
//                             </Link>
//                             <MenuItem onClick={() => handleDelete(item.id)}>Delete</MenuItem>
//                           </Menu>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             <PaginationOptions />
//           </div>
//         )}
//       </div>

//       <CModal visible={filterModalVisible} onClose={() => setFilterModalVisible(false)}>
//         <CModalHeader onClose={() => setFilterModalVisible(false)}>
//           <CModalTitle>Filter by Subdealer</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel htmlFor="subdealerFilterSelect">Select Subdealer</CFormLabel>
//             <CFormSelect
//               id="subdealerFilterSelect"
//               value={selectedSubdealer}
//               onChange={(e) => setSelectedSubdealer(e.target.value)}
//             >
//               <option value="">Select Subdealer</option>
//               {subdealers.map((subdealer) => (
//                 <option key={subdealer._id} value={subdealer._id}>
//                   {subdealer.name || subdealer.companyName || subdealer.email}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setFilterModalVisible(false)}>
//             Cancel
//           </CButton>
//           <CButton color="primary" onClick={handleApplyFilter}>
//             Apply Filter
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <CModal visible={exportModalVisible} onClose={() => setExportModalVisible(false)}>
//         <CModalHeader onClose={() => setExportModalVisible(false)}>
//           <CModalTitle>Export Commission Template</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel htmlFor="subdealerSelect">Select Subdealer</CFormLabel>
//             <CFormSelect
//               id="subdealerSelect"
//               value={selectedSubdealer}
//               onChange={(e) => setSelectedSubdealer(e.target.value)}
//             >
//               <option value="">Select Subdealer</option>
//               {subdealers.map((subdealer) => (
//                 <option key={subdealer._id} value={subdealer._id}>
//                   {subdealer.name || subdealer.companyName || subdealer.email}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>
//           <div className="mb-3">
//             <CFormLabel htmlFor="modelTypeSelect">Select Model Type</CFormLabel>
//             <CFormSelect
//               id="modelTypeSelect"
//               value={selectedModelType}
//               onChange={(e) => setSelectedModelType(e.target.value)}
//             >
//               <option value="">Select Model Type</option>
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setExportModalVisible(false)}>
//             Cancel
//           </CButton>
//           <CButton color="primary" onClick={handleExportCSV}>
//             Generate CSV
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Import Modal */}
//       <CModal visible={importModalVisible} onClose={() => setImportModalVisible(false)}>
//         <CModalHeader onClose={() => setImportModalVisible(false)}>
//           <CModalTitle>Import Commission Data</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel htmlFor="importSubdealerSelect">Select Subdealer</CFormLabel>
//             <CFormSelect
//               id="importSubdealerSelect"
//               value={importSubdealer}
//               onChange={(e) => setImportSubdealer(e.target.value)}
//             >
//               <option value="">Select Subdealer</option>
//               {subdealers.map((subdealer) => (
//                 <option key={subdealer._id} value={subdealer._id}>
//                   {subdealer.name || subdealer.companyName || subdealer.email}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>
//           <div className="mb-3">
//             <CFormLabel htmlFor="importModelTypeSelect">Select Model Type</CFormLabel>
//             <CFormSelect
//               id="importModelTypeSelect"
//               value={importModelType}
//               onChange={(e) => setImportModelType(e.target.value)}
//             >
//               <option value="">Select Model Type</option>
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </CFormSelect>
//           </div>
//           <div className="mb-3">
//             <CFormLabel htmlFor="fileInput">Select CSV File</CFormLabel>
//             <CFormInput
//               type="file"
//               id="fileInput"
//               accept=".csv"
//               onChange={handleFileChange}
//             />
//             {selectedFile && (
//               <div className="mt-2 text-muted">
//                 Selected file: {selectedFile.name}
//               </div>
//             )}
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setImportModalVisible(false)}>
//             Cancel
//           </CButton>
//           <CButton color="primary" onClick={handleImportCSV}>
//             Import CSV
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default CommissionList;




import { 
  CModal, CModalHeader, CModalTitle, CModalBody, 
  CModalFooter, CButton, CFormSelect, CFormInput, CFormLabel,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell
} from '@coreui/react';
import '../../../css/table.css';
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

import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';

const CommissionList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [subdealers, setSubdealers] = useState([]);
  const [selectedSubdealer, setSelectedSubdealer] = useState('');
  const [selectedModelType, setSelectedModelType] = useState('');
  const [importSubdealer, setImportSubdealer] = useState('');
  const [importModelType, setImportModelType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [commissionData, setCommissionData] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedSubdealerName, setSelectedSubdealerName] = useState('');
  const [priceHeaders, setPriceHeaders] = useState([]);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchSubdealers();
  }, []);

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get(`/subdealers`);
      setSubdealers(response.data.data.subdealers || []);
    } catch (error) {
      console.log('Error fetching subdealers', error);
      showError('Failed to load subdealers');
    }
  };

  const fetchCommissionData = async (subdealerId) => {
    try {
      const response = await axiosInstance.get(`/commission-master/subdealer/${subdealerId}`);
      const commissionData = response.data.data.commission_masters || [];
      setCommissionData(commissionData);
      setFilteredData(commissionData);
      setIsFilterApplied(true);
      setFilterModalVisible(false);
      
      // Extract all price headers from commission data
      const headers = [];
      const headerMap = new Map();
      
      commissionData.forEach(commission => {
        if (commission.commission_rates) {
          commission.commission_rates.forEach(rate => {
            if (rate.header_id && !headerMap.has(rate.header_id._id)) {
              headerMap.set(rate.header_id._id, rate.header_id);
              headers.push(rate.header_id);
            }
          });
        }
      });
      
      setPriceHeaders(headers);
      
      // Set the selected subdealer name for display
      const selected = subdealers.find(s => s._id === subdealerId);
      if (selected) {
        setSelectedSubdealerName(selected.name || selected.companyName || selected.email);
      }
    } catch (error) {
      console.log('Error fetching commission data', error);
      showError('Failed to load commission details');
    }
  };

  const handleApplyFilter = () => {
    if (!selectedSubdealer) {
      showError('Please select a subdealer');
      return;
    }
    fetchCommissionData(selectedSubdealer);
  };

  const handleClearFilter = () => {
    setSelectedSubdealer('');
    setSelectedSubdealerName('');
    setCommissionData([]);
    setFilteredData([]);
    setPriceHeaders([]);
    setIsFilterApplied(false);
  };

  const handleExportCSV = async () => {
    if (!selectedSubdealer || !selectedModelType) {
      showError('Please select both subdealer and model type');
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/commission-master/export-template?subdealer_id=${selectedSubdealer}&model_type=${selectedModelType}`,
        {
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `commission_template_${selectedModelType}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setExportModalVisible(false);
      setSelectedSubdealer('');
      setSelectedModelType('');
      showSuccess('CSV template downloaded successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showError('Failed to download CSV template');
    }
  };

  const handleImportCSV = async () => {
    if (!importSubdealer || !importModelType || !selectedFile) {
      showError('Please select subdealer, model type, and choose a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('subdealer_id', importSubdealer);
      formData.append('model_type', importModelType);
      
      const response = await axiosInstance.post(
        `/commission-master/import`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      setImportModalVisible(false);
      setImportSubdealer('');
      setImportModelType('');
      setSelectedFile(null);
      
      showSuccess('CSV imported successfully');
      
      // Refresh the data if we're currently viewing the same subdealer
      if (isFilterApplied && importSubdealer === selectedSubdealer) {
        fetchCommissionData(selectedSubdealer);
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
      showError('Failed to import CSV');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
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
        await axiosInstance.delete(`/commission-master/${id}`);
        // Refresh the commission data
        if (isFilterApplied && selectedSubdealer) {
          fetchCommissionData(selectedSubdealer);
        }
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };
  
  // Find commission rate for a specific model and header
  const findCommissionRate = (modelId, headerId) => {
    const commission = commissionData.find(c => c.model_id === modelId);
    if (!commission || !commission.commission_rates) return '-';
    
    const rate = commission.commission_rates.find(r => 
      r.header_id && r.header_id._id === headerId
    );
    return rate ? `${rate.commission_rate}%` : '-';
  };
  
  return (
    <div>
      <h4>
        {isFilterApplied ? `Subdealer Commission - ${selectedSubdealerName}` : 'Subdealer Commission'}
      </h4>
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
          <div className="button-group">
            <button className="filter-btn icon-btn" onClick={() => setFilterModalVisible(true)} title="Filter">
              <FilterListIcon /> Filter
            </button>
            {isFilterApplied && (
              <button className="clear-filter-btn icon-btn" onClick={handleClearFilter} title="Clear Filter">
                <ClearIcon /> Clear
              </button>
            )}
            <button className="import-csv-btn icon-btn" onClick={() => setImportModalVisible(true)} title="Import CSV">
              <FileUploadIcon /> Import
            </button>
            <button className="export-csv-btn icon-btn" onClick={() => setExportModalVisible(true)} title="Export CSV">
              <FileDownloadIcon /> Export
            </button>
            <Link to="/subdealer/add-commission">
              <button className="new-user-btn icon-btn" title="Add New Commission">
                <AddIcon />
              </button>
            </Link>
          </div>
        </div>
        
        {!isFilterApplied ? (
          <div className="no-filter-message">
            <p>Please apply a filter to view commission data</p>
          </div>
        ) : (
          <div className="table-responsive">
            {priceHeaders.length > 0 ? (
              <div className="table-wrapper">
                <CTable striped responsive className="responsive-table" style={{ overflow: 'auto' }}>
                  <CTableHead className="table-header-fixed">
                    <CTableRow>
                      <CTableHeaderCell>Model Name</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      {priceHeaders.map(header => (
                        <CTableHeaderCell key={header._id}>
                          {header.header_key} Commission
                        </CTableHeaderCell>
                      ))}
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentRecords.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={priceHeaders.length + 3} style={{ color: 'red' }}>
                          No commission data available for this subdealer
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      currentRecords.map((item, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{item.model_details?.display_name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{item.model_details?.type || 'N/A'}</CTableDataCell>
                          {priceHeaders.map(header => (
                            <CTableDataCell key={header._id}>
                              {findCommissionRate(item.model_id, header._id)}
                            </CTableDataCell>
                          ))}
                          <CTableDataCell>
                            <button className="action-button" onClick={(event) => handleClick(event, item._id)}>
                              Action
                            </button>
                            <Menu id={`action-menu-${item._id}`} anchorEl={anchorEl} open={menuId === item._id} onClose={handleClose}>
                              <Link className="Link" to={`/subdealer/update-commission/${item._id}`}>
                                <MenuItem>Edit</MenuItem>
                              </Link>
                              <MenuItem onClick={() => handleDelete(item._id)}>Delete</MenuItem>
                            </Menu>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
                <PaginationOptions />
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="responsive-table" style={{ overflow: 'auto' }}>
                  <thead className="table-header-fixed">
                    <tr>
                      <th>Sr.no</th>
                      <th>Model Name</th>
                      <th>Type</th>
                      <th>Commission Rates</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ color: 'red' }}>
                          No commission data available for this subdealer
                        </td>
                      </tr>
                    ) : (
                      currentRecords.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.model_details?.display_name || 'N/A'}</td>
                          <td>{item.model_details?.type || 'N/A'}</td>
                          <td>
                            {item.commission_rates && item.commission_rates.length > 0 ? (
                              <details>
                                <summary>View Rates ({item.commission_rates.length})</summary>
                                <div style={{maxHeight: '200px', overflow: 'auto'}}>
                                  {item.commission_rates.map((rate, idx) => (
                                    <div key={idx} style={{padding: '5px', borderBottom: '1px solid #eee'}}>
                                      <strong>{rate.header_id?.header_key || 'N/A'}:</strong> {rate.commission_rate}%
                                    </div>
                                  ))}
                                </div>
                              </details>
                            ) : 'No rates'}
                          </td>
                          <td>
                            <button className="action-button" onClick={(event) => handleClick(event, item._id)}>
                              Action
                            </button>
                            <Menu id={`action-menu-${item._id}`} anchorEl={anchorEl} open={menuId === item._id} onClose={handleClose}>
                              <Link className="Link" to={`/subdealer/update-commission/${item._id}`}>
                                <MenuItem>Edit</MenuItem>
                              </Link>
                              <MenuItem onClick={() => handleDelete(item._id)}>Delete</MenuItem>
                            </Menu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <PaginationOptions />
              </div>
            )}
          </div>
        )}
      </div>

      <CModal visible={filterModalVisible} onClose={() => setFilterModalVisible(false)}>
        <CModalHeader onClose={() => setFilterModalVisible(false)}>
          <CModalTitle>Filter by Subdealer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel htmlFor="subdealerFilterSelect">Select Subdealer</CFormLabel>
            <CFormSelect
              id="subdealerFilterSelect"
              value={selectedSubdealer}
              onChange={(e) => setSelectedSubdealer(e.target.value)}
            >
              <option value="">Select Subdealer</option>
              {subdealers.map((subdealer) => (
                <option key={subdealer._id} value={subdealer._id}>
                  {subdealer.name || subdealer.companyName || subdealer.email}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setFilterModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleApplyFilter}>
            Apply Filter
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={exportModalVisible} onClose={() => setExportModalVisible(false)}>
        <CModalHeader onClose={() => setExportModalVisible(false)}>
          <CModalTitle>Export Commission Template</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel htmlFor="subdealerSelect">Select Subdealer</CFormLabel>
            <CFormSelect
              id="subdealerSelect"
              value={selectedSubdealer}
              onChange={(e) => setSelectedSubdealer(e.target.value)}
            >
              <option value="">Select Subdealer</option>
              {subdealers.map((subdealer) => (
                <option key={subdealer._id} value={subdealer._id}>
                  {subdealer.name || subdealer.companyName || subdealer.email}
                </option>
              ))}
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="modelTypeSelect">Select Model Type</CFormLabel>
            <CFormSelect
              id="modelTypeSelect"
              value={selectedModelType}
              onChange={(e) => setSelectedModelType(e.target.value)}
            >
              <option value="">Select Model Type</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setExportModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleExportCSV}>
            Generate CSV
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Import Modal */}
      <CModal visible={importModalVisible} onClose={() => setImportModalVisible(false)}>
        <CModalHeader onClose={() => setImportModalVisible(false)}>
          <CModalTitle>Import Commission Data</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel htmlFor="importSubdealerSelect">Select Subdealer</CFormLabel>
            <CFormSelect
              id="importSubdealerSelect"
              value={importSubdealer}
              onChange={(e) => setImportSubdealer(e.target.value)}
            >
              <option value="">Select Subdealer</option>
              {subdealers.map((subdealer) => (
                <option key={subdealer._id} value={subdealer._id}>
                  {subdealer.name || subdealer.companyName || subdealer.email}
                </option>
              ))}
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="importModelTypeSelect">Select Model Type</CFormLabel>
            <CFormSelect
              id="importModelTypeSelect"
              value={importModelType}
              onChange={(e) => setImportModelType(e.target.value)}
            >
              <option value="">Select Model Type</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="fileInput">Select CSV File</CFormLabel>
            <CFormInput
              type="file"
              id="fileInput"
              accept=".csv"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <div className="mt-2 text-muted">
                Selected file: {selectedFile.name}
              </div>
            )}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setImportModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleImportCSV}>
            Import CSV
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default CommissionList;