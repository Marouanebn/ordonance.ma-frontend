import React, { useEffect, useState } from "react";
import SidebarMedecin from "./SidebarMedecin.jsx";
import Topbar from "./Topbar.jsx";
import "./topbar.css";

const Dashboard = () => {
  const [roleMessage, setRoleMessage] = useState("");

  useEffect(() => {
    const msg = localStorage.getItem("roleMessage");
    if (msg) {
      setRoleMessage(msg);
      // Optionally clear the message after showing it once
      localStorage.removeItem("roleMessage");
    }
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarMedecin />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar title="Tableau de bord" />

        <div style={{ flex: 1, padding: "30px", backgroundColor: "#f9f9f9" }}>
          {roleMessage && (
            <div style={{ marginBottom: 20, fontWeight: 'bold', color: '#2563eb', fontSize: 22 }}>
              {roleMessage}
            </div>
          )}
          <h1>Bienvenue</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
