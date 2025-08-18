// import React, { useState, useEffect } from 'react';
// import { 
//   CModal, 
//   CModalHeader, 
//   CModalBody, 
//   CModalFooter, 
//   CFormLabel, 
//   CButton, 
//   CFormSelect, 
//   CSpinner,
//   CFormInput,
//   CFormTextarea
// } from '@coreui/react';
// import axiosInstance from 'axiosInstance';
// import { showError } from 'utils/sweetAlerts';

// const ChassisNumberModal = ({ show, onClose, onSave, isLoading, booking, isUpdate = false }) => {
//   const [chassisNumber, setChassisNumber] = useState(booking?.chassisNumber || '');
//   const [reason, setReason] = useState('');
//   const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
//   const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
//   const [hasClaim, setHasClaim] = useState(null);
//   const [claimDetails, setClaimDetails] = useState({
//     price: '',
//     description: '',
//     documents: []
//   });
//   const [documentPreviews, setDocumentPreviews] = useState([]);

//   useEffect(() => {
//     if (show && booking && !isUpdate) {
//       fetchAvailableChassisNumbers();
//     }
//   }, [show, booking, isUpdate]);

//   const fetchAvailableChassisNumbers = async () => {
//     try {
//       setLoadingChassisNumbers(true);
//       const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
//       setAvailableChassisNumbers(response.data.data.chassisNumbers || []);
//     } catch (error) {
//       console.error('Error fetching chassis numbers:', error);
//       showError('Failed to fetch available chassis numbers');
//     } finally {
//       setLoadingChassisNumbers(false);
//     }
//   };

//   const handleDocumentUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + claimDetails.documents.length > 6) {
//       showError('You can upload a maximum of 6 documents');
//       return;
//     }
    
//     const newDocuments = [...claimDetails.documents, ...files];
//     setClaimDetails({...claimDetails, documents: newDocuments});
    
//     // Create previews for images
//     const imageFiles = files.filter(file => file.type.startsWith('image/'));
//     imageFiles.forEach(file => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setDocumentPreviews(prev => [...prev, {name: file.name, url: e.target.result}]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeDocument = (index) => {
//     const newDocuments = [...claimDetails.documents];
//     newDocuments.splice(index, 1);
//     setClaimDetails({...claimDetails, documents: newDocuments});
    
//     // Also remove preview if it exists
//     if (documentPreviews[index]) {
//       const newPreviews = [...documentPreviews];
//       newPreviews.splice(index, 1);
//       setDocumentPreviews(newPreviews);
//     }
//   };

//   const handleSubmit = () => {
//     if (!chassisNumber.trim()) {
//       showError('Please enter a chassis number');
//       return;
//     }
//     if (isUpdate && !reason.trim()) {
//       showError('Please enter a reason for updating');
//       return;
//     }
    
//     const payload = {
//       chassisNumber: chassisNumber.trim(),
//       ...(isUpdate && { reason }),
//       ...(hasClaim && { 
//         claimDetails: {
//           price: claimDetails.price,
//           description: claimDetails.description,
//           documents: claimDetails.documents
//         }
//       })
//     };
    
//     onSave(payload);
//   };

