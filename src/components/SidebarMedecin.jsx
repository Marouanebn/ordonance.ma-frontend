import React, { useState } from "react";
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
  UserPlus
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./sidebar-medecin.css";

const SidebarMedecin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { label: "Tableau de bord", icon: <LayoutDashboard />, path: "/dashboard" },
    { label: "Ordonnance", icon: <FilePlus />, path: "/medecin/ordonnance" },
    { label: "Archive des ordonnances", icon: <Archive />, path: "/medecin/archives" },
    { label: "Ajouter des médicaments", icon: <PlusCircle />, path: "/medecin/ajouter-medicaments" },
    { label: "Retour du patient", icon: <UserCheck />, path: "/medecin/retour-patient" },
    { label: "Retour du pharmacien", icon: <UserPlus />, path: "/medecin/retour-pharmacien" },
  ];

  const bottomMenu = [
    { label: "Notification", icon: <Bell />, badge: 6 },
    { label: "Messages", icon: <MessageSquare /> },
    { label: "Paramètre", icon: <Settings /> },
  ];

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
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={() => setIsOpen(false)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar-bottom">
          {bottomMenu.map((item, index) => (
            <div key={index} className="sidebar-bottom-item">
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
              {item.badge && <span className="badge">{item.badge}</span>}
            </div>
          ))}

       <div className="sidebar-footer flex items-center gap-3 mt-4 pt-4 border-t border-gray-300">
  <img
    src="/path-to-doctor-image.jpg"  // Replace with your actual image path or URL
    alt="Dr Slimani Amlah"
    className="doctor-avatar"
  />
  <div>
    <p className="sidebar-doctor-name">Dr Slimani Amlah</p>
    <p className="sidebar-role">Administrateur</p>
  </div>
</div>

        </div>
      </aside>
    </>
  );
};

export default SidebarMedecin;
