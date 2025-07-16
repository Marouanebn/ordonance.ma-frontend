import React from "react";
import SidebarMedecin from "./SidebarMedecin.jsx";
import Topbar from "./Topbar.jsx";
import "./topbar.css";

const Dashboard = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarMedecin />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar title="Tableau de bord" />

        <div style={{ flex: 1, padding: "30px", backgroundColor: "#f9f9f9" }}>
          <h1>Bienvenue</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
