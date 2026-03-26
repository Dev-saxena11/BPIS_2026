import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ChatBot from "./components/ChatBot";
import { LanguageProvider } from './contexts/LanguageContext';

import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import PolicyAI from "./pages/PolicyAI";
import Login from "./pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <LanguageProvider>
      {!isAuthenticated ? (
        <Login onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <BrowserRouter>
          <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Fixed Sidebar */}
            <Sidebar />
            
            {/* Main Content Area - dynamically pushed right by the sidebar width */}
            <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
              
              <Navbar />
              
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <Routes>
                  <Route path="/" element={<Overview />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/policy-advisor" element={<PolicyAI />} />
                </Routes>
              </div>
            </div>
            
            {/* Global Floating Components */}
            <ChatBot />
          </div>
        </BrowserRouter>
      )}
    </LanguageProvider>
  );
}

export default App;