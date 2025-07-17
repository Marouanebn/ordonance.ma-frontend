import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Pencil,
  Trash2,
  Loader2,
  X,
  Download
} from 'lucide-react';
import api from '../../lib/api';
import SidebarMedecin from '../SidebarMedecin';
import Topbar from '../Topbar';
import './OrdonanceMedecinPage.css'; // ⬅️ Your custom CSS

const OrdonanceMedecinPage = () => {
  const [ordonnances, setOrdonnances] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, patRes, medRes] = await Promise.all([
        api.get('/medecin/ordonnances'),
        api.get('/medecin/patients'),
        api.get('/medicaments'),
      ]);
      setOrdonnances(ordRes.data.data.data || []);
      setPatients(patRes.data.data || []);
      setMedicaments(medRes.data.data.data || []);
    } catch (err) { }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette ordonnance ?')) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await api.delete(`/medecin/ordonnances/${id}`);
      fetchData();
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        let errorMessages = [];
        Object.values(errors).forEach(msgs => {
          if (Array.isArray(msgs)) errorMessages.push(...msgs);
          else if (typeof msgs === 'string') errorMessages.push(msgs);
        });
        setDeleteError(errorMessages.join(' '));
      } else {
        setDeleteError(err.response?.data?.message || 'Erreur lors de la suppression.');
      }
    }
    setDeleteLoading(false);
  };

  return (
    <div className="ordonance-page">
      <SidebarMedecin />
      <div className="main-content">
        <Topbar title="Gestion des Ordonnances" />
        <div className="content-wrapper">
          <div className="header-bar">
            <h2>Ordonnances</h2>
            <button onClick={() => navigate('/medecin/ordonance/creer')} className="primary-button">
              <PlusCircle size={18} /> Nouvelle ordonnance
            </button>
          </div>

          {loading ? (
            <div className="loading-box">
              <Loader2 className="spinner" /> Chargement...
            </div>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>CIN</th>
                  <th>Médicaments</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Détail</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordonnances.map((ord) => (
                  <tr key={ord.id}>
                    <td>{ord.patient?.user?.name || '-'}</td>
                    <td>{ord.patient?.cin || '-'}</td>
                    <td>{ord.medicaments?.map(m => `${m.nom} (x${m.pivot?.quantite || 1})`).join(', ')}</td>
                    <td>{ord.date_prescription || ord.created_at}</td>
                    <td>{ord.status || '-'}</td>
                    <td>{ord.detail || '-'}</td>
                    <td className="actions-cell">
                      <button className="icon-button" onClick={() => navigate(`/medecin/ordonance/modifier/${ord.id}`)} title="Modifier">
                        <Pencil size={16} />
                      </button>
                      <button className="icon-button danger" onClick={() => handleDelete(ord.id)} title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdonanceMedecinPage;
