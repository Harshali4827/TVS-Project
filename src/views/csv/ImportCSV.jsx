


// import React, { useRef, useState, useEffect } from 'react';
// import axiosInstance from 'axiosInstance';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileImport } from '@fortawesome/free-solid-svg-icons';
// import '../../css/importCsv.css';
// import { showError, showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
// import Swal from 'sweetalert2';

// const ImportCSV = ({ endpoint, onSuccess, buttonText = "Import CSV", acceptedFiles = ".csv" }) => {
//   const fileInputRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [branches, setBranches] = useState([]);
//   const [selectedBranchId, setSelectedBranchId] = useState('');
//   const [selectedType, setSelectedType] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [branchError, setBranchError] = useState('');
//   const [typeError, setTypeError] = useState('');

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const response = await axiosInstance.get('/branches');
//         setBranches(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching branches:', error);
//       }
//     };

//     fetchBranches();
//   }, []);

//   const handleButtonClick = () => {
//     if (branches.length === 0) {
//      showError('Please ensure branches exist before importing data.')
//       return;
//     }
//     setShowModal(true);
//   };

//   const handleModalConfirm = () => {
//     let isValid = true;
    
//     if (!selectedBranchId) {
//       setBranchError('Please select a branch');
//       isValid = false;
//     } else {
//       setBranchError('');
//     }
    
//     if (!selectedType) {
//       setTypeError('Please select a type (EV / ICE)');
//       isValid = false;
//     } else {
//       setTypeError('');
//     }
    
//     if (isValid) {
//       setShowModal(false);
//       fileInputRef.current.click();
//     }
//   };

//   const handleModalCancel = () => {
//     setShowModal(false);
//     setSelectedBranchId('');
//     setSelectedType('');
//     setBranchError('');
//     setTypeError('');
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !selectedBranchId || !selectedType) return;

//     if (!file.name.toLowerCase().endsWith('.csv')) {
//       showFormSubmitError({ response: { status: 400, data: { message: 'Please upload a CSV file.' } } });
//       return;
//     }

//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('branch_id', selectedBranchId);
//     formData.append('type', selectedType);

//     try {
//       const response = await axiosInstance.post(endpoint, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       await showFormSubmitToast(response.data.message || 'File imported successfully!');

//       if (onSuccess) {
//         onSuccess();
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       showFormSubmitError(error);
//     } finally {
//       setIsLoading(false);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//       setSelectedBranchId('');
//       setSelectedType('');  
//     }
//   };

//   return (
//     <div className="import-csv-container">
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         accept={acceptedFiles}
//         style={{ display: 'none' }}
//       />
//       <button
//         className="import-csv-button"
//         onClick={handleButtonClick}
//         disabled={isLoading || branches.length === 0}
//       >
//         {isLoading ? (
//           'Uploading...'
//         ) : (
//           <>
//             <FontAwesomeIcon icon={faFileImport} className="import-icon" />
//             {buttonText}
//           </>
//         )}
//       </button>

//       {showModal && (
//         <div className="custom-modal">
//           <div className="custom-modal-content">
//             <div className="custom-modal-header">
//               <h3 className="custom-modal-title">Import CSV</h3>
//             </div>
//             <div className="custom-modal-body">
//               <select
//                 className="custom-modal-select"
//                 value={selectedBranchId}
//                 onChange={(e) => setSelectedBranchId(e.target.value)}
//               >
//                 <option value="">-- Select Branch --</option>
//                 {branches.map(b => (
//                   <option key={b._id} value={b._id}>{b.name}</option>
//                 ))}
//               </select>
//               {branchError && <div className="custom-modal-error">{branchError}</div>}
              
//               <select
//                 className="custom-modal-select"
//                 value={selectedType}
//                 onChange={(e) => setSelectedType(e.target.value)}
//               >
//                 <option value="">-- Select Type --</option>
//                 <option value="EV">EV</option>
//                 <option value="ICE">ICE</option>
//               </select>
//               {typeError && <div className="custom-modal-error">{typeError}</div>}
//             </div>
//             <div className="custom-modal-footer">
//               <button
//                 className="custom-modal-button custom-modal-button-cancel"
//                 onClick={handleModalCancel}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="custom-modal-button custom-modal-button-confirm"
//                 onClick={handleModalConfirm}
//               >
//                 Continue
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImportCSV;



import React, { useRef, useState, useEffect } from 'react';
import axiosInstance from 'axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import '../../css/importCsv.css';
import { showError, showFormSubmitError, showFormSubmitToast } from 'utils/sweetAlerts';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormSelect,
  CFormLabel,
  CSpinner
} from '@coreui/react';

