import { fetchGitHubProjects, formatProjectsForTerminal } from './githubApi.js';

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
                    "clear         - Clear the terminal",
                    "sudo          - Try it 😉",
                    "",
                    
                    "",
                    "Type any command to explore!"
                ]
            };
        
        case "about":
            return { 
                output: [
                    "Hi there!",
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
                    ` Email:    <a href="mailto:${YOUR_EMAIL}" style="color: #58a6ff; text-decoration: underline;">${YOUR_EMAIL}</a>`,
                    ` GitHub:   <a href="${GITHUB}" target="_blank" rel="noopener noreferrer" style="color: #58a6ff; text-decoration: underline;">${GITHUB}</a>`,
                    ` LinkedIn: <a href="${LINKEDIN}" target="_blank" rel="noopener noreferrer" style="color: #58a6ff; text-decoration: underline;">${LINKEDIN}</a>`,
                    "",
                    "Feel free to reach out for collaborations,",
                    "job opportunities, or just to say hi!",
                    "",
                    
                ]
            };
        
        case "resume":
            return {
                output: [
                    " Resume/CV:",
                    "",
                    `View online: <a href="${RESUME}" target="_blank" rel="noopener noreferrer" style="color: #58a6ff; text-decoration: underline;">${RESUME}</a>`,
                    "",
                    " Tip: Click the link above to view my resume in a new tab.",
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
                    "🎓 Machine Learning Specialization", 
                    "   Stanford Online (Coursera) • 2023",
                ]
            };
        
        default:
            return {
                output: [
                    `bash: ${cmd}: command not found`,
                    "",
                    "Type 'help' to see available commands.",
                    " Try commands like 'about', 'projects', or 'contact'!"
                ]
            };
    }
}