import React, { useState } from 'react';
import './LoginPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      // Determine role message and dashboard route
      let roleMsg = '';
      let dashboardRoute = '/dashboard';
      if (user && user.roles && user.roles.length > 0) {
        const role = user.roles[0].name;
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
        localStorage.setItem('userRole', role); // Store the actual role
      }
      localStorage.setItem('roleMessage', roleMsg);
      navigate(dashboardRoute);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Erreur lors de la connexion. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Side */}
        <div className="login-left">
          <img src="/logo-white.png" alt="Ordonnance Logo" />
          <h1>WELCOME</h1>
          <p className="description">
            Lorem Ipsum est un texte d’espace réservé couramment utilisé dans les industries graphique, imprimée et éditoriale.
          </p>
          <p className="bottom-text">Ordonnance.ma</p>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <img src="/logo-colored.png" alt="Ordonnance Logo" className="logo-small" />
          <h3 className="form-title">Se connecter</h3>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Votre Adresse Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <label htmlFor="password">Mot de passe</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Mot de passe"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <span
                className="toggle-icon"
                onClick={() => setShowPassword(prev => !prev)}
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-options">
              <label>
                <input type="checkbox" /> Se rappeler de
              </label>
              <a href="#" className="forgot">Mot de passe oublié?</a>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            <p className="signup-link">
              Vous n'avez pas un compte ? <a href="/select-role">Inscrivez vous</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
