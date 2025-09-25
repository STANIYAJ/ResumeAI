import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Resume } from '../types';
import { APIService } from '../services/apiService';
import { Send, MessageCircle, User, Bot, Lightbulb, TrendingUp, Award } from 'lucide-react';

interface ChatInterfaceProps {
  apiService: APIService;
  resumeContext?: Resume | null;
  hasApiKey: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ apiService, resumeContext, hasApiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: hasApiKey 
        ? 'Hello! I\'m your AI career advisor. I can help you with resume optimization, career planning, skill development, and job search strategies. What would you like to know?'
        : 'Hello! I\'m your AI career advisor powered by Google Gemini. I\'m ready to help you with resume optimization, career planning, skill development, and job search strategies. What would you like to know?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickSuggestions = [
    {
      icon: <Lightbulb className="w-4 h-4" />,
      text: "How can I improve my resume?",
      category: "Resume"
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      text: "What skills should I learn next?",
      category: "Skills"
    },
    {
      icon: <Award className="w-4 h-4" />,
      text: "How to prepare for interviews?",
      category: "Interview"
    }
  ];

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('resume') || message.includes('cv')) {
      return "Based on your resume analysis, I recommend focusing on these key areas:\n\n1. **Keywords**: Add more industry-specific keywords like 'agile', 'CI/CD', and 'microservices'\n2. **Quantify achievements**: Include metrics like '30% performance improvement' or 'managed team of 5'\n3. **ATS optimization**: Use standard section headers and avoid complex formatting\n\nYour current ATS score is 78/100. With these improvements, you could reach 90+!";
    }
    
    if (message.includes('skill') || message.includes('learn')) {
      return "Great question! Based on your current skills and market trends, I recommend prioritizing:\n\n**High Priority:**\n• Python - High demand (88%) and complements your existing skills\n• AWS - Cloud skills are essential (92% market demand)\n• Machine Learning - Growing field with excellent career prospects\n\n**Time Investment:**\n• Python: 2-3 months (Medium difficulty)\n• AWS: 3-4 months (Hard difficulty)\n• ML: 4-6 months (Hard difficulty)\n\nWould you like me to create a personalized learning path for any of these?";
    }
    
    if (message.includes('interview') || message.includes('prepare')) {
      return "Excellent! Interview preparation is crucial. Here's a comprehensive approach:\n\n**Technical Interview Prep:**\n• Review your resume projects in detail\n• Practice coding problems on LeetCode/HackerRank\n• Prepare system design scenarios\n\n**Behavioral Questions:**\n• Use the STAR method (Situation, Task, Action, Result)\n• Prepare stories about challenges, leadership, and growth\n• Research the company culture and values\n\n**Questions to Ask:**\n• Team structure and collaboration\n• Growth opportunities and career paths\n• Technical challenges and architecture\n\nWould you like me to help you practice specific types of questions?";
    }
    
    if (message.includes('salary') || message.includes('negotiate')) {
      return "Salary negotiation is an important skill! Here's how to approach it:\n\n**Research Phase:**\n• Use Glassdoor, PayScale, and levels.fyi for market data\n• Consider location, experience, and company size\n• Factor in total compensation (base + equity + benefits)\n\n**Negotiation Strategy:**\n• Wait for the offer before discussing salary\n• Present your case with data and achievements\n• Be flexible - consider non-salary benefits\n• Stay professional and positive\n\n**Your Market Position:**\nWith your current skills (React, TypeScript, Node.js), you're in a strong position. Adding Python and AWS could increase your market value by 15-25%.\n\nNeed help preparing your negotiation talking points?";
    }
    
    if (message.includes('career') || message.includes('path') || message.includes('growth')) {
      return "Let's map out your career trajectory! Based on your profile:\n\n**Current Position:** Senior Full Stack Developer\n**Experience:** 5+ years\n**Strengths:** React, TypeScript, Node.js\n\n**Potential Career Paths:**\n\n1. **Technical Leadership**\n   • Tech Lead → Engineering Manager → Director\n   • Focus: Team management, architecture decisions\n   • Timeline: 2-3 years to Tech Lead\n\n2. **Technical Specialist**\n   • Senior → Staff → Principal Engineer\n   • Focus: Deep technical expertise, system design\n   • Timeline: 3-5 years to Staff level\n\n3. **Product Engineering**\n   • Full Stack → Product Engineer → Head of Product Engineering\n   • Focus: User-centric development, product strategy\n   • Timeline: 2-4 years transition\n\nWhat resonates most with your interests and goals?";
    }
    
    // Default response
    return "I'd be happy to help you with that! I can assist with:\n\n• **Resume optimization** - ATS scoring, keyword suggestions, formatting\n• **Skill development** - Gap analysis, learning paths, certifications\n• **Career planning** - Growth strategies, role transitions, market insights\n• **Interview preparation** - Technical and behavioral question practice\n• **Salary negotiation** - Market research, negotiation strategies\n\nWhat specific area would you like to explore further?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      let responseContent: string;
      
      if (hasApiKey) {
        // Use real AI API
        responseContent = await apiService.chatWithAI(input, resumeContext);
      } else {
        // Use mock responses
        responseContent = generateResponse(input);
      }
      
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please check your API configuration or try again later.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI Career Advisor</h2>
            <p className="text-sm text-gray-600">Get personalized career guidance and insights</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              } rounded-lg p-4`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'assistant' && (
                  <Bot className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                {message.type === 'user' && (
                  <User className="w-5 h-5 text-blue-100 mt-0.5 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion.text)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
              >
                {suggestion.icon}
                <span>{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your career, resume, or skills..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;