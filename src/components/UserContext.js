import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(() => {
    // Check if the username is saved in localStorage
    const savedUsername = localStorage.getItem("username");
    return savedUsername || "";
  });

  const [email, setEmail] = useState(() => {
    // Check if the username is saved in localStorage
    const savedEmail = localStorage.getItem("email");
    return savedEmail || "";
  });



  // Sync username to localStorage whenever it changes
  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username);  // Save username to localStorage
    }
  }, [username]);

    // Sync username to localStorage whenever it changes
    useEffect(() => {
      if (email) {
        localStorage.setItem("email", email);  // Save username to localStorage
      }
    }, [email]);

  return (
    <UserContext.Provider value={{ username, setUsername, email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};
