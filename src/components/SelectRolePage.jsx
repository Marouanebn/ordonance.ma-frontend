import React, { useState } from 'react';
import './SelectRolePage.css';
import { FaUserMd, FaUser, FaFlask, FaPills } from 'react-icons/fa';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

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
            {selectedRole === 'Patient' && <PatientForm />}
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  // Real-time validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'nom':
        if (!value) return 'Nom requis';
        return '';
      case 'prenom':
        if (!value) return 'Prénom requis';
        return '';
      case 'email':
        if (!value) return 'Email requis';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Email invalide';
        return '';
      case 'telephone':
        if (!value) return 'Téléphone requis';
        if (!/^\+?\d{8,15}$/.test(value)) return 'Téléphone invalide';
        return '';
      case 'cin':
        if (!value) return 'CIN requis';
        if (value.length < 4) return 'CIN trop court';
        return '';
      case 'mot_de_passe':
        if (!value) return 'Mot de passe requis';
        if (value.length < 8) return 'Au moins 8 caractères';
        return '';
      case 'confirmation_mot_de_passe':
        if (!value) return 'Confirmation requise';
        if (value !== formData.mot_de_passe) return 'Les mots de passe ne correspondent pas';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
    // Validate on change
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, files ? files[0] : value) }));
    setError('');
  };

  const handleBlur = (e) => {
    const { name, value, files } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, files ? files[0] : value) }));
  };

  // canGoNext now only checks validity, does not set state
  const canGoNext = () => {
    if (step !== 1) return true;
    const required = ['nom', 'prenom', 'email', 'telephone', 'mot_de_passe', 'confirmation_mot_de_passe'];
    return required.every((field) => !validateField(field, formData[field]));
  };

  // nextStep sets errors if invalid
  const nextStep = () => {
    if (step !== 1) {
      setStep((prev) => prev + 1);
      return;
    }
    const required = ['nom', 'prenom', 'email', 'telephone', 'mot_de_passe', 'confirmation_mot_de_passe'];
    let newErrors = {};
    let valid = true;
    required.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) valid = false;
      newErrors[field] = err;
    });
    setFieldErrors((prev) => ({ ...prev, ...newErrors }));
    if (valid) setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  // handleSubmit sets errors if invalid
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      const required = ['nom', 'prenom', 'email', 'telephone', 'mot_de_passe', 'confirmation_mot_de_passe'];
      let newErrors = {};
      let valid = true;
      required.forEach((field) => {
        const err = validateField(field, formData[field]);
        if (err) valid = false;
        newErrors[field] = err;
      });
      setFieldErrors((prev) => ({ ...prev, ...newErrors }));
      if (!valid) return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    setFieldErrors({});
    try {
      let payload = {};
      let role = '';
      if (title === 'Médecin') {
        payload = {
          name: formData.nom + ' ' + formData.prenom,
          email: formData.email,
          password: formData.mot_de_passe,
          password_confirmation: formData.confirmation_mot_de_passe,
          role: 'medecin',
          telephone_medecin: formData.telephone,
          numero_cnom: formData.numero_cnom,
          specialite: formData.specialite,
          adresse_cabinet: formData.adresse_cabinet,
          ville_medecin: formData.ville,
          statut_medecin: formData.statut_medecin || 'actif',
        };
        role = 'medecin';
      } else if (title === 'Pharmacien') {
        payload = {
          name: formData.nom + ' ' + formData.prenom,
          email: formData.email,
          password: formData.mot_de_passe,
          password_confirmation: formData.confirmation_mot_de_passe,
          role: 'pharmacien',
          nom_pharmacie: formData.nom_pharmacie,
          telephone_pharmacien: formData.telephone,
          adresse_pharmacie: formData.adresse,
          ville_pharmacien: formData.ville,
          statut_pharmacien: formData.statut_pharmacien || 'actif',
        };
        role = 'pharmacien';
      } else if (title === 'Laboratoire') {
        payload = {
          name: formData.nom_responsable,
          email: formData.email,
          password: formData.mot_de_passe,
          password_confirmation: formData.confirmation_mot_de_passe,
          role: 'laboratoire',
          nom_responsable: formData.nom_responsable,
          nom_laboratoire: formData.nom_laboratoire,
          telephone_laboratoire: formData.telephone,
          adresse_laboratoire: formData.adresse,
          ville_laboratoire: formData.ville,
          numero_autorisation: formData.numero_autorisation,
          statut_laboratoire: formData.statut_laboratoire || 'actif',
        };
        role = 'laboratoire';
      } else if (title === 'Patient') {
        payload = {
          name: formData.nom + ' ' + formData.prenom,
          email: formData.email,
          password: formData.mot_de_passe,
          password_confirmation: formData.confirmation_mot_de_passe,
          role: 'patient',
          cin: formData.cin,
          telephone: formData.telephone,
          date_naissance: formData.date_naissance,
          genre: formData.genre,
          numero_securite_sociale: formData.numero_securite_sociale,
        };
        role = 'patient';
      }
      // Use FormData for file uploads
      const formPayload = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formPayload.append(key, value);
      });
      // Attach files if present (use correct backend field names)
      if (formData.piece_identite_recto) formPayload.append('piece_identite_recto', formData.piece_identite_recto);
      if (formData.piece_identite_verso) formPayload.append('piece_identite_verso', formData.piece_identite_verso);
      if (formData.diplome) formPayload.append('diplome', formData.diplome);
      if (formData.attestation_cnom) formPayload.append('attestation_cnom', formData.attestation_cnom);
      const response = await api.post('/register', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      // Set roleMessage for consistency with login
      let roleMsg = '';
      let dashboardRoute = '/dashboard';
      if (role === 'medecin') {
        roleMsg = 'Je suis médecin';
        dashboardRoute = '/dashboard-medecin';
      } else if (role === 'patient') {
        roleMsg = 'Je suis patient';
        dashboardRoute = '/dashboard-patient';
      } else if (role === 'pharmacien') {
        roleMsg = 'Je suis pharmacien';
        dashboardRoute = '/dashboard-pharmacien';
      } else if (role === 'laboratoire') {
        roleMsg = 'Je suis laboratoire';
        dashboardRoute = '/dashboard-laboratoire';
      } else if (role === 'admin') {
        roleMsg = 'Je suis admin';
        dashboardRoute = '/dashboard';
      }
      localStorage.setItem('roleMessage', roleMsg);
      localStorage.setItem('userRole', role);
      setSuccess('Inscription réussie ! Redirection...');
      setTimeout(() => {
        navigate(dashboardRoute);
      }, 1000);
    } catch (err) {
      // Show specific field errors if present
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        let newFieldErrors = { ...fieldErrors };
        let errorMessages = [];
        Object.entries(errors).forEach(([field, msgs]) => {
          if (Array.isArray(msgs)) {
            newFieldErrors[field] = msgs.join(' ');
            errorMessages.push(...msgs);
          } else if (typeof msgs === 'string') {
            newFieldErrors[field] = msgs;
            errorMessages.push(msgs);
          }
        });
        setFieldErrors(newFieldErrors);
        // Prefer backend 'message' if present, else join all error messages
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(errorMessages.join(' '));
        }
      } else {
        setError(
          err.response?.data?.message || "Erreur lors de l'inscription. Veuillez réessayer."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const isMedecin = title === 'Médecin';
  const isPatient = title === 'Patient';
  const totalSteps = isPatient ? 2 : isMedecin ? 4 : 5;

  return (
    <form onSubmit={handleSubmit} className="formulaire-inscription">
      <h3>Étape {step} sur {totalSteps}</h3>
      {step === 1 && (
        <>
          <input type="text" name="nom" placeholder="Nom" onChange={handleChange} onBlur={handleBlur} required />
          {fieldErrors.nom && <div className="error-message">{fieldErrors.nom}</div>}
          <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} onBlur={handleBlur} required />
          {fieldErrors.prenom && <div className="error-message">{fieldErrors.prenom}</div>}
          <input type="email" name="email" placeholder="Email" onChange={handleChange} onBlur={handleBlur} required />
          {fieldErrors.email && <div className="error-message">{fieldErrors.email}</div>}
          {isPatient && (
            <>
              <input type="text" name="cin" placeholder="CIN" onChange={handleChange} required value={formData.cin || ''} />
              {fieldErrors.cin && <div className="error-message">{fieldErrors.cin}</div>}
            </>
          )}
          <input type="tel" name="telephone" placeholder="Téléphone" onChange={handleChange} onBlur={handleBlur} required />
          {fieldErrors.telephone && <div className="error-message">{fieldErrors.telephone}</div>}
          <input type="password" name="mot_de_passe" placeholder="Mot de passe" onChange={handleChange} onBlur={handleBlur} required />
          {fieldErrors.mot_de_passe && <div className="error-message">{fieldErrors.mot_de_passe}</div>}
          <input type="password" name="confirmation_mot_de_passe" placeholder="Confirmation du mot de passe" onChange={handleChange} onBlur={handleBlur} required />
          {fieldErrors.confirmation_mot_de_passe && <div className="error-message">{fieldErrors.confirmation_mot_de_passe}</div>}
        </>
      )}
      {step === 2 && roleSpecificFields.step2(handleChange, formData)}
      {step === 3 && roleSpecificFields.step3 && roleSpecificFields.step3(handleChange, formData)}
      {step === 4 && roleSpecificFields.step4 && roleSpecificFields.step4(handleChange, formData)}
      {step === 5 && !isMedecin && roleSpecificFields.step5 && roleSpecificFields.step5(handleChange, formData)}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <div className="step-buttons">
        {step > 1 && <button type="button" onClick={prevStep}>Précédent</button>}
        {step < totalSteps && <button type="button" onClick={nextStep} disabled={step === 1 && !canGoNext()}>Suivant</button>}
        {step === totalSteps && <button type="submit" disabled={loading}>{loading ? 'Inscription...' : 'S\'inscrire'}</button>}
      </div>
    </form>
  );
}

