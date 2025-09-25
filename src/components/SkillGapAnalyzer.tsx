import React from 'react';
import { SkillGap } from '../types';
import { TrendingUp, Clock, DollarSign, BookOpen, Award, ExternalLink } from 'lucide-react';

interface SkillGapAnalyzerProps {
  skillGaps: SkillGap[];
}

const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({ skillGaps }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-4 h-4" />;
      case 'certification':
        return <Award className="w-4 h-4" />;
      case 'book':
        return <BookOpen className="w-4 h-4" />;
      case 'tutorial':
        return <BookOpen className="w-4 h-4" />;
      case 'practice':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'Free':
        return 'bg-green-100 text-green-800';
      case 'Paid':
        return 'bg-blue-100 text-blue-800';
      case 'Premium':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Skill Gap Analysis</h2>
            <p className="text-gray-600">Identify missing skills and accelerate your career growth</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Skills to Learn</div>
            <div className="text-3xl font-bold text-purple-600">{skillGaps.length}</div>
          </div>
        </div>
      </div>

      {/* Skill Gap Cards */}
      <div className="space-y-6">
        {skillGaps.map((gap, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              {/* Skill Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{gap.skill}</h3>
                  <p className="text-gray-600">{gap.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(gap.difficulty)}`}>
                    {gap.difficulty}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Market Demand</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${gap.marketDemand}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-blue-800">{gap.marketDemand}%</span>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Importance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-purple-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${gap.importance}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-purple-800">{gap.importance}%</span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Time to Learn</span>
                  </div>
                  <div className="text-lg font-semibold text-green-600">{gap.timeToLearn}</div>
                </div>
              </div>

              {/* Learning Resources */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommended Learning Resources</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gap.resources.map((resource) => (
                    <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-gray-900 truncate">{resource.title}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCostColor(resource.cost)}`}>
                              {resource.cost}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{resource.provider}</span>
                              <span>⭐ {resource.rating}</span>
                              <span>{resource.duration}</span>
                            </div>
                            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                              <span>View</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Start Learning Path
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Add to Learning Plan
                </button>
                <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  Skip This Skill
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Plan Summary */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Personalized Learning Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">6-9 months</div>
            <div className="text-sm text-gray-600">Estimated completion time</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">+25%</div>
            <div className="text-sm text-gray-600">Potential salary increase</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{skillGaps.length}</div>
            <div className="text-sm text-gray-600">High-impact skills to learn</div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors">
            Create Learning Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillGapAnalyzer;