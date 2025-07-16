import React, { useEffect, useState } from "react";
import SidebarLaboratoire from "./SidebarLaboratoire.jsx";
import Topbar from "./Topbar.jsx";
import SettingsPage from "./common/SettingsPage.jsx";
import "./topbar.css";

const DashboardLaboratoire = () => {
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
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <SidebarLaboratoire onMenuSelect={key => setShowSettings(key === 'settings')} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: 260 }}>
                <Topbar title="Tableau de bord Laboratoire" />
                <div style={{ flex: 1, padding: "30px", backgroundColor: "#f9f9f9" }}>
                    {showSettings ? (
                        <SettingsPage />
                    ) : (
                        <>
                            {roleMessage && (
                                <div style={{ marginBottom: 20, fontWeight: 'bold', color: '#2563eb', fontSize: 22 }}>
                                    {roleMessage}
                                </div>
                            )}
                            <h1>Bienvenue Laboratoire</h1>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default DashboardLaboratoire; 