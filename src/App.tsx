import React, { useState } from 'react';
import { Resume } from './types';
import { mockResume } from './data/mockData';
import { APIConfig, createAPIService } from './services/apiService';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ResumeUpload from './components/ResumeUpload';
import APIKeyConfig from './components/APIKeyConfig';
import AnalysisDashboard from './components/AnalysisDashboard';
import ATSOptimizer from './components/ATSOptimizer';
import SkillGapAnalyzer from './components/SkillGapAnalyzer';
import ChatInterface from './components/ChatInterface';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [resume, setResume] = useState<Resume | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiConfig, setApiConfig] = useState<APIConfig>(() => {
    // Load saved API config from localStorage
    const saved = localStorage.getItem('resumeAI_apiConfig');
    return saved ? JSON.parse(saved) : {
      geminiApiKey: 'AIzaSyB5Ywogu9sMr3q3ISgnnbQhd53Bm4nLEGo'
    };
  });
  const [apiService, setApiService] = useState(() => createAPIService(apiConfig));

  const handleResumeUpload = async (file: File, jobDescription?: string) => {
    setIsProcessing(true);
    
    try {
      // Check if API is configured
      if (!apiConfig.geminiApiKey && !apiConfig.openaiApiKey && !apiConfig.anthropicApiKey) {
        // Use mock data if no API key is configured
        setTimeout(() => {
          setResume(mockResume);
          setIsProcessing(false);
          setActiveTab('dashboard');
        }, 3000);
        return;
      }

      // Parse resume using API service
      const parsedData = await apiService.parseResume(file);
      
      // Extract text for analysis
      const resumeText = await apiService.extractTextFromFile(file);
      
      // Analyze skills
      const analysis = await apiService.analyzeSkills(resumeText, jobDescription);
      
      // Create resume object
      const newResume: Resume = {
        id: Date.now().toString(),
        fileName: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        content: resumeText,
        parsedData: parsedData,
        analysis: {
          atsScore: analysis.atsScore,
          skillsAnalysis: {
            technical: analysis.technicalSkills,
            soft: analysis.softSkills.map((skill: string) => ({ name: skill, level: 'Intermediate', category: 'Soft Skills', demand: 70, inResume: true })),
            trending: analysis.technicalSkills.filter((skill: any) => skill.demand > 85),
            missing: analysis.missingSkills
          },
          suggestions: analysis.suggestions,
          skillGaps: analysis.skillGaps.map((gap: any) => ({
            ...gap,
            resources: [
              {
                id: '1',
                title: `Learn ${gap.skill}`,
                type: 'course',
                provider: 'Online Platform',
                rating: 4.5,
                duration: gap.timeToLearn,
                cost: 'Paid',
                url: '#',
                description: `Comprehensive ${gap.skill} course`
              }
            ]
          })),
          overallScore: analysis.overallScore
        }
      };
      
      setResume(newResume);
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Resume processing error:', error);
      // Fallback to mock data on error
      setResume(mockResume);
      setActiveTab('dashboard');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfigSave = (config: APIConfig) => {
    setApiConfig(config);
    setApiService(createAPIService(config));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <ResumeUpload
            onUpload={handleResumeUpload}
            isProcessing={isProcessing}
            hasApiKey={!!(apiConfig.openaiApiKey || apiConfig.anthropicApiKey)}
          />
        );
      case 'config':
        return (
          <APIKeyConfig
            onConfigSave={handleConfigSave}
            currentConfig={apiConfig}
          />
        );
      case 'dashboard':
        return resume ? <AnalysisDashboard resume={resume} /> : null;
      case 'ats':
        return resume ? (
          <ATSOptimizer
            suggestions={resume.analysis.suggestions}
            atsScore={resume.analysis.atsScore}
          />
        ) : null;
      case 'skills':
        return resume ? (
          <SkillGapAnalyzer skillGaps={resume.analysis.skillGaps} />
        ) : null;
      case 'chat':
        return (
          <ChatInterface
            apiService={apiService}
            resumeContext={resume}
            hasApiKey={!!(apiConfig.geminiApiKey || apiConfig.openaiApiKey || apiConfig.anthropicApiKey)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasResume={!!resume}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;