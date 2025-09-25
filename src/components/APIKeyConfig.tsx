import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, AlertCircle, CheckCircle, Settings } from 'lucide-react';

interface APIKeyConfigProps {
  onConfigSave: (config: APIConfig) => void;
  currentConfig?: APIConfig;
}

export interface APIConfig {
  resumeParserApiKey?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  geminiApiKey?: string;
  skillsApiKey?: string;
  jobMarketApiKey?: string;
}

const APIKeyConfig: React.FC<APIKeyConfigProps> = ({ onConfigSave, currentConfig }) => {
  const [config, setConfig] = useState<APIConfig>(currentConfig || {});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const apiServices = [
    {
      key: 'geminiApiKey',
      name: 'Google Gemini API Key',
      description: 'Google\'s advanced AI for resume analysis and career guidance',
      placeholder: 'AIza...',
      required: true,
      helpUrl: 'https://makersuite.google.com/app/apikey'
    },
    {
      key: 'openaiApiKey',
      name: 'OpenAI API Key (Alternative)',
      description: 'Alternative to Gemini for AI analysis',
      placeholder: 'sk-...',
      required: false,
      helpUrl: 'https://platform.openai.com/api-keys'
    },
    {
      key: 'anthropicApiKey',
      name: 'Anthropic Claude API Key (Alternative)',
      description: 'Alternative to OpenAI for AI analysis',
      placeholder: 'sk-ant-...',
      required: false,
      helpUrl: 'https://console.anthropic.com/'
    },
    {
      key: 'resumeParserApiKey',
      name: 'Resume Parser API Key',
      description: 'For extracting structured data from resume files',
      placeholder: 'Enter your resume parser API key',
      required: false,
      helpUrl: 'https://rapidapi.com/affinda-affinda-default/api/resume-parser'
    },
    {
      key: 'skillsApiKey',
      name: 'Skills Database API Key',
      description: 'For enhanced skill recommendations and market data',
      placeholder: 'Enter your skills API key',
      required: false,
      helpUrl: '#'
    }
  ];

  const toggleKeyVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Validate at least one AI API key is provided
      if (!config.geminiApiKey && !config.openaiApiKey && !config.anthropicApiKey) {
        throw new Error('Please provide at least one AI API key (Gemini, OpenAI, or Anthropic)');
      }

      // Save to localStorage for persistence
      localStorage.setItem('resumeAI_apiConfig', JSON.stringify(config));
      
      // Call the parent callback
      onConfigSave(config);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving API configuration:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const maskApiKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">API Configuration</h2>
          <p className="text-gray-600">Configure your API keys to enable AI-powered resume analysis</p>
        </div>
      </div>

      <div className="space-y-6">
        {apiServices.map((service) => (
          <div key={service.key} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  {service.required && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
              </div>
              {service.helpUrl !== '#' && (
                <a
                  href={service.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Get API Key
                </a>
              )}
            </div>

            <div className="relative">
              <input
                type={showKeys[service.key] ? 'text' : 'password'}
                value={config[service.key as keyof APIConfig] || ''}
                onChange={(e) => handleInputChange(service.key, e.target.value)}
                placeholder={service.placeholder}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => toggleKeyVisibility(service.key)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKeys[service.key] ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {config[service.key as keyof APIConfig] && !showKeys[service.key] && (
              <p className="text-sm text-gray-500 mt-2">
                Current key: {maskApiKey(config[service.key as keyof APIConfig] || '')}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {saveStatus === 'success' && (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-medium">Configuration saved successfully!</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-600 font-medium">Error saving configuration</span>
            </>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Key className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Security Notice</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• API keys are stored locally in your browser and never sent to our servers</li>
              <li>• Keys are used only for direct API calls to the respective services</li>
              <li>• You can clear your keys anytime by refreshing the page</li>
              <li>• For production use, consider using environment variables</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIKeyConfig;