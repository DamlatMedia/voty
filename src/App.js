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
import { BrowserRouter as Router } from "react-router-dom";
import Pages from "./components/Pages";

function App() {
  console.log("Rendering App...");
  return (
    <UserProvider>
      <Router>
        <div>
          <Pages />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
