// import React, { useState, useEffect } from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton,
//   CRow,
//   CCol,
//   CBackdrop,
//   CBadge,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CListGroup,
//   CListGroupItem,
//   CSpinner
// } from '@coreui/react';
// import { axiosInstance } from 'utils/tableImports';

// const ViewInsuranceModal = ({ show, onClose, insuranceData: initialData }) => {
//   const [insuranceData, setInsuranceData] = useState(initialData);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchInsuranceDetails = async () => {
//       if (show && initialData?.id) {
//         setLoading(true);
//         try {
//           const response = await axiosInstance.get(`/insurance/${initialData.id}`);
//           setInsuranceData(response.data.data);
//         } catch (error) {
//           console.error('Error fetching insurance details:', error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchInsuranceDetails();
//   }, [show, initialData]);

//   if (!insuranceData) return null;

//   const getDocumentTypeBadge = (type) => {
//     switch (type) {
//       case 'POLICY':
//         return 'primary';
//       case 'RECEIPT':
//         return 'success';
//       case 'OTHER':
//         return 'info';
//       default:
//         return 'secondary';
//     }
//   };

//   const handleDownload = (url, name) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = name;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <>
//       <CBackdrop visible={show} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
//       <CModal visible={show} onClose={onClose} size="lg" alignment="center" scrollable>
//         <CModalHeader className="text-white" style={{ backgroundColor: '#243c7c' }}>
//           <CModalTitle className="text-white">Insurance Details</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {loading ? (
//             <div className="text-center">
//               <CSpinner />
//               <p>Loading insurance details...</p>
//             </div>
//           ) : (
//             <>
//               <CCard className="mb-4">
//                 <CCardHeader>
//                   <h5>Booking Information</h5>
//                 </CCardHeader>
//                 <CCardBody>
//                   <CRow className="mb-3">
//                     <CCol md={4}>
//                       <div className="info-item">
//                         <label className="form-label">Booking Number</label>
//                         <div className="info-value">{insuranceData.booking?.bookingNumber || 'N/A'}</div>
//                       </div>
//                     </CCol>
//                     <CCol md={4}>
//                       <div className="info-item">
//                         <label className="form-label">Insurance Status</label>
//                         <div className="info-value">
//                           <CBadge
//                             color={
//                               insuranceData.status === 'COMPLETED' ? 'success' : insuranceData.status === 'LATER' ? 'warning' : 'danger'
//                             }
//                           >
//                             {insuranceData.status}
//                           </CBadge>
//                         </div>
//                       </div>
//                     </CCol>
//                     <CCol md={4}>
//                       <div className="info-item">
//                         <label className="form-label">Customer Name</label>
//                         <div className="info-value">{insuranceData.booking?.customerName || 'N/A'}</div>
//                       </div>
//                     </CCol>
//                   </CRow>

//                   <CRow className="mb-3">
//                     <CCol md={4}>
//                       <div className="info-item">
//                         <label className="form-label">Chassis Number</label>
//                         <div className="info-value">{insuranceData.booking?.chassisNumber || 'N/A'}</div>
//                       </div>
//                     </CCol>
//                     <CCol md={4}>
//                       <div className="info-item">
//                         <label className="form-label">Model Name</label>
//                         <div className="info-value">{insuranceData.booking?.model?.model_name || 'N/A'}</div>
//                       </div>
//                     </CCol>
//                     <CCol md={4}>
//                       <div className="info-item">
//                         <label className="form-label">Insurance Date</label>
//                         <div className="info-value">
//                           {insuranceData.insuranceDate ? new Date(insuranceData.insuranceDate).toLocaleDateString('en-GB') : 'N/A'}
//                         </div>
//                       </div>
//                     </CCol>
//                   </CRow>
//                 </CCardBody>
//               </CCard>

