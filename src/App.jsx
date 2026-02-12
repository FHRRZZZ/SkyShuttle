import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AirportForm from './components/AirportForm';
import DropOffForm from './components/DropOffForm';
import CharterForm from './components/CharterForm';
import { openWhatsApp } from './utils/whatsapp';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigate = (target) => {
    if (target === 'contact') {
      openWhatsApp("6282289191926", "Halo, saya ingin bertanya tentang layanan SkyShuttle.");
      return;
    }

    if (target === 'about') {
        const footer = document.getElementById('footer');
        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    if (target === 'services') {
        if (currentPage !== 'dashboard') {
            setCurrentPage('dashboard');

            setTimeout(() => {
                const servicesSection = document.getElementById('services');
                if (servicesSection) servicesSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const servicesSection = document.getElementById('services');
            if (servicesSection) servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }

    setCurrentPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'airport':
        return (
          <div className="max-w-2xl mx-auto py-12 px-6">
            <AirportForm onBack={() => setCurrentPage('dashboard')} />
          </div>
        );
      case 'dropoff':
        return (
          <div className="max-w-2xl mx-auto py-12 px-6">
            <DropOffForm onBack={() => setCurrentPage('dashboard')} />
          </div>
        );
      case 'charter':
        return (
          <div className="max-w-2xl mx-auto py-12 px-6">
            <CharterForm onBack={() => setCurrentPage('dashboard')} />
          </div>
        );
      default:
        return <Dashboard onSelectService={setCurrentPage} />;
    }
  };

  return (
    <Layout onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

export default App;
