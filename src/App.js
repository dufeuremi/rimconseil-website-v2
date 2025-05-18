import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import './styles/global.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PageTitle from './components/PageTitle';
import CookieConsent from './components/CookieConsent';
import DashboardLayout from './components/DashboardLayout';
import PageSettings from './components/PageSettings';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import Articles from './pages/Articles';
import NotFound from './pages/NotFound';
import { RiMailLine } from './components/Button';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import LoaderSplash from './components/LoaderSplash';

// Page imports
import Home from './pages/Home';
import Expertises from './pages/Expertises';
import Services from './pages/Services';
import Secteurs from './pages/Secteurs';
import Valeurs from './pages/Valeurs';
import Enjeux from './pages/Enjeux';
import NotreEquipe from './pages/NotreEquipe';
import NotreReseau from './pages/NotreReseau';
import Pages from './pages/Pages';
import Actualites from './pages/Actualites';
import Contact from './pages/Contact';
import Login from './pages/Login';
import RendezVous from './pages/RendezVous';
import MentionsLegales from './pages/MentionsLegales';
import Confidentialite from './pages/Confidentialite';
import Maintenance from './pages/Maintenance';

// Dashboard pages
import DashboardHome from './pages/dashboard/DashboardHome';
import DashboardPages from './pages/dashboard/DashboardPages';
import DashboardArticles from './pages/dashboard/DashboardArticles';
import DashboardExpertises from './pages/dashboard/DashboardExpertises';
import DashboardServices from './pages/dashboard/DashboardServices';
import DashboardSecteurs from './pages/dashboard/DashboardSecteurs';
import DashboardValeurs from './pages/dashboard/DashboardValeurs';
import DashboardActualites from './pages/dashboard/DashboardActualites';
import DashboardContact from './pages/dashboard/DashboardContact';
import DashboardMessages from './pages/dashboard/DashboardMessages';

// Configuration globale
export const API_BASE_URL = 'https://backend.rimconseil.com';

// Ajouter le token JWT aux headers par défaut s'il existe
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
};

const DashboardContainer = ({ children }) => {
  return (
    <DashboardLayout>
      <div className="dashboard-page">
        {children}
      </div>
    </DashboardLayout>
  );
};

const FloatingContactButton = styled(Link)`
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 2000;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, var(--color-primary) 0%, var(--color-primarylight) 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(44, 119, 227, 0.12);
  transition: transform 0.2s, box-shadow 0.2s;
  font-size: 2rem;
  cursor: pointer;
  border: none;
  outline: none;
  text-decoration: none;
  border-radius: 0;

  &:hover {
    transform: translateY(-4px) scale(1.07);
    box-shadow: 0 8px 24px rgba(44, 119, 227, 0.18);
    color: #fff;
  }
`;

const AppContent = () => {
  return (
    <div className="App">
      <LoaderSplash />
      <ScrollToTop />
      <PageTitle />
      <Routes>
        {/* Dashboard routes - protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardContainer>
              <DashboardHome />
            </DashboardContainer>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/pages" element={
          <ProtectedRoute>
            <DashboardContainer>
              <DashboardPages />
            </DashboardContainer>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/articles" element={
          <ProtectedRoute>
            <DashboardContainer>
              <DashboardArticles />
            </DashboardContainer>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/expertises" element={
          <ProtectedRoute>
            <DashboardContainer>
              <DashboardExpertises />
            </DashboardContainer>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/services" element={
          <ProtectedRoute>
            <DashboardContainer>
              <DashboardServices />
            </DashboardContainer>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/secteurs" element={
          <ProtectedRoute>
            <DashboardContainer>
              <DashboardSecteurs />
            </DashboardContainer>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/valeurs" element={
          <ProtectedRoute>
            <DashboardContainer>
              <DashboardValeurs />
            </DashboardContainer>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/actualites" element={
          <ProtectedRoute>
            <DashboardContainer>
              <DashboardActualites />
            </DashboardContainer>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/contact" element={
          <ProtectedRoute>
            <DashboardContainer>
              <DashboardContact />
            </DashboardContainer>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/messages" element={
          <ProtectedRoute>
            <DashboardContainer>
              <DashboardMessages />
            </DashboardContainer>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/pages/:id/edit" element={
          <ProtectedRoute>
            <DashboardContainer>
              <PageSettings 
                onSave={(data) => {
                  console.log('Enregistrement des données:', data);
                  // Ici vous pourriez appeler une API pour sauvegarder les données
                }}
              />
            </DashboardContainer>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/actualites/edit/:id" element={
          <ProtectedRoute>
            <DashboardContainer>
              <PageSettings 
                onSave={(data) => {
                  console.log('Enregistrement des données actus:', data);
                  // Ici vous pourriez appeler une API pour sauvegarder les actus
                }}
                contentType="actus"
              />
            </DashboardContainer>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/articles/edit/:id" element={
          <ProtectedRoute>
            <DashboardContainer>
              <PageSettings 
                onSave={(data) => {
                  console.log('Enregistrement des données articles:', data);
                  // Ici vous pourriez appeler une API pour sauvegarder les articles
                }}
                contentType="articles"
              />
            </DashboardContainer>
          </ProtectedRoute>
        } />

        {/* Main routes - public */}
        <Route path="/" element={
          <MainLayout>
            <Home />
          </MainLayout>
        } />
        <Route path="/expertises" element={
          <MainLayout>
            <Expertises />
          </MainLayout>
        } />
        <Route path="/services" element={
          <MainLayout>
            <Services />
          </MainLayout>
        } />
        <Route path="/secteurs" element={
          <MainLayout>
            <Secteurs />
          </MainLayout>
        } />
        <Route path="/valeurs" element={
          <MainLayout>
            <Valeurs />
          </MainLayout>
        } />
        <Route path="/pages" element={
          <MainLayout>
            <Pages />
          </MainLayout>
        } />
        <Route path="/actualites" element={
          <MainLayout>
            <Actualites />
          </MainLayout>
        } />
        <Route path="/articles" element={
          <MainLayout>
            <Articles />
          </MainLayout>
        } />
        <Route path="/articles/:id" element={
          <MainLayout>
            <Articles />
          </MainLayout>
        } />
        <Route path="/contact" element={
          <MainLayout>
            <Contact />
          </MainLayout>
        } />
        <Route path="/connexion" element={
          <MainLayout>
            <Login />
          </MainLayout>
        } />
        <Route path="/rendez-vous" element={
          <MainLayout>
            <RendezVous />
          </MainLayout>
        } />
        <Route path="/mentions-legales" element={
          <MainLayout>
            <MentionsLegales />
          </MainLayout>
        } />
        <Route path="/politique-confidentialite" element={
          <MainLayout>
            <Confidentialite />
          </MainLayout>
        } />
        <Route path="/equipe" element={
          <MainLayout>
            <NotreEquipe />
          </MainLayout>
        } />
        <Route path="/reseau" element={
          <MainLayout>
            <NotreReseau />
          </MainLayout>
        } />
        <Route path="/enjeux" element={
          <MainLayout>
            <Enjeux />
          </MainLayout>
        } />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="*" element={
          <MainLayout>
            <NotFound />
          </MainLayout>
        } />
      </Routes>
      <FloatingContactButton to="/contact" aria-label="Contact">
        <RiMailLine />
      </FloatingContactButton>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
