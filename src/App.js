// import Pages from "./components/Pages";
// import { BrowserRouter as Router } from "react-router-dom";

// function App() {
//   return (
//     <div>
//       <Router>
//       <Pages />
//       </Router>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { UserProvider } from "./components/UserContext";
import { AdminProvider } from "./components/AdminContext";
import { BrowserRouter as Router } from "react-router-dom";
import Pages from "./components/Pages";
import { VideoProvider } from "./components/VideoContext";

function App() {
  console.log("Rendering App...");
  return (
    <AdminProvider>
    <UserProvider>
      <VideoProvider>
        <Router>
          <div>
            <Pages />
          </div>
        </Router>
      </VideoProvider>
    </UserProvider>
    </AdminProvider>
  );
}

export default App;