// 🩺 Médecin Form
function MedecinForm() {
  const roleSpecificFields = {
    step2: (handleChange, formData) => (
      <>
        <input type="text" name="telephone" placeholder="Téléphone" onChange={handleChange} required value={formData.telephone || ''} />
        <input type="text" name="numero_cnom" placeholder="Numéro CNOM" onChange={handleChange} required value={formData.numero_cnom || ''} />
      </>
    ),
    step3: (handleChange, formData) => (
      <>
        <input type="text" name="specialite" placeholder="Spécialité" onChange={handleChange} required value={formData.specialite || ''} />
        <input type="text" name="adresse_cabinet" placeholder="Adresse du cabinet" onChange={handleChange} required value={formData.adresse_cabinet || ''} />
        <input type="text" name="ville" placeholder="Ville" onChange={handleChange} required value={formData.ville || ''} />
      </>
    ),
    step4: (handleChange, formData) => (
      <>
        <select name="statut_medecin" onChange={handleChange} required value={formData.statut_medecin || 'actif'}>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
        <label>Pièce d'identité recto (PDF/JPG/PNG):
          <input type="file" name="piece_identite_recto" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
        </label>
        <label>Pièce d'identité verso (PDF/JPG/PNG):
          <input type="file" name="piece_identite_verso" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
        </label>
        <label>Diplôme (PDF/JPG/PNG):
          <input type="file" name="diplome" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
        </label>
        <label>Attestation CNOM (PDF/JPG/PNG):
          <input type="file" name="attestation_cnom" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
        </label>
      </>
    ),
    step5: (handleChange, formData) => (<><p>Merci de vérifier toutes les informations avant de soumettre.</p></>),
  };
  return <BaseForm roleSpecificFields={roleSpecificFields} title="Médecin" />;
}

