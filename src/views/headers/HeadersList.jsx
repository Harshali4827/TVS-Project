// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Menu, MenuItem } from '@mui/material';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// import { faCopy, faFileExcel, faFilePdf, faFileCsv } from '@fortawesome/free-solid-svg-icons';
// import '../../css/table.css';
// import '../../css/importCsv.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { getDefaultSearchFields, useTableFilter } from 'utils/tableFilters';
// import { usePagination } from 'utils/pagination.jsx';
// import { copyToClipboard, exportToExcel, exportToPdf } from 'utils/tableExports';
// import CopyToClipboard from 'react-copy-to-clipboard';
// import axiosInstance from 'axiosInstance';
// import { confirmDelete, showError, showSuccess } from 'utils/sweetAlerts';

// const HeadersList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [csvDialogOpen, setCsvDialogOpen] = useState(false);
//   const [selectedType, setSelectedType] = useState('');
//   const [branches, setBranches] = useState([]);
//   const [selectedBranchId, setSelectedBranchId] = useState('');

//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

//   const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);

//   useEffect(() => {
//     fetchData();
//     fetchBranches();
//   }, []);
//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/headers?sort=priority`);
//       setData(response.data.data.headers);
//       setFilteredData(response.data.data.headers);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };
//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//     } catch (error) {
//       console.log('Error fetching branches', error);
//     }
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
//         await axiosInstance.delete(`/headers/${id}`);
//         setData(data.filter((header) => header.id !== id));
//         fetchData();
//         showSuccess();
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };
//   return (
//     <div className="table-container">
//       <div className="table-header">
//         <div className="search-icon-data">
//           <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('headers'))} />
//           <SearchOutlinedIcon />
//         </div>
//         <div className="buttons">
//           <button className="btn2" title="Export CSV" onClick={() => setCsvDialogOpen(true)}>
//             <FontAwesomeIcon icon={faFileCsv} />
//           </button>
//         </div>
//         <Link to="/headers/add-header">
//           <button className="new-user-btn">+ New Header</button>
//         </Link>
//       </div>
//       <div className="table-responsive">
//         <div className="table-wrapper">
//           <table className="responsive-table" style={{ overflow: 'auto' }}>
//             <thead className="table-header-fixed">
//               <tr>
//                 <th>Sr.no</th>
//                 <th>Name</th>
//                 <th>Category key</th>
//                 <th>Type</th>
//                 <th>Priority number</th>
//                 <th>Page number</th>
//                 <th>HSN code</th>
//                 <th>GST rate</th>
//                 <th>Is Mandatory?</th>
//                 <th>Is Discount?</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentRecords.length === 0 ? (
//                 <tr>
//                   <td colSpan="4">No headers available</td>
//                 </tr>
//               ) : (
//                 currentRecords.map((header, index) => (
//                   <tr key={index}>
//                     <td>{index + 1}</td>
//                     <td>{header.header_key}</td>
//                     <td>{header.category_key}</td>
//                     <td>{header.type}</td>
//                     <td>{header.priority}</td>
//                     <td>{header.metadata?.page_no || ''}</td>
//                     <td>{header.metadata?.hsn_code || ''}</td>
//                     <td>{header.metadata?.gst_rate || ''}</td>
//                     <td>{header.is_mandatory ? 'Yes' : 'No'}</td>
//                     <td>{header.is_discount ? 'Yes' : 'No'}</td>

//                     <td>
//                       <button className="action-button" onClick={(event) => handleClick(event, header._id)}>
//                         Action
//                       </button>
//                       <Menu id={`action-menu-${header._id}`} anchorEl={anchorEl} open={menuId === header._id} onClose={handleClose}>
//                         <Link className="Link" to={`/headers/update-header/${header._id}`}>
//                           <MenuItem style={{ color: 'black' }}>Edit</MenuItem>
//                         </Link>
//                         <MenuItem onClick={() => handleDelete(header._id)}>Delete</MenuItem>
//                       </Menu>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <PaginationOptions />

//       {csvDialogOpen && (
//         <div className="modal-backdrop">
//           <div className="header-modal-content">
//             <select
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value)}
//               style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
//             >
//               <option value="">-- Select Model Type --</option>
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </select>

