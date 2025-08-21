const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/analytics'
        }
      ]
    },

    /*********************************/
    {
      id: 'components',
      title: 'Components',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'purchase',
          title: 'Purchase',
          type: 'collapse',
          icon: 'fas fa-warehouse',
          children: [
            {
              id: 'inward list',
              title: 'Inward Stock',
              type: 'item',
              url: '/inward-list'
            },
            {
              id: 'stock verification',
              title: 'Stock Verification',
              type: 'item',
              url: '/stock-verification'
            },
             {
          id: 'stock-transfer',
          title: 'Stock Transfer',
          type: 'item',
          url: '/stock-transfer'
        },
        {
          id: 'upload-challan',
          title: 'Upload Challan',
          type: 'item',
          url: '/upload-challan'
        }

          ]
        },
        {
          id: 'booking-form',
          title: 'Sales',
          type: 'collapse',
          icon: 'feather icon-file-text',
          children: [
            {
              id: 'booking form',
              title: 'New Booking',
              type: 'item',
              url: '/booking-form'
            },
            {
              id: 'booking list',
              title: 'All Booking',
              type: 'item',
              url: '/booking-list'
            },
            // {
            //   id: 'upload kyc',
            //   title: 'Upload KYC',
            //   type: 'item',
            //   url: '/upload-kyc'
            // },
            // {
            //   id: 'upload finance',
            //   title: 'Upload Finance Letter',
            //   type: 'item',
            //   url: '/upload-finance'
            // },
            {
              id: 'delivary challan',
              title: 'Delivery Challan',
              type: 'item',
              url: '/delivery-challan'
            },
            {
              id: 'invoice',
              title: 'Invoice',
              type: 'item',
              url: '/invoice'
            },
            {
              id: 'deal-form',
              title: 'Deal Form',
              type: 'item',
              url: '/deal-form'
            },
            {
              id: 'pending updates',
              title: 'Pending Updates',
              type: 'item',
              url: '/pending-updates'
            }
          ]
        },
          {
          id: 'sales report',
          title: 'Sales Report',
          type: 'collapse',
          icon: 'feather icon-file-text',
          children: [
            {
              id: 'sales report',
              title: 'Sales Person Wise',
              type: 'item',
              url: '/sales-report'
            }
          ]
        },
          {
          id: 'customers',
          title: 'Quotation',
          type: 'collapse',
          icon: 'feather icon-users',
          children: [
            {
              id: 'customers list',
              title: 'Customer Quotation',
              type: 'item',
              url: '/customers/customers-list'
            }
          ]
        },
         {
          id: 'account',
          title: 'Account',
          type: 'collapse',
          icon: 'fas fa-university',

          children: [
            {
              id: 'account-dashboard',
              title: 'PF/NPF Dashboard',
              type: 'item',
              url: '/account-dashboard'
            },
            {
              id: 'receipts',
              title: 'Receipts',
              type: 'item',
              url: '/account/receipt'
            },
            {
              id: 'debit-note',
              title: 'Debit Note',
              type: 'item',
              url: '/debit-note'
            },
            // {
            //   id: 'pending-receipts',
            //   title: 'Pending Receipts',
            //   type: 'item',
            //   url: '/account/pending-receipt'
            // },
            {
              id: 'all-receipts',
              title: 'All Receipts',
              type: 'item',
              url: '/account/all-receipt'
            },
            {
              id: 'view-ledgers',
              title: 'Ledgers',
              type: 'item',
              url: '/view-ledgers'
            },
            {
              id: 'view-ledgers',
              title: 'Exchange Ledger',
              type: 'item',
              url: '/exchange-ledgers'
            }
          ]
        },
         {
          id: 'insurance',
          title: 'Insurance',
          type: 'collapse',
          icon: 'fas fa-layer-group',
          children: [
            {
              id: 'dashboard',
              title: 'Dashboard',
              type: 'item',
              icon: 'feather icon-home',
              url: '/insurance-dashboard'
            },
            // {
            //   id: 'add-insurance',
            //   title: 'Add Insurance',
            //   type: 'item',
            //   url: '/add-insurance'
            // },
            // {
            //   id: 'manage-insurance',
            //   title: 'Manage Insurance',
            //   type: 'item',
            //   url: '/insurance-list'
            // },
            {
              id: 'report',
              title: 'Add Insurance',
              type: 'item',
              url: '/insurance-report'
            }
          ]
        },
         {
          id: 'rto',
          title: 'RTO',
          type: 'collapse',
          icon: 'fas fa-truck',
          children: [
            {
              id: 'rto-dashboard',
              title: 'Dashboard',
              type: 'item',
              icon: 'feather icon-home',
              url: '/rto-dashboard'
            },
            {
              id: 'application',
              title: 'Application',
              type: 'item',
              url: '/rto/application'
            },
            {
              id: 'rto-paper',
              title: 'RTO Paper',
              type: 'item',
              url: '/rto/rto-paper'
            },
            {
              id: 'rto-tax',
              title: 'RTO TAX',
              type: 'item',
              url: '/rto/rto-tax'
            },
            {
              id: 'hsrp-ordering',
              title: 'HSRP Ordering',
              type: 'item',
              url: '/rto/hsrp-ordering'
            },
            {
              id: 'hsrp-installation',
              title: 'HSRP Installation',
              type: 'item',
              url: '/rto/hsrp-installation'
            },
            {
              id: 'rc-confirmation',
              title: 'RC Confirmation',
              type: 'item',
              url: '/rto/rc-confirmation'
            },
            {
              id: 'rto-report',
              title: 'Report',
              type: 'item',
              url: '/rto/report'
            }
          ]
        },
         {
          id: 'fund-management',
          title: 'Fund Management',
          type: 'collapse',
          icon: 'fas fa-university',
          children: [
            {
              id: 'receipts',
              title: 'Cash Voucher',
              type: 'item',
              url: '/cash-voucher'
            },
            {
              id: 'receipts',
              title: 'Contra Voucher',
              type: 'item',
              url: '/contra-voucher'
            },
            {
              id: 'contra approval',
              title: 'Contra Approval',
              type: 'item',
              url: '/contra-approval'
            },
            {
              id: 'receipts',
              title: 'Workshop Cash Receipt',
              type: 'item',
              url: '/workshop-receipt'
            },
             {
              id: 'workshop approval',
              title: 'Workshop Approval',
              type: 'item',
              url: '/workshop-approval'
            },
            {
              id: 'receipts',
              title: 'All Cash Receipt',
              type: 'item',
              url: '/cash-receipt'
            },
            {
              id: 'receipts',
              title: 'Cash Book',
              type: 'item',
              url: '/cash-book'
            },
            {
              id: 'receipts',
              title: 'Day Book',
              type: 'item',
              url: '/day-book'
            },
            {
              id: 'receipts',
              title: 'Report',
              type: 'item',
              url: '/fund-report'
            }
          ]
        },
         {
          id: 'master',
          title: 'Masters',
          type: 'collapse',
          icon: 'fas fa-medal',
          children: [
            {
              id: 'branch-list',
              title: 'Location',
              type: 'item',
              url: '/branch/branch-list'
            },
            {
              id: 'headers list',
              title: 'Headers',
              type: 'item',
              url: '/headers/headers-list'
            },
            {
              id: 'all models',
              title: 'Vehicles',
              type: 'item',
              url: '/model/model-list'
            },
            {
              id: 'category list',
              title: 'Accessory Categories',
              type: 'item',
              url: '/categories/categories-list'
            },
            {
              id: 'accessories list',
              title: 'Accessories',
              type: 'item',
              url: '/accessories/accessories-list'
            },
            {
              id: 'color list',
              title: 'Colour',
              type: 'item',
              url: '/color/color-list'
            },
            {
              id: 'documents list',
              title: 'Documents',
              type: 'item',
              url: '/documents/documents-list'
            },
            {
              id: 'conditions list',
              title: 'Terms & Conditions',
              type: 'item',
              url: '/conditions/conditions-list'
            },
            {
              id: 'offers List',
              title: 'Offer List',
              type: 'item',
              url: '/offers/offer-list'
            },
            {
              id: 'attachments list',
              title: 'Attachments',
              type: 'item',
              url: '/attachments/attachments-list'
            },
            {
              id: 'declaration list',
              title: 'Declaration',
              type: 'item',
              url: '/declaration-master'
            },
            {
              id: 'rto-list',
              title: 'RTO',
              type: 'item',
              url: '/rto/rto-list'
            },
            {
              id: 'financers-list',
              title: 'Financer List',
              type: 'item',
              url: '/financer/financer-list'
            },
            {
              id: 'rates-list',
              title: 'Finance Rates',
              type: 'item',
              url: '/financer-rates/rates-list'
            },
            {
              id: 'provider-list',
              title: 'Insurance Providers',
              type: 'item',
              url: '/insurance-provider/provider-list'
            },
            {
              id: 'broker list',
              title: 'Broker List',
              type: 'item',
              url: '/broker/broker-list'
            }
          ]
        },
         {
          id: 'fund master',
          title: 'Fund Master',
          type: 'collapse',
          icon: 'fas fa-university',

          children: [
            {
              id: 'receipts',
              title: 'Cash Account Master',
              type: 'item',
              url: '/cash-master'
            },
            {
              id: 'receipts',
              title: 'Bank Account Master',
              type: 'item',
              url: '/bank-master'
            },
            {
              id: 'expense',
              title: 'Expense Master',
              type: 'item',
              url: '/expense'
            },
            {
              id:'opening balance',
              title:"Add Opening Balance",
              type:"item",
              url:"/opening-balance"
            }
          ]
        }

      ]
    },

    /****************************************************************************/
    {
      id: 'sub dealer',
      title: 'SUB DEALER',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'sub-master',
          title: 'Master',
          type: 'collapse',
          icon: 'feather icon-shield',
          children: [
            {
              id: 'subdealer list',
              title: 'Subdealer List',
              type: 'item',
              url: '/subdealer-list'
            },
            {
              id: 'commision',
              title: 'Subdealer Commision',
              type: 'item',
              url: '/subdealer-commission'
            },
            {
              id: 'commision',
              title: 'Calculate Commision',
              type: 'item',
              url: '/subdealer/calculate-commission'
            }
          ]
        },
        {
          id: 'subdealer-booking',
          title: 'Booking',
          type: 'collapse',
          icon: 'feather icon-shield',
          children: [
             {
              id: 'new booking',
              title: 'New Booking',
              type: 'item',
              url: '/subdealer-booking'
            },
            {
              id: 'all subdealer booking',
              title: ' All Booking',
              type: 'item',
              url: '/subdealer-all-bookings'
            },
             {
              id: 'subdealer delivary challan',
              title: 'Delivery Challan',
              type: 'item',
              url: '/delivery-challan'
            },
            {
              id: 'subdealer invoice',
              title: 'Invoice',
              type: 'item',
              url: '/invoice'
            },
            {
              id: 'subdealer deal-form',
              title: 'Deal Form',
              type: 'item',
              url: '/deal-form'
            },
            {
              id: 'subdealer pending updates',
              title: 'Pending Updates',
              type: 'item',
              url: '/pending-updates'
            }
          ]
        },
         {
          id: 'subdealer-account',
          title: 'Account',
          type: 'collapse',
          icon: 'fas fa-university',

          children: [
            // {
            //   id: 'account-dashboard',
            //   title: 'PF/NPF Dashboard',
            //   type: 'item',
            //   url: '/account-dashboard'
            // },
             {
              id: 'add-balance',
              title: 'Add Balance',
              type: 'item',
              url: '/subdealer-account/add-balance'
            },
            {
              id: 'onaccount-balance',
              title: 'OnAccount Balance',
              type: 'item',
              url: '/subdealer-account/onaccount-balance'
            },
            {
              id: 'receipts',
              title: 'Finance Payment',
              type: 'item',
              url: '/subdealer-account/receipt'
            },
             {
              id:'subdealer ledger',
              title: "Subdealer Ledger",
              type: 'item',
              url: '/subdealer-ledger'
            },
             {
              id:'sub-ledger',
              title: "Customer Ledger",
              type: 'item',
              url: '/subdealer/customer-ledger'
            },
             {
              id:'summary',
              title: "Summary",
              type: 'item',
              url: '/subdealer/summary'
            }
          ]
        },
       
      ]
    },
    /*********************************************************** */
    {
      id: 'user management',
      title: 'User Management',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        // {
        //   id: 'permissions',
        //   title: 'Permissions',
        //   type: 'collapse',
        //   icon: 'feather icon-shield',
        //   children: [
        //     {
        //       id: 'create permission',
        //       title: 'Add Permissions',
        //       type: 'item',
        //       url: '/permissions/add-permissions'
        //     },
        //     {
        //       id: 'permissions list',
        //       title: 'Permissions List',
        //       type: 'item',
        //       url: '/permissions/permissions-list'
        //     }
        //   ]
        // },
        {
          id: 'role',
          title: 'Roles',
          type: 'collapse',
          icon: 'feather icon-shield',
          children: [
            {
              id: 'create role',
              title: 'Create Role',
              type: 'item',
              url: '/roles/create-role'
            },
            {
              id: 'all roles',
              title: 'All Roles',
              type: 'item',
              url: '/roles/all-role'
            }
          ]
        },
        {
          id: 'user',
          title: 'User',
          type: 'collapse',
          icon: 'feather icon-user',
          children: [
            {
              id: 'add user',
              title: 'Add User',
              type: 'item',
              url: '/users/add-user'
            },
            {
              id: 'users list',
              title: 'Users List',
              type: 'item',
              url: '/users/users-list'
            }
          ]
        },
        {
          id: 'buffer',
          title: 'Buffer',
          type: 'collapse',
          icon: 'fas fa-layer-group',
          children: [
            {
              id: 'buffer-list',
              title: 'Buffer Reports',
              type: 'item',
              url: '/buffer/buffer-list'
            }
          ]
        }
      ]
    }
  ]
};

