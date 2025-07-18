import React, { useState, useEffect } from "react";
import axios from "../../lib/api";
import "./SettingsPage.css";

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

  useEffect(() => {
    axios
      .get("/user")
      .then((res) => {
        const user = res.data.data?.user || res.data.user || res.data;
        setProfile({ name: user.name, email: user.email });
        const userRole = user.roles ? user.roles[0].name : user.role || "";
        setRole(userRole);

        if (userRole === "patient") {
          axios.get("/patient/profile").then((r) => setExtra(r.data.data.patient || {}));
        } else if (userRole === "medecin") {
          axios.get("/medecin/profile").then((r) => setExtra(r.data.data.medecin || {}));
        } else if (userRole === "pharmacien") {
          axios.get("/pharmacien/profile").then((r) => setExtra(r.data.data.pharmacien || {}));
        } else if (userRole === "laboratoire") {
          axios.get("/laboratoire/profile").then((r) => setExtra(r.data.data.laboratoire || {}));
        }
      })
      .catch(() => setError("Erreur lors du chargement du profil."));
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleExtraChange = (e) => {
    setExtra({ ...extra, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    let url = "/user/profile";
    if (role === "patient") url = "/patient/profile";
    else if (role === "medecin") url = "/medecin/profile";
    else if (role === "pharmacien") url = "/pharmacien/profile";
    else if (role === "laboratoire") url = "/laboratoire/profile";

    axios
      .put(url, { ...profile, ...extra })
      .then((res) => setMessage(res.data.message || "Profil mis à jour !"))
      .catch((err) => setError(err.response?.data?.message || "Erreur lors de la mise à jour."));
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    axios
      .put("/user/password", passwords)
      .then((res) => setMessage(res.data.message))
      .catch((err) => setError(err.response?.data?.message || "Erreur lors du changement de mot de passe."));
  };

  const fields = roleFields[role] || [];

  return (
    <div className="settings-page">
      <h2>Paramètres du compte</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleProfileSubmit} className="profile-form">
        <h3>Informations personnelles</h3>

        <div className="form-group">
          <label>Nom</label>
          <input name="name" value={profile.name} onChange={handleProfileChange} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={profile.email} onChange={handleProfileChange} required />
        </div>

        {fields.map((field) => (
          <div key={field.name} className="form-group">
            <label>{field.label}</label>
            {field.type === "select" ? (
              <select name={field.name} value={extra[field.name] || ""} onChange={handleExtraChange}>
                <option value="">Sélectionner</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={field.name}
                type={field.type}
                value={extra[field.name] || ""}
                onChange={handleExtraChange}
              />
            )}
          </div>
        ))}

        {(role === "medecin" || role === "pharmacien" || role === "laboratoire") && (
          <div className="preview-documents">
            {["piece_identite_recto", "piece_identite_verso", "diplome", "attestation_cnom"].map((key) => {
              if (!extra[key]) return null;
              const isPDF = extra[key].endsWith(".pdf");
              const labelMap = {
                piece_identite_recto: "Pièce d'identité recto",
                piece_identite_verso: "Pièce d'identité verso",
                diplome: "Diplôme",
                attestation_cnom: "Attestation CNOM",
              };
              if (key === "attestation_cnom" && role !== "medecin") return null;
              return (
                <div key={key}>
                  <b>{labelMap[key]}:</b><br />
                  {isPDF ? (
                    <a href={`http://localhost:8000/storage/${extra[key]}`} target="_blank" rel="noopener noreferrer">
                      Voir PDF
                    </a>
                  ) : (
                    <img
                      src={`http://localhost:8000/storage/${extra[key]}`}
                      alt={labelMap[key]}
                      style={{ maxWidth: 120, marginTop: 4 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button type="submit" className="btn-primary">Enregistrer</button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="password-form">
        <h3>Changer le mot de passe</h3>
        <div className="form-group">
          <label>Mot de passe actuel</label>
          <input
            type="password"
            name="current_password"
            value={passwords.current_password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            name="new_password"
            value={passwords.new_password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            name="new_password_confirmation"
            value={passwords.new_password_confirmation}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit" className="btn-primary">Changer</button>
      </form>
    </div>
  );
};

export default SettingsPage;
