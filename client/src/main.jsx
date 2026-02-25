import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster 
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#0a0102',
          color: '#CBEEF3',
          border: '1px solid rgba(221, 45, 74, 0.2)',
          borderRadius: '1rem',
          backdropFilter: 'blur(10px)',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        },
        success: {
          iconTheme: {
            primary: '#DD2D4A',
            secondary: '#0a0102',
          },
        },
        error: {
          style: {
            border: '1px solid rgba(239, 68, 68, 0.3)',
            background: 'rgba(20, 3, 5, 0.95)',
          }
        }
      }}
    />
    <App />
  </StrictMode>
);
