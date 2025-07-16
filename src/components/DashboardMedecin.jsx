import React, { useEffect, useState } from "react";
import SidebarMedecin from "./SidebarMedecin.jsx";
import Topbar from "./Topbar.jsx";
import SettingsPage from "./common/SettingsPage.jsx";
import "./topbar.css";

const DashboardMedecin = () => {
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
            <SidebarMedecin
                onMenuSelect={key => setShowSettings(key === 'settings')}
                onNavigate={() => setShowSettings(false)}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: 260 }}>
                <Topbar title="Tableau de bord Médecin" />
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
                            <h1>Bienvenue Médecin</h1>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default DashboardMedecin; 