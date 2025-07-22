import React from 'react';
import { ArrowLeft, Users, Plus, AlertCircle, Check } from 'lucide-react';

const DelegationHub = ({
  setCurrentView,
  translations: t,
  getActiveDelegations,
  getOverdueDelegations
}) => {
  const activeDelegations = getActiveDelegations();
  const overdueDelegations = getOverdueDelegations();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center text-red-100 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            {t.back}
          </button>
          <div className="flex items-center">
            <Users className="w-6 h-6 mr-2" />
            <h1 className="text-xl font-semibold">🌶️ {t.chiliheadDelegation}</h1>
          </div>
          <button
            onClick={() => setCurrentView('newDelegation')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
            title="New Delegation"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-2 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{activeDelegations.length}</div>
            <div className="text-red-200 text-sm">Active</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-300">0</div>
            <div className="text-red-200 text-sm">Follow-up Due</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-300">{overdueDelegations.length}</div>
            <div className="text-red-200 text-sm">Overdue</div>
          </div>
        </div>
      </div>

      {/* Delegations List */}
      <div className="p-4 space-y-3">
        {activeDelegations.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">🌶️ ChiliHead Delegation Hub</h2>
            <p className="text-gray-500 mb-6">Start developing your team with the 5-Pillar Methodology</p>
            
            <div className="bg-white rounded-lg p-6 shadow max-w-md mx-auto mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">The ChiliHead Commitment:</h3>
              <div className="space-y-2 text-left">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Sense of Belonging</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Clear Direction</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Preparation</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Support</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Accountability</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('newDelegation')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              🌶️ Create Your First Delegation
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Delegation tracking will be fully functional with backend integration!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DelegationHub;
