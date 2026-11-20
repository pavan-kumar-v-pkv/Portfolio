// GitHub API integration for fetching projects
const GITHUB_USERNAME = 'pavan-kumar-v-pkv';
const CACHE_KEY = 'gh-projects-v2';
const CACHE_TTL = 10 * 60 * 1000; // 10 min — the unauthenticated API allows only 60 req/hr per IP

const LANG_COLORS = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Java: '#b07219',
    'C++': '#f34b7d', C: '#555555', HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051',
    Go: '#00ADD8', Jupyter: '#DA5B0B', 'Jupyter Notebook': '#DA5B0B', Dockerfile: '#384d54',
};

function readCache() {
    try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { at, data } = JSON.parse(raw);
        return Date.now() - at < CACHE_TTL ? data : null;
    } catch {
        return null;
    }
}

function writeCache(data) {
    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
    } catch { /* storage unavailable — ignore */ }
}

export async function fetchGitHubProjects() {
    const cached = readCache();
    if (cached) return cached;

    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`);
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
    const repos = await res.json();

    const projects = repos
        .filter(r => !r.fork && !r.archived && r.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase())
        .map(r => ({
            name: r.name,
            description: r.description || '',
            url: r.html_url,
            language: r.language,
            stars: r.stargazers_count,
            updated: r.pushed_at || r.updated_at,
            topics: r.topics || [],
            homepage: r.homepage,
        }))
        .slice(0, 8);

    writeCache(projects);
    return projects;
}

function timeAgo(iso) {
    const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (days < 1) return 'today';
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
}

export function formatProjectsForTerminal(projects, profileUrl) {
    const out = [[{ text: `Projects`, cls: 'bold' }, { text: `  (${projects.length} most recently updated)`, cls: 'muted' }], ''];

    projects.forEach((p, i) => {
        out.push([
            { text: `${String(i + 1).padStart(2, '0')} `, cls: 'muted' },
            { text: p.name, href: p.url, cls: 'bold' },
            ...(p.stars ? [{ text: `  ★ ${p.stars}`, cls: 'warn' }] : []),
            ...(p.homepage ? ['  ', { text: '↗ live', href: p.homepage, cls: 'success' }] : []),
        ]);
        if (p.description) out.push([{ text: '   ' }, p.description]);
        out.push([
            { text: '   ' },
            ...(p.language ? [{ text: '● ', color: LANG_COLORS[p.language] || '#8b949e' }, { text: p.language, cls: 'muted' }, { text: ' · ', cls: 'muted' }] : []),
            { text: `updated ${timeAgo(p.updated)}`, cls: 'muted' },
            ...(p.topics.length ? [{ text: ' · ', cls: 'muted' }, ...p.topics.slice(0, 4).flatMap((t, j) => [...(j ? [' '] : []), { text: `#${t}`, cls: 'tag' }])] : []),
        ]);
        out.push('');
    });

    out.push(['More on ', { text: 'github.com/pavan-kumar-v-pkv', href: profileUrl }]);
    return out;
}
