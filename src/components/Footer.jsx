// components/Footer.jsx
import React from 'react';
import './footer.css'; // ✅ Import CSS file

const Footer = () => {
  return (
    <footer className="custom-footer">
      <span>© 2025 Ordannance. Tous droits réservés</span>
      <span>Ordonnance.ma</span>
    </footer>
  );
};

export default Footer;
