import React from 'react';
import { ATSSuggestion } from '../types';
import { AlertTriangle, CheckCircle, Info, TrendingUp } from 'lucide-react';

interface ATSOptimizerProps {
  suggestions: ATSSuggestion[];
  atsScore: number;
}

const ATSOptimizer: React.FC<ATSOptimizerProps> = ({ suggestions, atsScore }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'keywords':
        return 'bg-purple-100 text-purple-800';
      case 'formatting':
        return 'bg-green-100 text-green-800';
      case 'structure':
        return 'bg-blue-100 text-blue-800';
      case 'content':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalImpact = suggestions.reduce((sum, suggestion) => sum + suggestion.impact, 0);
  const potentialScore = Math.min(100, atsScore + totalImpact);

  return (
    <div className="space-y-6">
      {/* ATS Score Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ATS Optimization</h2>
            <p className="text-gray-600">Improve your resume's compatibility with Applicant Tracking Systems</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Current ATS Score</div>
            <div className="text-3xl font-bold text-blue-600">{atsScore}/100</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Current Score</span>
              <span className="text-sm font-medium text-gray-900">{atsScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-red-500 to-yellow-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${atsScore}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Potential Score</span>
              <span className="text-sm font-medium text-green-600">+{totalImpact} points</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${potentialScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Optimization Suggestions</h3>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
            {suggestions.length} improvements
          </span>
        </div>

        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`border rounded-lg p-4 ${getSeverityBg(suggestion.severity)}`}
            >
              <div className="flex items-start space-x-3">
                {getSeverityIcon(suggestion.severity)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{suggestion.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(suggestion.category)}`}>
                        {suggestion.category}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        +{suggestion.impact} points
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{suggestion.description}</p>
                  
                  {/* Action buttons */}
                  <div className="flex items-center space-x-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Apply Fix
                    </button>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ATS Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">ATS Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">✅ Do</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Use standard section headers (Experience, Education, Skills)</li>
              <li>• Include relevant keywords from job descriptions</li>
              <li>• Use a clean, simple format</li>
              <li>• Save as PDF and Word formats</li>
              <li>• Use standard fonts (Arial, Calibri, Times New Roman)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">❌ Avoid</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Complex formatting, tables, or graphics</li>
              <li>• Unusual fonts or colors</li>
              <li>• Headers and footers</li>
              <li>• Images or logos</li>
              <li>• Abbreviations without full words</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSOptimizer;