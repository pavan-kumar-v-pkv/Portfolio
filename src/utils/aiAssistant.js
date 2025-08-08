// AI Assistant functionality for the terminal
export const aiCommands = {
  'ai': {
    description: 'Interact with AI assistant',
    usage: 'ai <question>',
    examples: [
      'ai What technologies does Pavan work with?',
      'ai Tell me about his experience',
      'ai What projects has he worked on?'
    ]
  }
};

// Simple AI responses based on portfolio data
const portfolioKnowledge = {
  skills: {
    languages: ['JavaScript', 'Python', 'Java', 'C++'],
    frontend: ['React', 'HTML5', 'CSS3', 'Tailwind CSS'],
    backend: ['Node.js', 'Express', 'Django'],
    databases: ['PostgreSQL', 'MySQL'],
    devops: ['Docker', 'CI/CD', 'Jenkins'],
    tools: ['Git', 'VS Code', 'Postman']
  },
  experience: [
    {
      role: 'DevOps Intern',
      company: 'Hewlett Packard Enterprise (HPE)',
      period: 'Feb 2025 - Jul 2025',
      achievements: [
        'Dockerized simulators for Ubuntu',
        'Integrated Docker-based simulators into Jenkins CI pipeline',
        'Automated smoke/unit tests using Python and shell scripting'
      ]
    }
  ],
  about: {
    name: 'Pavan Kumar V',
    role: 'Software Engineer',
    specialization: 'Web development and Generative AI',
    passion: 'Building innovative software solutions'
  }
};

export const processAIQuery = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Skills-related queries
  if (lowerQuery.includes('skill') || lowerQuery.includes('technolog') || lowerQuery.includes('language')) {
    return [
      "🤖 AI Assistant: Here are Pavan's technical skills:",
      "",
      "💻 Programming Languages:",
      `   ${portfolioKnowledge.skills.languages.join(', ')}`,
      "",
      "🎨 Frontend Technologies:",
      `   ${portfolioKnowledge.skills.frontend.join(', ')}`,
      "",
      "⚙️  Backend Technologies:",
      `   ${portfolioKnowledge.skills.backend.join(', ')}`,
      "",
      "🗄️  Databases:",
      `   ${portfolioKnowledge.skills.databases.join(', ')}`,
      "",
      "🚀 DevOps & Tools:",
      `   ${portfolioKnowledge.skills.devops.join(', ')}, ${portfolioKnowledge.skills.tools.join(', ')}`,
      ""
    ];
  }
  
  // Experience-related queries
  if (lowerQuery.includes('experience') || lowerQuery.includes('work') || lowerQuery.includes('job')) {
    return [
      "🤖 AI Assistant: Here's Pavan's work experience:",
      "",
      "💼 Current Position:",
      `   ${portfolioKnowledge.experience[0].role}`,
      `   ${portfolioKnowledge.experience[0].company}`,
      `   ${portfolioKnowledge.experience[0].period}`,
      "",
      "🎯 Key Achievements:",
      ...portfolioKnowledge.experience[0].achievements.map(achievement => `   • ${achievement}`),
      ""
    ];
  }
  
  // About-related queries
  if (lowerQuery.includes('about') || lowerQuery.includes('who') || lowerQuery.includes('pavan')) {
    return [
      "🤖 AI Assistant: About Pavan Kumar V:",
      "",
      `👨‍💻 ${portfolioKnowledge.about.name} is a ${portfolioKnowledge.about.role}`,
      `🎯 Specializing in ${portfolioKnowledge.about.specialization}`,
      `💡 Passionate about ${portfolioKnowledge.about.passion}`,
      "",
      "🌟 He combines technical expertise with creative problem-solving",
      "   to build innovative software solutions that make a difference.",
      ""
    ];
  }
  
  // Project-related queries
  if (lowerQuery.includes('project') || lowerQuery.includes('portfolio') || lowerQuery.includes('github')) {
    return [
      "🤖 AI Assistant: About Pavan's projects:",
      "",
      "🚀 He works on diverse projects including:",
      "   • Interactive portfolio websites with terminal interfaces",
      "   • AI-powered applications and chatbots",
      "   • DevOps automation and CI/CD pipelines",
      "   • Full-stack web applications with modern frameworks",
      "",
      "💡 Type 'projects' to see his latest GitHub repositories!",
      ""
    ];
  }
  
  // Contact-related queries
  if (lowerQuery.includes('contact') || lowerQuery.includes('reach') || lowerQuery.includes('email')) {
    return [
      "🤖 AI Assistant: How to reach Pavan:",
      "",
      "📧 Type 'contact' to see his contact information",
      "🔗 Check out his professional profiles and portfolio",
      "💼 He's always open to discussing new opportunities!",
      ""
    ];
  }
  
  // General help
  if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
    return [
      "🤖 AI Assistant: I can help you learn about Pavan Kumar V!",
      "",
      "💬 Try asking me:",
      "   • 'What skills does Pavan have?'",
      "   • 'Tell me about his experience'",
      "   • 'What projects has he worked on?'",
      "   • 'How can I contact him?'",
      "",
      "🎯 I have knowledge about his technical skills, work experience,",
      "   projects, and professional background.",
      ""
    ];
  }
  
  // Default response
  return [
    "🤖 AI Assistant: I'd be happy to help you learn about Pavan Kumar V!",
    "",
    "💡 Try asking me about:",
    "   • His technical skills and technologies",
    "   • Work experience and achievements", 
    "   • Projects and portfolio",
    "   • Contact information",
    "",
    "🔍 Type 'ai help' to see more specific questions you can ask.",
    ""
  ];
};

export const validateAICommand = (input) => {
  const trimmed = input.trim();
  if (!trimmed.startsWith('ai ')) {
    return null;
  }
  
  const query = trimmed.substring(3).trim();
  if (!query) {
    return {
      isValid: false,
      message: "Please provide a question after 'ai'. Example: ai What skills does Pavan have?"
    };
  }
  
  return {
    isValid: true,
    query: query
  };
};
