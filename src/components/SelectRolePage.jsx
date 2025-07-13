import React, { useState } from 'react';
import './SelectRolePage.css';
import { FaUserMd, FaUser, FaFlask, FaPills } from 'react-icons/fa';

const roles = [
  { name: 'Médecin', icon: <FaUserMd /> },
  { name: 'Patient', icon: <FaUser /> },
  { name: 'Laboratoire', icon: <FaFlask /> },
  { name: 'Pharmacien', icon: <FaPills /> },
];

function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState(null);

  const closeModal = () => setSelectedRole(null);

  return (
    <div className="select-wrapper">
      <div className="select-container">
        {/* Left Side */}
        <div className="select-left">
          <FaPills size={50} color="#fff" style={{ marginBottom: '2rem' }} />
          <h1>Bienvenue</h1>
          <p className="description">
            Lorem Ipsum est un texte d’espace réservé couramment utilisé dans les industries graphique, imprimée et éditoriale.
          </p>
          <p className="bottom-text">Ordonnance.ma</p>
        </div>

        {/* Right Side */}
        <div className="select-right">
          <div className="role-cards">
            {roles.map((role, idx) => (
              <div className="role-card" key={idx} onClick={() => setSelectedRole(role.name)}>
                <div className="role-icon">{role.icon}</div>
                <div className="role-name">{role.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedRole && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="top-header">
              <h2 className="form-title">Créer un compte {selectedRole}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>

            {selectedRole === 'Médecin' && <MedecinForm />}
            {selectedRole === 'Laboratoire' && <LaboratoireForm />}
            {selectedRole === 'Pharmacien' && <PharmacienForm />}
            {selectedRole === 'Patient' && <BasicRoleForm role="Patient" />}
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable BaseForm component logic
function BaseForm({ roleSpecificFields, title }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${title} Form Submitted:`, formData);
    // Handle backend submission here
  };

  return (
    <form onSubmit={handleSubmit} className="formulaire-inscription">
      <h3>Étape {step} sur 5</h3>

      {step === 1 && (
        <>
          <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
          <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="tel" name="telephone" placeholder="Téléphone" onChange={handleChange} required />
          <input type="password" name="mot_de_passe" placeholder="Mot de passe" onChange={handleChange} required />
          <input type="password" name="confirmation_mot_de_passe" placeholder="Confirmation du mot de passe" onChange={handleChange} required />
        </>
      )}

      {step === 2 && roleSpecificFields.step2(handleChange)}
      {step === 3 && roleSpecificFields.step3(handleChange)}
      {step === 4 && roleSpecificFields.step4(handleChange)}
      {step === 5 && roleSpecificFields.step5(handleChange)}

      <div className="step-buttons">
        {step > 1 && <button type="button" onClick={prevStep}>Précédent</button>}
        {step < 5 && <button type="button" onClick={nextStep}>Suivant</button>}
        {step === 5 && <button type="submit">Soumettre</button>}
      </div>
    </form>
  );
}

// 🩺 Médecin Form
function MedecinForm() {
  const roleSpecificFields = {
    step2: (handleChange) => (
      <>
        <input type="text" name="numero_cnom" placeholder="Numéro CNOM" onChange={handleChange} required />
        <input type="text" name="specialite" placeholder="Spécialité" onChange={handleChange} required />
      </>
    ),
    step3: (handleChange) => (
      <>
        <input type="text" name="adresse_cabinet" placeholder="Adresse du cabinet" onChange={handleChange} required />
        <input type="text" name="ville" placeholder="Ville" onChange={handleChange} required />
        <input type="text" name="wilaya" placeholder="Wilaya" onChange={handleChange} required />
      </>
    ),
    step4: (handleChange) => (
      <>
        <label>Pièce d'identité (Recto)</label>
        <input type="file" name="piece_identite_recto" onChange={handleChange} required />
        <label>Pièce d'identité (Verso)</label>
        <input type="file" name="piece_identite_verso" onChange={handleChange} required />
        <label>Diplôme</label>
        <input type="file" name="diplome" onChange={handleChange} required />
        <label>Attestation CNOM</label>
        <input type="file" name="attestation_cnom" onChange={handleChange} required />
        <label>Photo de profil</label>
        <input type="file" name="photo_profil" onChange={handleChange} required />
      </>
    ),
    step5: (handleChange) => (
      <>
        <label>Signature du médecin (image ou numérique)</label>
        <input type="file" name="signature" onChange={handleChange} required />
        <p>Merci de vérifier toutes les informations avant de soumettre.</p>
      </>
    ),
  };
  return <BaseForm roleSpecificFields={roleSpecificFields} title="Médecin" />;
}

// 🧪 Laboratoire Form
function LaboratoireForm() {
  const roleSpecificFields = {
    step2: (handleChange) => (
      <>
        <input type="text" name="nom_laboratoire" placeholder="Nom du laboratoire" onChange={handleChange} required />
        <input type="text" name="numero_autorisation" placeholder="Numéro d'autorisation du laboratoire" onChange={handleChange} required />
      </>
    ),
    step3: (handleChange) => (
      <>
        <input type="text" name="adresse" placeholder="Adresse du laboratoire" onChange={handleChange} required />
        <input type="text" name="ville" placeholder="Ville" onChange={handleChange} required />
        <input type="text" name="wilaya" placeholder="Wilaya" onChange={handleChange} required />
      </>
    ),
    step4: (handleChange) => (
      <>
        <label>Licence d'exploitation</label>
        <input type="file" name="licence" onChange={handleChange} required />
        <label>Certificat d'enregistrement</label>
        <input type="file" name="certificat_enregistrement" onChange={handleChange} required />
        <label>Pièce d'identité (Recto)</label>
        <input type="file" name="piece_identite_recto" onChange={handleChange} required />
        <label>Pièce d'identité (Verso)</label>
        <input type="file" name="piece_identite_verso" onChange={handleChange} required />
        <label>Photo de profil</label>
        <input type="file" name="photo_profil" onChange={handleChange} required />
      </>
    ),
    step5: (handleChange) => (
      <>
        <label>Signature du représentant</label>
        <input type="file" name="signature" onChange={handleChange} required />
        <p>Merci de vérifier toutes les informations avant de soumettre.</p>
      </>
    ),
  };
  return <BaseForm roleSpecificFields={roleSpecificFields} title="Laboratoire" />;
}

// 💊 Pharmacien Form
function PharmacienForm() {
  const roleSpecificFields = {
    step2: (handleChange) => (
      <>
        <input type="text" name="nom_pharmacie" placeholder="Nom de la pharmacie" onChange={handleChange} required />
        <input type="text" name="numero_inscription" placeholder="Numéro d'inscription à l'ordre des pharmaciens" onChange={handleChange} required />
      </>
    ),
    step3: (handleChange) => (
      <>
        <input type="text" name="adresse" placeholder="Adresse de la pharmacie" onChange={handleChange} required />
        <input type="text" name="ville" placeholder="Ville" onChange={handleChange} required />
        <input type="text" name="wilaya" placeholder="Wilaya" onChange={handleChange} required />
      </>
    ),
    step4: (handleChange) => (
      <>
        <label>Diplôme de pharmacien</label>
        <input type="file" name="diplome" onChange={handleChange} required />
        <label>Attestation de l'ordre des pharmaciens</label>
        <input type="file" name="attestation_ordre" onChange={handleChange} required />
        <label>Pièce d'identité (Recto)</label>
        <input type="file" name="piece_identite_recto" onChange={handleChange} required />
        <label>Pièce d'identité (Verso)</label>
        <input type="file" name="piece_identite_verso" onChange={handleChange} required />
        <label>Photo de profil</label>
        <input type="file" name="photo_profil" onChange={handleChange} required />
      </>
    ),
    step5: (handleChange) => (
      <>
        <label>Signature du pharmacien</label>
        <input type="file" name="signature" onChange={handleChange} required />
        <p>Merci de vérifier toutes les informations avant de soumettre.</p>
      </>
    ),
  };
  return <BaseForm roleSpecificFields={roleSpecificFields} title="Pharmacien" />;
}

// 🧍 Basic Form for Patient
function BasicRoleForm({ role }) {
  return (
    <form className="formulaire-inscription">
      <input type="text" placeholder="Nom complet" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Mot de passe" required />
      <button type="submit" className="submit-btn">S'inscrire</button>
    </form>
  );
}

export default SelectRolePage;
