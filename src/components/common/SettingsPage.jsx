import React, { useState, useEffect } from "react";
import axios from "../../lib/api";

const roleFields = {
    patient: [
        { name: "cin", label: "CIN", type: "text" },
        { name: "telephone", label: "Téléphone", type: "tel" },
        { name: "date_naissance", label: "Date de naissance", type: "date" },
        { name: "genre", label: "Genre", type: "select", options: ["homme", "femme"] },
        { name: "numero_securite_sociale", label: "Numéro de sécurité sociale", type: "text" },
    ],
    medecin: [
        { name: "telephone", label: "Téléphone", type: "tel" },
        { name: "specialite", label: "Spécialité", type: "text" },
        { name: "numero_ordre", label: "Numéro d'ordre", type: "text" },
        { name: "adresse_cabinet", label: "Adresse du cabinet", type: "text" },
        { name: "ville", label: "Ville", type: "text" },
    ],
    pharmacien: [
        { name: "telephone", label: "Téléphone", type: "tel" },
        { name: "numero_pharmacie", label: "Numéro de pharmacie", type: "text" },
        { name: "adresse_pharmacie", label: "Adresse de la pharmacie", type: "text" },
        { name: "ville", label: "Ville", type: "text" },
    ],
    laboratoire: [
        { name: "telephone", label: "Téléphone", type: "tel" },
        { name: "numero_laboratoire", label: "Numéro de laboratoire", type: "text" },
        { name: "adresse", label: "Adresse", type: "text" },
        { name: "ville", label: "Ville", type: "text" },
    ],
};

