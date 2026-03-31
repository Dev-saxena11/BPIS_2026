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
import SchemeRepository from "./components/SchemeRepository";
import "./Layout.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <LanguageProvider>
      {!isAuthenticated ? (
        <Login onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <BrowserRouter>
          <div className="dashboard-shell">
            {/* Fixed Sidebar */}
            <Sidebar
              isExpanded={isSidebarExpanded}
              setIsExpanded={setIsSidebarExpanded}
              onWidthChange={setSidebarWidth}
            />
            
            {/* Main Content Area - dynamically pushed right by the sidebar width */}
            <div
              className="main-shell"
              style={{
                marginLeft: `${sidebarWidth}px`,
              }}
            >
              
              <Navbar isSidebarExpanded={isSidebarExpanded} />
              
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <Routes>
                  <Route path="/" element={<Overview />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/policy-advisor" element={<PolicyAI />} />
                  <Route
                    path="/scheme-repository"
                    element={<SchemeRepository />}
                  />
                </Routes>
              </div>
            </div>
            {isSidebarExpanded && <div className="main-shell-blur" />}
            
            {/* Global Floating Components */}
            <ChatBot />
          </div>
        </BrowserRouter>
      )}
    </LanguageProvider>
  );
}

export default App;
