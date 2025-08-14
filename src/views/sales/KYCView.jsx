// import React, { useEffect, useState } from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CRow,
//   CCol,
//   CBadge,
//   CButton,
//   CFormInput,
//   CFormLabel
// } from '@coreui/react';
// import PropTypes from 'prop-types';
// import config from 'config';
// import { showError, showSuccess } from 'utils/sweetAlerts';
// import axiosInstance from 'axiosInstance';
// import '../../css/kycView.css';
// import { Link } from 'react-router-dom';
// import CIcon from '@coreui/icons-react';
// import { cilCloudUpload } from '@coreui/icons';

// const KYCView = ({ open, onClose, kycData, refreshData, bookingId }) => {
//   const [actionLoading, setActionLoading] = useState(false);
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [currentAction, setCurrentAction] = useState(null);
//   const [verificationNote, setVerificationNote] = useState('');

//   const handleStatusButtonClick = (action) => {
//     setCurrentAction(action);
//     setShowStatusModal(true);
//   };

//   useEffect(() => {
//     if (bookingId) {
//       console.log('KYCView received valid bookingId:', bookingId);
//     } else {
//       console.warn('KYCView received null bookingId!');
//     }
//   }, [bookingId]);
//   const handleKycStatusUpdate = async () => {
//     try {
//       setActionLoading(true);
//       console.log('Fetching KYC for booking ID:', bookingId);
//       if (!bookingId) {
//         showError('Booking ID is missing');
//         return;
//       }
//       if (!verificationNote.trim()) {
//         alert('Verification note is required');
//         return;
//       }

//       await axiosInstance.post(`/kyc/${bookingId}/verify`, {
//         status: currentAction,
//         verificationNote: verificationNote
//       });

//       showSuccess(`KYC ${currentAction.toLowerCase()} successfully!`);
//       refreshData();
//       setShowStatusModal(false);
//       onClose();
//     } catch (error) {
//       console.log(error);
//       showError(error.response?.data?.message || `Failed to update KYC status`);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   if (!kycData) {
//     return (
//       <CModal visible={open} onClose={onClose} size="xl">
//         <CModalHeader>
//           <CModalTitle>Loading KYC Details...</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="text-center py-4">Loading KYC information...</div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={onClose}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     );
//   }

//   return (
//     <>
//       <CModal visible={open} onClose={onClose} size="xl">
//         <CModalHeader>
//           <CModalTitle>KYC Documents</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="kyc-documents-container">
//             <CRow>
//               <CCol md={6}>
//                 <CCard className="document-card">
//                   <CCardHeader>Aadhar Front</CCardHeader>
//                   <CCardBody>
//                     <img src={`${config.baseURL}${kycData.aadharFront}`} alt="Aadhar Front" className="document-image" />
//                   </CCardBody>
//                 </CCard>
//               </CCol>
//               <CCol md={6}>
//                 <CCard className="document-card">
//                   <CCardHeader>Aadhar Back</CCardHeader>
//                   <CCardBody>
//                     <img src={`${config.baseURL}${kycData.aadharBack}`} alt="Aadhar Back" className="document-image" />
//                   </CCardBody>
//                 </CCard>
//               </CCol>
//             </CRow>

//             <CRow className="mt-4">
//               <CCol md={6}>
//                 <CCard className="document-card">
//                   <CCardHeader>PAN Card</CCardHeader>
//                   <CCardBody>
//                     <img src={`${config.baseURL}${kycData.panCard}`} alt="PAN Card" className="document-image" />
//                   </CCardBody>
//                 </CCard>
//               </CCol>
//               <CCol md={6}>
//                 <CCard className="document-card">
//                   <CCardHeader>Vehicle Photo</CCardHeader>
//                   <CCardBody>
//                     <img src={`${config.baseURL}${kycData.vPhoto}`} alt="Vehicle Photo" className="document-image" />
//                   </CCardBody>
//                 </CCard>
//               </CCol>
//             </CRow>

//             <CRow className="mt-4">
//               <CCol md={6}>
//                 <CCard className="document-card">
//                   <CCardHeader>Chassis Number Photo</CCardHeader>
//                   <CCardBody>
//                     <img src={`${config.baseURL}${kycData.chasisNoPhoto}`} alt="Chassis Number" className="document-image" />
//                   </CCardBody>
//                 </CCard>
//               </CCol>
//               <CCol md={6}>
//                 <CCard className="document-card">
//                   <CCardHeader>Address Proof 1</CCardHeader>
//                   <CCardBody>
//                     <img src={`${config.baseURL}${kycData.addressProof1}`} alt="Address Proof 1" className="document-image" />
//                   </CCardBody>
//                 </CCard>
//               </CCol>
//             </CRow>

