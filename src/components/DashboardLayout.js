import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SidebarSimple, Sidebar, Article, Files, Gear, Warning, SignOut, CaretDown, CaretRight, ChatText } from '@phosphor-icons/react';
import axios from 'axios';
import './DashboardLayout.css';
import BugReportModal from './BugReportModal';
import logo from '../assets/images/logo.svg';
import Title from './Title';
import ConfirmationDialog from './ConfirmationDialog';
import SuccessPopup from './SuccessPopup';

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Détection mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSection = (section) => {
    // Si la sidebar est fermée, l'ouvrir d'abord
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    
    // Ensuite basculer la section
    setActiveSection(activeSection === section ? null : section);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    // Supprimer le token JWT du localStorage
    localStorage.removeItem('token');
    // Nettoyer le header d'autorisation dans axios
    delete axios.defaults.headers.common['Authorization'];
    setShowLogoutDialog(false);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate('/connexion');
    }, 1800);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className={`dashboard-layout ${isCollapsed ? 'collapsed' : ''}`}>
      {isMobile && (
        <button className="dashboard-mobile-toggle" onClick={toggleMobileMenu}>
          <Sidebar size={24} />
        </button>
      )}
      
      <div className={`left-bar ${isMobile && showMobileMenu ? 'active' : ''}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className={`logo ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => isMobile && setShowMobileMenu(false)}>
            <img src={logo} alt="Logo" className="logo-image" />
            {!isCollapsed && <Title level={3} className="dashboard-title">Dashboard</Title>}
          </Link>
          {!isMobile && (
            <button className="collapse-btn" onClick={toggleCollapse}>
              {isCollapsed ? <Sidebar weight="bold" className="toggle-icon" /> : <SidebarSimple weight="bold" className="toggle-icon" />}
            </button>
          )}
        </div>

        <nav className="nav-section">
          <Link to="/dashboard/messages" className={`nav-item ${isActive('/dashboard/messages') ? 'active' : ''}`} onClick={() => isMobile && setShowMobileMenu(false)}>
            <ChatText className="icon" />
            {!isCollapsed && <span>Messages</span>}
          </Link>
        </nav>

        <nav className="nav-section">
          <Link to="/dashboard/actualites" className={`nav-item ${isActive('/dashboard/actualites') ? 'active' : ''}`} onClick={() => isMobile && setShowMobileMenu(false)}>
            <Files className="icon" />
            {!isCollapsed && <span>Actualités</span>}
          </Link>
        </nav>

        <nav className="nav-section">
          <Link to="/dashboard/articles" className={`nav-item ${isActive('/dashboard/articles') ? 'active' : ''}`} onClick={() => isMobile && setShowMobileMenu(false)}>
            <Article className="icon" />
            {!isCollapsed && <span>Articles</span>}
          </Link>
        </nav>

        <nav className="nav-section">
          <div className={`nav-item ${activeSection === 'personalisation' ? 'active' : ''}`} onClick={() => toggleSection('personalisation')}>
            <Gear className="icon" />
            {!isCollapsed && (
              <>
                <span>Personnalisation</span>
                {activeSection === 'personalisation' ? 
                  <CaretDown className="dropdown-icon" /> : 
                  <CaretRight className="dropdown-icon" />
                }
              </>
            )}
          </div>
          {activeSection === 'personalisation' && !isCollapsed && (
            <div className="dropdown-content">
              <Link to="/dashboard/expertises" className={`nav-item ${isActive('/dashboard/expertises') ? 'active' : ''}`} onClick={() => isMobile && setShowMobileMenu(false)}>
                Expertises
              </Link>
              <Link to="/dashboard/services" className={`nav-item ${isActive('/dashboard/services') ? 'active' : ''}`} onClick={() => isMobile && setShowMobileMenu(false)}>
                Services
              </Link>
              <Link to="/dashboard/secteurs" className={`nav-item ${isActive('/dashboard/secteurs') ? 'active' : ''}`} onClick={() => isMobile && setShowMobileMenu(false)}>
                Secteurs
              </Link>
              <Link to="/dashboard/valeurs" className={`nav-item ${isActive('/dashboard/valeurs') ? 'active' : ''}`} onClick={() => isMobile && setShowMobileMenu(false)}>
                Valeurs
              </Link>
              <Link to="/dashboard/contact" className={`nav-item ${isActive('/dashboard/contact') ? 'active' : ''}`} onClick={() => isMobile && setShowMobileMenu(false)}>
                Contact
              </Link>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item alert-bug-btn" onClick={() => setIsBugModalOpen(true)}>
            <Warning className="icon" />
            {!isCollapsed && <span>Signaler une panne</span>}
          </button>
          <button className="nav-item logout-btn" onClick={handleLogout}>
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
      <ConfirmationDialog
        title="Déconnexion"
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
        confirmText="Se déconnecter"
        cancelText="Annuler"
        danger
      >
        Êtes-vous sûr de vouloir vous déconnecter&nbsp;?
      </ConfirmationDialog>
      <SuccessPopup
        message="Vous avez été déconnecté avec succès."
        show={showSuccessPopup}
        onHide={() => setShowSuccessPopup(false)}
        duration={1200}
      />
    </div>
  );
};

export default DashboardLayout; 