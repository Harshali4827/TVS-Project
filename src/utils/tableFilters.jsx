import React, { useState } from 'react';

export const useTableFilter = (initialData) => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);

  // const handleFilter = (searchValue, searchFields) => {
  //   if (!searchValue) {
  //     setFilteredData(data);
  //     return;
  //   }

  //   const searchTerm = searchValue.toLowerCase();
  //   const filtered = data.filter((row) =>
  //     searchFields.some((field) =>
  //       String(row[field] || '')
  //         .toLowerCase()
  //         .includes(searchTerm)
  //     )
  //   );

  //   setFilteredData(filtered);
  // };

  /**************************************** */

  // const handleFilter = (searchValue, searchFields) => {
  //   if (!searchValue) {
  //     setFilteredData(data);
  //     return;
  //   }

  //   const searchTerm = searchValue.toLowerCase();
  //   const filtered = data.filter((row) =>
  //     searchFields.some((field) => {
  //       const value = field.split('.').reduce((obj, key) => (obj ? obj[key] : ''), row);
  //       return String(value || '')
  //         .toLowerCase()
  //         .includes(searchTerm);
  //     })
  //   );

  //   setFilteredData(filtered);
  // };

  const handleFilter = (searchValue, searchFields) => {
    if (!searchValue) {
      setFilteredData(data);
      return;
    }

    const searchTerm = searchValue.toLowerCase();
    const filtered = data.filter((row) =>
      searchFields.some((field) => {
        // Handle nested properties
        const value = field.split('.').reduce((obj, key) => {
          if (!obj) return '';
          // Handle array indices if needed (e.g., array.0.property)
          if (key.match(/^\d+$/)) return obj[parseInt(key)];
          return obj[key];
        }, row);
        if (value === undefined || value === null) return false;

        if (typeof value === 'boolean') {
          return (value ? 'yes' : 'no').includes(searchTerm);
        }
        if (field === 'createdAt' && value instanceof Date) {
          return value.toLocaleDateString('en-GB').includes(searchTerm);
        }
        if (typeof value === 'number') {
          return String(value).includes(searchTerm);
        }
        return String(value).toLowerCase().includes(searchTerm);
      })
    );

    setFilteredData(filtered);
  };
  return {
    data,
    setData,
    filteredData,
    setFilteredData,
    handleFilter
  };
};

export const getDefaultSearchFields = (tableType) => {
  const fieldMap = {
    branch: ['name', 'address', 'city', 'state', 'pincode', 'email', 'phone', 'gst_number'],
    users: ['name', 'email', 'mobile', 'branchName', 'roles'],
    roles: ['name', 'description', 'permissions.resource', 'permissions.actions'],
    models: ['model_name'],
    headers: ['header_key', 'category_key', 'key', 'type', 'priority', 'page_no', 'hsn_code', 'gst_rate'],
    documents: ['name', 'description'],
    conditions: ['title', 'content', 'order'],
    offers: ['title', 'description', 'applyToAllModels', 'applicableModels'],
    customers: ['name', 'address', 'taluka', 'district', 'mobile1', 'mobile2'],
    attachments: ['title', 'description'],
    financer: ['name'],
    rto: ['rto_code', 'rto_name'],
    finance_rates: ['branchDetails.name', 'financeProviderDetails.name', 'gcRate'],
    insurance_provider: ['provider_name'],
    booking: [
      'model.model_name',
      'model.type',
      'color.name',
      'branch.name',
      'customerType',
      'rto',
      'rtoAmount',
      'hpa',
      'salesExecutive.name',
      'customerDetails.salutation',
      'customerDetails.name',
      'customerDetails.address',
      'customerDetails.taluka',
      'customerDetails.district',
      'customerDetails.pincode',
      'customerDetails.mobile1',
      'customerDetails.mobile2',
      'exchange',
      'exchangeDetails.broker.name',
      'payment.type',
      'payment.financer.name',
      'createdAt'
    ],
    accessories: ['name', 'description', 'price', 'part_number'],
    inward: [
      'locationDetails.name',
      'type',
      'model',
      'colorDetails.name',
      'batteryNumber',
      'keyNumber',
      'chassisNumber',
      'engineNumber',
      'motorNumber',
      'chargerNumber'
    ],
    receipts: [
      'bookingNumber',
      'model.model_name',
      'customerDetails.name',
      'chassisNumber',
      'discountedAmount',
      'receivedAmount',
      'balanceAmount'
    ],
    expense: ['expense']
  };

  return fieldMap[tableType] || Object.keys(fieldMap.branch);
};
