
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import LiveVoice from './components/LiveVoice';
import Diagnostics from './components/Diagnostics';
import UnitConverter from './components/UnitConverter';
import QuickSpecs from './components/QuickSpecs';
import NearbyShops from './components/NearbyShops';
import InstallPrompt from './components/InstallPrompt';
import VisualDiagnostic from './components/VisualDiagnostic';
import ComponentTester from './components/ComponentTester';
import TSBRadar from './components/TSBRadar';
import GuidedDiagnostic from './components/GuidedDiagnostic';
import LaborEstimator from './components/LaborEstimator';
import CircuitGenius from './components/CircuitGenius';
import FailurePredictor from './components/FailurePredictor';
import PrecisionSpecs from './components/PrecisionSpecs';
import ADASGuide from './components/ADASGuide';
import InstallGuide from './components/InstallGuide';
import ToolMaintenance from './components/ToolMaintenance';
import TorqueSpecs from './components/TorqueSpecs';
import RepairGuide from './components/RepairGuide';
import ShareApp from './components/ShareApp';
import PartFinder from './components/PartFinder';
import Registration from './components/Registration';
import AdminDashboard from './components/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import UpdatePrompt from './components/UpdatePrompt';
import PremiumUpgrade from './components/PremiumUpgrade';
import { AppView } from './types';
import { auth, checkUserRegistration, checkUserPremium, updateLastActive } from './services/firebaseService';
import { onAuthStateChanged } from 'firebase/auth';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<AppView[]>([AppView.DASHBOARD]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    const requestInitialPermissions = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Tell Capacitor Updater the app is ready and loaded correctly (prevents rollback)
          await CapacitorUpdater.notifyAppReady();

          // Request Camera and Geolocation permissions on startup
          await Camera.requestPermissions();
          await Geolocation.requestPermissions();
        } catch (error) {
          console.warn("Permissions request failed or was denied:", error);
        }
      }
    };
    requestInitialPermissions();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const registered = await checkUserRegistration(user.uid);
        setIsRegistered(registered);
        if (registered) {
          updateLastActive(user.uid);
          const premiumStatus = await checkUserPremium(user.uid);
          setIsPremium(premiumStatus);
        } else {
          setIsPremium(false);
        }
      } else {
        setIsRegistered(false);
        setIsPremium(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const navigateTo = (view: AppView) => {
    if (viewHistory[historyIndex] === view) return;
    const shadowHistory = [...viewHistory.slice(0, historyIndex + 1), view];
    setViewHistory(shadowHistory);
    setHistoryIndex(shadowHistory.length - 1);
    setActiveView(view);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setActiveView(viewHistory[newIndex]);
    } else {
      navigateTo(AppView.DASHBOARD);
    }
  };

  const handleForward = () => {
    if (historyIndex < viewHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setActiveView(viewHistory[newIndex]);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case AppView.PREMIUM_UPGRADE:
        return <PremiumUpgrade onBack={handleBack} onSuccess={() => { setIsPremium(true); handleBack(); }} />;
      case AppView.DASHBOARD:
        return <Dashboard onAction={navigateTo} onBack={handleBack} isPremium={isPremium} />;
      case AppView.CHAT:
        return <ChatInterface onBack={handleBack} isPremium={isPremium} onUpgrade={() => navigateTo(AppView.PREMIUM_UPGRADE)} />;
      case AppView.LIVE_VOICE:
        return <LiveVoice onBack={handleBack} />;
      case AppView.DIAGNOSTICS:
        return <Diagnostics onBack={handleBack} />;
      case AppView.UNIT_CONVERTER:
        return <UnitConverter onBack={handleBack} />;
      case AppView.QUICK_SPECS:
        return <QuickSpecs onAction={navigateTo} onBack={handleBack} />;
      case AppView.NEARBY_SHOPS:
        return <NearbyShops onBack={handleBack} />;
      case AppView.AI_VISION:
        return <VisualDiagnostic onBack={handleBack} />;
      case AppView.COMPONENT_TESTER:
        return <ComponentTester onBack={handleBack} />;
      case AppView.TSB_RADAR:
        return <TSBRadar onBack={handleBack} />;
      case AppView.GUIDED_DIAGNOSTIC:
        return <GuidedDiagnostic onBack={handleBack} />;
      case AppView.LABOR_ESTIMATOR:
        return <LaborEstimator onBack={handleBack} />;
      case AppView.CIRCUIT_GENIUS:
        return <CircuitGenius onBack={handleBack} />;
      case AppView.FAILURE_PREDICTOR:
        return <FailurePredictor onBack={handleBack} />;
      case AppView.PRECISION_SPECS:
        return <PrecisionSpecs onBack={handleBack} />;
      case AppView.ADAS_GUIDE:
        return <ADASGuide onBack={handleBack} />;
      case AppView.INSTALL_GUIDE:
        return <InstallGuide onBack={handleBack} />;
      case AppView.TOOL_MAINTENANCE:
        return <ToolMaintenance onBack={handleBack} />;
      case AppView.TORQUE_SPECS:
        return <TorqueSpecs onBack={handleBack} />;
      case AppView.REPAIR_GUIDE:
        return <RepairGuide onBack={handleBack} />;
      case AppView.PART_FINDER:
        return <PartFinder onBack={handleBack} />;
      case AppView.SHARE_APP:
        return <ShareApp onBack={handleBack} />;
      case AppView.REGISTER:
        return <Registration onComplete={() => setIsRegistered(true)} onBack={handleBack} />;
      case AppView.ADMIN_DASHBOARD:
        return <AdminDashboard onBack={handleBack} />;
      default:
        return <Dashboard onAction={navigateTo} onBack={handleBack} />;
    }
  };

  // Force registration view if not registered
  const currentView = isRegistered === false ? AppView.REGISTER : activeView;

  return (
    <ErrorBoundary>
      <UpdatePrompt />
      <Layout 
        activeView={currentView} 
        setActiveView={navigateTo}
        onBack={handleBack}
        onForward={handleForward}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < viewHistory.length - 1}
        historyIndex={historyIndex}
        historyLength={viewHistory.length}
      >
        <InstallPrompt />
        {isRegistered === null ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : renderView()}
      </Layout>
    </ErrorBoundary>
  );
};

export default App;