//   return (
//     <CModal visible={show} onClose={onClose} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
//       <CModalHeader>
//         <h5 className="modal-title">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
//       </CModalHeader>
//       <CModalBody>
//         {hasClaim === null ? (
//           <div className="text-center">
//             <h5>Is there any claim?</h5>
//             <div className="d-flex justify-content-center mt-3">
//               <CButton 
//                 color="primary" 
//                 className="me-3" 
//                 onClick={() => setHasClaim(true)}
//               >
//                 Yes
//               </CButton>
//               <CButton 
//                 color="secondary" 
//                 onClick={() => setHasClaim(false)}
//               >
//                 No
//               </CButton>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="mb-3">
//               <CFormLabel>Model: {booking?.model?.model_name}</CFormLabel>
//             </div>
//             <div className="mb-3">
//               <CFormLabel>Color: {booking?.color?.name}</CFormLabel>
//             </div>
//             <div className="mb-3">
//               <CFormLabel htmlFor="chassisNumber">Chassis Number</CFormLabel>
//               {isUpdate ? (
//                 <CFormInput
//                   type="text"
//                   value={chassisNumber}
//                   onChange={(e) => setChassisNumber(e.target.value)}
//                   required
//                 />
//               ) 
//               : loadingChassisNumbers ? (
//                 <div className="text-center">
//                   <CSpinner size="sm" />
//                   <span className="ms-2">Loading chassis numbers...</span>
//                 </div>
//               ) : availableChassisNumbers.length > 0 ? (
//                 <CFormSelect 
//                   value={chassisNumber} 
//                   onChange={(e) => setChassisNumber(e.target.value)} 
//                   required
//                 >
//                   <option value="">Select a chassis number</option>
//                   {availableChassisNumbers.map((num) => (
//                     <option key={num} value={num}>
//                       {num}
//                     </option>
//                   ))}
//                 </CFormSelect>
//               ) : (
//                 <div className="text-danger">No chassis numbers available for this model and color combination</div>
//               )}
//             </div>
            
//             {isUpdate && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="reason">Reason for Update</CFormLabel>
//                 <CFormTextarea
//                   id="reason"
//                   value={reason}
//                   onChange={(e) => setReason(e.target.value)}
//                   required
//                   rows={3}
//                 />
//               </div>
//             )}
            
//             {hasClaim && (
//               <div className="mt-4 border-top pt-3">
//                 <h5>Claim Details</h5>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimPrice">Price (₹)</CFormLabel>
//                   <CFormInput
//                     type="number"
//                     id="claimPrice"
//                     value={claimDetails.price}
//                     onChange={(e) => setClaimDetails({...claimDetails, price: e.target.value})}
//                     placeholder="Enter claim amount"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimDescription">Description</CFormLabel>
//                   <CFormTextarea
//                     id="claimDescription"
//                     value={claimDetails.description}
//                     onChange={(e) => setClaimDetails({...claimDetails, description: e.target.value})}
//                     placeholder="Enter claim description"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel>Documents (Max 6)</CFormLabel>
//                   <input
//                     type="file"
//                     className="form-control"
//                     onChange={handleDocumentUpload}
//                     multiple
//                     accept="image/*,.pdf,.doc,.docx"
//                   />
//                   <small className="text-muted">You can upload images, PDFs, or Word documents</small>
                  
//                   {documentPreviews.length > 0 && (
//                     <div className="mt-2">
//                       <h6>Uploaded Documents:</h6>
//                       <div className="d-flex flex-wrap gap-2">
//                         {documentPreviews.map((doc, index) => (
//                           <div key={index} className="position-relative" style={{width: '100px'}}>
//                             <img 
//                               src={doc.url} 
//                               alt={doc.name} 
//                               className="img-thumbnail"
//                               style={{width: '100%', height: '100px', objectFit: 'cover'}}
//                             />
//                             <button
//                               className="position-absolute top-0 end-0 btn btn-sm btn-danger"
//                               onClick={() => removeDocument(index)}
//                               style={{transform: 'translate(50%, -50%)'}}
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
                  
//                   {claimDetails.documents.filter(d => !d.type.startsWith('image/')).length > 0 && (
//                     <div className="mt-2">
//                       <h6>Other Files:</h6>
//                       <ul>
//                         {claimDetails.documents
//                           .filter(d => !d.type.startsWith('image/'))
//                           .map((doc, index) => (
//                             <li key={index} className="d-flex align-items-center">
//                               {doc.name}
//                               <button
//                                 className="btn btn-sm btn-danger ms-2"
//                                 onClick={() => removeDocument(
//                                   claimDetails.documents.findIndex(d => d.name === doc.name)
//                                 )}
//                               >
//                                 ×
//                               </button>
//                             </li>
//                           ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </CModalBody>
//       {hasClaim !== null && (
//         <CModalFooter>
//           <CButton color="secondary" onClick={onClose} disabled={isLoading}>
//             Cancel
//           </CButton>
//           <CButton
//             color="primary"
//             onClick={handleSubmit}
//             disabled={isLoading || (!isUpdate && (loadingChassisNumbers || availableChassisNumbers.length === 0))}
//           >
//             {isLoading ? 'Saving...' : 'Save'}
//           </CButton>
//         </CModalFooter>
//       )}
//     </CModal>
//   );
// };

