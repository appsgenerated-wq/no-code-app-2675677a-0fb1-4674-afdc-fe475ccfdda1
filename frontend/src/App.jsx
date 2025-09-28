import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import { testBackendConnection } from './services/apiService.js';
import config from './constants.js';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [discoveries, setDiscoveries] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [backendConnected, setBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const manifest = new Manifest({
    baseURL: config.BACKEND_URL,
    appId: config.APP_ID,
  });

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 [APP] Starting backend connection test...');
      const connectionResult = await testBackendConnection();
      setBackendConnected(connectionResult.success);

      if (connectionResult.success) {
        console.log('✅ [APP] Backend connection successful.');
        try {
          const currentUser = await manifest.from('User').me();
          setUser(currentUser);
          setCurrentScreen('dashboard');
        } catch (error) {
          console.log('No active session found.');
          setUser(null);
          setCurrentScreen('landing');
        }
      } else {
        console.error('❌ [APP] Backend connection failed:', connectionResult.error);
      }
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const login = async (email, password) => {
    await manifest.login(email, password);
    const loggedInUser = await manifest.from('User').me();
    setUser(loggedInUser);
    setCurrentScreen('dashboard');
  };

  const logout = async () => {
    await manifest.logout();
    setUser(null);
    setDiscoveries([]);
    setCurrentScreen('landing');
  };

  const loadDiscoveries = async () => {
    const response = await manifest.from('Discovery').find({
      include: ['owner'],
      sort: { discoveryDate: 'desc' },
    });
    setDiscoveries(response.data);
  };

  const createDiscovery = async (discoveryData) => {
    const newDiscovery = await manifest.from('Discovery').create(discoveryData);
    // Refetch discoveries to get the latest list with owner info
    loadDiscoveries();
  };

  const deleteDiscovery = async (discoveryId) => {
    await manifest.from('Discovery').delete(discoveryId);
    setDiscoveries(discoveries.filter(d => d.id !== discoveryId));
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
    }

    return currentScreen === 'landing' ? (
      <LandingPage onLogin={login} />
    ) : (
      <DashboardPage
        user={user}
        discoveries={discoveries}
        onLogout={logout}
        onLoadDiscoveries={loadDiscoveries}
        onCreateDiscovery={createDiscovery}
        onDeleteDiscovery={deleteDiscovery}
      />
    );
  };

  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${backendConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <span className={`h-2 w-2 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>{backendConnected ? 'API Connected' : 'API Disconnected'}</span>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

export default App;
