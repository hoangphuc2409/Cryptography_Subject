import React, { createContext, useState, useEffect } from 'react';
import { getAuth, signOut } from "firebase/auth";
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
    setUser(null);
    localStorage.removeItem('user');
  };

  ;

  return (
    <UserContext.Provider value={{ user, setUser, logout}}>
      {children}
    </UserContext.Provider>
  );
};