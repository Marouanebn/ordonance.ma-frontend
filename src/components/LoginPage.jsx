import React, { useState } from 'react';
import './LoginPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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

          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Votre Adresse Email"
              required
            />

            <label htmlFor="password">Mot de passe</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Mot de passe"
                required
              />
              <span
                className="toggle-icon"
                onClick={() => setShowPassword(prev => !prev)}
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="form-options">
              <label>
                <input type="checkbox" /> Se rappeler de
              </label>
              <a href="#" className="forgot">Mot de passe oublié?</a>
            </div>

            <button type="submit" className="btn-login">Se connecter</button>

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
