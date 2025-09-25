import React from 'react';
import { Resume } from '../types';
import { FileText, TrendingUp, Award, AlertTriangle, CheckCircle, User } from 'lucide-react';

interface AnalysisDashboardProps {
  resume: Resume;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ resume }) => {
  const { analysis, parsedData } = resume;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{parsedData.personalInfo.name}</h2>
              <p className="text-gray-600">{parsedData.personalInfo.email}</p>
              <p className="text-sm text-gray-500">{parsedData.personalInfo.location}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Resume uploaded</div>
            <div className="text-sm font-medium text-gray-900">{resume.uploadDate}</div>
          </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Score</p>
              <div className="flex items-baseline space-x-2">
                <span className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}
                </span>
                <span className="text-gray-400">/100</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getScoreBgColor(analysis.overallScore)}`}>
              <Award className={`w-6 h-6 ${getScoreColor(analysis.overallScore)}`} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.overallScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ATS Score</p>
              <div className="flex items-baseline space-x-2">
                <span className={`text-3xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                  {analysis.atsScore}
                </span>
                <span className="text-gray-400">/100</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getScoreBgColor(analysis.atsScore)}`}>
              <FileText className={`w-6 h-6 ${getScoreColor(analysis.atsScore)}`} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.atsScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Skills Identified</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-blue-600">
                  {analysis.skillsAnalysis.technical.length}
                </span>
                <span className="text-gray-400">skills</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {analysis.skillsAnalysis.missing.length} missing high-demand skills
            </p>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Strengths</span>
            </div>
            <p className="text-sm text-green-700">
              Strong technical skills in React and TypeScript
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Improvements</span>
            </div>
            <p className="text-sm text-yellow-700">
              Add more industry keywords for better ATS scanning
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Trending</span>
            </div>
            <p className="text-sm text-blue-700">
              Cloud and AI skills are highly demanded
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800">Next Steps</span>
            </div>
            <p className="text-sm text-purple-700">
              Consider AWS certification for career growth
            </p>
          </div>
        </div>
      </div>

      {/* Skills Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Overview</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Technical Skills</span>
              <span className="text-sm text-gray-500">{analysis.skillsAnalysis.technical.length} identified</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.skillsAnalysis.technical.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Missing High-Demand Skills</span>
              <span className="text-sm text-gray-500">{analysis.skillsAnalysis.missing.length} identified</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.skillsAnalysis.missing.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;