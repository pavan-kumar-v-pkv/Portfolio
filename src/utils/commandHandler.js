import { fetchGitHubProjects, formatProjectsForTerminal } from './githubApi.js';
import { processAIQuery, validateAICommand } from './aiAssistant.js';

const YOUR_EMAIL = "pkvstarscream@gmail.com";
const GITHUB = "https://github.com/pavan-kumar-v-pkv";
const LINKEDIN = "https://www.linkedin.com/in/pavan-kumar-v-53881524b/"; 
const RESUME = "https://drive.google.com/file/d/1z0NmKa8u_Dsn6eteyJq-gdyZiW8b40vC/view?usp=drive_link"; 

export default function commandHandler(raw) {
    const parts = raw.trim().split(" "); // Split the command into parts
    const cmd = parts[0].toLowerCase(); // Get the command in lowercase
    const arg = parts.slice(1).join(" "); // Get the arguments after the command

    switch (cmd) {
        case "help":
            return {
                output: [
                    "Available commands:",
                    "",
                    "help          - Show this help message",
                    "about         - Learn about me",
                    "projects      - View my GitHub projects",
                    "skills        - Technical skills",
                    "experience    - Work experience",
                    "education     - Educational background",
                    "contact       - Get in touch",
                    "resume        - View/download resume",
                    "ai <question> - Ask AI about me",
                    "clear         - Clear the terminal",
                    "sudo          - Try it 😉",
                    "",
                    "✨ New features:",
                    "• GitHub integration for live project data",
                    "• AI assistant to answer questions about me",
                    "",
                    "Type any command to explore!"
                ]
            };
        
        case "about":
            return { 
                output: [
                    "Hi there! 👋",
                    "",
                    "I'm Pavan Kumar V, a passionate software developer specializing in",
                    "web development and Generative AI.",
                    "",
                    
                    "Welcome to my interactive portfolio terminal!"
                ] 
            };
        
        case "projects":
            // Return a promise for async GitHub data fetching
            return {
                output: ["🔄 Fetching latest projects from GitHub..."],
                async: true,
                asyncHandler: async () => {
                    try {
                        const projects = await fetchGitHubProjects();
                        return formatProjectsForTerminal(projects);
                    } catch (error) {
                        return [
                            " Error fetching GitHub projects.",
                            "",
                            " Here are some featured projects:",
                            "",
                            "1. Interactive Portfolio Terminal",
                            "   A modern terminal-based portfolio website",
                            "   Technologies: React, CSS3, JavaScript",
                            "",
                            "2. AI Chat Application", 
                            "   Smart chatbot with modern UI",
                            "   Technologies: React, Node.js, AI APIs",
                            "",
                            "🔗 Visit my GitHub: " + GITHUB
                        ];
                    }
                }
            };
        
        case "skills":
            return {
                output: [
                    "Technical Skills:",
                    "",
                    " Languages:",
                    "   JavaScript, Python, Java, C++",
                    "",
                    " Frontend:",
                    "   React, HTML5, CSS3, Tailwind CSS",
                    "",
                    " Backend:",
                    "   Node.js, Express, Django",
                    "",
                    " Databases:",
                    "   PostgreSQL, MySQL",
                    "",
                    " DevOps:",
                    "   Docker, CI/CD, Jenkins",
                    "",
                    " Tools:",
                    "   Git, VS Code, Postman"
                ]
            };
        
        case "experience":
            return {
                output: [
                    "Work Experience:",
                    "",
                    "   DevOps Intern",
                    "   Hewlett Packard Enterprise (HPE) • Feb 2025 - Jul 2025",
                    "   • Dockerized simulators for Ubuntu",
                    "   • Integrated Docker-based simulators into Jenkins CI pipeline",
                    "   • Automated smoke/unit tests using Python and shell scripting",
                    "   • Maintained Confluence documentation for CI/CD processes",
                    "",
                ]
            };
        
        case "education":
            return {
                output: [
                    "Education:",
                    "",
                    " Bachelor of Engineering in Computer Science and Engineering",
                    " RV Institute of Technology and Management ® • 2022 - 2025",
                    "",
                ]
            };
        
        case "contact":
            return {
                output: [
                    "Let's Connect! ",
                    "",
                    " Email:    " + YOUR_EMAIL,
                    " GitHub:   " + GITHUB,
                    " LinkedIn: " + LINKEDIN,
                    "",
                    "Feel free to reach out for collaborations,",
                    "   job opportunities, or just to say hi!",
                    "",
                    "Response time: Usually within 24 hours"
                ]
            };
        
        case "resume":
            return {
                output: [
                    " Resume/CV:",
                    "",
                    "View online: " + RESUME,
                    "",
                    " Tip: Right-click the link above and select",
                    "   'Open in new tab' to view my resume.",
                    "",
                    "Available formats: PDF, HTML",
                    "Last updated: August 2025"
                ]
            };
        
        case "sudo":
            return {
                output: [
                    "Nice try! 😄",
                    "",
                    "But you don't have sudo privileges here...",
                    "This is a safe, read-only environment.",
                    "",
                    " Try other commands like 'about' or 'projects'!"
                ]
            };
        
        case "clear":
            return { clear: true, output: [] }; // Indicate that the terminal should be cleared
        
        case "ls":
            return {
                output: [
                    "about.txt    projects.md    skills.json",
                    "experience.yaml    education.pdf    contact.vcf",
                    "",
                    " Use commands like 'about', 'projects', etc. to explore!"
                ]
            };
        
        case "pwd":
            return {
                output: ["/home/pavan/portfolio"]
            };
        
        case "whoami":
            return {
                output: ["pavan - Software Developer & AI Enthusiast"]
            };
        
        case "certifications":
            return {
                output: [
                    "Certifications & Courses:",
                    "",
                    " Machine Learning Specialization", 
                    "   Stanford Online (Coursera) • 2023",
                ]
            };
        
        case "ai":
            const aiValidation = validateAICommand(raw);
            if (!aiValidation) {
                return {
                    output: [
                        "AI Assistant: Hello! I can answer questions about Pavan Kumar V.",
                        "",
                        "Usage: ai <your question>",
                        "",
                        "Examples:",
                        "  ai What skills does Pavan have?",
                        "  ai Tell me about his experience",
                        "  ai What projects has he worked on?",
                        "",
                        "Type 'ai help' for more information!"
                    ]
                };
            }
            
            if (!aiValidation.isValid) {
                return {
                    output: [
                        "🤖 AI Assistant: " + aiValidation.message,
                        "",
                        "Example: ai What technologies does Pavan work with?"
                    ]
                };
            }
            
            return {
                output: processAIQuery(aiValidation.query)
            };
        
        default:
            // Check if it's an AI command that wasn't caught by the case
            if (raw.toLowerCase().startsWith('ai ')) {
                const query = raw.substring(3).trim();
                return {
                    output: processAIQuery(query)
                };
            }
            
            return {
                output: [
                    `bash: ${cmd}: command not found`,
                    "",
                    "Try 'help' to see available commands.",
                    "Or ask the AI: ai <your question>"
                ]
            };
    }
}