import React, { useState } from 'react';
import './Dashboard.css';

import { 
  Search, 
  BarChart3, 
  FileText, 
  User, 
  Clock, 
  Archive, 
  Building, 
  Users, 
  Stethoscope,
  Bell,
  MessageSquare,
  Settings,
  Home,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Tableau de bord' },
    { id: 'requests', icon: FileText, label: 'Liste demandes' },
    { id: 'patient-id', icon: User, label: 'Identité patient' },
    { id: 'current-requests', icon: Clock, label: 'Demandes en cours' },
    { id: 'archived-requests', icon: Archive, label: 'Demandes archivées' },
    { id: 'laboratories', icon: Building, label: 'Liste Laboratoires' },
    { id: 'couriers', icon: Users, label: 'Listes coursiers' },
    { id: 'doctors', icon: Stethoscope, label: 'Listes médecins' },
  ];

  const bottomMenuItems = [
    { id: 'notifications', icon: Bell, label: 'Notification', hasNotification: true },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'settings', icon: Settings, label: 'Paramètre' },
  ];

  // Sample data for different sections
  const dashboardStats = [
    { title: 'Total Demandes', value: '247', color: 'from-blue-500 to-blue-600', icon: FileText },
    { title: 'En Cours', value: '32', color: 'from-orange-500 to-orange-600', icon: Clock },
    { title: 'Terminées', value: '215', color: 'from-green-500 to-green-600', icon: BarChart3 },
    { title: 'Archivées', value: '45', color: 'from-purple-500 to-purple-600', icon: Archive },
  ];

  const recentRequests = [
    { id: 1, patient: 'Ahmed Ben Ali', date: '2024-07-05', status: 'En cours', type: 'Analyse' },
    { id: 2, patient: 'Fatima Zahra', date: '2024-07-04', status: 'Terminé', type: 'Consultation' },
    { id: 3, patient: 'Omar Idrissi', date: '2024-07-03', status: 'En attente', type: 'Radiologie' },
    { id: 4, patient: 'Aicha Morad', date: '2024-07-02', status: 'Terminé', type: 'Analyse' },
  ];

  const laboratories = [
    { id: 1, name: 'Laboratoire Central', address: 'Casablanca', phone: '+212 522 123 456', email: 'central@lab.ma' },
    { id: 2, name: 'Bio Lab', address: 'Rabat', phone: '+212 537 987 654', email: 'contact@biolab.ma' },
    { id: 3, name: 'Medica Lab', address: 'Marrakech', phone: '+212 524 555 123', email: 'info@medicalab.ma' },
  ];

  const doctors = [
    { id: 1, name: 'Dr. Hassan Alami', specialty: 'Cardiologie', hospital: 'CHU Ibn Sina', phone: '+212 661 123 456' },
    { id: 2, name: 'Dr. Leila Bennani', specialty: 'Pédiatrie', hospital: 'Clinique Al Amal', phone: '+212 662 789 012' },
    { id: 3, name: 'Dr. Youssef Tazi', specialty: 'Orthopédie', hospital: 'Hôpital Militaire', phone: '+212 663 345 678' },
  ];

  const handleMenuClick = (itemId) => {
    setActiveItem(itemId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En cours': return 'bg-orange-100 text-orange-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const MenuItem = ({ item, isActive, onClick }) => (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      <item.icon size={20} />
      <span className="font-medium">{item.label}</span>
      {item.hasNotification && (
        <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>
      )}
    </button>
  );

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <div key={index} className={`bg-gradient-to-r ${stat.color} text-white p-6 rounded-lg shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon size={40} className="opacity-80" />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Activité Récente</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{request.patient}</td>
                        <td className="py-3 px-4">{request.date}</td>
                        <td className="py-3 px-4">{request.type}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'requests':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Liste des Demandes</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Plus size={20} />
                Nouvelle Demande
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex gap-4 mb-6">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter size={16} />
                  Filtrer
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download size={16} />
                  Exporter
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">#{request.id}</td>
                        <td className="py-3 px-4">{request.patient}</td>
                        <td className="py-3 px-4">{request.date}</td>
                        <td className="py-3 px-4">{request.type}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye size={16} />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Edit size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'patient-id':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Identité Patient</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'laboratories':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Liste des Laboratoires</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Plus size={20} />
                Ajouter Laboratoire
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {laboratories.map((lab) => (
                <div key={lab.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{lab.name}</h3>
                    <Building className="text-blue-600" size={24} />
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{lab.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <span>{lab.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>{lab.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'doctors':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Liste des Médecins</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Plus size={20} />
                Ajouter Médecin
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Spécialité</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Hôpital</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Téléphone</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Stethoscope size={20} className="text-blue-600" />
                          </div>
                          {doctor.name}
                        </td>
                        <td className="py-3 px-4">{doctor.specialty}</td>
                        <td className="py-3 px-4">{doctor.hospital}</td>
                        <td className="py-3 px-4">{doctor.phone}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye size={16} />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Edit size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">{menuItems.find(item => item.id === activeItem)?.label}</h2>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600">Contenu de la page {activeItem}...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
   <div className="dashboard-container">
  {/* Sidebar */}
  <div className="sidebar">
    {/* Header */}
    <div className="sidebar-header">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <div className="sidebar-logo-dot"></div>
        </div>
        <span className="sidebar-logo-text">Ordonnance.ma</span>
      </div>
    </div>

    {/* Main Navigation */}
    <div className="sidebar-nav">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleMenuClick(item.id)}
          className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
        >
          <item.icon className="menu-item-icon" />
          <span>{item.label}</span>
          {item.hasNotification && <div className="menu-item-notification"></div>}
        </button>
      ))}
    </div>
        </div>


        {/* Bottom Navigation */}
        <div className="px-4 py-4 border-t border-gray-200 space-y-2">
          {bottomMenuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              onClick={handleMenuClick}
            />
          ))}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <div className="font-medium">Dr Slimani Aminah</div>
              <div className="text-xs">Administrateur</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500"> 
            © 2024 Apihealth. Tous droits réservés
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
    {/* Top Bar */}
    <div className="top-bar">
      <div className="top-bar-content">
        <h1 className="page-title">
          {menuItems.find(item => item.id === activeItem)?.label || 'Tableau de bord'}
        </h1>
        <div className="search-container">
          <div className="search-input-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Recherche"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>

        {/* Content Area */}
    <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;