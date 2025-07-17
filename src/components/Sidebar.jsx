import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    {
      section: "Laboratoire",
      items: [
        { text: "Accueil laboratoire", path: "/lab-home" },
        { text: "Demandes reçues", path: "/lab-demandes" },
        { text: "Consulter une demande", path: "/lab-consulter" },
        { text: "Valider ou refuser une demande", path: "/lab-valider" },
        { text: "Notifier le pharmacien", path: "/lab-notifier" },
        { text: "Statut des préparations", path: "/lab-preparations" },
        { text: "Profil laboratoire", path: "/lab-profil" },
        { text: "Historique des demandes", path: "/lab-historique" },
      ],
    },
    {
      section: "Pharmacien",
      items: [
        { text: "Tableau de bord pharmacien", path: "/pharma-dashboard" },
        { text: "Ordonnances à traiter", path: "/pharma-ordonnances" },
        { text: "Consulter une ordonnance", path: "/pharma-consulter" },
        { text: "Marquer un médicament comme indisponible", path: "/pharma-indispo" },
        { text: "Transférer la demande au laboratoire", path: "/pharma-transfer" },
        { text: "Mettre à jour la disponibilité", path: "/pharma-update" },
        { text: "Stock des médicaments", path: "/pharma-stock" },
        { text: "Profil pharmacie", path: "/pharma-profil" },
      ],
    },
    {
      section: "Patient",
      items: [
        { text: "Accueil patient", path: "/patient-home" },
        { text: "Mes ordonnances", path: "/patient-ordonnances" },
        { text: "Profil personnel", path: "/patient-profil" },
        { text: "Historique médical", path: "/patient-historique" },
        { text: "Support / Assistance", path: "/patient-support" },
      ],
    },
    {
      section: "Médecin",
      items: [
        { text: "Tableau de bord", path: "/medecin-dashboard" },
        { text: "Créer une ordonnance", path: "/medecin-creer" },
        { text: "Modifier / Supprimer une ordonnance", path: "/medecin-modifier" },
        { text: "Mes ordonnances", path: "/medecin-ordonnances" },
        { text: "Ajouter des médicaments", path: "/medecin-ajouter" },
        { text: "Envoyer une ordonnance au patient", path: "/medecin-envoyer" },
        { text: "Recevoir retour du pharmacien", path: "/medecin-retour" },
        { text: "Profil médecin", path: "/medecin-profil" },
      ],
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Ordonnance.ma</h2>
      </div>

      <div className="sidebar-content">
        {menu.map((section, index) => (
          <div key={index} className="sidebar-section">
            <p className="section-title">{section.section}</p>
            {section.items.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className={
                  location.pathname === item.path ? "sidebar-link active" : "sidebar-link"
                }
              >
                {item.text}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <p>Dr Slimani Amlah</p>
        <span>Administrateur</span>
        <p className="copyright">© 2025 </p>
      </div>
    </div>
  );
};

export default Sidebar;
