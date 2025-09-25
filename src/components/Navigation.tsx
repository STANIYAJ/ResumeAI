import React from 'react';
import { FileText, BarChart3, Target, MessageCircle, TrendingUp, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasResume: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, hasResume }) => {
  const tabs = [
    { id: 'upload', label: 'Upload Resume', icon: FileText, disabled: false },
    { id: 'config', label: 'API Setup', icon: Settings, disabled: false },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, disabled: !hasResume },
    { id: 'ats', label: 'ATS Optimizer', icon: TrendingUp, disabled: !hasResume },
    { id: 'skills', label: 'Skill Gaps', icon: Target, disabled: !hasResume },
    { id: 'chat', label: 'AI Advisor', icon: MessageCircle, disabled: false },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDisabled = tab.disabled;
            
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && onTabChange(tab.id)}
                disabled={isDisabled}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : isDisabled
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;