const SettingsPage = () => {
    const [profile, setProfile] = useState({ name: "", email: "" });
    const [role, setRole] = useState("");
    const [extra, setExtra] = useState({});
    const [passwords, setPasswords] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    // Remove file state and preview state
    // const [files, setFiles] = useState({});
    // const [previews, setPreviews] = useState({});

    useEffect(() => {
        axios.get("/user").then(res => {
            const user = res.data.data?.user || res.data.user || res.data;
            setProfile({ name: user.name, email: user.email });
            const userRole = user.roles ? user.roles[0].name : (user.role || "");
            setRole(userRole);
            // Fetch role-specific profile
            if (userRole === "patient") {
                axios.get("/patient/profile").then(r => setExtra(r.data.data.patient || {}));
            } else if (userRole === "medecin") {
                axios.get("/medecin/profile").then(r => setExtra(r.data.data.medecin || {}));
            } else if (userRole === "pharmacien") {
                axios.get("/pharmacien/profile").then(r => setExtra(r.data.data.pharmacien || {}));
            } else if (userRole === "laboratoire") {
                axios.get("/laboratoire/profile").then(r => setExtra(r.data.data.laboratoire || {}));
            }
        }).catch(() => setError("Erreur lors du chargement du profil."));
    }, []);

    const handleProfileChange = e => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };
    const handleExtraChange = e => {
        setExtra({ ...extra, [e.target.name]: e.target.value });
    };
    // Remove handleFileChange

    const handleProfileSubmit = e => {
        e.preventDefault();
        setMessage(""); setError("");
        // Compose payload
        let url = "/user/profile";
        if (role === "patient") url = "/patient/profile";
        else if (role === "medecin") url = "/medecin/profile";
        else if (role === "pharmacien") url = "/pharmacien/profile";
        else if (role === "laboratoire") url = "/laboratoire/profile";
        // Only send text fields
        const payload = { ...profile, ...extra };
        axios.put(url, payload)
            .then(res => setMessage(res.data.message || "Profil mis à jour !"))
            .catch(err => setError(err.response?.data?.message || "Erreur lors de la mise à jour."));
    };

    const handlePasswordChange = e => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = e => {
        e.preventDefault();
        setMessage(""); setError("");
        axios.put("/user/password", {
            current_password: passwords.current_password,
            new_password: passwords.new_password,
            new_password_confirmation: passwords.new_password_confirmation,
        })
            .then(res => setMessage(res.data.message))
            .catch(err => setError(err.response?.data?.message || "Erreur lors du changement de mot de passe."));
    };

    const fields = roleFields[role] || [];
    // Remove backendUrl variable and use the backend URL directly in all src/href

    return (
        <div className="settings-page" style={{ maxWidth: 600, margin: "0 auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 32 }}>
            <h2 style={{ textAlign: "center", marginBottom: 24 }}>Paramètres du compte</h2>
            {message && <div className="success-message" style={{ color: "#198754", marginBottom: 16 }}>{message}</div>}
            {error && <div className="error-message" style={{ color: "#dc3545", marginBottom: 16 }}>{error}</div>}

            <form onSubmit={handleProfileSubmit} className="profile-form" style={{ marginBottom: 32 }}>
                <h3 style={{ marginBottom: 16 }}>Informations personnelles</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <input name="name" value={profile.name} onChange={handleProfileChange} placeholder="Nom" required style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }} />
                    <input name="email" value={profile.email} onChange={handleProfileChange} placeholder="Email" required type="email" style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }} />
                    {fields.map(field => field.type === "select" ? (
                        <select key={field.name} name={field.name} value={extra[field.name] || ""} onChange={handleExtraChange} style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}>
                            <option value="">{field.label}</option>
                            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    ) : (
                        <input
                            key={field.name}
                            name={field.name}
                            value={extra[field.name] || ""}
                            onChange={handleExtraChange}
                            placeholder={field.label}
                            type={field.type}
                            style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
                        />
                    ))}
                </div>
                {/* Display file previews only, no upload fields */}
                {(role === 'medecin' || role === 'pharmacien' || role === 'laboratoire') && (
                    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {extra.piece_identite_recto && (
                            extra.piece_identite_recto.endsWith('.pdf') ? (
                                <div><b>Pièce d'identité recto:</b> <a href={`http://localhost:8000/storage/${extra.piece_identite_recto}`} target="_blank" rel="noopener noreferrer">Voir PDF</a></div>
                            ) : (
                                <div><b>Pièce d'identité recto:</b><br /><img src={`http://localhost:8000/storage/${extra.piece_identite_recto}`} alt="Document identité recto" style={{ maxWidth: 120, display: 'block', marginTop: 4 }} /></div>
                            )
                        )}
                        {extra.piece_identite_verso && (
                            extra.piece_identite_verso.endsWith('.pdf') ? (
                                <div><b>Pièce d'identité verso:</b> <a href={`http://localhost:8000/storage/${extra.piece_identite_verso}`} target="_blank" rel="noopener noreferrer">Voir PDF</a></div>
                            ) : (
                                <div><b>Pièce d'identité verso:</b><br /><img src={`http://localhost:8000/storage/${extra.piece_identite_verso}`} alt="Document identité verso" style={{ maxWidth: 120, display: 'block', marginTop: 4 }} /></div>
                            )
                        )}
                        {extra.diplome && (
                            extra.diplome.endsWith('.pdf') ? (
                                <div><b>Diplôme:</b> <a href={`http://localhost:8000/storage/${extra.diplome}`} target="_blank" rel="noopener noreferrer">Voir PDF</a></div>
                            ) : (
                                <div><b>Diplôme:</b><br /><img src={`http://localhost:8000/storage/${extra.diplome}`} alt="Diplôme" style={{ maxWidth: 120, display: 'block', marginTop: 4 }} /></div>
                            )
                        )}
                        {role === 'medecin' && extra.attestation_cnom && (
                            extra.attestation_cnom.endsWith('.pdf') ? (
                                <div><b>Attestation CNOM:</b> <a href={`http://localhost:8000/storage/${extra.attestation_cnom}`} target="_blank" rel="noopener noreferrer">Voir PDF</a></div>
                            ) : (
                                <div><b>Attestation CNOM:</b><br /><img src={`http://localhost:8000/storage/${extra.attestation_cnom}`} alt="Attestation CNOM" style={{ maxWidth: 120, display: 'block', marginTop: 4 }} /></div>
                            )
                        )}
                    </div>
                )}
                <button type="submit" style={{ marginTop: 24, padding: "10px 24px", borderRadius: 6, background: "#2563eb", color: "#fff", border: "none", fontWeight: 600, fontSize: 16 }}>Enregistrer</button>
            </form>

            <form onSubmit={handlePasswordSubmit} className="password-form" style={{ marginBottom: 0 }}>
                <h3 style={{ marginBottom: 16 }}>Changer le mot de passe</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <input type="password" name="current_password" value={passwords.current_password} onChange={handlePasswordChange} placeholder="Mot de passe actuel" required style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }} />
                    <input type="password" name="new_password" value={passwords.new_password} onChange={handlePasswordChange} placeholder="Nouveau mot de passe" required style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }} />
                    <input type="password" name="new_password_confirmation" value={passwords.new_password_confirmation} onChange={handlePasswordChange} placeholder="Confirmer le nouveau mot de passe" required style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }} />
                </div>
                <button type="submit" style={{ marginTop: 24, padding: "10px 24px", borderRadius: 6, background: "#2563eb", color: "#fff", border: "none", fontWeight: 600, fontSize: 16 }}>Changer</button>
            </form>
        </div>
    );
};

export default SettingsPage; 