// 🧪 Laboratoire Form
function LaboratoireForm() {
  const roleSpecificFields = {
    step2: (handleChange, formData) => (
      <>
        <input type="text" name="nom_responsable" placeholder="Nom du responsable" onChange={handleChange} required value={formData.nom_responsable || ''} />
        <input type="text" name="nom_laboratoire" placeholder="Nom du laboratoire" onChange={handleChange} required value={formData.nom_laboratoire || ''} />
      </>
    ),
    step3: (handleChange, formData) => (
      <>
        <input type="tel" name="telephone" placeholder="Téléphone" onChange={handleChange} required value={formData.telephone || ''} />
        <input type="text" name="adresse" placeholder="Adresse du laboratoire" onChange={handleChange} required value={formData.adresse || ''} />
        <input type="text" name="ville" placeholder="Ville" onChange={handleChange} required value={formData.ville || ''} />
      </>
    ),
    step4: (handleChange, formData) => (
      <>
        <select name="statut_laboratoire" onChange={handleChange} required value={formData.statut_laboratoire || 'actif'}>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
        <label>Pièce d'identité recto (PDF/JPG/PNG):
          <input type="file" name="piece_identite_recto" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
        </label>
        <label>Pièce d'identité verso (PDF/JPG/PNG):
          <input type="file" name="piece_identite_verso" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
        </label>
        <label>Diplôme (PDF/JPG/PNG):
          <input type="file" name="diplome" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
        </label>
      </>
    ),
    step5: (handleChange, formData) => (<><p>Merci de vérifier toutes les informations avant de soumettre.</p></>),
  };
  return <BaseForm roleSpecificFields={roleSpecificFields} title="Laboratoire" />;
}

