import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-bold tracking-wide">
          Analyse Salaire
        </h1>

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-yellow-300 transition">Dashboard</Link>
          <Link to="/analyse" className="hover:text-yellow-300 transition">Analyse Bivariée</Link>
          <Link to="/modeles" className="hover:text-yellow-300 transition">Modèles</Link>
          <Link to="/modelesAvancees" className="hover:text-yellow-300 transition">Analyse Avancée</Link>
          <Link to="/prediction" className="hover:text-yellow-300 transition">Prédiction</Link>
        </nav>

        {/* Bouton Menu Mobile */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <nav className="md:hidden bg-gray-800 px-6 py-4 space-y-4">
          <Link to="/" className="block hover:text-yellow-300" onClick={toggleMenu}>Dashboard</Link>
          <Link to="/analyse" className="block hover:text-yellow-300" onClick={toggleMenu}>Analyse Bivariée</Link>
          <Link to="/modeles" className="block hover:text-yellow-300" onClick={toggleMenu}>Modèles</Link>
          <Link to="/modelesAvancees" className="block hover:text-yellow-300" onClick={toggleMenu}>Analyse Avancée</Link>
          <Link to="/prediction" className="block hover:text-yellow-300" onClick={toggleMenu}>Prédiction</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
