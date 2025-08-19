// import config from 'config';
// import '../../css/table.css';
// import '../../css/bill.css';
// import {
//   React,
//   useEffect,
//   SearchOutlinedIcon,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   axiosInstance,
//   useState
// } from 'utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import { cilFile, cilImage } from '@coreui/icons';
// import { Page,pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// const AllReceipt = () => {
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const { currentRecords, PaginationOptions } = usePagination(filteredData);
//   const [isPdf, setIsPdf] = useState(false);
//   const [selectedBill, setSelectedBill] = useState(null);
//   const [numPages, setNumPages] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/vouchers`);
//       setData(response.data.data);
//       setFilteredData(response.data.data);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };

// const handleViewBill = (billUrl) => {
//     const isPdfFile = billUrl.toLowerCase().endsWith('.pdf');
//     setIsPdf(isPdfFile);
//     setSelectedBill(`${config.baseURL}${billUrl}`);
//   };

//   const handleCloseBillModal = () => {
//     setSelectedBill(null);
//     setNumPages(null);
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };
//   const handleViewPdf = async (id) => {
//     try {
//       const response = await axiosInstance.get(`/vouchers/receipt/${id}`, {
//         responseType: 'blob'
//       });

//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const link = document.createElement('a');
//       link.href = window.URL.createObjectURL(blob);
//       link.download = `receipt_${id}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading PDF:', error);
//       alert('Failed to download receipt. Please try again.');
//     }
//   };

//   return (
//     <div>
//       <h4>Cash Receipt</h4>
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
//         </div>
//         <div className="table-responsive">
//           <div className="table-wrapper">
//             <table className="responsive-table" style={{ overflow: 'auto' }}>
//               <thead className="table-header-fixed">
//                 <tr>
//                   <th>Sr.no</th>
//                   <th>Voucher ID</th>
//                   <th>Recipient Name</th>
//                   <th>Date</th>
//                   <th>Voucher Type</th>
//                   <th>Debit</th>
//                   <th>Credit</th>
//                   <th>Payment Mode</th>
//                   <th>Bank Location</th>
//                   <th>Cash Location</th>
//                   <th>Bill</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentRecords.length === 0 ? (
//                   <tr>
//                     <td colSpan="10" style={{ color: 'red' }}>
//                       No cash receipt available
//                     </td>
//                   </tr>
//                 ) : (
//                   currentRecords.map((item, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>{item.voucherId}</td>
//                       <td>{item.recipientName}</td>
//                       <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-GB') : ''}</td>
//                       <td>{item.voucherType}</td>
//                       <td>{item.voucherType === 'debit' ? item.amount : 0}</td>
//                       <td>{item.voucherType === 'credit' ? item.amount : 0}</td>
//                       <td>{item.paymentMode || ''}</td>
//                       <td>{item.bankLocation || ''}</td>
//                       <td>{item.cashLocation || ''}</td>
//                      <td>
//   {item.billUrl ? (
//     <button 
//       className="view-bill-button" 
//       onClick={() => handleViewBill(item.billUrl)}
//     >
//       <CIcon icon={item.billUrl.toLowerCase().endsWith('.pdf') ? cilFile : cilImage} />
//       VIEW BILL
//     </button>
//   ) : (
//     <span className="no-bill">No bill attached</span>
//   )}
// </td>
//                       <td>
//                         <button className="action-button" onClick={() => handleViewPdf(item._id)}>
//                           DOWNLOAD
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <PaginationOptions />
//       {selectedBill && (
//         <div className="bill-modal">
//           <div className="bill-modal-content">
//             <span className="close" onClick={handleCloseBillModal}>&times;</span>
            
//             {isPdf ? (
//               <div className="pdf-viewer">
//                 <Document
//                   file={selectedBill}
//                   onLoadSuccess={onDocumentLoadSuccess}
//                   onLoadError={console.error}
//                 >
//                   {Array.from(new Array(numPages), (el, index) => (
//                     <Page
//                       key={`page_${index + 1}`}
//                       pageNumber={index + 1}
//                       width={Math.min(800, window.innerWidth - 100)}
//                     />
//                   ))}
//                 </Document>
//               </div>
//             ) : (
//               <img 
//                 src={selectedBill} 
//                 alt="Bill" 
//                 className="bill-image"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = '/path-to-fallback-image.png';
//                 }}
//               />
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//     </div>
//   );
// };

// export default AllReceipt;


import '../../css/table.css';
import '../../css/bill.css';
import {
  React,
  useEffect,
  SearchOutlinedIcon,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  axiosInstance
} from 'utils/tableImports';
import { FaFilePdf, FaFileImage, FaFileAlt } from 'react-icons/fa';
import config from 'config';

const AllReceipt = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/vouchers`);
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const handleViewPdf = async (id) => {
    try {
      const response = await axiosInstance.get(`/vouchers/receipt/${id}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `receipt_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download receipt. Please try again.');
    }
  };

  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return null;
    
    const extension = fileUrl.split('.').pop().toLowerCase();
    
    if (extension === 'pdf') {
      return <FaFilePdf className="file-icon pdf" />;
    } else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
      return <FaFileImage className="file-icon image" />;
    } else {
      return <FaFileAlt className="file-icon other" />;
    }
  };

  const handleViewBill = (billUrl) => {
    if (!billUrl) return;
    
    const fullUrl = `${config.baseURL}${billUrl}`;
    const extension = billUrl.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
      // Open image in new tab
      window.open(fullUrl, '_blank');
    } else if (extension === 'pdf') {
      // Open PDF in new tab
      window.open(fullUrl, '_blank');
    } else {
      // Download other file types
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = billUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h4>Cash Receipt</h4>
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
        </div>
        <div className="table-responsive">
          <div className="table-wrapper">
            <table className="responsive-table" style={{ overflow: 'auto' }}>
              <thead className="table-header-fixed">
                <tr>
                  <th>Sr.no</th>
                  <th>Voucher ID</th>
                  <th>Recipient Name</th>
                  <th>Date</th>
                  <th>Voucher Type</th>
                  <th>Debit</th>
                  <th>Credit</th>
                  <th>Payment Mode</th>
                  <th>Bank Location</th>
                  <th>Cash Location</th>
                  <th>Bill</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="12" style={{ color: 'red' }}>
                      No cash receipt available
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.voucherId}</td>
                      <td>{item.recipientName}</td>
                      <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-GB') : ''}</td>
                      <td>{item.voucherType}</td>
                      <td>{item.voucherType === 'debit' ? item.amount : 0}</td>
                      <td>{item.voucherType === 'credit' ? item.amount : 0}</td>
                      <td>{item.paymentMode || ''}</td>
                      <td>{item.bankLocation || ''}</td>
                      <td>{item.cashLocation || ''}</td>
                      <td>
                        {item.billUrl ? (
                          <div className="bill-cell" onClick={() => handleViewBill(item.billUrl)}>
                            {getFileIcon(item.billUrl)}
                            <span className="bill-text">View Bill</span>
                          </div>
                        ) : (
                          'No bill'
                        )}
                      </td>
                      <td>
                        <button className="action-button" onClick={() => handleViewPdf(item._id)}>
                          DOWNLOAD
                        </button>
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
    </div>
  );
};

export default AllReceipt;