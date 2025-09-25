import { Resume, Skill, SkillGap, Resource, ATSSuggestion } from '../types';

export const mockSkills: Skill[] = [
  { name: 'React', level: 'Advanced', category: 'Frontend', demand: 95, inResume: true },
  { name: 'TypeScript', level: 'Intermediate', category: 'Programming', demand: 90, inResume: true },
  { name: 'Node.js', level: 'Intermediate', category: 'Backend', demand: 85, inResume: true },
  { name: 'Python', level: 'Beginner', category: 'Programming', demand: 88, inResume: false },
  { name: 'AWS', level: 'Beginner', category: 'Cloud', demand: 92, inResume: false },
  { name: 'Docker', level: 'Intermediate', category: 'DevOps', demand: 80, inResume: true },
  { name: 'GraphQL', level: 'Beginner', category: 'API', demand: 75, inResume: false },
  { name: 'MongoDB', level: 'Intermediate', category: 'Database', demand: 70, inResume: true },
];

export const mockSkillGaps: SkillGap[] = [
  {
    skill: 'Python',
    category: 'Programming',
    importance: 95,
    marketDemand: 88,
    difficulty: 'Medium',
    timeToLearn: '2-3 months',
    resources: [
      {
        id: '1',
        title: 'Complete Python Bootcamp',
        type: 'course',
        provider: 'Udemy',
        rating: 4.8,
        duration: '40 hours',
        cost: 'Paid',
        url: '#',
        description: 'Comprehensive Python course from basics to advanced topics'
      },
      {
        id: '2',
        title: 'Python for Everybody',
        type: 'course',
        provider: 'Coursera',
        rating: 4.7,
        duration: '30 hours',
        cost: 'Free',
        url: '#',
        description: 'University of Michigan Python specialization'
      }
    ]
  },
  {
    skill: 'AWS',
    category: 'Cloud',
    importance: 90,
    marketDemand: 92,
    difficulty: 'Hard',
    timeToLearn: '3-4 months',
    resources: [
      {
        id: '3',
        title: 'AWS Solutions Architect',
        type: 'certification',
        provider: 'AWS',
        rating: 4.9,
        duration: '60 hours',
        cost: 'Premium',
        url: '#',
        description: 'Official AWS certification preparation'
      }
    ]
  },
  {
    skill: 'Machine Learning',
    category: 'AI/ML',
    importance: 85,
    marketDemand: 95,
    difficulty: 'Hard',
    timeToLearn: '4-6 months',
    resources: [
      {
        id: '4',
        title: 'Machine Learning Specialization',
        type: 'course',
        provider: 'Coursera',
        rating: 4.9,
        duration: '80 hours',
        cost: 'Paid',
        url: '#',
        description: 'Stanford University ML course by Andrew Ng'
      }
    ]
  }
];

export const mockATSSuggestions: ATSSuggestion[] = [
  {
    id: '1',
    category: 'keywords',
    severity: 'high',
    title: 'Add Industry Keywords',
    description: 'Include more relevant industry keywords like "agile", "scrum", "CI/CD"',
    impact: 25
  },
  {
    id: '2',
    category: 'formatting',
    severity: 'medium',
    title: 'Improve Section Headers',
    description: 'Use standard section headers like "Work Experience" instead of "Professional Journey"',
    impact: 15
  },
  {
    id: '3',
    category: 'structure',
    severity: 'low',
    title: 'Quantify Achievements',
    description: 'Add more numerical metrics to demonstrate impact (e.g., "Improved performance by 30%")',
    impact: 20
  }
];

export const mockResume: Resume = {
  id: '1',
  fileName: 'john_doe_resume.pdf',
  uploadDate: '2024-01-15',
  content: 'Mock resume content...',
  parsedData: {
    personalInfo: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe'
    },
    summary: 'Experienced full-stack developer with 5+ years of experience building scalable web applications.',
    experience: [
      {
        id: '1',
        company: 'Tech Innovations Inc.',
        position: 'Senior Full Stack Developer',
        duration: '2022 - Present',
        description: [
          'Led development of customer-facing web applications serving 100k+ users',
          'Implemented CI/CD pipelines reducing deployment time by 60%',
          'Mentored junior developers and conducted code reviews'
        ],
        technologies: ['React', 'Node.js', 'TypeScript', 'MongoDB']
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        duration: '2020 - 2022',
        description: [
          'Built and maintained RESTful APIs handling 1M+ requests daily',
          'Collaborated with design team to implement responsive UI components',
          'Optimized database queries improving application performance by 40%'
        ],
        technologies: ['React', 'Express.js', 'PostgreSQL', 'Docker']
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science in Computer Science',
        year: '2020',
        gpa: '3.8'
      }
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'Docker', 'MongoDB', 'Git', 'Agile'],
    certifications: ['AWS Cloud Practitioner', 'Certified Scrum Master']
  },
  analysis: {
    atsScore: 78,
    skillsAnalysis: {
      technical: mockSkills.filter(s => s.inResume),
      soft: [],
      trending: mockSkills.filter(s => s.demand > 85),
      missing: mockSkills.filter(s => !s.inResume)
    },
    suggestions: mockATSSuggestions,
    skillGaps: mockSkillGaps,
    overallScore: 82
  }
};