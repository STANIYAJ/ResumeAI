export interface Resume {
  id: string;
  fileName: string;
  uploadDate: string;
  content: string;
  parsedData: ParsedResumeData;
  analysis: ResumeAnalysis;
}

export interface ParsedResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
  gpa?: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  skillsAnalysis: SkillsAnalysis;
  suggestions: ATSSuggestion[];
  skillGaps: SkillGap[];
  overallScore: number;
}

export interface SkillsAnalysis {
  technical: Skill[];
  soft: Skill[];
  trending: Skill[];
  missing: Skill[];
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  demand: number;
  inResume: boolean;
}

export interface ATSSuggestion {
  id: string;
  category: 'formatting' | 'keywords' | 'structure' | 'content';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  impact: number;
}

export interface SkillGap {
  skill: string;
  category: string;
  importance: number;
  marketDemand: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeToLearn: string;
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'course' | 'certification' | 'book' | 'tutorial' | 'practice';
  provider: string;
  rating: number;
  duration: string;
  cost: 'Free' | 'Paid' | 'Premium';
  url: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}