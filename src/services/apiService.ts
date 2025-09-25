// API Service for Resume Analysis and Skills Processing

export interface APIConfig {
  resumeParserApiKey?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  geminiApiKey?: string;
  skillsApiKey?: string;
  jobMarketApiKey?: string;
}

export class APIService {
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
  }

  // Extract text from PDF/DOC files
  async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          if (file.type === 'application/pdf') {
            // For PDF files, we'll use a simple text extraction
            // In production, you'd want to use a proper PDF parser
            const text = await this.extractPDFText(arrayBuffer);
            resolve(text);
          } else if (file.type.includes('document') || file.name.endsWith('.docx')) {
            // For Word documents, extract text
            const text = await this.extractDocText(arrayBuffer);
            resolve(text);
          } else {
            reject(new Error('Unsupported file type'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  private async extractPDFText(arrayBuffer: ArrayBuffer): Promise<string> {
    // Simple PDF text extraction - in production, use pdf-parse or similar
    const uint8Array = new Uint8Array(arrayBuffer);
    const text = new TextDecoder().decode(uint8Array);
    
    // Extract readable text from PDF (basic implementation)
    const textMatch = text.match(/BT\s*(.*?)\s*ET/gs);
    if (textMatch) {
      return textMatch.map(match => 
        match.replace(/BT\s*|\s*ET/g, '')
             .replace(/Tj\s*/g, ' ')
             .replace(/[()]/g, '')
      ).join(' ');
    }
    
    return 'PDF text extraction requires additional libraries. Please use plain text or provide API key for advanced parsing.';
  }

  private async extractDocText(arrayBuffer: ArrayBuffer): Promise<string> {
    // Basic DOC/DOCX text extraction - in production, use mammoth.js or similar
    const uint8Array = new Uint8Array(arrayBuffer);
    const text = new TextDecoder().decode(uint8Array);
    
    // Extract readable text (very basic implementation)
    return text.replace(/[^\x20-\x7E\n]/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();
  }

  // Parse resume using external API or local extraction
  async parseResume(file: File): Promise<any> {
    try {
      // First, extract text from the file
      const resumeText = await this.extractTextFromFile(file);
      
      // If we have a resume parser API key, use it for structured parsing
      if (this.config.resumeParserApiKey) {
        return await this.parseWithAPI(file);
      }
      
      // Otherwise, use AI to parse the text
      return await this.parseWithAI(resumeText);
    } catch (error) {
      console.error('Resume parsing error:', error);
      throw error;
    }
  }

  private async parseWithAPI(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.affinda.com/v3/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.resumeParserApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Resume parsing failed: ${response.statusText}`);
    }

    return await response.json();
  }

  private async parseWithAI(resumeText: string): Promise<any> {
    const prompt = `
Parse the following resume text and extract structured information:

${resumeText}

Please provide a JSON response with the following structure:
{
  "personalInfo": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "city, state",
    "linkedin": "linkedin url",
    "github": "github url"
  },
  "summary": "Professional summary",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "duration": "Start - End",
      "description": ["bullet point 1", "bullet point 2"],
      "technologies": ["tech1", "tech2"]
    }
  ],
  "education": [
    {
      "institution": "School Name",
      "degree": "Degree Type",
      "year": "Graduation Year",
      "gpa": "GPA if mentioned"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "certifications": ["cert1", "cert2"]
}

Extract only information that is clearly present in the resume. Use null for missing fields.
`;

    const aiResponse = await this.callAI(prompt);
    return JSON.parse(aiResponse);
  }

  // Analyze skills using AI
  async analyzeSkills(resumeText: string, jobDescription?: string): Promise<any> {
    const apiKey = this.config.openaiApiKey || this.config.anthropicApiKey || this.config.geminiApiKey;
    if (!apiKey) {
      throw new Error('AI API key not configured');
    }

    const prompt = `
Analyze the following resume and provide a detailed skills assessment:

Resume Content:
${resumeText}

${jobDescription ? `Target Job Description:\n${jobDescription}\n` : ''}

Please provide a JSON response with:
{
  "technicalSkills": [{"name": "skill", "level": "Beginner|Intermediate|Advanced|Expert", "category": "category", "demand": 1-100}],
  "softSkills": ["skill1", "skill2"],
  "missingSkills": [{"name": "skill", "importance": 1-100, "marketDemand": 1-100, "category": "category"}],
  "atsScore": 1-100,
  "suggestions": [{"category": "keywords|formatting|structure|content", "severity": "low|medium|high", "title": "title", "description": "description", "impact": 1-30}],
  "overallScore": 1-100,
  "skillGaps": [{"skill": "skill name", "category": "category", "importance": 1-100, "marketDemand": 1-100, "difficulty": "Easy|Medium|Hard", "timeToLearn": "time estimate"}]
}
`;

    const response = await this.callAI(prompt);
    return JSON.parse(response);
  }

  private async callAI(prompt: string): Promise<string> {
    if (this.config.openaiApiKey) {
      return await this.callOpenAI(prompt);
    } else if (this.config.anthropicApiKey) {
      return await this.callAnthropic(prompt);
    } else if (this.config.geminiApiKey) {
      return await this.callGemini(prompt);
    }
    throw new Error('No AI API key configured');
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert career advisor and resume analyst. Provide detailed, actionable insights for resume improvement and career development. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callAnthropic(prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.anthropicApiKey}`,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 3000,
        messages: [
          {
            role: 'user',
            content: `You are an expert career advisor and resume analyst. ${prompt}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private async callGemini(prompt: string): Promise<string> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.config.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert career advisor and resume analyst. Provide detailed, actionable insights for resume improvement and career development. Always respond with valid JSON.\n\n${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }
    
    throw new Error('Invalid JSON response from Gemini API');
  }

  // Chat with AI for career guidance
  async chatWithAI(message: string, context?: any): Promise<string> {
    const systemPrompt = `You are an expert career advisor and resume consultant. You help professionals improve their careers through:
- Resume optimization and ATS compatibility
- Skill gap analysis and learning recommendations
- Career path guidance and growth strategies
- Interview preparation and salary negotiation
- Industry insights and market trends

${context ? `User Context: ${JSON.stringify(context)}` : ''}

Provide helpful, actionable advice in a conversational tone. Be specific and practical.`;

    if (this.config.openaiApiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.8,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } else if (this.config.anthropicApiKey) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.anthropicApiKey}`,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `${systemPrompt}\n\nUser: ${message}`
            }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } else if (this.config.geminiApiKey) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.config.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error('No AI API key configured');
  }
}

// Create API service instance
export const createAPIService = (config: APIConfig): APIService => {
  return new APIService(config);
};