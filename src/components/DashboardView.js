import React from 'react';
import { ArrowLeft, Award, Users, Printer, TrendingUp, Star, Target, Edit } from 'lucide-react';
import { taskData } from '../data/taskData';

const DashboardView = ({
  gmName,
  setCurrentView,
  translations: t,
  getCompletionStats,
  getActiveDelegations,
  getOverdueDelegations,
  getCurrentDateInfo,
  getBrinkerFiscalInfo,
  delegationData
}) => {
  const dateInfo = getCurrentDateInfo();
  const fiscalInfo = getBrinkerFiscalInfo();
  const activeDelegations = getActiveDelegations();
  const overdueDelegations = getOverdueDelegations();

  // Get daily stats separately
  const dailyStats = getCompletionStats('daily');
  const dailyPercentage = dailyStats.total > 0 ? Math.round((dailyStats.completed / dailyStats.total) * 100) : 0;

  // Calculate strategic tasks (everything except daily)
  const strategicFrequencies = ['weekly', 'biweekly', 'monthly', 'quarterly'];
  const strategicStats = strategicFrequencies.reduce((acc, frequency) => {
    const stats = getCompletionStats(frequency);
    acc.completed += stats.completed;
    acc.total += stats.total;
    return acc;
  }, { completed: 0, total: 0 });

  const strategicPercentage = strategicStats.total > 0 ? Math.round((strategicStats.completed / strategicStats.total) * 100) : 0;

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

  // Print Dashboard Report with FULL delegation details
  const printDashboardReport = () => {
    const printWindow = window.open('', '_blank');
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ChiliHead Commitment Report - ${gmName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
          .header { text-align: center; border-bottom: 2px solid #DC2626; padding-bottom: 10px; margin-bottom: 20px; }
          .metric { display: inline-block; margin: 10px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
          .task-section { margin: 20px 0; }
          .delegation { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9; }
          .commitment-step { margin: 8px 0; padding: 8px; border-left: 3px solid #ccc; }
          .completed { border-left-color: green; background: #f0fff0; }
          .incomplete { border-left-color: #ccc; background: #f8f8f8; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌶️ My ChiliHead Commitment Tracker</h1>
          <h2>GM Performance Dashboard Report</h2>
          <p><strong>GM:</strong> ${gmName} | <strong>Period:</strong> ${dateInfo.fiscalPeriod} | <strong>Week:</strong> ${dateInfo.fiscalWeek} of ${fiscalInfo.totalWeeksInPeriod}</p>
          <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="task-section">
          <h3>DAILY OPERATIONS</h3>
          <div class="metric"><strong>Today's Completion:</strong> ${dailyStats.completed}/${dailyStats.total} (${dailyPercentage}%)</div>
        </div>

        <div class="task-section">
          <h3>STRATEGIC LEADERSHIP</h3>
          <div class="metric"><strong>Strategic Tasks:</strong> ${strategicStats.completed}/${strategicStats.total} (${strategicPercentage}%)</div>
        </div>

        <div class="task-section">
          <h3>🌶️ CHILIHEAD DELEGATIONS - DETAILED STATUS</h3>
          <div class="metric">Total Delegations: ${delegationData.length}</div>
          <div class="metric">Active: ${activeDelegations.length}</div>
          <div class="metric">Overdue: ${overdueDelegations.length}</div>
    `;

    // Add detailed delegation information
    if (delegationData.length > 0) {
      html += `<h4>Delegation Details:</h4>`;
      
      delegationData.forEach((delegation, index) => {
        const completedSteps = Object.values(delegation.chiliheadProgress || {}).filter(step => step.completed).length;
        const isOverdue = delegation.dueDate && new Date(delegation.dueDate) < new Date();
        
        html += `
          <div class="delegation">
            <h4>${index + 1}. ${delegation.taskDescription}</h4>
            <p><strong>Assigned to:</strong> ${delegation.assignedTo}</p>
            <p><strong>Status:</strong> ${delegation.status || 'planning'} ${isOverdue ? '(OVERDUE)' : ''}</p>
            <p><strong>Priority:</strong> ${delegation.priority}</p>
            ${delegation.dueDate ? `<p><strong>Due Date:</strong> ${new Date(delegation.dueDate).toLocaleDateString()}</p>` : ''}
            ${delegation.followUpDate ? `<p><strong>Follow-up Date:</strong> ${new Date(delegation.followUpDate).toLocaleDateString()}</p>` : ''}
            
            <h5>ChiliHead Commitment Progress (${completedSteps}/5):</h5>
        `;
        
        // Add each ChiliHead step with details
        const commitmentSteps = [
          { key: 'senseOfBelonging', label: 'SENSE OF BELONGING' },
          { key: 'clearDirection', label: 'CLEAR DIRECTION' },
          { key: 'preparation', label: 'PREPARATION' },
          { key: 'support', label: 'SUPPORT' },
          { key: 'accountability', label: 'ACCOUNTABILITY' }
        ];
        
        commitmentSteps.forEach(step => {
          const stepData = delegation.chiliheadProgress?.[step.key] || { completed: false, notes: '' };
          html += `
            <div class="commitment-step ${stepData.completed ? 'completed' : 'incomplete'}">
              <strong>${stepData.completed ? '✓' : '○'} ${step.label}</strong>
              ${stepData.notes ? `<br><em>Notes: ${stepData.notes}</em>` : ''}
              ${!stepData.completed ? '<br><em>Still needs attention</em>' : ''}
            </div>
          `;
        });
        
        html += `</div>`;
      });
    } else {
      html += `<p><em>No delegations created yet.</em></p>`;
    }

    html += `
        </div>
        <div class="no-print" style="margin-top: 30px;">
          <button onclick="window.print()">Print Report</button>
          <button onclick="window.close()">Close</button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center text-white text-opacity-80 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            {t.back}
          </button>
          <div className="text-center">
            <h1 className="text-xl font-semibold">🌶️ {t.gmPerformance}</h1>
            <div className="text-sm text-white text-opacity-80">
              {gmName} • Period {fiscalInfo.currentPeriod} Week {fiscalInfo.currentWeek}
            </div>
          </div>
          <button
            onClick={printDashboardReport}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Daily Operations Section */}
      <div className="p-4">
        <div className={`rounded-lg p-6 shadow-lg ${dailyPercentage === 100 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Star className={`w-6 h-6 mr-2 ${dailyPercentage === 100 ? 'text-white' : 'text-blue-600'}`} />
              <h2 className={`text-xl font-semibold ${dailyPercentage === 100 ? 'text-white' : 'text-gray-800'}`}>
                Today's Operations
              </h2>
            </div>
            <div className={`text-2xl font-bold ${dailyPercentage === 100 ? 'text-white' : 'text-blue-600'}`}>
              {dailyPercentage}%
            </div>
          </div>

          <div className="mb-4">
            <div className={`w-full rounded-full h-4 ${dailyPercentage === 100 ? 'bg-white bg-opacity-30' : 'bg-gray-200'} overflow-hidden shadow-inner`}>
              <div
                className="h-4 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-lg relative"
                style={{ width: `${dailyPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
              </div>
            </div>
            <div className={`text-center mt-2 text-sm ${dailyPercentage === 100 ? 'text-white' : 'text-gray-600'}`}>
              {dailyStats.completed}/{dailyStats.total} tasks completed
            </div>
          </div>

          {dailyPercentage === 100 ? (
            <div className="text-center">
              <div className="text-2xl mb-2 animate-bounce">🔥🙌🔥</div>
              <div className="text-white font-bold text-lg">YOU CRUSHED TODAY!</div>
              <div className="text-white text-opacity-90">All daily operations complete - high five yourself! 🙌</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-gray-600">
                {dailyPercentage >= 75 && "Almost there! Finish strong! 💪"}
                {dailyPercentage >= 50 && dailyPercentage < 75 && "Good progress! Keep going! 🔥"}
                {dailyPercentage >= 25 && dailyPercentage < 50 && "Building momentum! 🚀"}
                {dailyPercentage < 25 && "Let's get started! 🌶️"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Strategic Leadership Section */}
      <div className="p-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center mb-4">
            <Target className="w-6 h-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Strategic Leadership Development</h3>
            <div className="ml-auto text-xl font-bold text-purple-600">{strategicPercentage}%</div>
          </div>
          
          <div className="space-y-3">
            {strategicFrequencies.map(frequency => {
              const stats = getCompletionStats(frequency);
              const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
              const colorClass = getFrequencyColor(frequency);
              
              return (
                <div key={frequency} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${colorClass} mr-3`}></div>
                    <span className="capitalize font-medium">{frequency}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-600">{stats.completed}/{stats.total}</div>
                    <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${colorClass} shadow-sm`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm font-medium w-10">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 h-3 rounded-full transition-all duration-1000 shadow-lg relative"
                style={{ width: `${strategicPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
              </div>
            </div>
            <div className="text-gray-600 mt-2 text-sm">
              {strategicPercentage >= 80 && "🌟 Leadership Excellence!"}
              {strategicPercentage >= 60 && strategicPercentage < 80 && "📈 Strong Leadership Growth!"}
              {strategicPercentage >= 40 && strategicPercentage < 60 && "🎯 Building Leadership Skills!"}
              {strategicPercentage >= 20 && strategicPercentage < 40 && "🌱 Developing Leadership!"}
              {strategicPercentage < 20 && "🚀 Leadership Journey Starting!"}
            </div>
          </div>
        </div>
      </div>

      {/* ChiliHead Delegation Report */}
      <div className="p-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">🌶️ ChiliHead Delegation Report</h3>
            </div>
            <button
              onClick={() => setCurrentView('newDelegation')}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
            >
              + New Delegation
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{delegationData.length}</div>
              <div className="text-sm text-blue-800">Total</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{activeDelegations.length}</div>
              <div className="text-sm text-green-800">Active</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{overdueDelegations.length}</div>
              <div className="text-sm text-red-800">Overdue</div>
            </div>
          </div>

          {delegationData.length === 0 ? (
            <div className="text-center py-6">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No delegations created yet</p>
              <button
                onClick={() => setCurrentView('newDelegation')}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                🌶️ Create Your First ChiliHead Delegation
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {delegationData.map(delegation => {
                const completedSteps = Object.values(delegation.chiliheadProgress || {}).filter(step => step.completed).length;
                const isOverdue = delegation.dueDate && new Date(delegation.dueDate) < new Date();
                
                return (
                  <div
                    key={delegation.id}
                    className={`p-4 rounded-lg border-2 ${
                      isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 mb-1">{delegation.taskDescription}</div>
                        <div className="text-sm text-gray-600 mb-2">
                          Assigned to: {delegation.assignedTo} | Status: {delegation.status || 'planning'}
                          {delegation.dueDate && (
                            <span> | Due: {new Date(delegation.dueDate).toLocaleDateString()}</span>
                          )}
                        </div>
                        
                        {/* ChiliHead Progress Summary */}
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-600">ChiliHead Progress:</div>
                          <div className="flex space-x-1">
                            {['senseOfBelonging', 'clearDirection', 'preparation', 'support', 'accountability'].map((step, index) => (
                              <div
                                key={step}
                                className={`w-3 h-3 rounded-full ${
                                  delegation.chiliheadProgress?.[step]?.completed 
                                    ? 'bg-green-500' 
                                    : 'bg-gray-300'
                                }`}
                                title={step}
                              ></div>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({completedSteps}/5)</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => alert('🌶️ Edit delegation functionality coming with backend!')}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors ml-4"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCurrentView('newDelegation')}
              className="bg-red-600 text-white p-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              🌶️ New Delegation
            </button>
            <button
              onClick={printDashboardReport}
              className="bg-gray-600 text-white p-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              {t.printReport}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
