import React, { useState } from 'react';

export const MedicamentForm = ({ onSuccess, onCancel, initialValues }) => {
    const [form, setForm] = useState(initialValues || { nom: '', quantite: 1, disponible: true });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            // The parent should provide the API call
            await onSuccess(form);
            setSuccess('Médicament créé avec succès.');
            setTimeout(() => {
                setSuccess('');
                if (onCancel) onCancel();
            }, 1000);
        } catch (err) {
            setError('Erreur lors de la création.');
        }
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
            <div className="mb-2">
                <label>Nom</label>
                <input type="text" name="nom" className="form-control" value={form.nom} onChange={handleChange} required />
            </div>
            <div className="mb-2">
                <label>Quantité</label>
                <input type="number" name="quantite" min="1" className="form-control" value={form.quantite} onChange={handleChange} required />
            </div>
            <div className="mb-2">
                <label>
                    <input type="checkbox" name="disponible" checked={form.disponible} onChange={handleChange} /> Disponible
                </label>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>Annuler</button>}
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Enregistrement...' : 'Enregistrer'}</button>
            </div>
        </form>
    );
};

// Default export is the medecin page, which uses the form
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import SidebarMedecin from '../SidebarMedecin';
import Topbar from '../Topbar';

const CreateMedicamentPage = () => {
    const navigate = useNavigate();
    const handleSuccess = async (form) => {
        await api.post('/medicaments', {
            nom: form.nom,
            quantite: Number(form.quantite),
            disponible: form.disponible,
        });
        navigate('/medecin/medicaments');
    };
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <SidebarMedecin />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 260 }}>
                <Topbar title="Créer un médicament" />
                <div style={{ flex: 1, padding: '30px', backgroundColor: '#f9f9f9' }}>
                    <h2>Créer un médicament</h2>
                    <button className="btn btn-secondary mb-3" onClick={() => navigate('/medecin/medicaments')}>Retour</button>
                    <MedicamentForm onSuccess={handleSuccess} onCancel={() => navigate('/medecin/medicaments')} />
                </div>
            </div>
        </div>
    );
};

export default CreateMedicamentPage; 