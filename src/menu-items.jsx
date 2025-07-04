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
      id: 'utilities',
      title: 'Utilities',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'permissions',
          title: 'Permissions',
          type: 'collapse',
          icon: 'feather icon-shield',
          children: [
            {
              id: 'create permission',
              title: 'Add Permissions',
              type: 'item',
              url: '/permissions/add-permissions'
            },
            {
              id: 'permissions list',
              title: 'Permissions List',
              type: 'item',
              url: '/permissions/permissions-list'
            }
          ]
        },
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
          id: 'branch',
          title: 'Location',
          type: 'collapse',
          icon: 'feather icon-map-pin',
          children: [
            {
              id: 'branch',
              title: 'Add Branch',
              type: 'item',
              url: '/branch/add-branch'
            },
            {
              id: 'branch-list',
              title: 'Branch List',
              type: 'item',
              url: '/branch/branch-list'
            }
          ]
        },
        {
          id: 'employee',
          title: 'Employee',
          type: 'collapse',
          icon: 'feather icon-user',
          children: [
            {
              id: 'add employee',
              title: 'Add Employee',
              type: 'item',
              url: '/employee/add-employee'
            },
            {
              id: 'employee-list',
              title: 'Employee List',
              type: 'item',
              url: '/employee/employee-list'
            }
          ]
        },
        {
          id: 'headers',
          title: 'Headers',
          type: 'collapse',
          icon: 'feather icon-settings',
          children: [
            {
              id: 'add header',
              title: 'Add Header',
              type: 'item',
              url: '/headers/add-header'
            },
            {
              id: 'headers list',
              title: 'Headers List',
              type: 'item',
              url: '/headers/headers-list'
            }
          ]
        },
        {
          id: 'documents',
          title: 'Documents',
          type: 'collapse',
          icon: 'fas fa-file-alt',
          children: [
            {
              id: 'add document',
              title: 'Add Document',
              type: 'item',
              url: '/documents/add-document'
            },
            {
              id: 'documents list',
              title: 'Documents List',
              type: 'item',
              url: '/documents/documents-list'
            }
          ]
        },
        {
          id: 'conditions',
          title: 'Terms & conditions',
          type: 'collapse',
          icon: 'fas fa-file-contract',
          children: [
            {
              id: 'add condition',
              title: 'Add',
              type: 'item',
              url: '/conditions/add-condition'
            },
            {
              id: 'conditions list',
              title: 'Conditions List',
              type: 'item',
              url: '/conditions/conditions-list'
            }
          ]
        },
        {
          id: 'offers',
          title: 'Offers',
          type: 'collapse',
          icon: 'fas fa-tags',
          children: [
            {
              id: 'add offer',
              title: 'Add Offer',
              type: 'item',
              url: '/offers/add-offer'
            },
            {
              id: 'offers List',
              title: 'Offer List',
              type: 'item',
              url: '/offers/offer-list'
            }
          ]
        },
        {
          id: 'attachments',
          title: 'Attachments',
          type: 'collapse',
          icon: 'fas fa-file-alt',
          children: [
            {
              id: 'add attachment',
              title: 'Add Attachments',
              type: 'item',
              url: '/attachments/add-attachments'
            },
            {
              id: 'attachments list',
              title: 'Attachments List',
              type: 'item',
              url: '/attachments/attachments-list'
            }
          ]
        }
      ]
    },

    /*********************************/
    {
      id: 'product and inventory',
      title: 'Product & Inventory Management',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'model',
          title: 'Model',
          type: 'collapse',
          icon: 'fas fa-motorcycle',
          children: [
            {
              id: 'add model',
              title: 'Add Model',
              type: 'item',
              url: '/model/add-model'
            },
            {
              id: 'all models',
              title: 'All Models',
              type: 'item',
              url: '/model/model-list'
            }
          ]
        },
        {
          id: 'color',
          title: 'Color',
          type: 'collapse',
          icon: 'fas fa-palette',
          children: [
            {
              id: 'add color',
              title: 'Add Color',
              type: 'item',
              url: '/color/add-color'
            },
            {
              id: 'color list',
              title: 'Color List',
              type: 'item',
              url: '/color/color-list'
            }
          ]
        },
        {
          id: 'accessories',
          title: 'Accessories',
          type: 'collapse',
          icon: 'fas fa-headphones',
          children: [
            {
              id: 'add accessories',
              title: 'Add Accessories',
              type: 'item',
              url: '/accessories/add-accessories'
            },
            {
              id: 'accessories list',
              title: 'Accessories List',
              type: 'item',
              url: '/accessories/accessories-list'
            }
          ]
        },
        {
          id: 'vehicle-inventory',
          title: 'Vehicle Inward',
          type: 'collapse',
          icon: 'fas fa-warehouse',
          children: [
            {
              id: 'add inventory',
              title: 'Add Vehicle',
              type: 'item',
              url: '/vehicle-inventory/add-inventory'
            },
            {
              id: 'inventory list',
              title: 'Inward List',
              type: 'item',
              url: '/vehicle-inventory/inventory-list'
            }
          ]
        }
      ]
    },

    /*********************************/
    {
      id: 'pricing',
      title: 'Pricing & Financial Setup',
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
              id: 'add rto',
              title: 'Add RTO',
              type: 'item',
              url: '/rto/add-rto'
            },
            {
              id: 'rto-list',
              title: 'RTO List',
              type: 'item',
              url: '/rto/rto-list'
            }
          ]
        },
        {
          id: 'financer',
          title: 'Financer',
          type: 'collapse',
          icon: 'feather icon-credit-card',
          children: [
            {
              id: 'add employee',
              title: 'Add Financer',
              type: 'item',
              url: '/financer/add-financer'
            },
            {
              id: 'financers-list',
              title: 'Financer List',
              type: 'item',
              url: '/financer/financer-list'
            }
          ]
        },
        {
          id: 'finance-rates',
          title: 'Finance Rates',
          type: 'collapse',
          icon: 'feather icon-credit-card',
          children: [
            {
              id: 'add rates',
              title: 'Add Rates',
              type: 'item',
              url: '/financer-rates/add-rates'
            },
            {
              id: 'rates-list',
              title: 'Rates List',
              type: 'item',
              url: '/financer-rates/rates-list'
            }
          ]
        },
        {
          id: 'insurance provider',
          title: 'Insurance Provider',
          type: 'collapse',
          icon: 'feather icon-shield',
          children: [
            {
              id: 'add insurance provider',
              title: 'Insurance Provider',
              type: 'item',
              url: '/insurance-provider/add-provider'
            },
            {
              id: 'provider-list',
              title: 'Insurance Providers List',
              type: 'item',
              url: '/insurance-provider/provider-list'
            }
          ]
        },
        {
          id: 'broker',
          title: 'Broker',
          type: 'collapse',
          icon: 'feather icon-user',
          children: [
            {
              id: 'add broker',
              title: 'Add Broker',
              type: 'item',
              url: '/broker/add-broker'
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

    /***************** */

    {
      id: 'sales and customer management',
      title: 'Sales & Customer Management',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'customers',
          title: 'Customers',
          type: 'collapse',
          icon: 'feather icon-users',
          children: [
            {
              id: 'customers list',
              title: 'Customers List',
              type: 'item',
              url: '/customers/customers-list'
            }
          ]
        },
        {
          id: 'booking-form',
          title: 'Booking Form',
          type: 'collapse',
          icon: 'feather icon-file-text',
          children: [
            {
              id: 'booking form',
              title: 'Booking Form',
              type: 'item',
              url: '/booking-form'
            },
            {
              id: 'booking list',
              title: 'All Booking',
              type: 'item',
              url: '/booking-list'
            }
          ]
        }
      ]
    }

    /********************** */
  ]
};

export default menuItems;