//             {kycData.addressProof2 && (
//               <CRow className="mt-4">
//                 <CCol md={6}>
//                   <CCard className="document-card">
//                     <CCardHeader>Address Proof 2</CCardHeader>
//                     <CCardBody>
//                       <img src={`${config.baseURL}${kycData.addressProof2}`} alt="Address Proof 2" className="document-image" />
//                     </CCardBody>
//                   </CCard>
//                 </CCol>
//                 <CCol md={6}>
//                   <CCard className="document-card">
//                     <CCardHeader>KYC Document PDF</CCardHeader>
//                     <CCardBody>
//                       <a
//                         href={`${config.baseURL}${kycData.documentPdf}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="btn btn-primary"
//                       >
//                         View PDF
//                       </a>
//                     </CCardBody>
//                   </CCard>
//                 </CCol>
//               </CRow>
//             )}
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <div className="d-flex justify-content-between w-100">
//             <div>
//               {kycData.status === 'PENDING' && (
//                 <>
//                   <CButton color="success" onClick={() => handleStatusButtonClick('APPROVED')} disabled={actionLoading}>
//                     {actionLoading ? 'Approving...' : 'Approve KYC'}
//                   </CButton>
//                   <CButton color="danger" onClick={() => handleStatusButtonClick('REJECTED')} disabled={actionLoading} className="ms-2">
//                     {actionLoading ? 'Rejecting...' : 'Reject KYC'}
//                   </CButton>
//                 </>
//               )}
//               {(kycData.status === 'REJECTED' || kycData.status === 'NOT_UPLOADED') && (
//                 <>
//                   <span className={`status-badge ${kycData.status.toLowerCase()}`}>KYC {kycData.status}</span>
//                   <Link
//                     to={`/upload-kyc/${bookingId}`}
//                     state={{
//                       bookingId: bookingId,
//                       customerName: kycData.customerName,
//                       address: kycData.address
//                     }}
//                     className="ms-2"
//                   >
//                     <CButton className="upload-kyc-btn icon-only">
//                       <CIcon icon={cilCloudUpload} />
//                     </CButton>
//                   </Link>
//                 </>
//               )}
//               {kycData.status === 'APPROVED' && (
//                 <span className={`status-badge ${kycData.status.toLowerCase()}`}>KYC {kycData.status}</span>
//               )}
//             </div>
//             <CButton color="secondary" onClick={onClose}>
//               Close
//             </CButton>
//           </div>
//         </CModalFooter>
//       </CModal>

//       {/* KYC Status Update Modal */}
//       <CModal visible={showStatusModal} onClose={() => setShowStatusModal(false)} alignment="center">
//         <CModalHeader>
//           <CModalTitle>{`${currentAction === 'APPROVED' ? 'Approve' : 'Reject'} KYC`}</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel htmlFor="verificationNote">Verification Note</CFormLabel>
//             <CFormInput
//               id="verificationNote"
//               type="text"
//               placeholder={`Enter ${currentAction === 'APPROVED' ? 'approval' : 'rejection'} note`}
//               value={verificationNote}
//               onChange={(e) => setVerificationNote(e.target.value)}
//               required
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setShowStatusModal(false)} disabled={actionLoading}>
//             Cancel
//           </CButton>
//           <CButton
//             color={currentAction === 'APPROVED' ? 'success' : 'danger'}
//             onClick={handleKycStatusUpdate}
//             disabled={actionLoading || !verificationNote.trim()}
//           >
//             {actionLoading ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                 Processing...
//               </>
//             ) : currentAction === 'APPROVED' ? (
//               'Approve'
//             ) : (
//               'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </>
//   );
// };

// KYCView.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   refreshData: PropTypes.func.isRequired,
//   bookingId: PropTypes.string.isRequired,
//   kycData: PropTypes.shape({
//     aadharFront: PropTypes.string,
//     aadharBack: PropTypes.string,
//     panCard: PropTypes.string,
//     vPhoto: PropTypes.string,
//     chasisNoPhoto: PropTypes.string,
//     addressProof1: PropTypes.string,
//     addressProof2: PropTypes.string,
//     documentPdf: PropTypes.string,
//     status: PropTypes.oneOf(['PENDING', 'APPROVED', 'REJECTED', 'NOT_UPLOADED']),
//     customerName: PropTypes.string,
//     address: PropTypes.string,
//     id: PropTypes.string
//   })
// };

// export default KYCView;

import React, { useEffect, useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CBadge,
  CButton,
  CFormInput,
  CFormLabel
} from '@coreui/react';
import PropTypes from 'prop-types';
import config from 'config';
import { showError, showSuccess } from 'utils/sweetAlerts';
import axiosInstance from 'axiosInstance';
import '../../css/kycView.css';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload } from '@coreui/icons';