// 💊 Pharmacien Form
function PharmacienForm() {
  const roleSpecificFields = {
    step2: (handleChange, formData) => (
      <>
        <input type="text" name="nom_pharmacie" placeholder="Nom de la pharmacie" onChange={handleChange} required value={formData.nom_pharmacie || ''} />
        <input type="tel" name="telephone" placeholder="Téléphone" onChange={handleChange} required value={formData.telephone || ''} />
      </>
    ),
    step3: (handleChange, formData) => (
      <>
        <input type="text" name="adresse" placeholder="Adresse de la pharmacie" onChange={handleChange} required value={formData.adresse || ''} />
        <input type="text" name="ville" placeholder="Ville" onChange={handleChange} required value={formData.ville || ''} />
      </>
    ),
    step4: (handleChange, formData) => (
      <>
        <select name="statut_pharmacien" onChange={handleChange} required value={formData.statut_pharmacien || 'actif'}>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
        <label>Pièce d'identité recto (PDF/JPG/PNG):
          <input type="file" name="piece_identite_recto" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
        </label>
        <label>Pièce d'identité verso (PDF/JPG/PNG):
          <input type="file" name="piece_identite_verso" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
        </label>
        <label>Diplôme (PDF/JPG/PNG):
          <input type="file" name="diplome" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
        </label>
      </>
    ),
    step5: (handleChange, formData) => (<><p>Merci de vérifier toutes les informations avant de soumettre.</p></>),
  };
  return <BaseForm roleSpecificFields={roleSpecificFields} title="Pharmacien" />;
}

// 🧍 Basic Form for Patient
function PatientForm() {
  const roleSpecificFields = {
    step2: (handleChange, formData) => (
      <>
        <input type="date" name="date_naissance" placeholder="Date de naissance" onChange={handleChange} required value={formData.date_naissance || ''} />
        <select name="genre" onChange={handleChange} required value={formData.genre || 'homme'}>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
        </select>
      </>
    ),
    step3: undefined,
    step4: undefined,
    step5: undefined,
  };
  return <BaseForm roleSpecificFields={roleSpecificFields} title="Patient" />;
}

export default SelectRolePage;