export default menuItems;




/********************************* PERMISSIONS   ****************************/


// const userPermissions = JSON.parse(localStorage.getItem('userPermissions')) || [];
// console.log(userPermissions);

// const hasPermission = (moduleName, action) => {
//   return userPermissions.some(perm => 
//     perm.module === moduleName && perm.action === action
//   );
// };

// const urlToModuleMap = {

//   '/app/dashboard/analytics': 'DASHBOARD_READ',

//   '/inward-list': 'VEHICLES_READ',
//   '/stock-verification': 'VEHICLES_READ',
//   '/stock-transfer': 'VEHICLES_READ',
//   '/upload-challan': 'VEHICLES_READ',
  
//   // Sales
//   '/customers/customers-list': 'CUSTOMER_READ',
//   '/booking-form': 'BOOKING_CREATE',
//   '/booking-list': 'BOOKING_READ',
//   '/delivery-challan': 'SALES_READ',
//   '/invoice': 'SALES_READ',
//   '/deal-form': 'SALES_CREATE',
//   '/pending-updates': 'SALES_READ',
//   '/sales-report': 'REPORTS_READ',
  
//   // Account
//   '/account-dashboard': 'FINANCE_READ',
//   '/account/receipt': 'FINANCE_READ',
//   '/debit-note': 'FINANCE_READ',
//   '/account/pending-receipt': 'FINANCE_READ',
//   '/account/all-receipt': 'FINANCE_READ',
//   '/view-ledgers': 'FINANCE_READ',
//   '/exchange-ledgers': 'FINANCE_READ',
  