//             <select
//               value={selectedBranchId}
//               onChange={(e) => setSelectedBranchId(e.target.value)}
//               style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
//             >
//               <option value="">-- Select Branch --</option>
//               {branches.map((branch) => (
//                 <option key={branch._id} value={branch._id}>
//                   {branch.name}
//                 </option>
//               ))}
//             </select>

//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <button onClick={() => setCsvDialogOpen(false)} className="custom-modal-button custom-modal-button-cancel">
//                 Cancel
//               </button>
//               <button
//                 onClick={async () => {
//                   if (!selectedType) {
//                     showError('Please select a type.');
//                     return;
//                   }
//                   if (!selectedBranchId) {
//                     showError('Please select a branch.');
//                     return;
//                   }
//                   try {
//                     const response = await axiosInstance.get(
//                       `/csv/export-template?filled=true&type=${selectedType}&branch_id=${selectedBranchId}`,
//                       { responseType: 'blob' }
//                     );

//                     const url = window.URL.createObjectURL(new Blob([response.data]));
//                     const link = document.createElement('a');
//                     link.href = url;
//                     link.setAttribute('download', `exported_data_${selectedType}.csv`);
//                     document.body.appendChild(link);
//                     link.click();
//                     link.remove();
//                     setCsvDialogOpen(false);
//                     setSelectedType('');
//                     setSelectedBranchId('');
//                   } catch (error) {
//                     console.error('CSV export failed:', error);
//                     showError('Failed to export CSV.');
//                     setCsvDialogOpen(false);
//                   }
//                 }}
//                 className="custom-modal-button custom-modal-button-confirm"
//               >
//                 Export
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HeadersList;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { faCopy, faFileExcel, faFilePdf, faFileCsv } from '@fortawesome/free-solid-svg-icons';
import '../../css/table.css';
import '../../css/importCsv.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDefaultSearchFields, useTableFilter } from 'utils/tableFilters';
import { usePagination } from 'utils/pagination.jsx';
import { copyToClipboard, exportToExcel, exportToPdf } from 'utils/tableExports';
import CopyToClipboard from 'react-copy-to-clipboard';
import axiosInstance from 'axiosInstance';
import { confirmDelete, showError, showSuccess } from 'utils/sweetAlerts';

