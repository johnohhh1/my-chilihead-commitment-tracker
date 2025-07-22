import React, { useState } from 'react';
import { ArrowLeft, Check, Clock, Save } from 'lucide-react';

const NewDelegationForm = ({ setCurrentView, createDelegation, translations: t }) => {
  const [formData, setFormData] = useState({
    taskDescription: '',
    assignedTo: '',
    dueDate: '',
    followUpDate: '',
    priority: 'medium',
    status: 'planning', // planning, active, complete
    chiliheadProgress: {
      senseOfBelonging: { completed: false, notes: '' },
      clearDirection: { completed: false, notes: '' },
      preparation: { completed: false, notes: '' },
      support: { completed: false, notes: '' },
      accountability: { completed: false, notes: '' }
    }
  });

  const [activeStep, setActiveStep] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.taskDescription || !formData.assignedTo) {
      alert('🌶️ Please provide task description and assignee');
      return;
    }

    // Save delegation with current data
    createDelegation(formData);
    alert('🌶️ Delegation saved as draft! You can continue developing the ChiliHead Commitment over time.');
    setCurrentView('dashboard');
  };

  const handleActivate = () => {
    const completedSteps = Object.values(formData.chiliheadProgress).filter(step => step.completed).length;
    
    if (completedSteps === 0) {
      alert('🌶️ Complete at least one ChiliHead Commitment step before activating this delegation.');
      return;
    }

    if (!formData.dueDate) {
      alert('🌶️ Please set a due date before activating this delegation.');
      return;
    }

    // Update status to active and save
    const activeDelegation = {
      ...formData,
      status: 'active'
    };
    
    createDelegation(activeDelegation);
    alert(`🌶️ Delegation activated with ${completedSteps}/5 ChiliHead steps complete! You can continue building the remaining steps as you work with your team member.`);
    setCurrentView('dashboard');
  };

  const updateChiliheadProgress = (key, field, value) => {
    setFormData(prev => ({
      ...prev,
      chiliheadProgress: {
        ...prev.chiliheadProgress,
        [key]: {
          ...prev.chiliheadProgress[key],
          [field]: value
        }
      }
    }));
  };

  // ChiliHead Commitment items with official colors
  const commitmentItems = [
    { 
      key: 'senseOfBelonging', 
      label: 'SENSE OF BELONGING',
      description: 'Make them feel valued and included',
      color: 'from-yellow-400 to-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-800',
      placeholder: 'How did you give them ownership? What area of responsibility?'
    },
    { 
      key: 'clearDirection', 
      label: 'CLEAR DIRECTION',
      description: 'They know exactly what success looks like',
      color: 'from-orange-400 to-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-800',
      placeholder: 'What does good look like? How will they know they succeeded?'
    },
    { 
      key: 'preparation', 
      label: 'PREPARATION',
      description: 'They have everything needed to succeed',
      color: 'from-red-400 to-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-800',
      placeholder: 'What resources, training, or tools do they need?'
    },
    { 
      key: 'support', 
      label: 'SUPPORT',
      description: 'Ongoing help and resources available',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      textColor: 'text-red-800',
      placeholder: 'How will you support them? Who can they ask for help?'
    },
    { 
      key: 'accountability', 
      label: 'ACCOUNTABILITY',
      description: 'Follow-up expectations are crystal clear',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-800',
      placeholder: 'When will you check in? How will you follow up?'
    }
  ];

  const completedCount = Object.values(formData.chiliheadProgress).filter(step => step.completed).length;
  const canActivate = completedCount > 0 && formData.dueDate;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center text-red-100 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            {t.back}
          </button>
          <h1 className="text-xl font-semibold">🌶️ {t.newDelegation}</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm">{completedCount}/5</span>
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <span className="text-sm font-bold">{completedCount}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Task Description */}
        <div className="bg-white p-4 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.taskDescription} *
          </label>
          <textarea
            value={formData.taskDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, taskDescription: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            rows={3}
            placeholder="What needs to be accomplished?"
            required
          />
        </div>

        {/* Assignment Details */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.assignTo} *
            </label>
            <input
              type="text"
              value={formData.assignedTo}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              placeholder="Team member name..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.dueDate}
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
              <div className="text-xs text-gray-500 mt-1">Required for activation</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.followUpDate}
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.priority}
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              <option value="low">{t.low}</option>
              <option value="medium">{t.medium}</option>
              <option value="high">{t.high}</option>
            </select>
          </div>
        </div>

        {/* ChiliHead Commitment Progress */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">The CHILIHEAD</h2>
            <h2 className="text-2xl font-bold text-red-600 mb-4">COMMITMENT</h2>
            <div className="text-sm text-gray-600 mb-4">
              Progress: {completedCount}/5 Steps • Build this over time with your team member
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            {commitmentItems.map((item, index) => {
              const stepData = formData.chiliheadProgress[item.key];
              const isActive = activeStep === item.key;
              
              return (
                <div 
                  key={item.key} 
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                    stepData.completed 
                      ? `${item.bgColor} ${item.borderColor} shadow-md` 
                      : isActive
                        ? 'bg-gray-50 border-blue-300 shadow-sm'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`bg-gradient-to-r ${item.color} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold`}>
                        {stepData.completed ? <Check className="w-4 h-4" /> : index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-bold text-lg ${stepData.completed ? item.textColor : 'text-gray-600'}`}>
                          {item.label}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {stepData.completed && (
                            <span className="text-green-600 text-sm font-medium">✓ Complete</span>
                          )}
                          <button
                            type="button"
                            onClick={() => setActiveStep(isActive ? null : item.key)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            {isActive ? 'Close' : stepData.completed ? 'Edit' : 'Work On This'}
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm ${stepData.completed ? item.textColor : 'text-gray-500'} mb-2`}>
                        {item.description}
                      </p>

                      {isActive && (
                        <div className="mt-3 space-y-3">
                          <textarea
                            value={stepData.notes}
                            onChange={(e) => updateChiliheadProgress(item.key, 'notes', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder={item.placeholder}
                          />
                          <div className="flex items-center space-x-3">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={stepData.completed}
                                onChange={(e) => updateChiliheadProgress(item.key, 'completed', e.target.checked)}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mr-2"
                              />
                              <span className="text-sm">Mark as complete</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {stepData.completed && stepData.notes && !isActive && (
                        <div className="mt-2 p-2 bg-white bg-opacity-50 rounded text-sm">
                          <strong>Notes:</strong> {stepData.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="text-sm text-gray-700 text-center italic">
              💡 <strong>Pro Tip:</strong> You don't need to complete all steps at once! Save as draft and continue building the ChiliHead Commitment over time as you work with your team member.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save as Draft
          </button>

          {canActivate && (
            <button
              type="button"
              onClick={handleActivate}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-bold transition-colors"
            >
              🌶️ Activate Delegation ({completedCount}/5 steps complete)
            </button>
          )}

          {!canActivate && (
            <div className="w-full bg-gray-300 text-gray-600 py-3 px-4 rounded-lg font-semibold text-center">
              {completedCount === 0 && !formData.dueDate && "Complete at least 1 ChiliHead step + set due date to activate"}
              {completedCount === 0 && formData.dueDate && "Complete at least 1 ChiliHead step to activate"}
              {completedCount > 0 && !formData.dueDate && "Set due date to activate"}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default NewDelegationForm;