//   // Insurance
//   '/insurance-dashboard': 'INSURANCE_READ',
//   '/insurance-report': 'INSURANCE_CREATE',
  
//   // RTO
//   '/rto-dashboard': 'RTO_READ',
//   '/rto/application': 'RTO_CREATE',
//   '/rto/rto-paper': 'RTO_READ',
//   '/rto/rto-tax': 'RTO_READ',
//   '/rto/hsrp-ordering': 'RTO_CREATE',
//   '/rto/hsrp-installation': 'RTO_CREATE',
//   '/rto/rc-confirmation': 'RTO_READ',
//   '/rto/report': 'RTO_READ',
  
//   // Fund Management
//   '/cash-voucher': 'FINANCE_CREATE',
//   '/contra-voucher': 'FINANCE_CREATE',
//   '/contra-approval': 'FINANCE_READ',
//   '/workshop-receipt': 'FINANCE_CREATE',
//   '/workshop-approval': 'FINANCE_READ',
//   '/cash-receipt': 'FINANCE_READ',
//   '/cash-book': 'FINANCE_READ',
//   '/day-book': 'FINANCE_READ',
//   '/fund-report': 'REPORTS_READ',
  
//   // Masters
//   '/branch/branch-list': 'BRANCH_READ',
//   '/headers/headers-list': 'MASTER_READ',
//   '/model/model-list': 'MODEL_READ',
//   '/categories/categories-list': 'ACCESSORY_CATEGORY_READ',
//   '/accessories/accessories-list': 'ACCESSORY_READ',
//   '/color/color-list': 'COLOR_READ',
//   '/documents/documents-list': 'DOCUMENTS_READ',
//   '/conditions/conditions-list': 'MASTER_READ',
//   '/offers/offer-list': 'MASTER_READ',
//   '/attachments/attachments-list': 'ATTACHMENTS_READ',
//   '/declaration-master': 'DECLARATION_READ',
//   '/rto/rto-list': 'RTO_READ',
//   '/financer/financer-list': 'FINANCER_READ',
//   '/financer-rates/rates-list': 'FINANCE_READ',
//   '/insurance-provider/provider-list': 'INSURANCE_READ',
//   '/broker/broker-list': 'BROKER_READ',
  
