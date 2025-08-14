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
      id: 'purchase',
      title: 'Purchase',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'vehicle-inward',
          title: 'Vehicle Inward',
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
            }
          ]
        },
        {
          id: 'stock-transfer',
          title: 'Stock Transfer',
          type: 'item',
          icon: 'feather icon-home',
          url: '/stock-transfer'
        },
        {
          id: 'upload-challan',
          title: 'Upload Challan',
          type: 'item',
          icon: 'feather icon-home',
          url: '/upload-challan'
        }
      ]
    },
    /****************************************************************************/

    {
      id: 'sales and customer management',
      title: 'Sales & Customer Management',
      type: 'group',
      icon: 'icon-navigation',
      children: [
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
        }
      ]
    },
    /****************************************************************************/

    {
      id: 'account',
      title: 'Account',
      type: 'group',
      icon: 'icon-navigation',
      children: [
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
              id: 'insurace-receipts',
              title: 'Insurance Receipts',
              type: 'item',
              url: '/insurance-receipts'
            },
            {
              id: 'debit-note',
              title: 'Debit Note',
              type: 'item',
              url: '/debit-note'
            },
            {
              id: 'pending-receipts',
              title: 'Pending Receipts',
              type: 'item',
              url: '/account/pending-receipt'
            },
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
        }
      ]
    },
    /*********************************/
    {
      id: 'insurance',
      title: 'Insurance',
      type: 'group',
      icon: 'icon-navigation',
      children: [
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
        }
      ]
    },
    /*********************************/
    {
      id: 'rto',
      title: 'RTO',
      type: 'group',
      icon: 'icon-navigation',
      children: [
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
        }
      ]
    },

    /************************************************************/
    {
      id: 'fund-management',
      title: 'Fund Management',
      type: 'group',
      icon: 'icon-navigation',
      children: [
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
              id: ' cash approval',
              title: 'Cash Approval',
              type: 'item',
              url: '/cash-approval'
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
        }
      ]
    },

    /************************************************************/

    {
      id: 'master',
      title: 'Masters',
      type: 'group',
      icon: 'icon-navigation',
      children: [
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
        }
      ]
    },

    /****************************************************************************/
    {
      id: 'fund master',
      title: 'Fund Master',
      type: 'group',
      icon: 'icon-navigation',
      children: [
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
        // {
        //   id: 'employee',
        //   title: 'Employee',
        //   type: 'collapse',
        //   icon: 'feather icon-user',
        //   children: [
        //     {
        //       id: 'add employee',
        //       title: 'Add Employee',
        //       type: 'item',
        //       url: '/employee/add-employee'
        //     },
        //     {
        //       id: 'employee-list',
        //       title: 'Employee List',
        //       type: 'item',
        //       url: '/employee/employee-list'
        //     }
        //   ]
        // },
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