const KYCView = ({ open, onClose, kycData, refreshData, bookingId }) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [verificationNote, setVerificationNote] = useState('');

  const handleStatusButtonClick = (action) => {
    setCurrentAction(action);
    setShowStatusModal(true);
  };

  useEffect(() => {
    if (bookingId) {
      console.log('KYCView received valid bookingId:', bookingId);
    } else {
      console.warn('KYCView received null bookingId!');
    }
  }, [bookingId]);

  const handleKycStatusUpdate = async () => {
    try {
      setActionLoading(true);
      console.log('Fetching KYC for booking ID:', bookingId);
      if (!bookingId) {
        showError('Booking ID is missing');
        return;
      }
      if (!verificationNote.trim()) {
        alert('Verification note is required');
        return;
      }

      await axiosInstance.post(`/kyc/${bookingId}/verify`, {
        status: currentAction,
        verificationNote: verificationNote
      });

      showSuccess(`KYC ${currentAction.toLowerCase()} successfully!`);
      refreshData();
      setShowStatusModal(false);
      onClose();
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || `Failed to update KYC status`);
    } finally {
      setActionLoading(false);
    }
  };

  if (!kycData || !kycData.kycDocuments) {
    return (
      <CModal visible={open} onClose={onClose} size="xl">
        <CModalHeader>
          <CModalTitle>Loading KYC Details...</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="text-center py-4">Loading KYC information...</div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    );
  }

  const { kycDocuments } = kycData;

  return (
    <>
      <CModal visible={open} onClose={onClose} size="xl">
        <CModalHeader>
          <CModalTitle>KYC Documents</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="kyc-documents-container">
            <CRow>
              <CCol md={6}>
                <CCard className="document-card">
                  <CCardHeader>Aadhar Front</CCardHeader>
                  <CCardBody>
                    {kycDocuments.aadharFront?.original ? (
                      <img src={`${config.baseURL}${kycDocuments.aadharFront.original}`} alt="Aadhar Front" className="document-image" />
                    ) : (
                      <div className="text-muted">No document uploaded</div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={6}>
                <CCard className="document-card">
                  <CCardHeader>Aadhar Back</CCardHeader>
                  <CCardBody>
                    {kycDocuments.aadharBack?.original ? (
                      <img src={`${config.baseURL}${kycDocuments.aadharBack.original}`} alt="Aadhar Back" className="document-image" />
                    ) : (
                      <div className="text-muted">No document uploaded</div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CRow className="mt-4">
              <CCol md={6}>
                <CCard className="document-card">
                  <CCardHeader>PAN Card</CCardHeader>
                  <CCardBody>
                    {kycDocuments.panCard?.original ? (
                      <img src={`${config.baseURL}${kycDocuments.panCard.original}`} alt="PAN Card" className="document-image" />
                    ) : (
                      <div className="text-muted">No document uploaded</div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={6}>
                <CCard className="document-card">
                  <CCardHeader>Vehicle Photo</CCardHeader>
                  <CCardBody>
                    {kycDocuments.vPhoto?.original ? (
                      <img src={`${config.baseURL}${kycDocuments.vPhoto.original}`} alt="Vehicle Photo" className="document-image" />
                    ) : (
                      <div className="text-muted">No document uploaded</div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CRow className="mt-4">
              <CCol md={6}>
                <CCard className="document-card">
                  <CCardHeader>Chassis Number Photo</CCardHeader>
                  <CCardBody>
                    {kycDocuments.chasisNoPhoto?.original ? (
                      <img
                        src={`${config.baseURL}${kycDocuments.chasisNoPhoto.original}`}
                        alt="Chassis Number"
                        className="document-image"
                      />
                    ) : (
                      <div className="text-muted">No document uploaded</div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={6}>
                <CCard className="document-card">
                  <CCardHeader>Address Proof 1</CCardHeader>
                  <CCardBody>
                    {kycDocuments.addressProof1?.original ? (
                      <img
                        src={`${config.baseURL}${kycDocuments.addressProof1.original}`}
                        alt="Address Proof 1"
                        className="document-image"
                      />
                    ) : (
                      <div className="text-muted">No document uploaded</div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CRow className="mt-4">
              <CCol md={6}>
                <CCard className="document-card">
                  <CCardHeader>Address Proof 2</CCardHeader>
                  <CCardBody>
                    {kycDocuments.addressProof2?.original ? (
                      <img
                        src={`${config.baseURL}${kycDocuments.addressProof2.original}`}
                        alt="Address Proof 2"
                        className="document-image"
                      />
                    ) : (
                      <div className="text-muted">No document uploaded</div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={6}>
                <CCard className="document-card">
                  <CCardHeader>KYC Document PDF</CCardHeader>
                  <CCardBody>
                    {kycDocuments.documentPdf ? (
                      <a
                        href={`${config.baseURL}${kycDocuments.documentPdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        View PDF
                      </a>
                    ) : (
                      <div className="text-muted">No PDF available</div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </div>
        </CModalBody>
        <CModalFooter>
          <div className="d-flex justify-content-between w-100">
            <div>
              {kycData.status === 'PENDING' && (
                <>
                  <CButton color="success" onClick={() => handleStatusButtonClick('APPROVED')} disabled={actionLoading}>
                    {actionLoading ? 'Approving...' : 'Approve KYC'}
                  </CButton>
                  <CButton color="danger" onClick={() => handleStatusButtonClick('REJECTED')} disabled={actionLoading} className="ms-2">
                    {actionLoading ? 'Rejecting...' : 'Reject KYC'}
                  </CButton>
                </>
              )}
              {(kycData.status === 'REJECTED' || kycData.status === 'NOT_UPLOADED') && (
                <>
                  <span className={`status-badge ${kycData.status.toLowerCase()}`}>KYC {kycData.status}</span>
                  <Link
                    to={`/upload-kyc/${bookingId}`}
                    state={{
                      bookingId: bookingId,
                      customerName: kycData.customerName,
                      address: kycData.address
                    }}
                    className="ms-2"
                  >
                    <CButton className="upload-kyc-btn icon-only">
                      <CIcon icon={cilCloudUpload} />
                    </CButton>
                  </Link>
                </>
              )}
              {kycData.status === 'APPROVED' && (
                <span className={`status-badge ${kycData.status.toLowerCase()}`}>KYC {kycData.status}</span>
              )}
            </div>
            <CButton color="secondary" onClick={onClose}>
              Close
            </CButton>
          </div>
        </CModalFooter>
      </CModal>

      {/* KYC Status Update Modal */}
      <CModal visible={showStatusModal} onClose={() => setShowStatusModal(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>{`${currentAction === 'APPROVED' ? 'Approve' : 'Reject'} KYC`}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel htmlFor="verificationNote">Verification Note</CFormLabel>
            <CFormInput
              id="verificationNote"
              type="text"
              placeholder={`Enter ${currentAction === 'APPROVED' ? 'approval' : 'rejection'} note`}
              value={verificationNote}
              onChange={(e) => setVerificationNote(e.target.value)}
              required
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowStatusModal(false)} disabled={actionLoading}>
            Cancel
          </CButton>
          <CButton
            color={currentAction === 'APPROVED' ? 'success' : 'danger'}
            onClick={handleKycStatusUpdate}
            disabled={actionLoading || !verificationNote.trim()}
          >
            {actionLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : currentAction === 'APPROVED' ? (
              'Approve'
            ) : (
              'Reject'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

KYCView.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
  bookingId: PropTypes.string.isRequired,
  kycData: PropTypes.shape({
    kycDocuments: PropTypes.shape({
      aadharFront: PropTypes.shape({
        original: PropTypes.string,
        pdf: PropTypes.string,
        mimetype: PropTypes.string,
        originalname: PropTypes.string
      }),
      aadharBack: PropTypes.shape({
        original: PropTypes.string,
        pdf: PropTypes.string,
        mimetype: PropTypes.string,
        originalname: PropTypes.string
      }),
      panCard: PropTypes.shape({
        original: PropTypes.string,
        pdf: PropTypes.string,
        mimetype: PropTypes.string,
        originalname: PropTypes.string
      }),
      vPhoto: PropTypes.shape({
        original: PropTypes.string,
        pdf: PropTypes.string,
        mimetype: PropTypes.string,
        originalname: PropTypes.string
      }),
      chasisNoPhoto: PropTypes.shape({
        original: PropTypes.string,
        pdf: PropTypes.string,
        mimetype: PropTypes.string,
        originalname: PropTypes.string
      }),
      addressProof1: PropTypes.shape({
        original: PropTypes.string,
        pdf: PropTypes.string,
        mimetype: PropTypes.string,
        originalname: PropTypes.string
      }),
      addressProof2: PropTypes.shape({
        original: PropTypes.string,
        pdf: PropTypes.string,
        mimetype: PropTypes.string,
        originalname: PropTypes.string
      }),
      documentPdf: PropTypes.string
    }),
    status: PropTypes.oneOf(['PENDING', 'APPROVED', 'REJECTED', 'NOT_UPLOADED']),
    customerName: PropTypes.string,
    address: PropTypes.string,
    id: PropTypes.string
  })
};

export default KYCView;
