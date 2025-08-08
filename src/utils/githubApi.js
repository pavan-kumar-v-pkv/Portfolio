// GitHub API integration for fetching projects
const GITHUB_USERNAME = 'pavan-kumar-v-pkv'; // Replace with your GitHub username
const GITHUB_API_BASE = 'https://api.github.com';

export const fetchGitHubProjects = async () => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const repos = await response.json();
    
    // Filter and format the repositories
    const projects = repos
      .filter(repo => !repo.fork && !repo.archived) // Only original, non-archived repos
      .map(repo => ({
        name: repo.name,
        description: repo.description || 'No description available',
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated: repo.updated_at,
        topics: repo.topics || [],
        homepage: repo.homepage
      }))
      .slice(0, 8); // Limit to top 8 projects
    
    return projects;
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return [
      {
        name: 'portfolio-terminal',
        description: 'Interactive terminal-based portfolio website',
        url: 'https://github.com/pavan-kumar-v-pkv/portfolio',
        language: 'JavaScript',
        stars: 0,
        forks: 0,
        updated: new Date().toISOString(),
        topics: ['react', 'portfolio', 'terminal'],
        homepage: null
      },
      {
        name: 'ai-chat-app',
        description: 'AI-powered chat application with modern UI',
        url: 'https://github.com/pavan-kumar-v-pkv/ai-chat',
        language: 'JavaScript',
        stars: 0,
        forks: 0,
        updated: new Date().toISOString(),
        topics: ['ai', 'chat', 'react'],
        homepage: null
      }
    ];
  }
};

export const formatProjectsForTerminal = (projects) => {
  const output = [
    "📂 GitHub Projects:",
    "",
    ...projects.map((project, index) => [
      `${index + 1}. ${project.name}`,
      `   Description: ${project.description}`,
      `   Language: ${project.language || 'Not specified'}`,
      `   ⭐ ${project.stars} | 🍴 ${project.forks}`,
      `   URL: <a href="${project.url}" target="_blank" rel="noopener noreferrer" style="color: #58a6ff; text-decoration: underline;">${project.url}</a>`,
      `   Topics: ${project.topics.join(', ') || 'None'}`,
      `   Last updated: ${new Date(project.updated).toLocaleDateString()}`,
      project.homepage ? `   Live Demo: <a href="${project.homepage}" target="_blank" rel="noopener noreferrer" style="color: #3fb950; text-decoration: underline;">${project.homepage}</a>` : null,
      ""
    ]).flat().filter(Boolean)
  ];
  
  return output;
};
