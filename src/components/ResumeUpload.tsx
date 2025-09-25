import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface ResumeUploadProps {
  onUpload: (file: File, jobDescription?: string) => void;
  isProcessing: boolean;
  hasApiKey: boolean;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUpload, isProcessing, hasApiKey }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [jobDescription, setJobDescription] = useState('');
  const [showJobDescription, setShowJobDescription] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = (file: File) => {
    if (file.type === 'application/pdf' || file.type.includes('document')) {
      setUploadStatus('success');
      onUpload(file, jobDescription);
    } else {
      setUploadStatus('error');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Enhance Your Resume with AI
        </h2>
        <p className="text-lg text-gray-600">
          Upload your resume to get ATS optimization, skill gap analysis, and personalized career guidance
        </p>
        {!hasApiKey && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              <strong>Ready for Analysis:</strong> Your Gemini API key is configured! 
              Upload your resume to get real AI-powered analysis and recommendations.
            </p>
          </div>
        )}
      </div>

      {/* Job Description Input */}
      {hasApiKey && (
        <div className="mb-6">
          <button
            onClick={() => setShowJobDescription(!showJobDescription)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-3"
          >
            <span>{showJobDescription ? 'Hide' : 'Add'} Target Job Description (Optional)</span>
          </button>
          
          {showJobDescription && (
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to get more targeted analysis and recommendations..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-2">
                Adding a job description helps provide more targeted skill gap analysis and ATS optimization.
              </p>
            </div>
          )}
        </div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : uploadStatus === 'success'
            ? 'border-green-500 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        <div className="space-y-4">
          {isProcessing ? (
            <div className="animate-spin mx-auto w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          ) : uploadStatus === 'success' ? (
            <CheckCircle className="mx-auto w-16 h-16 text-green-500" />
          ) : uploadStatus === 'error' ? (
            <AlertCircle className="mx-auto w-16 h-16 text-red-500" />
          ) : (
            <Upload className="mx-auto w-16 h-16 text-gray-400" />
          )}

          <div>
            {isProcessing ? (
              <p className="text-lg font-medium text-blue-600">
                Processing your resume...
              </p>
            ) : uploadStatus === 'success' ? (
              <p className="text-lg font-medium text-green-600">
                Resume uploaded successfully!
              </p>
            ) : uploadStatus === 'error' ? (
              <p className="text-lg font-medium text-red-600">
                Please upload a valid PDF or Word document
              </p>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-900">
                  Drop your resume here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, and DOCX files up to 10MB
                </p>
              </>
            )}
          </div>

          {!isProcessing && uploadStatus === 'idle' && (
            <div className="flex items-center justify-center space-x-6 pt-4">
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <FileText className="w-4 h-4" />
                <span>ATS Compatible</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <CheckCircle className="w-4 h-4" />
                <span>AI Powered</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {uploadStatus === 'idle' && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">ATS Analysis</h3>
            <p className="text-sm text-gray-600">
              Get detailed feedback on ATS compatibility and keyword optimization
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Skill Gap Analysis</h3>
            <p className="text-sm text-gray-600">
              Identify missing skills and get personalized learning recommendations
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Career Guidance</h3>
            <p className="text-sm text-gray-600">
              Get AI-powered career advice and personalized growth strategies
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;