import React, { useEffect, useState } from "react";
import SidebarPatient from "./SidebarPatient.jsx";
import Topbar from "./Topbar.jsx";
import SettingsPage from "./common/SettingsPage.jsx";
import MesOrdonnancesPatientPage from "./patient/MesOrdonnancesPatientPage.jsx";
import "./topbar.css";
import Footer from "./Footer.jsx";

const DashboardPatient = () => {
    const [roleMessage, setRoleMessage] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [showOrdonnances, setShowOrdonnances] = useState(false);
    useEffect(() => {
        const msg = localStorage.getItem("roleMessage");
        if (msg) {
            setRoleMessage(msg);
            localStorage.removeItem("roleMessage");
        }
    }, []);
    const handleMenuSelect = (key) => {
        setShowSettings(key === 'settings');
        setShowOrdonnances(key === 'ordonnances');
    };
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <SidebarPatient onMenuSelect={handleMenuSelect} activeKey={showSettings ? 'settings' : showOrdonnances ? 'ordonnances' : 'dashboard'} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: 260 }}>
                <Topbar title="Tableau de bord Patient" />
                <div style={{ flex: 1, padding: "30px", backgroundColor: "#f9f9f9" }}>
                    {showSettings ? (
                        <SettingsPage />
                    ) : showOrdonnances ? (
                        <MesOrdonnancesPatientPage />
                    ) : (
                        <>
                            {roleMessage && (
                                <div style={{ marginBottom: 20, fontWeight: 'bold', color: '#2563eb', fontSize: 22 }}>
                                    {roleMessage}
                                </div>
                            )}
                            <h1>Bienvenue Patient</h1>
                        </>
                    )}
                </div>

                <Footer />
            </div>
        </div>
    );
};
export default DashboardPatient; 