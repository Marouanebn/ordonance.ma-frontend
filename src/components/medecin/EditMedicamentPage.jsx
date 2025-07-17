import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import SidebarMedecin from '../SidebarMedecin';
import Topbar from '../Topbar';
import './CreateMedicamentPage.css';

const EditMedicamentPage = () => {
    const { id } = useParams();
    const [form, setForm] = useState({ nom: '', quantite: 1, disponible: true });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/medicaments/${id}`);
            const medicament = res.data.data;
            setForm({
                nom: medicament.nom || '',
                quantite: medicament.quantite || 1,
                disponible: medicament.disponible ?? true,
            });
        } catch (err) {
            setError('Erreur lors du chargement du médicament.');
        }
        setLoading(false);
    };

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
        try {
            await api.put(`/medicaments/${id}`, {
                nom: form.nom,
                quantite: Number(form.quantite),
                disponible: form.disponible,
            });
            navigate('/medecin/medicaments');
        } catch (err) {
            setError('Erreur lors de la modification.');
        }
        setSubmitting(false);
    };

    return (
        <div className="page-container">
            <SidebarMedecin />
            <div className="page-content">
                <Topbar title="Modifier un médicament" />
                <div className="content-inner">
                    <div className="header-section">
                        <button className="btn-back-icon" onClick={() => navigate('/medecin/medicaments')}>
                            ← Retour
                        </button>
                        <h2 className="page-title">Modifier un médicament</h2>
                    </div>
                    {loading ? (
                        <div>Chargement...</div>
                    ) : (
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
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => navigate('/medecin/medicaments')}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditMedicamentPage; 