import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const permissions = useSelector(state => 
    state.auth.user?.roles?.flatMap(role => role.permissions) || []
  );

  const hasPermission = (moduleName, action = 'READ') => {
    return permissions.some(
      perm => perm.module === moduleName && perm.action === action
    );
  };

  const value = { hasPermission };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};