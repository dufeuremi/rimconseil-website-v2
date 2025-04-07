import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './styles/global.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PageTitle from './components/PageTitle';
import CookieConsent from './components/CookieConsent';
import DashboardLayout from './components/DashboardLayout';
import PageSettings from './components/PageSettings';

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

const AppContent = () => {
  return (
    <div className="App">
      <ScrollToTop />
      <PageTitle />
      <Routes>
        {/* Dashboard routes */}
        <Route path="/dashboard" element={
          <DashboardContainer>
            <DashboardHome />
          </DashboardContainer>
        } />
        <Route path="/dashboard/pages" element={
          <DashboardContainer>
            <DashboardPages />
          </DashboardContainer>
        } />
        <Route path="/dashboard/articles" element={
          <DashboardContainer>
            <DashboardArticles />
          </DashboardContainer>
        } />
        <Route path="/dashboard/expertises" element={
          <DashboardContainer>
            <DashboardExpertises />
          </DashboardContainer>
        } />
        <Route path="/dashboard/services" element={
          <DashboardContainer>
            <DashboardServices />
          </DashboardContainer>
        } />
        <Route path="/dashboard/secteurs" element={
          <DashboardContainer>
            <DashboardSecteurs />
          </DashboardContainer>
        } />
        <Route path="/dashboard/valeurs" element={
          <DashboardContainer>
            <DashboardValeurs />
          </DashboardContainer>
        } />
        <Route path="/dashboard/actualites" element={
          <DashboardContainer>
            <DashboardActualites />
          </DashboardContainer>
        } />
        <Route path="/dashboard/contact" element={
          <DashboardContainer>
            <DashboardContact />
          </DashboardContainer>
        } />
        <Route path="/dashboard/pages/:id/edit" element={
          <DashboardContainer>
            <PageSettings 
              onSave={(data) => {
                console.log('Enregistrement des données:', data);
                // Ici vous pourriez appeler une API pour sauvegarder les données
              }}
            />
          </DashboardContainer>
        } />

        {/* Main routes */}
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
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
