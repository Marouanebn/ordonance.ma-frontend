import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FilePlus,
  Pill,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../lib/api";
import "./sidebar-medecin.css";

const SidebarMedecin = ({ onMenuSelect, onNavigate, activeKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/user").then((res) => {
      const u = res.data.data?.user || res.data.user || res.data;
      setUser({
        name: u.name,
        role: u.roles ? u.roles[0].name : u.role || "",
      });
    });
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch { }
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { label: "Tableau de bord", icon: <LayoutDashboard />, path: "/dashboard-medecin" },
    { label: "Ordonance", icon: <FilePlus />, path: "/medecin/ordonance" },
    { label: "Médicaments", icon: <Pill />, path: "/medecin/medicaments" },
    { label: "Paramètre", icon: <Settings />, action: () => onMenuSelect && onMenuSelect("settings") },
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
          {menuItems
            .filter((item) => item.label !== "Paramètre")
            .map((item, index) => (
              <li key={index} className="sidebar-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (activeKey === 'dashboard' && item.label === 'Tableau de bord') || (activeKey === 'ordonance' && item.label === 'Ordonance') || (activeKey === 'medicaments' && item.label === 'Médicaments') ? "active-link" : "inactive-link"}
                  onClick={() => {
                    setIsOpen(false);
                    if (onNavigate) onNavigate();
                  }}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </NavLink>
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
            <span className="icon"><Settings /></span>
            <span className="label">Paramètre</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="doctor-info">
            <img
              src="/path-to-doctor-image.jpg"
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

export default SidebarMedecin;
