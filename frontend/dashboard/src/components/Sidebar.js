import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Map, BarChart2, Cpu, Search } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "../assets/logo.png"; // Assuming you have a logo image in assets folder

const Sidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/", label: t("navOverview"), icon: <Map size={20} /> },
    {
      path: "/analytics",
      label: t("navAnalytics"),
      icon: <BarChart2 size={20} />,
    },
    {
      path: "/policy-advisor",
      label: t("navPolicyAI"),
      icon: <Cpu size={20} />,
    },
    {
      path: "/scheme-repository",
      label: t("navSchemeRepository"),
      icon: <Search size={20} />,
    },
  ];

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          padding: "24px",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "6px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          <img
            src={logo}
            alt="BPIS Logo"
            style={{ width: "auto", height: "60px", objectFit: "contain" }}
          />
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: "1.35rem",
            fontWeight: 700,
            letterSpacing: "0.5px",
            lineHeight: 1.2,
            color: "#ffffff",
          }}
        >
          {t("brand")}
        </h2>
      </div>

      <nav
        style={{
          flex: 1,
          padding: "20px 0",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: "none",
                color: isActive ? "white" : "#94a3b8",
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: isActive ? "#1e293b" : "transparent",
                borderLeft: isActive
                  ? "4px solid #3b82f6"
                  : "4px solid transparent",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#1e293b";
                  e.currentTarget.style.color = "white";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#94a3b8";
                }
              }}
            >
              {item.icon}
              <span style={{ fontSize: "1.05rem" }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: "24px",
          borderTop: "1px solid #1e293b",
          fontSize: "0.8rem",
          color: "#64748b",
        }}
      >
        &copy; 2026 BPIS Systems
      </div>
    </div>
  );
};

export default Sidebar;
