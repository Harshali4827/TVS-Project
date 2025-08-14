import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

// project import
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';
import PrivateRoute from 'guards/PrivateRoutes';

// ==============================|| ROUTES ||============================== //

const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

export const routes = [
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/reset-password-1',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    exact: 'true',
    path: '/verify-otp',
    element: lazy(() => import('./views/auth/verify-otp/VerifyOTP'))
  },
  {
    path: '*',
    layout: AdminLayout,
    guard: PrivateRoute,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/analytics',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/permissions/add-permissions',
        element: lazy(() => import('./views/permissions/AddPermissions'))
      },
      {
        exact: 'true',
        path: '/permissions/permissions-list',
        element: lazy(() => import('./views/permissions/PermissionsList'))
      },
      {
        exact: 'true',
        path: '/roles/create-role',
        element: lazy(() => import('./views/roles/CreateRole'))
      },
      {
        exact: 'true',
        path: '/roles/update-role/:id',
        element: lazy(() => import('./views/roles/CreateRole'))
      },
      {
        exact: 'true',
        path: '/roles/all-role',
        element: lazy(() => import('./views/roles/AllRoles'))
      },
      {
        exact: 'true',
        path: '/users/add-user',
        element: lazy(() => import('./views/users/AddUser'))
      },
      {
        exact: 'true',
        path: '/users/update-user/:id',
        element: lazy(() => import('./views/users/AddUser'))
      },
      {
        exact: 'true',
        path: '/users/users-list',
        element: lazy(() => import('./views/users/UsersList'))
      },
      {
        exact: 'true',
        path: '/branch/add-branch',
        element: lazy(() => import('./views/branch/AddBranch'))
      },
      {
        exact: 'true',
        path: '/branch/update-branch/:id',
        element: lazy(() => import('./views/branch/AddBranch'))
      },
      {
        exact: 'true',
        path: '/branch/branch-list',
        element: lazy(() => import('./views/branch/BranchList'))
      },
      {
        exact: 'true',
        path: '/employee/add-employee',
        element: lazy(() => import('./views/employee/AddEmployee'))
      },
      {
        exact: 'true',
        path: '/employee/update-employee/:id',
        element: lazy(() => import('./views/employee/AddEmployee'))
      },
      {
        exact: 'true',
        path: '/employee/employee-list',
        element: lazy(() => import('./views/employee/EmployeeList'))
      },
      {
        exact: 'true',
        path: '/model/add-model',
        element: lazy(() => import('./views/model/AddModel'))
      },
      {
        exact: 'true',
        path: '/model/update-model/:id',
        element: lazy(() => import('./views/model/UpdateModel'))
      },
      {
        exact: 'true',
        path: '/model/model-list',
        element: lazy(() => import('./views/model/ModelList'))
      },
      {
        exact: 'true',
        path: '/color/add-color',
        element: lazy(() => import('./views/color/AddColor'))
      },
      {
        exact: 'true',
        path: '/color/update-color/:id',
        element: lazy(() => import('./views/color/AddColor'))
      },
      {
        exact: 'true',
        path: '/color/color-list',
        element: lazy(() => import('./views/color/ColorList'))
      },
      {
        exact: 'true',
        path: '/accessories/add-accessories',
        element: lazy(() => import('./views/accessories/AddAccessories'))
      },
      {
        exact: 'true',
        path: '/accessories/update-accessories/:id',
        element: lazy(() => import('./views/accessories/AddAccessories'))
      },
      {
        exact: 'true',
        path: '/accessories/accessories-list',
        element: lazy(() => import('./views/accessories/AccessoriesList'))
      },

      {
        exact: 'true',
        path: '/categories/add-category',
        element: lazy(() => import('./views/categories/AddCategory'))
      },
      {
        exact: 'true',
        path: '/categories/update-category/:id',
        element: lazy(() => import('./views/categories/AddCategory'))
      },
      {
        exact: 'true',
        path: '/categories/categories-list',
        element: lazy(() => import('./views/categories/CategoryList'))
      },
      {
        exact: 'true',
        path: '/inward-stock',
        element: lazy(() => import('./views/inward/InwardStock'))
      },
      {
        exact: 'true',
        path: '/update-inward/:id',
        element: lazy(() => import('./views/inward/InwardStock'))
      },
      {
        exact: 'true',
        path: '/inward-list',
        element: lazy(() => import('./views/inward/StockList'))
      },
      {
        exact: 'true',
        path: '/stock-verification',
        element: lazy(() => import('./views/inward/StockVerification'))
      },
      {
        exact: 'true',
        path: '/rto/add-rto',
        element: lazy(() => import('./views/rto-master/AddRto'))
      },
      {
        exact: 'true',
        path: '/rto/update-rto/:id',
        element: lazy(() => import('./views/rto-master/AddRto'))
      },
      {
        exact: 'true',
        path: '/rto/rto-list',
        element: lazy(() => import('./views/rto-master/RtoList'))
      },
      {
        exact: 'true',
        path: '/financer/add-financer',
        element: lazy(() => import('./views/financer/AddFinancer'))
      },
      {
        exact: 'true',
        path: '/financer/update-financer/:id',
        element: lazy(() => import('./views/financer/AddFinancer'))
      },
      {
        exact: 'true',
        path: '/financer/financer-list',
        element: lazy(() => import('./views/financer/FinancerList'))
      },
      {
        exact: 'true',
        path: '/financer-rates/add-rates',
        element: lazy(() => import('./views/finance-rates/AddRates'))
      },
      {
        exact: 'true',
        path: '/financer-rates/update-rates/:id',
        element: lazy(() => import('./views/finance-rates/AddRates'))
      },
      {
        exact: 'true',
        path: '/financer-rates/update-rates/:id',
        element: lazy(() => import('./views/finance-rates/AddRates'))
      },
      {
        exact: 'true',
        path: '/financer-rates/rates-list',
        element: lazy(() => import('./views/finance-rates/RatesList'))
      },
      {
        exact: 'true',
        path: '/insurance-provider/add-provider',
        element: lazy(() => import('./views/insurance-provider/AddProvider'))
      },
      {
        exact: 'true',
        path: '/insurance-provider/update-provider/:id',
        element: lazy(() => import('./views/insurance-provider/AddProvider'))
      },
      {
        exact: 'true',
        path: '/insurance-provider/provider-list',
        element: lazy(() => import('./views/insurance-provider/ProvidersList'))
      },
      {
        exact: 'true',
        path: '/broker/add-broker',
        element: lazy(() => import('./views/broker/AddBroker'))
      },
      {
        exact: 'true',
        path: '/broker/update-broker/:id',
        element: lazy(() => import('./views/broker/AddBroker'))
      },
      {
        exact: 'true',
        path: '/broker/broker-list',
        element: lazy(() => import('./views/broker/BrokerList'))
      },
      {
        exact: 'true',
        path: '/headers/add-header',
        element: lazy(() => import('./views/headers/AddHeader'))
      },
      {
        exact: 'true',
        path: '/headers/update-header/:id',
        element: lazy(() => import('./views/headers/AddHeader'))
      },
      {
        exact: 'true',
        path: '/headers/update-header/:id',
        element: lazy(() => import('./views/headers/AddHeader'))
      },
      {
        exact: 'true',
        path: '/headers/headers-list',
        element: lazy(() => import('./views/headers/HeadersList'))
      },
      {
        exact: 'true',
        path: '/customers/add-customer',
        element: lazy(() => import('./views/customers/AddCustomer'))
      },
      {
        exact: 'true',
        path: '/customers/update-customer/:id',
        element: lazy(() => import('./views/customers/AddCustomer'))
      },
      {
        exact: 'true',
        path: '/customers/customers-list',
        element: lazy(() => import('./views/customers/CustomersList'))
      },
      {
        exact: 'true',
        path: '/documents/add-document',
        element: lazy(() => import('./views/documents/AddDocument'))
      },
      {
        exact: 'true',
        path: '/documents/update-document/:id',
        element: lazy(() => import('./views/documents/AddDocument'))
      },
      {
        exact: 'true',
        path: '/documents/documents-list',
        element: lazy(() => import('./views/documents/DocumentsList'))
      },
      {
        exact: 'true',
        path: '/conditions/add-condition',
        element: lazy(() => import('./views/terms-and-conditions/AddCondition'))
      },
      {
        exact: 'true',
        path: '/conditions/update-condition/:id',
        element: lazy(() => import('./views/terms-and-conditions/AddCondition'))
      },
      {
        exact: 'true',
        path: '/conditions/conditions-list',
        element: lazy(() => import('./views/terms-and-conditions/ConditionList'))
      },

      {
        exact: 'true',
        path: '/offers/add-offer',
        element: lazy(() => import('./views/model-offers/AddOffers'))
      },
      {
        exact: 'true',
        path: '/offers/update-offer/:id',
        element: lazy(() => import('./views/model-offers/AddOffers'))
      },
      {
        exact: 'true',
        path: '/offers/offer-list',
        element: lazy(() => import('./views/model-offers/OffersList'))
      },
      {
        exact: 'true',
        path: '/attachments/add-attachments',
        element: lazy(() => import('./views/attachments/Attachments'))
      },
      {
        exact: 'true',
        path: '/attachments/update-attachments/:id',
        element: lazy(() => import('./views/attachments/Attachments'))
      },
      {
        exact: 'true',
        path: '/attachments/attachments-list',
        element: lazy(() => import('./views/attachments/AttachmentsList'))
      },
      {
        exact: 'true',
        path: '/add-declaration',
        element: lazy(() => import('./views/declaration/AddDeclaration'))
      },
      {
        exact: 'true',
        path: '/update-declaration/:id',
        element: lazy(() => import('./views/declaration/AddDeclaration'))
      },
      {
        exact: 'true',
        path: '/declaration-master',
        element: lazy(() => import('./views/declaration/DeclarationList'))
      },
      {
        exact: 'true',
        path: '/booking-form',
        element: lazy(() => import('./views/sales/BookingForm'))
      },

      {
        exact: 'true',
        path: '/booking-form/:id',
        element: lazy(() => import('./views/sales/BookingForm'))
      },
      {
        exact: 'true',
        path: '/booking-list',
        element: lazy(() => import('./views/sales/BookingList'))
      },
      {
        exact: 'true',
        path: '/upload-kyc',
        element: lazy(() => import('./views/sales/UploadKYC'))
      },
      {
        exact: 'true',
        path: '/upload-kyc/:id',
        element: lazy(() => import('./views/sales/UploadKYC'))
      },
      {
        exact: 'true',
        path: '/upload-finance',
        element: lazy(() => import('./views/sales/UploadFinance'))
      },
      {
        exact: 'true',
        path: '/upload-finance/:id',
        element: lazy(() => import('./views/sales/UploadFinance'))
      },
      {
        exact: 'true',
        path: '/delivery-challan',
        element: lazy(() => import('./views/delivery-challan/DeliveryChallan'))
      },
      {
        exact: 'true',
        path: '/invoice',
        element: lazy(() => import('./views/sales/Invoice'))
      },
      {
        exact: 'true',
        path: '/stock-transfer',
        element: lazy(() => import('./views/purchase/StockTransfer'))
      },
      {
        exact: 'true',
        path: '/upload-challan',
        element: lazy(() => import('./views/purchase/UploadChallan'))
      },
      {
        exact: 'true',
        path: '/buffer/buffer-list',
        element: lazy(() => import('./views/buffer/BufferList'))
      },
      {
        exact: 'true',
        path: '/pending-updates',
        element: lazy(() => import('./views/sales/PendingUpdates'))
      },
      {
        exact: 'true',
        path: '/deal-form',
        element: lazy(() => import('./views/sales/DealForm'))
      },
      {
        exact: 'true',
        path: '/sales-report',
        element: lazy(() => import('./views/sales-report/SalesReport'))
      },
      {
        exact: 'true',
        path: '/account/receipt',
        element: lazy(() => import('./views/account/Receipt'))
      },
      {
        exact: 'true',
        path: '/view-ledgers',
        element: lazy(() => import('./views/account/ViewLedger'))
      },
      {
        exact: 'true',
        path: '/account-dashboard',
        element: lazy(() => import('./views/account/AccountDashboard'))
      },
      {
        exact: 'true',
        path: '/debit-note',
        element: lazy(() => import('./views/account/debit-note/DebitNote'))
      },
      {
        exact: 'true',
        path: '/account/pending-receipt',
        element: lazy(() => import('./views/account/PendingReceipt'))
      },
      {
        exact: 'true',
        path: '/account/all-receipt',
        element: lazy(() => import('./views/account/AllReceipt'))
      },
      {
        exact: 'true',
        path: '/exchange-ledgers',
        element: lazy(() => import('./views/account/ExchangeLedger'))
      },
      {
        exact: 'true',
        path: '/bank-master',
        element: lazy(() => import('./views/fund-master/BankList'))
      },
      {
        exact: 'true',
        path: '/add-bank',
        element: lazy(() => import('./views/fund-master/AddBank'))
      },
      {
        exact: 'true',
        path: '/update-bank/:id',
        element: lazy(() => import('./views/fund-master/AddBank'))
      },
      {
        exact: 'true',
        path: '/cash-master',
        element: lazy(() => import('./views/fund-master/CashList'))
      },
      {
        exact: 'true',
        path: '/add-cash',
        element: lazy(() => import('./views/fund-master/AddCash'))
      },
      {
        exact: 'true',
        path: '/update-cash/:id',
        element: lazy(() => import('./views/fund-master/AddCash'))
      },
      {
        exact: 'true',
        path: '/add-balance',
        element: lazy(() => import('./views/fund-master/AddOpeningBalance'))
      },
      {
        exact: 'true',
        path: '/update-balance/:id',
        element: lazy(() => import('./views/fund-master/AddOpeningBalance'))
      },
       {
        exact: 'true',
        path: '/opening-balance',
        element: lazy(() => import('./views/fund-master/OpeningBalanceList'))
      },
      {
        exact: 'true',
        path: '/insurance-dashboard',
        element: lazy(() => import('./views/insurance/insurance-dashboard/InsuranceDashboard'))
      },
      {
        exact: 'true',
        path: '/add-insurance',
        element: lazy(() => import('./views/insurance/insurance-details/AddInsurance'))
      },
      {
        exact: 'true',
        path: '/insurance-receipts',
        element: lazy(() => import('./views/insurance/insurance-receipt/InsuranceReceipt'))
      },
      {
        exact: 'true',
        path: '/insurance-list',
        element: lazy(() => import('./views/insurance/insurance-details/InsuranceList'))
      },
      {
        exact: 'true',
        path: '/insurance-report',
        element: lazy(() => import('./views/insurance/report/InsuranceReport'))
      },
      {
        exact: 'true',
        path: '/rto-dashboard',
        element: lazy(() => import('./views/rto/RTODashboard'))
      },
      {
        exact: 'true',
        path: '/rto/application',
        element: lazy(() => import('./views/rto/Application'))
      },
      {
        exact: 'true',
        path: '/rto/rto-paper',
        element: lazy(() => import('./views/rto/RTOPaper'))
      },
      {
        exact: 'true',
        path: '/rto/rto-paper',
        element: lazy(() => import('./views/rto/RTOPaper'))
      },
      {
        exact: 'true',
        path: '/rto/rto-tax',
        element: lazy(() => import('./views/rto/RTOTax'))
      },
      {
        exact: 'true',
        path: '/rto/hsrp-ordering',
        element: lazy(() => import('./views/rto/HSRPOrdering'))
      },
      {
        exact: 'true',
        path: '/rto/hsrp-installation',
        element: lazy(() => import('./views/rto/HSRPInstallation'))
      },
      {
        exact: 'true',
        path: '/rto/rc-confirmation',
        element: lazy(() => import('./views/rto/RCConfirmation'))
      },
      {
        exact: 'true',
        path: '/rto/report',
        element: lazy(() => import('./views/rto/RTOReport'))
      },
      {
        exact: 'true',
        path: '/cash-voucher',
        element: lazy(() => import('./views/fund-management/CashVoucher'))
      },
      {
        exact: 'true',
        path: '/contra-voucher',
        element: lazy(() => import('./views/fund-management/ContraVoucher'))
      },
      {
        exact: 'true',
        path: '/contra-approval',
        element: lazy(() => import('./views/fund-management/ContraApproval'))
      },
      {
        exact: 'true',
        path: '/cash-approval',
        element: lazy(() => import('./views/fund-management/CashApproval'))
      },
       {
        exact: 'true',
        path: '/workshop-approval',
        element: lazy(() => import('./views/fund-management/WorkshopReceiptApproval'))
      },
      {
        exact: 'true',
        path: '/workshop-receipt',
        element: lazy(() => import('./views/fund-management/WorkshopReceipt'))
      },
      {
        exact: 'true',
        path: '/cash-receipt',
        element: lazy(() => import('./views/fund-management/CashReceipt'))
      },
      {
        exact: 'true',
        path: '/cash-book',
        element: lazy(() => import('./views/fund-management/CashBook'))
      },
      {
        exact: 'true',
        path: '/day-book',
        element: lazy(() => import('./views/fund-management/DayBook'))
      },
      {
        exact: 'true',
        path: '/fund-report',
        element: lazy(() => import('./views/fund-management/FundReport'))
      },
      {
        exact: 'true',
        path: '/expense',
        element: lazy(() => import('./views/fund-master/AddExpense'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default renderRoutes;