//               <CCard className="mb-4">
//                 <CCardHeader>
//                   <h5>Insurance Details</h5>
//                 </CCardHeader>
//                 <CCardBody>
//                   <CRow className="mb-3">
//                     <CCol md={4}>
//                       <div className="info-item">
//                         <label className="form-label">Insurance Provider</label>
//                         <div className="info-value">{insuranceData.insuranceProviderDetails?.provider_name || 'N/A'}</div>
//                       </div>
//                     </CCol>
//                     <CCol md={4}>
//                       <div className="info-item">
//                         <label className="form-label">Policy Number</label>
//                         <div className="info-value">{insuranceData.policyNumber || 'N/A'}</div>
//                       </div>
//                     </CCol>
//                     <CCol md={4}>
//                       <div className="info-item">
//                         <label className="form-label">RSA Policy Number</label>
//                         <div className="info-value">{insuranceData.rsaPolicyNumber || 'N/A'}</div>
//                       </div>
//                     </CCol>
//                     <CCol md={4}>
//                       <div className="info-item">
//                         <label className="form-label">CMS Policy Number</label>
//                         <div className="info-value">{insuranceData.cmsPolicyNumber || 'N/A'}</div>
//                       </div>
//                     </CCol>
//                     <CCol md={8}>
//                       <div className="info-item">
//                         <label className="form-label">Remarks</label>
//                         <div className="info-value">{insuranceData.remarks || 'No remarks provided'}</div>
//                       </div>
//                     </CCol>
//                   </CRow>
//                 </CCardBody>
//               </CCard>

//               <CCard className="mb-4">
//                 <CCardHeader>
//                   <h5>Documents</h5>
//                 </CCardHeader>
//                 <CCardBody>
//                   {insuranceData.documents && insuranceData.documents.length > 0 ? (
//                     <CListGroup>
//                       {insuranceData.documents.map((doc, index) => (
//                         <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
//                           <div>
//                             <CBadge color={getDocumentTypeBadge(doc.type)} className="me-2">
//                               {doc.type}
//                             </CBadge>
//                             {doc.name}
//                             <div className="text-muted small">Uploaded: {new Date(doc.uploadedAt).toLocaleString()}</div>
//                           </div>
//                           <CButton color="primary" size="sm" onClick={() => handleDownload(doc.url, doc.name)}>
//                             Download
//                           </CButton>
//                         </CListGroupItem>
//                       ))}
//                     </CListGroup>
//                   ) : (
//                     <div className="text-muted">No documents uploaded</div>
//                   )}
//                 </CCardBody>
//               </CCard>
//             </>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={onClose}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <style jsx>{`
//         .info-item {
//           margin-bottom: 1rem;
//         }
//         .info-item label {
//           font-weight: 600;
//           color: #4f5d73;
//           margin-bottom: 0.25rem;
//         }
//         .info-value {
//           padding: 0.5rem;
//           background-color: #f8f9fa;
//           border-radius: 0.25rem;
//           min-height: 2.5rem;
//           display: flex;
//           align-items: center;
//         }
//       `}</style>
//     </>
//   );
// };

// export default ViewInsuranceModal;

import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CCol,
  CBackdrop,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CListGroup,
  CListGroupItem,
  CSpinner,
  CImage
} from '@coreui/react';
import { axiosInstance } from 'utils/tableImports';
import config from 'config';

