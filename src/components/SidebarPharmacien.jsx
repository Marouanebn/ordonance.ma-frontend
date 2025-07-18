import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Archive,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../lib/api";
import "./sidebar-pharmacien.css";

const SidebarPharmacien = ({ onMenuSelect, activeKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ name: "", role: "" });
  const [selectedTab, setSelectedTab] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.get("/user").then((res) => {
      const u = res.data.data?.user || res.data.user || res.data;
      setUser({
        name: u.name,
        role: u.roles ? u.roles[0].name : u.role || "",
      });
    });
  }, []);

  // On mount or when location changes, update selectedTab based on URL
  useEffect(() => {
    if (location.pathname === "/dashboard-pharmacien") {
      setSelectedTab("dashboard");
    } else {
      // If you want, reset selectedTab or leave as is
      // setSelectedTab("");
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch { }
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: <LayoutDashboard />,
      path: "/dashboard-pharmacien",
    },
    {
      id: "valider",
      label: "Recherche Ordonnance",
      icon: <FileText />,
      action: () => onMenuSelect && onMenuSelect("valider"),
    },
    {
      id: "validated",
      label: "Ordonnances validées",
      icon: <Archive />,
      action: () => onMenuSelect && onMenuSelect("validated"),
    },
  ];

  return (
    <>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <X /> : <Menu />}
      </div>

      <aside className={`sidebar-medecin ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <img src="./src/assets/2.png" alt="Ordonnance.ma" />
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebar-item">
              {item.path ? (
                <button
                  className={`sidebar-link-btn ${activeKey === item.id ? 'active-link' : 'inactive-link'}`}
                  onClick={() => {
                    setIsOpen(false);
                    if (item.path) navigate(item.path);
                    if (item.action) item.action();
                  }}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </button>
              ) : (
                <button
                  className={`sidebar-link-btn ${activeKey === item.id ? 'active-link' : 'inactive-link'}`}
                  onClick={() => {
                    setIsOpen(false);
                    if (item.action) item.action();
                  }}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="sidebar-settings">
          <button
            className={`sidebar-link-btn ${activeKey === 'settings' ? 'active-link' : 'inactive-link'}`}
            onClick={() => {
              setIsOpen(false);
              onMenuSelect && onMenuSelect("settings");
            }}
          >
            <span className="icon">
              <Settings />
            </span>
            <span className="label">Paramètre</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="doctor-info">
            <img
              src="/path-to-pharmacien-image.jpg"
              alt={user.name}
              className="doctor-avatar"
            />
            <div>
              <p className="sidebar-doctor-name">{user.name}</p>
              <p className="sidebar-role">{user.role}</p>
            </div>
          </div>
          <button className="logout-text-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarPharmacien;