const HeadersList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [exportTypeDialogOpen, setExportTypeDialogOpen] = useState(false);
  const [selectedModelType, setSelectedModelType] = useState('');
  const [branches, setBranches] = useState([]);
  const [subdealers, setSubdealers] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedSubdealerId, setSelectedSubdealerId] = useState('');
  const [exportTarget, setExportTarget] = useState(''); // 'branch' or 'subdealer'

  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);

  useEffect(() => {
    fetchData();
    fetchBranches();
    fetchSubdealers();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/headers?sort=priority`);
      setData(response.data.data.headers);
      setFilteredData(response.data.data.headers);
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

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get('/subdealers');
      setSubdealers(response.data.data.subdealers || []);
    } catch (error) {
      console.log('Error fetching subdealers', error);
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
        await axiosInstance.delete(`/headers/${id}`);
        setData(data.filter((header) => header.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleExportClick = () => {
    setExportTypeDialogOpen(true);
  };

  const handleExportTypeSelect = (type) => {
    setExportTarget(type);
    setExportTypeDialogOpen(false);
    setCsvDialogOpen(true);
  };

  const handleExportCSV = async () => {
    if (!selectedModelType) {
      showError('Please select a model type.');
      return;
    }

    let endpoint = '';
    if (exportTarget === 'branch' && !selectedBranchId) {
      showError('Please select a branch.');
      return;
    }
    if (exportTarget === 'subdealer' && !selectedSubdealerId) {
      showError('Please select a subdealer.');
      return;
    }

    try {
      if (exportTarget === 'branch') {
        endpoint = `/csv/export-template?filled=true&type=${selectedModelType}&branch_id=${selectedBranchId}`;
      } else {
        endpoint = `/csv/export-template?filled=true&type=${selectedModelType}&subdealer_id=${selectedSubdealerId}`;
      }

      const response = await axiosInstance.get(endpoint, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exported_data_${selectedModelType}_${exportTarget}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Reset states
      setCsvDialogOpen(false);
      setSelectedModelType('');
      setSelectedBranchId('');
      setSelectedSubdealerId('');
      setExportTarget('');
    } catch (error) {
      console.error('CSV export failed:', error);
      showError('Failed to export CSV.');
      setCsvDialogOpen(false);
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-icon-data">
          <input type="text" placeholder="Search.." onChange={(e) => handleFilter(e.target.value, getDefaultSearchFields('headers'))} />
          <SearchOutlinedIcon />
        </div>
        <div className="buttons">
          <button className="btn2" title="Export CSV" onClick={handleExportClick}>
            <FontAwesomeIcon icon={faFileCsv} />
          </button>
        </div>
        <Link to="/headers/add-header">
          <button className="new-user-btn">+ New Header</button>
        </Link>
      </div>
      <div className="table-responsive">
        <div className="table-wrapper">
          <table className="responsive-table" style={{ overflow: 'auto' }}>
            <thead className="table-header-fixed">
              <tr>
                <th>Sr.no</th>
                <th>Name</th>
                <th>Category key</th>
                <th>Type</th>
                <th>Priority number</th>
                <th>Page number</th>
                <th>HSN code</th>
                <th>GST rate</th>
                <th>Is Mandatory?</th>
                <th>Is Discount?</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4">No headers available</td>
                </tr>
              ) : (
                currentRecords.map((header, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{header.header_key}</td>
                    <td>{header.category_key}</td>
                    <td>{header.type}</td>
                    <td>{header.priority}</td>
                    <td>{header.metadata?.page_no || ''}</td>
                    <td>{header.metadata?.hsn_code || ''}</td>
                    <td>{header.metadata?.gst_rate || ''}</td>
                    <td>{header.is_mandatory ? 'Yes' : 'No'}</td>
                    <td>{header.is_discount ? 'Yes' : 'No'}</td>

                    <td>
                      <button className="action-button" onClick={(event) => handleClick(event, header._id)}>
                        Action
                      </button>
                      <Menu id={`action-menu-${header._id}`} anchorEl={anchorEl} open={menuId === header._id} onClose={handleClose}>
                        <Link className="Link" to={`/headers/update-header/${header._id}`}>
                          <MenuItem style={{ color: 'black' }}>Edit</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleDelete(header._id)}>Delete</MenuItem>
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

      {/* First dialog to select export target (branch or subdealer) */}
      {exportTypeDialogOpen && (
        <div className="modal-backdrop">
          <div className="header-modal-content">
            <h5>Select Export Target</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button 
                onClick={() => handleExportTypeSelect('branch')} 
                className="custom-modal-button"
              >
                Branch
              </button>
              <button 
                onClick={() => handleExportTypeSelect('subdealer')} 
                className="custom-modal-button"
              >
                Subdealer
              </button>
            </div>
            <button 
              onClick={() => setExportTypeDialogOpen(false)} 
              className="custom-modal-button custom-modal-button-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Second dialog for model type and branch/subdealer selection */}
      {csvDialogOpen && (
        <div className="modal-backdrop">
          <div className="header-modal-content">
            <select
              value={selectedModelType}
              onChange={(e) => setSelectedModelType(e.target.value)}
              style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
            >
              <option value="">-- Select Model Type --</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </select>

            {exportTarget === 'branch' ? (
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
            ) : (
              <select
                value={selectedSubdealerId}
                onChange={(e) => setSelectedSubdealerId(e.target.value)}
                style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
              >
                <option value="">-- Select Subdealer --</option>
                {subdealers.map((subdealer) => (
                  <option key={subdealer._id} value={subdealer._id}>
                    {subdealer.name}
                  </option>
                ))}
              </select>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setCsvDialogOpen(false)} className="custom-modal-button custom-modal-button-cancel">
                Cancel
              </button>
              <button
                onClick={handleExportCSV}
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

export default HeadersList;