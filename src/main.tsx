import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
// import TestApp from "./TestApp.tsx";
import "./index.css";
import AuthProvider from "./context/AuthContext";
import UserProvider from "./context/UserContext";
import ErrorBoundary from "./components/ErrorBoundary";

// Calculate the base URL for routing
const basename = import.meta.env.BASE_URL || '/';

// Log environment variables to console for debugging
console.log("============== ENVIRONMENT VARIABLES ==============");
console.log("BASE_URL:", import.meta.env.BASE_URL);
console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("VITE_SUPABASE_ANON_KEY exists:", Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY));
console.log("VITE_DEV_MODE:", import.meta.env.VITE_DEV_MODE);
console.log("VITE_DEBUG:", import.meta.env.VITE_DEBUG);
console.log("==================================================");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      {/* Use the full app with Router and Auth provider */}
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
