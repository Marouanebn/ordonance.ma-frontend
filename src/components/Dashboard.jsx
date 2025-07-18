import React, { useEffect, useState } from "react";
import SidebarMedecin from "./SidebarMedecin.jsx";
import Topbar from "./Topbar.jsx";
import SettingsPage from "./common/SettingsPage.jsx";
import "./dashboard.css"; // Custom CSS for design
import Charts from "./Charts"; // Import the chart component


const Dashboard = () => {
  const [roleMessage, setRoleMessage] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const msg = localStorage.getItem("roleMessage");
    if (msg) {
      setRoleMessage(msg);
      localStorage.removeItem("roleMessage");
    }
  }, []);

  return (
    <div className="dashboard-container">
      <SidebarMedecin onMenuSelect={(key) => setShowSettings(key === "settings")} />

      <div className="dashboard-main">
        <Topbar title="Tableau de bord Médecin" />

        <div className="dashboard-content">
          {showSettings ? (
            <SettingsPage />
          ) : (
            <>
              {roleMessage && (
                <div className="dashboard-role-msg">{roleMessage}</div>
              )}

               {/* Summary Cards */}
            <div className="dashboard-cards">
  <div className="card positive">
    <div className="card-icon"><Package size={24} color="#22c55e" /></div>
    <p>Total cartouches consommées</p>
    <h2>467</h2>
    <span className="card-change">+3.48% Depuis le mois dernier</span>
  </div>

  <div className="card negative">
    <div className="card-icon"><Archive size={24} color="#ef4444" /></div>
    <p>Cartouches disponibles</p>
    <h2>533</h2>
    <span className="card-change">-3.48% Depuis le mois dernier</span>
  </div>

  <div className="card positive">
    <div className="card-icon"><Users size={24} color="#22c55e" /></div>
    <p>Nombre de patients</p>
    <h2>409</h2>
    <span className="card-change">+3.48% Depuis le mois dernier</span>
  </div>

  <div className="card positive">
    <div className="card-icon"><UserCheck size={24} color="#22c55e" /></div>
    <p>Nombre de médecins</p>
    <h2>84</h2>
    <span className="card-change">+3.48% Depuis le mois dernier</span>
  </div>
</div>


              {/* Charts */}
            <Charts />

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
