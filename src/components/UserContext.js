import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(() => {
    // Check if the username is saved in localStorage
    const savedUsername = localStorage.getItem("username");
    return savedUsername || "";
  });

  // Sync username to localStorage whenever it changes
  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username);  // Save username to localStorage
    }
  }, [username]);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

// import { createContext, useState, useEffect } from 'react';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [username, setUsername] = useState(() => {
//     // Check if the username is saved in localStorage
//     const savedUsername = localStorage.getItem("username");
//     return savedUsername || "";
//   });

//   // Sync username to localStorage whenever it changes
//   useEffect(() => {
//     if (username) {
//       localStorage.setItem("username", username);  // Save username to localStorage
//     }
//   }, [username]);

//   return (
//     <UserContext.Provider value={{ username, setUsername }}>
//       {children}
//     </UserContext.Provider>
//   );
// };



// import { createContext, useState } from "react";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [username, setUsername] = useState( "");
//   // const [username, setUsername] = useState(localStorage.getItem("username") || "");
//   console.log("UserProvider initialized with:", { username, setUsername });

//   return (
//     <UserContext.Provider value={{ username, setUsername }}>
//       {children}
//     </UserContext.Provider>
//   );
// };



// import { createContext, useState, useEffect } from 'react';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [username, setUsername] = useState(() => {
//     // Check if the username is saved in localStorage
//     const savedUsername = localStorage.getItem("username");
//     return savedUsername || "";
//   });

//   // Sync username to localStorage whenever it changes
//   useEffect(() => {
//     if (username) {
//       localStorage.setItem("username", username);  // Save username to localStorage
//     }
//   }, [username]);

//   return (
//     <UserContext.Provider value={{ username, setUsername }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
