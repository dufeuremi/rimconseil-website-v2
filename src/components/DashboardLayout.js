import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SidebarSimple, Sidebar, House, Article, Files, Gear, Bug, SignOut, CaretDown, CaretRight } from '@phosphor-icons/react';
import './DashboardLayout.css';
import BugReportModal from './BugReportModal';

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Ici on pourrait ajouter une logique de déconnexion si nécessaire
    navigate('/');
  };

  return (
    <div className={`dashboard-layout ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="left-bar">
        <div className="sidebar-header">
          <Link to="/dashboard" className="logo">
            <SidebarSimple className="icon" />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>
          <button className="collapse-btn" onClick={toggleCollapse}>
            {isCollapsed ? <Sidebar weight="bold" className="icon" /> : <SidebarSimple weight="bold" className="icon" />}
          </button>
        </div>

        <nav className="nav-section">
          <Link to="/dashboard/pages" className={`section-title ${isActive('/dashboard/pages') ? 'active' : ''}`}>
            <Files className="icon" />
            {!isCollapsed && <span>Pages</span>}
          </Link>
        </nav>

        <nav className="nav-section">
          <Link to="/dashboard/articles" className={`section-title ${isActive('/dashboard/articles') ? 'active' : ''}`}>
            <Article className="icon" />
            {!isCollapsed && <span>Articles</span>}
          </Link>
        </nav>

        <nav className="nav-section">
          <div className="section-title" onClick={() => toggleSection('personalisation')}>
            <Gear className="icon" />
            {!isCollapsed && (
              <>
                <span>Personnalisation</span>
                {activeSection === 'personalisation' ? <CaretDown className="icon" /> : <CaretRight className="icon" />}
              </>
            )}
          </div>
          {activeSection === 'personalisation' && !isCollapsed && (
            <div className="dropdown-content">
              <Link to="/dashboard/expertises" className={`nav-link ${isActive('/dashboard/expertises') ? 'active' : ''}`}>
                Expertises
              </Link>
              <Link to="/dashboard/services" className={`nav-link ${isActive('/dashboard/services') ? 'active' : ''}`}>
                Services
              </Link>
              <Link to="/dashboard/secteurs" className={`nav-link ${isActive('/dashboard/secteurs') ? 'active' : ''}`}>
                Secteurs
              </Link>
              <Link to="/dashboard/valeurs" className={`nav-link ${isActive('/dashboard/valeurs') ? 'active' : ''}`}>
                Valeurs
              </Link>
              <Link to="/dashboard/actualites" className={`nav-link ${isActive('/dashboard/actualites') ? 'active' : ''}`}>
                Actualités
              </Link>
              <Link to="/dashboard/contact" className={`nav-link ${isActive('/dashboard/contact') ? 'active' : ''}`}>
                Contact
              </Link>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="alert-bug-btn" onClick={() => setIsBugModalOpen(true)}>
            <Bug className="icon" />
            {!isCollapsed && <span>Signaler une panne</span>}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <SignOut className="icon" />
            {!isCollapsed && <span>Se déconnecter</span>}
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {children}
      </div>

      <BugReportModal 
        isOpen={isBugModalOpen}
        onClose={() => setIsBugModalOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout; 