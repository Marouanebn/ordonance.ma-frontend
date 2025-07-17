import React, { useEffect, useState } from 'react';
import { PlusCircle, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import SidebarMedecin from '../SidebarMedecin';
import Topbar from '../Topbar';
import './MedicamentsMedecinPage.css';

const MedicamentsMedecinPage = () => {
  const navigate = useNavigate();
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedicaments();
  }, []);

  const fetchMedicaments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/medicaments');
      setMedicaments(Array.isArray(res.data.data?.data) ? res.data.data.data : []);
    } catch (err) {
      setError('Erreur lors du chargement des médicaments.');
    }
    setLoading(false);
  };

  const handleEdit = (id) => {
    navigate(`/medecin/medicaments/modifier/${id}`);
  };

  const handleView = (id) => {
    navigate(`/medecin/medicaments/consulter/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce médicament ?')) {
      // Call delete API
      api.delete(`/medicaments/${id}`)
        .then(() => {
          fetchMedicaments();
        })
        .catch(() => {
          alert("Erreur lors de la suppression.");
        });
    }
  };

  return (
    <div className="medicaments-page">
      <SidebarMedecin />
      <div className="main-content">
        <Topbar title="Gestion des Médicaments" />
        <div className="content-wrapper">
          <div className="header-bar">
            <h2>Médicaments</h2>
            <button className="primary-button" onClick={() => navigate('/medecin/medicaments/creer')}>
              <PlusCircle size={18} /> Créer un médicament
            </button>
          </div>

          {loading ? (
            <div className="loading-box">
              <Loader2 className="spinner" size={20} />
              Chargement...
            </div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Quantité</th>
                  <th>Disponibilité</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicaments.map((m) => (
                  <tr key={m.id}>
                    <td>{m.nom}</td>
                    <td>{m.quantite}</td>
                    <td>{m.disponible ? 'Oui' : 'Non'}</td>
                    <td className="actions-cell">
                      <button className="icon-button" onClick={() => handleView(m.id)} title="Consulter">
                        <Eye size={16} />
                      </button>
                      <button className="icon-button" onClick={() => handleEdit(m.id)} title="Modifier">
                        <Pencil size={16} />
                      </button>
                      <button className="icon-button danger" onClick={() => handleDelete(m.id)} title="Supprimer">
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

export default MedicamentsMedecinPage;
