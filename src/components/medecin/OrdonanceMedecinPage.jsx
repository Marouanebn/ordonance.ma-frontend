import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Pencil,
  Trash2,
  Loader2,
  X
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
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ patient_id: '', medicaments: [], date_prescription: '', detail: '' });
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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
    } catch (err) {}
    setLoading(false);
  };

  const openEditModal = (ord) => {
    setEditId(ord.id);
    setEditForm({
      patient_id: ord.patient?.id || '',
      medicaments: ord.medicaments?.map(m => ({
        medicament_id: m.id,
        quantite: m.pivot?.quantite || 1
      })) || [],
      date_prescription: ord.date_prescription || '',
      detail: ord.detail || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditMedicamentChange = (idx, field, value) => {
    setEditForm((prev) => {
      const meds = [...prev.medicaments];
      meds[idx][field] = value;
      return { ...prev, medicaments: meds };
    });
  };

  const addEditMedicament = () => {
    setEditForm((prev) => ({
      ...prev,
      medicaments: [...prev.medicaments, { medicament_id: '', quantite: 1 }],
    }));
  };

  const removeEditMedicament = (idx) => {
    setEditForm((prev) => ({
      ...prev,
      medicaments: prev.medicaments.filter((_, i) => i !== idx),
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await api.put(`/medecin/ordonnances/${editId}`, {
        medicaments: editForm.medicaments.map(m => ({
          medicament_id: m.medicament_id,
          quantite: Number(m.quantite),
        })),
        date_prescription: editForm.date_prescription,
        detail: editForm.detail,
      });
      setEditId(null);
      fetchData();
    } catch (err) {
      setEditError('Erreur lors de la modification.');
    }
    setEditLoading(false);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/medecin/ordonnances/${deleteId}`);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      setDeleteError('Erreur lors de la suppression.');
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
                    <td>{ord.medicaments?.map(m => `${m.nom} (x${m.pivot?.quantite || 1})`).join(', ')}</td>
                    <td>{ord.date_prescription || ord.created_at}</td>
                    <td>{ord.status || '-'}</td>
                    <td>{ord.detail || '-'}</td>
                    <td className="actions-cell">
                      <button className="icon-button" onClick={() => openEditModal(ord)} title="Modifier">
                        <Pencil size={16} />
                      </button>
                      <button className="icon-button danger" onClick={() => setDeleteId(ord.id)} title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Delete Modal */}
          {deleteId && (
            <div className="modal">
              <div className="modal-box">
                <h3>Confirmer la suppression</h3>
                <p>Voulez-vous vraiment supprimer cette ordonnance ?</p>
                {deleteError && <div className="error">{deleteError}</div>}
                <div className="modal-actions">
                  <button className="secondary-button" onClick={() => setDeleteId(null)}>Annuler</button>
                  <button className="danger-button" onClick={handleDelete} disabled={deleteLoading}>
                    {deleteLoading ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {editId && (
            <div className="modal">
              <div className="modal-box large">
                <h3>Modifier l'ordonnance</h3>
                <form onSubmit={handleEditSubmit}>
                  <label>Patient</label>
                  <select value={editForm.patient_id} disabled>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.user?.name}</option>
                    ))}
                  </select>

                  <label>Médicaments</label>
                  {editForm.medicaments.map((m, idx) => (
                    <div className="med-row" key={idx}>
                      <select value={m.medicament_id} onChange={(e) => handleEditMedicamentChange(idx, 'medicament_id', e.target.value)}>
                        <option value="">Choisir</option>
                        {medicaments.map(md => (
                          <option key={md.id} value={md.id}>{md.nom}</option>
                        ))}
                      </select>
                      <input type="number" min="1" value={m.quantite} onChange={(e) => handleEditMedicamentChange(idx, 'quantite', e.target.value)} />
                      <button type="button" className="icon-button danger" onClick={() => removeEditMedicament(idx)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-med-btn" onClick={addEditMedicament}>+ Ajouter médicament</button>

                  <label>Date de prescription</label>
                  <input type="date" name="date_prescription" value={editForm.date_prescription} onChange={handleEditChange} required />

                  <label>Détail</label>
                  <textarea name="detail" value={editForm.detail} onChange={handleEditChange} maxLength={500}></textarea>

                  {editError && <div className="error">{editError}</div>}

                  <div className="modal-actions">
                    <button type="button" className="secondary-button" onClick={() => setEditId(null)}>Annuler</button>
                    <button type="submit" className="primary-button" disabled={editLoading}>
                      {editLoading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdonanceMedecinPage;