const ImportCSV = ({ endpoint, onSuccess, buttonText = "Import CSV", acceptedFiles = ".csv" }) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [subdealers, setSubdealers] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedSubdealerId, setSelectedSubdealerId] = useState('');
  const [selectedModelType, setSelectedModelType] = useState('');
  const [exportTypeDialogOpen, setExportTypeDialogOpen] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [exportTarget, setExportTarget] = useState(''); // 'branch' or 'subdealer'
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    const fetchSubdealers = async () => {
      try {
        const response = await axiosInstance.get('/subdealers');
        setSubdealers(response.data.data.subdealers || []);
      } catch (error) {
        console.error('Error fetching subdealers:', error);
      }
    };

    fetchBranches();
    fetchSubdealers();
  }, []);

  const handleButtonClick = () => {
    if (branches.length === 0 && subdealers.length === 0) {
      showError('Please ensure branches or subdealers exist before importing data.');
      return;
    }
    setExportTypeDialogOpen(true);
  };

  const handleExportTypeSelect = (type) => {
    setExportTarget(type);
    setExportTypeDialogOpen(false);
    setCsvDialogOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      showFormSubmitError({ response: { status: 400, data: { message: 'Please upload a CSV file.' } } });
      return;
    }

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', selectedModelType);

    if (exportTarget === 'branch') {
      formData.append('branch_id', selectedBranchId);
    } else {
      formData.append('subdealer_id', selectedSubdealerId);
    }

    try {
      const response = await axiosInstance.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await showFormSubmitToast(response.data.message || 'File imported successfully!');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showFormSubmitError(error);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedBranchId('');
      setSelectedSubdealerId('');
      setSelectedModelType('');
      setExportTarget('');
      setCsvDialogOpen(false);
    }
  };

  const handleImportConfirm = () => {
    if (!selectedModelType) {
      showError('Please select a model type.');
      return;
    }

    if (exportTarget === 'branch' && !selectedBranchId) {
      showError('Please select a branch.');
      return;
    }

    if (exportTarget === 'subdealer' && !selectedSubdealerId) {
      showError('Please select a subdealer.');
      return;
    }

    setCsvDialogOpen(false);
    fileInputRef.current.click();
  };

  return (
    <div className="import-csv-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFiles}
        style={{ display: 'none' }}
      />
      <button
        className="import-csv-button"
        onClick={handleButtonClick}
        disabled={isImporting || (branches.length === 0 && subdealers.length === 0)}
      >
        {isImporting ? (
          'Uploading...'
        ) : (
          <>
            <FontAwesomeIcon icon={faFileImport} className="import-icon" />
            {buttonText}
          </>
        )}
      </button>

     <CModal 
  visible={exportTypeDialogOpen} 
  onClose={() => setExportTypeDialogOpen(false)}
  alignment="center"
  size="sm" 
>
  <CModalHeader className="p-3"> 
    <CModalTitle className="h5">Select Import Target</CModalTitle>
  </CModalHeader>
  <CModalBody className="p-3 text-center"> 
    <div className="d-flex flex-column gap-2">
      <CButton 
        color="primary" 
        onClick={() => handleExportTypeSelect('branch')}
        size="sm" 
        className="mb-1" 
        disabled={branches.length === 0}
      >
        Branch
        {branches.length === 0 && <span className="ms-1 text-muted small">(None)</span>}
      </CButton>
      <CButton 
        color="secondary" 
        onClick={() => handleExportTypeSelect('subdealer')}
        size="sm"
        disabled={subdealers.length === 0}
      >
        Subdealer
        {subdealers.length === 0 && <span className="ms-1 text-muted small">(None)</span>}
      </CButton>
    </div>
  </CModalBody>
  <CModalFooter className="p-2 justify-content-center"> 
    <CButton 
      color="secondary" 
      onClick={() => setExportTypeDialogOpen(false)}
      size="sm"
    >
      Cancel
    </CButton>
  </CModalFooter>
</CModal>
     
      <CModal 
        visible={csvDialogOpen} 
        onClose={() => setCsvDialogOpen(false)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Import CSV Data</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Model Type</CFormLabel>
            <CFormSelect
              value={selectedModelType}
              onChange={(e) => setSelectedModelType(e.target.value)}
            >
              <option value="">-- Select Model Type --</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
          </div>

          {exportTarget === 'branch' ? (
            <div className="mb-3">
              <CFormLabel>Branch</CFormLabel>
              <CFormSelect
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
              >
                <option value="">-- Select Branch --</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </CFormSelect>
            </div>
          ) : (
            <div className="mb-3">
              <CFormLabel>Subdealer</CFormLabel>
              <CFormSelect
                value={selectedSubdealerId}
                onChange={(e) => setSelectedSubdealerId(e.target.value)}
              >
                <option value="">-- Select Subdealer --</option>
                {subdealers.map((subdealer) => (
                  <option key={subdealer._id} value={subdealer._id}>
                    {subdealer.name}
                  </option>
                ))}
              </CFormSelect>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setCsvDialogOpen(false)}
            disabled={isImporting}
          >
            Cancel
          </CButton>
          <CButton 
            color="primary" 
            onClick={handleImportConfirm}
            disabled={isImporting || !selectedModelType || (exportTarget === 'branch' ? !selectedBranchId : !selectedSubdealerId)}
          >
            {isImporting ? (
              <>
                <CSpinner size="sm" />
                <span className="ms-2">Importing...</span>
              </>
            ) : (
              'Import'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ImportCSV;