const ViewInsuranceModal = ({ show, onClose, insuranceData: initialData }) => {
  const [insuranceData, setInsuranceData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [docLoading, setDocLoading] = useState(false);

  useEffect(() => {
    const fetchInsuranceDetails = async () => {
      if (show && initialData?.id) {
        setLoading(true);
        try {
          const response = await axiosInstance.get(`/insurance/${initialData.id}`);
          setInsuranceData(response.data.data);
        } catch (error) {
          console.error('Error fetching insurance details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInsuranceDetails();
  }, [show, initialData]);

  if (!insuranceData) return null;

  const getDocumentTypeBadge = (type) => {
    switch (type) {
      case 'POLICY':
        return 'primary';
      case 'RECEIPT':
        return 'success';
      case 'OTHER':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const handleDownload = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDocument = async (doc) => {
    setCurrentDoc(doc);
    setDocLoading(true);
    try {
      // If you need to fetch the document content separately, you can do it here
      // Otherwise, we'll just use the URL directly
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setDocLoading(false);
    }
  };

  const isImageFile = (fileName) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
  };

  const isPdfFile = (fileName) => {
    return fileName.toLowerCase().endsWith('.pdf');
  };

  return (
    <>
      <CBackdrop visible={show} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
      <CModal visible={show} onClose={onClose} size="lg" alignment="center" scrollable>
        <CModalHeader className="text-white" style={{ backgroundColor: '#243c7c' }}>
          <CModalTitle className="text-white">Insurance Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {loading ? (
            <div className="text-center">
              <CSpinner />
              <p>Loading insurance details...</p>
            </div>
          ) : (
            <>
              <CCard className="mb-4">
                <CCardHeader>
                  <h5>Booking Information</h5>
                </CCardHeader>
                <CCardBody>
                  <CRow className="mb-3">
                    <CCol md={4}>
                      <div className="info-item">
                        <label className="form-label">Booking Number</label>
                        <div className="info-value">{insuranceData.booking?.bookingNumber || 'N/A'}</div>
                      </div>
                    </CCol>
                    <CCol md={4}>
                      <div className="info-item">
                        <label className="form-label">Insurance Status</label>
                        <div className="info-value">
                          <CBadge
                            color={
                              insuranceData.status === 'COMPLETED' ? 'success' : insuranceData.status === 'LATER' ? 'warning' : 'danger'
                            }
                          >
                            {insuranceData.status}
                          </CBadge>
                        </div>
                      </div>
                    </CCol>
                    <CCol md={4}>
                      <div className="info-item">
                        <label className="form-label">Customer Name</label>
                        <div className="info-value">{insuranceData.booking?.customerName || 'N/A'}</div>
                      </div>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={4}>
                      <div className="info-item">
                        <label className="form-label">Chassis Number</label>
                        <div className="info-value">{insuranceData.booking?.chassisNumber || 'N/A'}</div>
                      </div>
                    </CCol>
                    <CCol md={4}>
                      <div className="info-item">
                        <label className="form-label">Model Name</label>
                        <div className="info-value">{insuranceData.booking?.model?.model_name || 'N/A'}</div>
                      </div>
                    </CCol>
                    <CCol md={4}>
                      <div className="info-item">
                        <label className="form-label">Insurance Date</label>
                        <div className="info-value">
                          {insuranceData.insuranceDate ? new Date(insuranceData.insuranceDate).toLocaleDateString('en-GB') : 'N/A'}
                        </div>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <CCard className="mb-4">
                <CCardHeader>
                  <h5>Insurance Details</h5>
                </CCardHeader>
                <CCardBody>
                  <CRow className="mb-3">
                    <CCol md={4}>
                      <div className="info-item">
                        <label className="form-label">Insurance Provider</label>
                        <div className="info-value">{insuranceData.insuranceProviderDetails?.provider_name || 'N/A'}</div>
                      </div>
                    </CCol>
                    <CCol md={4}>
                      <div className="info-item">
                        <label className="form-label">Policy Number</label>
                        <div className="info-value">{insuranceData.policyNumber || 'N/A'}</div>
                      </div>
                    </CCol>
                    <CCol md={4}>
                      <div className="info-item">
                        <label className="form-label">RSA Policy Number</label>
                        <div className="info-value">{insuranceData.rsaPolicyNumber || 'N/A'}</div>
                      </div>
                    </CCol>
                    <CCol md={4}>
                      <div className="info-item">
                        <label className="form-label">CMS Policy Number</label>
                        <div className="info-value">{insuranceData.cmsPolicyNumber || 'N/A'}</div>
                      </div>
                    </CCol>
                    <CCol md={8}>
                      <div className="info-item">
                        <label className="form-label">Remarks</label>
                        <div className="info-value">{insuranceData.remarks || 'No remarks provided'}</div>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <CCard className="mb-4">
                <CCardHeader>
                  <h5>Documents</h5>
                </CCardHeader>
                <CCardBody>
                  {insuranceData.documents && insuranceData.documents.length > 0 ? (
                    <div className="document-preview-list" style={{ display: 'flex', gap: '10px' }}>
                      {insuranceData.documents?.map((doc, index) => (
                        <div key={index} className="mb-4">
                          <h6>{doc.name}</h6>
                          <CImage src={`${config.baseURL}${doc.url}`} fluid className="img-thumbnail" style={{ maxHeight: '200px' }} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted">No documents uploaded</div>
                  )}
                </CCardBody>
              </CCard>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <style jsx>{`
        .info-item {
          margin-bottom: 1rem;
        }
        .info-item label {
          font-weight: 600;
          color: #4f5d73;
          margin-bottom: 0.25rem;
        }
        .info-value {
          padding: 0.5rem;
          background-color: #f8f9fa;
          border-radius: 0.25rem;
          min-height: 2.5rem;
          display: flex;
          align-items: center;
        }
        .document-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .document-list {
          flex: 1;
        }
        .document-preview {
          flex: 2;
          border: 1px solid #ddd;
          border-radius: 0.25rem;
          padding: 1rem;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .preview-content {
          width: 100%;
          height: 100%;
        }
        .pdf-preview {
          width: 100%;
        }
        .unsupported-file {
          padding: 2rem;
        }
      `}</style>
    </>
  );
};

export default ViewInsuranceModal;
