import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckSquare,
  Clock3,
  Archive,
  Bell,
  MessageSquare,
  Settings,
  Menu,
  X,
  LayoutDashboard,
  FilePlus,
  PlusCircle,
  UserCheck,
  UserPlus,
  Pill,
  LogOut
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../lib/api";
import "./sidebar-medecin.css";

const SidebarMedecin = ({ onMenuSelect, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/user").then(res => {
      const u = res.data.data?.user || res.data.user || res.data;
      setUser({
        name: u.name,
        role: u.roles ? u.roles[0].name : (u.role || "")
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
    { label: "Tableau de bord", icon: <LayoutDashboard />, path: "/dashboard" },
    { label: "Ordonance", icon: <FilePlus />, path: "/medecin/ordonance" },
    { label: "Médicaments", icon: <Pill />, path: "/medecin/medicaments" },
    { label: "Paramètre", icon: <Settings />, action: () => onMenuSelect && onMenuSelect('settings') },
  ];

  const bottomMenu = [];

  return (
    <>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <X /> : <Menu />}
      </div>

      <aside className={`sidebar-medecin ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <img src="/logo.svg" alt="Ordonnance.ma" />
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item, index) => (
            <li key={index} className="sidebar-item">
              {item.path ? (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                  onClick={() => {
                    setIsOpen(false);
                    if (onNavigate) onNavigate();
                  }}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </NavLink>
              ) : (
                <button
                  className="sidebar-link-btn"
                  onClick={() => {
                    setIsOpen(false);
                    if (item.action) item.action();
                  }}
                  style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left' }}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="sidebar-bottom">
          {bottomMenu.map((item, index) => (
            <div key={index} className="sidebar-bottom-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={() => setIsOpen(false)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
                {item.badge && <span className="badge">{item.badge}</span>}
              </NavLink>
            </div>
          ))}

          <div className="sidebar-footer flex items-center gap-3 mt-4 pt-4 border-t border-gray-300" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src="/path-to-doctor-image.jpg"
                alt={user.name}
                className="doctor-avatar"
                style={{ width: 48, height: 48, borderRadius: "50%" }}
              />
              <div>
                <p className="sidebar-doctor-name" style={{ fontWeight: 600, margin: 0 }}>{user.name}</p>
                <p className="sidebar-role" style={{ color: "#2563eb", margin: 0 }}>{user.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, background: "#dc3545", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: 600, cursor: "pointer" }}>
              <LogOut size={18} /> Se déconnecter
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarMedecin;
