import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../lib/api';
import SidebarMedecin from '../SidebarMedecin';
import Topbar from '../Topbar';
import './CreateMedicamentPage.css';

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
        <form onSubmit={handleSubmit} className="medicament-form">
            <div className="mb-2">
                <label htmlFor="nom">Nom</label>
                <input
                    id="nom"
                    type="text"
                    name="nom"
                    className="form-control"
                    value={form.nom}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-2">
                <label htmlFor="quantite">Quantité</label>
                <input
                    id="quantite"
                    type="number"
                    name="quantite"
                    min="1"
                    className="form-control"
                    value={form.quantite}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-2">
                <label>
                    <input
                        type="checkbox"
                        name="disponible"
                        checked={form.disponible}
                        onChange={handleChange}
                    />{' '}
                    Disponible
                </label>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <div className="form-actions">
                {onCancel && (
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        Annuler
                    </button>
                )}
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
};

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
        <div className="page-container">
            <SidebarMedecin />
            <div className="page-content">
                <Topbar title="Créer un médicament" />
                <div className="content-inner">
                    <div className="header-section">
                        <button className="btn-back-icon" onClick={() => navigate('/medecin/medicaments')}>
                            <ArrowLeft size={18} />
                            <span>Retour</span>
                        </button>
                        <h2 className="page-title">Créer un médicament</h2>
                    </div>

                    <MedicamentForm
                        onSuccess={handleSuccess}
                        onCancel={() => navigate('/medecin/medicaments')}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateMedicamentPage;
