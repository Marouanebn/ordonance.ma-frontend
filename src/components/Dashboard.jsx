import React from "react";
import Sidebar from "./Sidebar.jsx";
import "./Sidebar.css";

const Dashboard = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "30px" }}>
        <h1>Bienvenue</h1>
        {/* Other dashboard content goes here */}
      </div>
    </div>
  );
};

export default Dashboard;
