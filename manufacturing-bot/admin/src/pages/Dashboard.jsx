import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import Overview from '../components/dashboard/Overview';

const Dashboard = () => {
  const [currentSection, setCurrentSection] = useState('overview');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      {/* Sidebar */}
      <Sidebar currentSection={currentSection} setCurrentSection={setCurrentSection} />

      {/* Main Content */}
      <div className="flex-1">
        <Header handleLogout={handleLogout} />
        
        <main className="p-6">
          {currentSection === 'overview' && <Overview />}
          {/* Other sections will be added here */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 