// src/components/Topbar.jsx
import React from "react";
import { Search } from "lucide-react";
import "./topbar.css";

const Topbar = ({ title = "Tableau de bord" }) => {
  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>

      <div className="topbar-search">
        <Search className="search-icon" size={16} />
        <input
          type="text"
          className="search-input"
          placeholder="Recherche"
        />
      </div>
    </header>
  );
};

export default Topbar;