// export default ChassisNumberModal;

import React, { useState, useEffect } from 'react';
import { 
  CModal, 
  CModalHeader, 
  CModalBody, 
  CModalFooter, 
  CFormLabel, 
  CButton, 
  CFormSelect, 
  CSpinner,
  CFormInput,
  CFormTextarea
} from '@coreui/react';
import axiosInstance from 'axiosInstance';
import { showError } from 'utils/sweetAlerts';

const ChassisNumberModal = ({ show, onClose, onSave, isLoading, booking, isUpdate = false }) => {
  const [chassisNumber, setChassisNumber] = useState(booking?.chassisNumber || '');
  const [reason, setReason] = useState('');
  const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
  const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
  const [hasClaim, setHasClaim] = useState(null);
  const [claimDetails, setClaimDetails] = useState({
    price: '',
    description: '',
    documents: []
  });
  const [documentPreviews, setDocumentPreviews] = useState([]);

  useEffect(() => {
    if (show && booking) {
      fetchAvailableChassisNumbers();
    }
  }, [show, booking]);

  const fetchAvailableChassisNumbers = async () => {
    try {
      setLoadingChassisNumbers(true);
      const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
      const availableNumbers = response.data.data.chassisNumbers || [];
      setAvailableChassisNumbers(availableNumbers);
      
      // If updating and current chassis number is not in available list, add it
      if (isUpdate && booking.chassisNumber && !availableNumbers.includes(booking.chassisNumber)) {
        setAvailableChassisNumbers([booking.chassisNumber, ...availableNumbers]);
      }
    } catch (error) {
      console.error('Error fetching chassis numbers:', error);
      showError('Failed to fetch available chassis numbers');
    } finally {
      setLoadingChassisNumbers(false);
    }
  };

    const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + claimDetails.documents.length > 6) {
      showError('You can upload a maximum of 6 documents');
      return;
    }
    
    const newDocuments = [...claimDetails.documents, ...files];
    setClaimDetails({...claimDetails, documents: newDocuments});
    
    // Create previews for images
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDocumentPreviews(prev => [...prev, {name: file.name, url: e.target.result}]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDocument = (index) => {
    const newDocuments = [...claimDetails.documents];
    newDocuments.splice(index, 1);
    setClaimDetails({...claimDetails, documents: newDocuments});
    
    // Also remove preview if it exists
    if (documentPreviews[index]) {
      const newPreviews = [...documentPreviews];
      newPreviews.splice(index, 1);
      setDocumentPreviews(newPreviews);
    }
  };

  const handleSubmit = () => {
    if (!chassisNumber.trim()) {
      showError('Please enter a chassis number');
      return;
    }
    if (isUpdate && !reason.trim()) {
      showError('Please enter a reason for updating');
      return;
    }
    
    const payload = {
      chassisNumber: chassisNumber.trim(),
      ...(isUpdate && { reason }),
      ...(hasClaim && { 
        claimDetails: {
          price: claimDetails.price,
          description: claimDetails.description,
          documents: claimDetails.documents
        }
      })
    };
    
    onSave(payload);
  };


  return (
    <CModal visible={show} onClose={onClose} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
      <CModalHeader>
        <h5 className="modal-title">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
      </CModalHeader>
      <CModalBody>
        {hasClaim === null ? (
          <div className="text-center">
            <h5>Is there any claim?</h5>
            <div className="d-flex justify-content-center mt-3">
              <CButton 
                color="primary" 
                className="me-3" 
                onClick={() => setHasClaim(true)}
              >
                Yes
              </CButton>
              <CButton 
                color="secondary" 
                onClick={() => setHasClaim(false)}
              >
                No
              </CButton>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <CFormLabel>Model: {booking?.model?.model_name}</CFormLabel>
            </div>
            <div className="mb-3">
              <CFormLabel>Color: {booking?.color?.name}</CFormLabel>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="chassisNumber">Chassis Number</CFormLabel>
              {loadingChassisNumbers ? (
                <div className="text-center">
                  <CSpinner size="sm" />
                  <span className="ms-2">Loading chassis numbers...</span>
                </div>
              ) : availableChassisNumbers.length > 0 ? (
                <CFormSelect 
                  value={chassisNumber} 
                  onChange={(e) => setChassisNumber(e.target.value)} 
                  required
                >
                  <option value="">Select a chassis number</option>
                  {availableChassisNumbers.map((num) => (
                    <option key={num} value={num}>
                      {num} {num === booking?.chassisNumber && '(Current)'}
                    </option>
                  ))}
                </CFormSelect>
              ) : (
                <div className="text-danger">No chassis numbers available for this model and color combination</div>
              )}
            </div>
            
            {isUpdate && (
              <div className="mb-3">
                <CFormLabel htmlFor="reason">Reason for Update</CFormLabel>
                <CFormTextarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={3}
                />
              </div>
            )}
            
          {hasClaim && (
              <div className="mt-4 border-top pt-3">
                <h5>Claim Details</h5>
                <div className="mb-3">
                  <CFormLabel htmlFor="claimPrice">Price (₹)</CFormLabel>
                  <CFormInput
                    type="number"
                    id="claimPrice"
                    value={claimDetails.price}
                    onChange={(e) => setClaimDetails({...claimDetails, price: e.target.value})}
                    placeholder="Enter claim amount"
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="claimDescription">Description</CFormLabel>
                  <CFormTextarea
                    id="claimDescription"
                    value={claimDetails.description}
                    onChange={(e) => setClaimDetails({...claimDetails, description: e.target.value})}
                    placeholder="Enter claim description"
                    rows={3}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Documents (Max 6)</CFormLabel>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleDocumentUpload}
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <small className="text-muted">You can upload images, PDFs, or Word documents</small>
                  
                  {documentPreviews.length > 0 && (
                    <div className="mt-2">
                      <h6>Uploaded Documents:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {documentPreviews.map((doc, index) => (
                          <div key={index} className="position-relative" style={{width: '100px'}}>
                            <img 
                              src={doc.url} 
                              alt={doc.name} 
                              className="img-thumbnail"
                              style={{width: '100%', height: '100px', objectFit: 'cover'}}
                            />
                            <button
                              className="position-absolute top-0 end-0 btn btn-sm btn-danger"
                              onClick={() => removeDocument(index)}
                              style={{transform: 'translate(50%, -50%)'}}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {claimDetails.documents.filter(d => !d.type.startsWith('image/')).length > 0 && (
                    <div className="mt-2">
                      <h6>Other Files:</h6>
                      <ul>
                        {claimDetails.documents
                          .filter(d => !d.type.startsWith('image/'))
                          .map((doc, index) => (
                            <li key={index} className="d-flex align-items-center">
                              {doc.name}
                              <button
                                className="btn btn-sm btn-danger ms-2"
                                onClick={() => removeDocument(
                                  claimDetails.documents.findIndex(d => d.name === doc.name)
                                )}
                              >
                                ×
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
               )}
      </CModalBody>
      {hasClaim !== null && (
        <CModalFooter>
          <CButton color="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading || (!isUpdate && (loadingChassisNumbers || availableChassisNumbers.length === 0))}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </CButton>
        </CModalFooter>
      )}
    </CModal>
  );
};
export default ChassisNumberModal;
