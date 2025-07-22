import React from 'react';
import { Calendar, Clock, Target, BarChart3, Users, TrendingUp } from 'lucide-react';
import { taskData } from '../data/taskData';

const HomeScreen = ({
  gmName,
  setGmName,
  language,
  setLanguage,
  setCurrentView,
  setSelectedFrequency,
  translations: t,
  getCompletionStats,
  getActiveDelegations,
  getOverdueDelegations,
  getCurrentDateInfo,
  getBrinkerFiscalInfo
}) => {
  const dateInfo = getCurrentDateInfo();
  const fiscalInfo = getBrinkerFiscalInfo();

  const getFrequencyColor = (frequency) => {
    const colors = {
      daily: 'bg-blue-600',
      weekly: 'bg-green-600',
      biweekly: 'bg-teal-600', 
      monthly: 'bg-purple-600',
      quarterly: 'bg-orange-600'
    };
    return colors[frequency] || 'bg-gray-600';
  };

  const getFrequencyIcon = (frequency) => {
    const icons = {
      daily: Clock,
      weekly: Calendar,
      biweekly: BarChart3,
      monthly: BarChart3,
      quarterly: Target
    };
    return icons[frequency] || Clock;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-end mb-4 pt-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-lg text-sm"
          >
            {language === 'en' ? 'Español' : 'English'}
          </button>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">🌶️ {t.appTitle}</h1>
          <p className="text-red-100 mb-4">{t.tagline}</p>
          <div className="bg-white bg-opacity-20 text-white p-3 rounded-lg text-sm">
            <div><strong>{t.period} {fiscalInfo.currentPeriod}</strong> • {t.fiscalWeek} {fiscalInfo.currentWeek} of {fiscalInfo.totalWeeksInPeriod}</div>
            <div>{t.weekOf} {fiscalInfo.weekStart.toLocaleDateString()} - {fiscalInfo.weekEnd.toLocaleDateString()}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-6 shadow-lg">
          <input
            type="text"
            placeholder={t.enterName}
            value={gmName}
            onChange={(e) => setGmName(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
          />
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 border-2 border-red-200 rounded-lg p-4 transition-colors"
            >
              <div className="flex items-center mb-3">
                <TrendingUp className="w-6 h-6 text-red-600 mr-2" />
                <h2 className="text-xl font-semibold text-red-800">{t.gmPerformance}</h2>
              </div>
              <div className="text-lg font-semibold text-red-800">{t.dashboard}</div>
              <div className="text-sm text-red-600">Complete overview & reports</div>
            </button>
          </div>

          {Object.keys(taskData).map(frequency => {
            const stats = getCompletionStats(frequency);
            const IconComponent = getFrequencyIcon(frequency);
            const colorClass = getFrequencyColor(frequency);
            
            return (
              <div key={frequency} className="bg-white rounded-lg p-6 shadow-lg">
                <button
                  onClick={() => {
                    setSelectedFrequency(frequency);
                    setCurrentView('tasks');
                  }}
                  className={`w-full ${colorClass.replace('bg-', 'bg-').replace('-600', '-50')} hover:${colorClass.replace('bg-', 'bg-').replace('-600', '-100')} border-2 ${colorClass.replace('bg-', 'border-').replace('-600', '-200')} rounded-lg p-4 transition-colors`}
                >
                  <div className="flex items-center mb-3">
                    <IconComponent className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')} mr-2`} />
                    <h2 className={`text-xl font-semibold ${colorClass.replace('bg-', 'text-').replace('-600', '-800')}`}>
                      {t[frequency]} {t.tasks}
                    </h2>
                  </div>
                  <div className={`text-lg font-semibold ${colorClass.replace('bg-', 'text-').replace('-600', '-800')}`}>
                    {frequency === 'daily' && t.todaysTasks}
                    {frequency === 'weekly' && t.thisWeeksTasks}
                    {frequency === 'biweekly' && t.biweeklyTasks}
                    {frequency === 'monthly' && t.thisMonthsTasks}
                    {frequency === 'quarterly' && t.thisQuartersTasks}
                  </div>
                  <div className={`text-sm ${colorClass.replace('bg-', 'text-')}`}>
                    {stats.completed}/{stats.total} complete
                  </div>
                </button>
              </div>
            );
          })}

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <button
              onClick={() => setCurrentView('delegation')}
              className="w-full bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-lg p-4 transition-colors"
            >
              <div className="flex items-center mb-3">
                <Users className="w-6 h-6 text-red-600 mr-2" />
                <h2 className="text-xl font-semibold text-red-800">🌶️ {t.chiliheadDelegation}</h2>
              </div>
              <div className="text-lg font-semibold text-red-800">{t.delegationHub}</div>
              <div className="text-sm text-red-600">
                {getActiveDelegations().length} active delegations
                {getOverdueDelegations().length > 0 && (
                  <span className="ml-2 text-red-800 font-semibold">
                    • {getOverdueDelegations().length} overdue
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