//   // Fund Master
//   '/cash-master': 'FINANCE_READ',
//   '/bank-master': 'BANK_READ',
//   '/expense': 'FINANCE_READ',
//   '/opening-balance': 'FINANCE_CREATE',
  
//   // User Management
//   '/roles/create-role': 'ROLE_CREATE',
//   '/roles/all-role': 'ROLE_READ',
//   '/users/add-user': 'USER_CREATE',
//   '/users/users-list': 'USER_READ',
//   '/buffer/buffer-list': 'AUDIT_LOG_READ'
// };

// // Filter menu items based on permissions
// const filterMenuItems = (items) => {
//   return items.map(item => {
//     if (item.children) {
//       const filteredChildren = filterMenuItems(item.children);
//       return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null;
//     }
    
//     if (item.url) {
//       const moduleAction = urlToModuleMap[item.url];
//       if (moduleAction) {
//         const [module, action] = moduleAction.split('_');
//         return hasPermission(module, action) ? item : null;
//       }
//     }
    
//     // Always show items without URLs (headers, etc.)
//     return item;
//   }).filter(Boolean);
// };

// // Full menu items structure
// const fullMenuItems = {
//   items: [
//     {
//       id: 'navigation',
//       title: 'Navigation',
//       type: 'group',
//       icon: 'icon-navigation',
//       children: [
//         {
//           id: 'dashboard',
//           title: 'Dashboard',
//           type: 'item',
//           icon: 'feather icon-home',
//           url: '/app/dashboard/analytics'
//         }
//       ]
//     },
//     {
//       id: 'purchase',
//       title: 'Purchase',
//       type: 'group',
//       icon: 'icon-navigation',
//       children: [
//         {
//           id: 'vehicle-inward',
//           title: 'Vehicle Inward',
//           type: 'collapse',
//           icon: 'fas fa-warehouse',
//           children: [
//             {
//               id: 'inward list',
//               title: 'Inward Stock',
//               type: 'item',
//               url: '/inward-list'
//             },
//             {
//               id: 'stock verification',
//               title: 'Stock Verification',
//               type: 'item',
//               url: '/stock-verification'
//             }
//           ]
//         },
//         {
//           id: 'stock-transfer',
//           title: 'Stock Transfer',
//           type: 'item',
//           icon: 'feather icon-home',
//           url: '/stock-transfer'
//         },
//         {
//           id: 'upload-challan',
//           title: 'Upload Challan',
//           type: 'item',
//           icon: 'feather icon-home',
//           url: '/upload-challan'
//         }
//       ]
//     },
//     {
//       id: 'sales and customer management',
//       title: 'Sales & Customer Management',
//       type: 'group',
//       icon: 'icon-navigation',
//       children: [
//         {
//           id: 'customers',
//           title: 'Quotation',
//           type: 'collapse',
//           icon: 'feather icon-users',
//           children: [
//             {
//               id: 'customers list',
//               title: 'Customer Quotation',
//               type: 'item',
//               url: '/customers/customers-list'
//             }
//           ]
//         },
//         {
//           id: 'booking-form',
//           title: 'Sales',
//           type: 'collapse',
//           icon: 'feather icon-file-text',
//           children: [
//             {
//               id: 'booking form',
//               title: 'New Booking',
//               type: 'item',
//               url: '/booking-form'
//             },
//             {
//               id: 'booking list',
//               title: 'All Booking',
//               type: 'item',
//               url: '/booking-list'
//             },
//             {
//               id: 'delivary challan',
//               title: 'Delivery Challan',
//               type: 'item',
//               url: '/delivery-challan'
//             },
//             {
//               id: 'invoice',
//               title: 'Invoice',
//               type: 'item',
//               url: '/invoice'
//             },
//             {
//               id: 'deal-form',
//               title: 'Deal Form',
//               type: 'item',
//               url: '/deal-form'
//             },
//             {
//               id: 'pending updates',
//               title: 'Pending Updates',
//               type: 'item',
//               url: '/pending-updates'
//             }
//           ]
//         },
//         {
//           id: 'sales report',
//           title: 'Sales Report',
//           type: 'collapse',
//           icon: 'feather icon-file-text',
//           children: [
//             {
//               id: 'sales report',
//               title: 'Sales Person Wise',
//               type: 'item',
//               url: '/sales-report'
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'account',
//       title: 'Account',
//       type: 'group',
//       icon: 'icon-navigation',
//       children: [
//         {
//           id: 'account',
//           title: 'Account',
//           type: 'collapse',
//           icon: 'fas fa-university',
//           children: [
//             {
//               id: 'account-dashboard',
//               title: 'PF/NPF Dashboard',
//               type: 'item',
//               url: '/account-dashboard'
//             },
//             {
//               id: 'receipts',
//               title: 'Receipts',
//               type: 'item',
//               url: '/account/receipt'
//             },
//             {
//               id: 'debit-note',
//               title: 'Debit Note',
//               type: 'item',
//               url: '/debit-note'
//             },
//             {
//               id: 'pending-receipts',
//               title: 'Pending Receipts',
//               type: 'item',
//               url: '/account/pending-receipt'
//             },
//             {
//               id: 'all-receipts',
//               title: 'All Receipts',
//               type: 'item',
//               url: '/account/all-receipt'
//             },
//             {
//               id: 'view-ledgers',
//               title: 'Ledgers',
//               type: 'item',
//               url: '/view-ledgers'
//             },
//             {
//               id: 'view-ledgers',
//               title: 'Exchange Ledger',
//               type: 'item',
//               url: '/exchange-ledgers'
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'insurance',
//       title: 'Insurance',
//       type: 'group',
//       icon: 'icon-navigation',
//       children: [
//         {
//           id: 'insurance',
//           title: 'Insurance',
//           type: 'collapse',
//           icon: 'fas fa-layer-group',
//           children: [
//             {
//               id: 'dashboard',
//               title: 'Dashboard',
//               type: 'item',
//               icon: 'feather icon-home',
//               url: '/insurance-dashboard'
//             },
//             {
//               id: 'report',
//               title: 'Add Insurance',
//               type: 'item',
//               url: '/insurance-report'
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'rto',
//       title: 'RTO',
//       type: 'group',
//       icon: 'icon-navigation',
//       children: [
//         {
//           id: 'rto',
//           title: 'RTO',
//           type: 'collapse',
//           icon: 'fas fa-truck',
//           children: [
//             {
//               id: 'rto-dashboard',
//               title: 'Dashboard',
//               type: 'item',
//               icon: 'feather icon-home',
//               url: '/rto-dashboard'
//             },
//             {
//               id: 'application',
//               title: 'Application',
//               type: 'item',
//               url: '/rto/application'
//             },
//             {
//               id: 'rto-paper',
//               title: 'RTO Paper',
//               type: 'item',
//               url: '/rto/rto-paper'
//             },
//             {
//               id: 'rto-tax',
//               title: 'RTO TAX',
//               type: 'item',
//               url: '/rto/rto-tax'
//             },
//             {
//               id: 'hsrp-ordering',
//               title: 'HSRP Ordering',
//               type: 'item',
//               url: '/rto/hsrp-ordering'
//             },
//             {
//               id: 'hsrp-installation',
//               title: 'HSRP Installation',
//               type: 'item',
//               url: '/rto/hsrp-installation'
//             },
//             {
//               id: 'rc-confirmation',
//               title: 'RC Confirmation',
//               type: 'item',
//               url: '/rto/rc-confirmation'
//             },
//             {
//               id: 'rto-report',
//               title: 'Report',
//               type: 'item',
//               url: '/rto/report'
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'fund-management',
//       title: 'Fund Management',
//       type: 'group',
//       icon: 'icon-navigation',
//       children: [
//         {
//           id: 'fund-management',
//           title: 'Fund Management',
//           type: 'collapse',
//           icon: 'fas fa-university',
//           children: [
//             {
//               id: 'receipts',
//               title: 'Cash Voucher',
//               type: 'item',
//               url: '/cash-voucher'
//             },
//             {
//               id: 'receipts',
//               title: 'Contra Voucher',
//               type: 'item',
//               url: '/contra-voucher'
//             },
//             {
//               id: 'contra approval',
//               title: 'Contra Approval',
//               type: 'item',
//               url: '/contra-approval'
//             },
//             {
//               id: 'receipts',
//               title: 'Workshop Cash Receipt',
//               type: 'item',
//               url: '/workshop-receipt'
//             },
//             {
//               id: 'workshop approval',
//               title: 'Workshop Approval',
//               type: 'item',
//               url: '/workshop-approval'
//             },
//             {
//               id: 'receipts',
//               title: 'All Cash Receipt',
//               type: 'item',
//               url: '/cash-receipt'
//             },
//             {
//               id: 'receipts',
//               title: 'Cash Book',
//               type: 'item',
//               url: '/cash-book'
//             },
//             {
//               id: 'receipts',
//               title: 'Day Book',
//               type: 'item',
//               url: '/day-book'
//             },
//             {
//               id: 'receipts',
//               title: 'Report',
//               type: 'item',
//               url: '/fund-report'
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'master',
//       title: 'Masters',
//       type: 'group',
//       icon: 'icon-navigation',
//       children: [
//         {
//           id: 'master',
//           title: 'Masters',
//           type: 'collapse',
//           icon: 'fas fa-medal',
//           children: [
//             {
//               id: 'branch-list',
//               title: 'Location',
//               type: 'item',
//               url: '/branch/branch-list'
//             },
//             {
//               id: 'headers list',
//               title: 'Headers',
//               type: 'item',
//               url: '/headers/headers-list'
//             },
//             {
//               id: 'all models',
//               title: 'Vehicles',
//               type: 'item',
//               url: '/model/model-list'
//             },
//             {
//               id: 'category list',
//               title: 'Accessory Categories',
//               type: 'item',
//               url: '/categories/categories-list'
//             },
//             {
//               id: 'accessories list',
//               title: 'Accessories',
//               type: 'item',
//               url: '/accessories/accessories-list'
//             },
//             {
//               id: 'color list',
//               title: 'Colour',
//               type: 'item',
//               url: '/color/color-list'
//             },
//             {
//               id: 'documents list',
//               title: 'Documents',
//               type: 'item',
//               url: '/documents/documents-list'
//             },
//             {
//               id: 'conditions list',
//               title: 'Terms & Conditions',
//               type: 'item',
//               url: '/conditions/conditions-list'
//             },
//             {
//               id: 'offers List',
//               title: 'Offer List',
//               type: 'item',
//               url: '/offers/offer-list'
//             },
//             {
//               id: 'attachments list',
//               title: 'Attachments',
//               type: 'item',
//               url: '/attachments/attachments-list'
//             },
//             {
//               id: 'declaration list',
//               title: 'Declaration',
//               type: 'item',
//               url: '/declaration-master'
//             },
//             {
//               id: 'rto-list',
//               title: 'RTO',
//               type: 'item',
//               url: '/rto/rto-list'
//             },
//             {
//               id: 'financers-list',
//               title: 'Financer List',
//               type: 'item',
//               url: '/financer/financer-list'
//             },
//             {
//               id: 'rates-list',
//               title: 'Finance Rates',
//               type: 'item',
//               url: '/financer-rates/rates-list'
//             },
//             {
//               id: 'provider-list',
//               title: 'Insurance Providers',
//               type: 'item',
//               url: '/insurance-provider/provider-list'
//             },
//             {
//               id: 'broker list',
//               title: 'Broker List',
//               type: 'item',
//               url: '/broker/broker-list'
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'fund master',
//       title: 'Fund Master',
//       type: 'group',
//       icon: 'icon-navigation',
//       children: [
//         {
//           id: 'fund master',
//           title: 'Fund Master',
//           type: 'collapse',
//           icon: 'fas fa-university',
//           children: [
//             {
//               id: 'receipts',
//               title: 'Cash Account Master',
//               type: 'item',
//               url: '/cash-master'
//             },
//             {
//               id: 'receipts',
//               title: 'Bank Account Master',
//               type: 'item',
//               url: '/bank-master'
//             },
//             {
//               id: 'expense',
//               title: 'Expense Master',
//               type: 'item',
//               url: '/expense'
//             },
//             {
//               id:'opening balance',
//               title:"Add Opening Balance",
//               type:"item",
//               url:"/opening-balance"
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'user management',
//       title: 'User Management',
//       type: 'group',
//       icon: 'icon-navigation',
//       children: [
//         {
//           id: 'role',
//           title: 'Roles',
//           type: 'collapse',
//           icon: 'feather icon-shield',
//           children: [
//             {
//               id: 'create role',
//               title: 'Create Role',
//               type: 'item',
//               url: '/roles/create-role'
//             },
//             {
//               id: 'all roles',
//               title: 'All Roles',
//               type: 'item',
//               url: '/roles/all-role'
//             }
//           ]
//         },
//         {
//           id: 'user',
//           title: 'User',
//           type: 'collapse',
//           icon: 'feather icon-user',
//           children: [
//             {
//               id: 'add user',
//               title: 'Add User',
//               type: 'item',
//               url: '/users/add-user'
//             },
//             {
//               id: 'users list',
//               title: 'Users List',
//               type: 'item',
//               url: '/users/users-list'
//             }
//           ]
//         },
//         {
//           id: 'buffer',
//           title: 'Buffer',
//           type: 'collapse',
//           icon: 'fas fa-layer-group',
//           children: [
//             {
//               id: 'buffer-list',
//               title: 'Buffer Reports',
//               type: 'item',
//               url: '/buffer/buffer-list'
//             }
//           ]
//         }
//       ]
//     }
//   ]
// };

// // Filter the menu items based on permissions
// const menuItems = {
//   items: filterMenuItems(fullMenuItems.items)
// };

// export default menuItems;