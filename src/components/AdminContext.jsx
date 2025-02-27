import { createContext, useState, useEffect } from 'react';

export const useAdmin = createContext();

export const AdminProvider = ({ children }) => {
  const [username, setUsername] = useState(() => {
    // Check if the username is saved in localStorage
    const savedUsername = localStorage.getItem("adminUsername");
    return savedUsername || "";
  });

  // Sync username to localStorage whenever it changes
  useEffect(() => {
    if (username) {
      localStorage.setItem("adminUsername", username);  // Save username to localStorage
    }
  }, [username]);

  return (
    <useAdmin.Provider value={{ username, setUsername }}>
      {children}
    </useAdmin.Provider>
  );
};

