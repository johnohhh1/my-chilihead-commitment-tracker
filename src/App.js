import React, { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import TasksView from './components/TasksView';
import DashboardView from './components/DashboardView';
import DelegationHub from './components/DelegationHub';
import NewDelegationForm from './components/NewDelegationForm';
import { translations } from './utils/translations';
import { taskData } from './data/taskData';
import { fiscalConfig } from './utils/fiscalCalendar';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [checklistData, setChecklistData] = useState({});
  const [gmName, setGmName] = useState('');
  const [language, setLanguage] = useState('en');
  const [delegationData, setDelegationData] = useState([]);

  const t = translations[language];

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('chiliheadTrackerData');
    const savedName = localStorage.getItem('gmName');
    const savedLanguage = localStorage.getItem('preferredLanguage');
    const savedDelegations = localStorage.getItem('delegationData');
    
    if (savedData) {
      setChecklistData(JSON.parse(savedData));
    }
    if (savedName) {
      setGmName(savedName);
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    if (savedDelegations) {
      setDelegationData(JSON.parse(savedDelegations));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('chiliheadTrackerData', JSON.stringify(checklistData));
  }, [checklistData]);

  useEffect(() => {
    localStorage.setItem('gmName', gmName);
  }, [gmName]);

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('delegationData', JSON.stringify(delegationData));
  }, [delegationData]);

  // Fiscal calendar functions
  const getBrinkerFiscalInfo = () => {
    return {
      currentPeriod: fiscalConfig.currentPeriod,
      currentWeek: fiscalConfig.currentWeek,
      totalWeeksInPeriod: fiscalConfig.weeksInCurrentPeriod,
      weekStart: new Date('2025-07-17'),
      weekEnd: new Date('2025-07-23'),
      fiscalYearStart: new Date(fiscalConfig.fiscalYearStart)
    };
  };

  const getCurrentDateInfo = () => {
    const fiscalInfo = getBrinkerFiscalInfo();
    return {
      date: new Date().toLocaleDateString(),
      fiscalPeriod: fiscalInfo.currentPeriod,
      fiscalWeek: fiscalInfo.currentWeek,
      weekStart: fiscalInfo.weekStart,
      weekEnd: fiscalInfo.weekEnd
    };
  };

  const getCompletionStats = (frequency) => {
    const today = new Date().toDateString();
    const key = `${frequency}_${today}`;
    const tasks = taskData[frequency];
    const completed = Object.values(checklistData[key] || {}).filter(Boolean).length;
    return { completed, total: tasks.length };
  };

  const getActiveDelegations = () => {
    return delegationData.filter(item => !item.completed && item.status === 'active');
  };

  const getOverdueDelegations = () => {
    const today = new Date();
    return delegationData.filter(item => 
      !item.completed && item.status === 'active' && item.dueDate && new Date(item.dueDate) < today
    );
  };

  // Create delegation function
  const createDelegation = (delegationFormData) => {
    const newDelegation = {
      id: Date.now(),
      ...delegationFormData,
      createdDate: new Date().toISOString(),
      completed: false
    };
    
    setDelegationData(prev => [...prev, newDelegation]);
    console.log('Delegation created:', newDelegation); // Debug log
  };

  // Update delegation function
  const updateDelegation = (id, updates) => {
    setDelegationData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  // Mark delegation complete
  const markDelegationComplete = (id, outcome) => {
    setDelegationData(prev => prev.map(item => 
      item.id === id 
        ? { ...item, completed: true, completedDate: new Date().toISOString(), outcome }
        : item
    ));
  };

  // Shared props
  const sharedProps = {
    gmName,
    setGmName,
    language,
    setLanguage,
    currentView,
    setCurrentView,
    selectedFrequency,
    setSelectedFrequency,
    translations: t,
    checklistData,
    setChecklistData,
    delegationData,
    setDelegationData,
    createDelegation,
    updateDelegation,
    markDelegationComplete,
    getCompletionStats,
    getActiveDelegations,
    getOverdueDelegations,
    getCurrentDateInfo,
    getBrinkerFiscalInfo
  };

  // Route to appropriate component
  switch (currentView) {
    case 'tasks':
      return <TasksView {...sharedProps} />;
    case 'dashboard':
      return <DashboardView {...sharedProps} />;
    case 'delegation':
      return <DelegationHub {...sharedProps} />;
    case 'newDelegation':
      return <NewDelegationForm {...sharedProps} />;
    default:
      return <HomeScreen {...sharedProps} />;
  }
};

export default App;
