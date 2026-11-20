import { fetchGitHubProjects, formatProjectsForTerminal } from './githubApi.js';

/*
 * Output format
 * -------------
 * A command returns `{ output: Line[] }` where a Line is either
 *   - a plain string, or
 *   - an array of segments: string | { text, href?, cls?, cmd? }
 *       href → rendered as an external link
 *       cmd  → rendered as a clickable chip that runs that command
 *       cls  → extra CSS class (accent, success, warn, muted, bold, tag…)
 *
 * No raw HTML is ever injected, so data from the GitHub API can't break the page.
 */

export const PROFILE = {
    name: 'Pavan Kumar V',
    role: 'AI/ML & Backend Engineer',
    email: 'pavankumarvpkv@gmail.com',
    github: 'https://github.com/pavan-kumar-v-pkv',
    linkedin: 'https://www.linkedin.com/in/pavan-kumar-v-53881524b/',
    resume: 'https://drive.google.com/file/d/1z0NmKa8u_Dsn6eteyJq-gdyZiW8b40vC/view?usp=drive_link',
};

const SKILLS = [
    'Python', 'JavaScript', 'SQL', 'C++',
    'LangGraph', 'LangChain', 'LlamaIndex', 'RAG', 'Weaviate',
    'FastAPI', 'Node.js', 'PostgreSQL', 'MongoDB',
    'AWS', 'Docker', 'Jenkins', 'Git',
];

const FEATURED = [
    {
        name: 'AI Investment & Trading Engine',
        year: '2026',
        note: 'private repo, available on request',
        desc: 'Broker-independent trading research platform for Indian markets: NSE calendar service, event-driven backtester with risk limits and audited paper execution. 270+ pytest tests.',
        stack: ['Python', 'pytest'],
    },
    {
        name: 'ContractGuard',
        year: '2025',
        url: 'https://github.com/pavan-kumar-v-pkv/ContractGuard-Multi-Agent-Legal-Document-Analyzer',
        desc: 'AI legal document analyzer: 5 LangGraph agents for clause extraction, comparison and risk analysis, on a local-first LlamaIndex + ChromaDB hybrid-search RAG pipeline.',
        stack: ['LangGraph', 'LlamaIndex', 'ChromaDB', 'FastAPI'],
    },
    {
        name: 'MyOwnCloud',
        year: '2025',
        url: 'https://github.com/pavan-kumar-v-pkv/MyOwnCloud',
        desc: 'Self-hosted AI file storage with expiring share links, Groq LLaMA 3 tagging, OCR and content-based search.',
        stack: ['Node.js', 'PostgreSQL', 'Groq', 'Docker'],
    },
];

function featuredLines() {
    return [
        [{ text: 'Featured projects', cls: 'bold' }],
        '',
        ...FEATURED.flatMap(p => [
            [
                { text: '★ ', cls: 'warn' },
                p.url ? { text: p.name, href: p.url, cls: 'bold' } : { text: p.name, cls: 'bold' },
                { text: `  ${p.year}`, cls: 'muted' },
                ...(p.note ? [{ text: ` · ${p.note}`, cls: 'muted' }] : []),
            ],
            ['  ', p.desc],
            ['  ', ...p.stack.flatMap((t, i) => [...(i ? [' '] : []), { text: `#${t}`, cls: 'tag' }])],
            '',
        ]),
    ];
}

const THEMES = ['blue', 'green', 'amber', 'purple'];

// Commands shown in `help`, in display order.
const HELP = [
    ['about', 'Who I am'],
    ['projects', 'Latest repos, live from GitHub'],
    ['skills', 'Tech I work with'],
    ['experience', 'Where I have worked'],
    ['education', 'Where I studied'],
    ['contact', 'Get in touch'],
    ['resume', 'Open my resume'],
    ['theme', 'Cycle the accent colour'],
    ['clear', 'Clear the screen'],
];

// Every command the shell knows (used for Tab-completion and "did you mean").
export const COMMANDS = [
    ...HELP.map(([c]) => c),
    'help', 'whoami', 'ls', 'pwd', 'date', 'echo', 'history',
    'certifications', 'sudo', 'exit',
];

const link = (text, href) => ({ text, href });
const chip = (cmd, text = cmd) => ({ text, cmd });
const pad = (s, n) => s + ' '.repeat(Math.max(1, n - s.length));

function levenshtein(a, b) {
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
            );
        }
    }
    return dp[a.length][b.length];
}

function suggest(cmd) {
    let best = null;
    let bestScore = Infinity;
    for (const c of COMMANDS) {
        const d = levenshtein(cmd, c);
        if (d < bestScore) { best = c; bestScore = d; }
    }
    return bestScore <= 2 ? best : null;
}

export function welcomeLines() {
    return [
        '',
        [{ text: 'Welcome! ', cls: 'bold' }, "I'm ", { text: PROFILE.name, cls: 'bold accent' }, ' · ', { text: PROFILE.role, cls: 'muted' }],
        '',
        ['Type ', chip('help'), ' or click a command to get started. ', { text: 'Tab', cls: 'kbd' }, ' autocompletes, ', { text: '↑ ↓', cls: 'kbd' }, ' browse history.'],
    ];
}

/**
 * @param {string} raw     the full input line
 * @param {object} ctx     { history: string[], theme: string }
 */
export default function commandHandler(raw, ctx = {}) {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    switch (cmd) {
        case 'help':
            return {
                output: [
                    [{ text: 'Available commands', cls: 'bold' }],
                    '',
                    ...HELP.map(([c, d]) => [chip(c, pad(c, 13)), { text: d, cls: 'muted' }]),
                    '',
                    [{ text: 'Also try: ', cls: 'muted' }, chip('whoami'), ' ', chip('ls'), ' ', chip('history'), ' ', chip('sudo')],
                ],
            };

        case 'about':
            return {
                output: [
                    [{ text: 'Hi there! 👋', cls: 'bold' }],
                    '',
                    ["I'm ", { text: PROFILE.name, cls: 'accent' }, ', an AI/ML and backend engineer in Bengaluru.'],
                    '',
                    ["I'm a ", { text: 'Member of Technical Staff at MetricStream', cls: 'success' }, ', building production'],
                    'multi-agent and RAG systems for an enterprise governance, risk and compliance (GRC)',
                    'platform with LangGraph, FastAPI, Weaviate and MongoDB.',
                    '',
                    'I care about deterministic, well-tested systems around LLMs.',
                    '',
                    ['Next: ', chip('experience'), ' · ', chip('projects'), ' · ', chip('contact')],
                ],
            };

        case 'projects':
            return {
                loading: 'Fetching latest projects from GitHub',
                async: async () => {
                    try {
                        const featured = new Set(FEATURED.map(f => f.url?.toLowerCase()));
                        const projects = (await fetchGitHubProjects()).filter(p => !featured.has(p.url.toLowerCase()));
                        return [...featuredLines(), ...formatProjectsForTerminal(projects, PROFILE.github)];
                    } catch {
                        return [
                            ...featuredLines(),
                            [{ text: "Couldn't load the rest from GitHub right now. ", cls: 'muted' }, 'See ', link('github.com/pavan-kumar-v-pkv', PROFILE.github)],
                        ];
                    }
                },
            };

        case 'skills':
            return {
                output: [
                    [{ text: 'Skills', cls: 'bold' }],
                    '',
                    SKILLS.flatMap((sk, i) => [...(i ? [{ text: ' · ', cls: 'muted' }] : []), { text: sk, cls: 'tag' }]),
                ],
            };

        case 'experience': {
            const bullet = (t) => ['  ', { text: '▸ ', cls: 'accent' }, t];
            return {
                output: [
                    [{ text: 'Work Experience', cls: 'bold' }],
                    '',
                    [{ text: '● ', cls: 'success' }, { text: 'Member of Technical Staff', cls: 'bold' }, ' @ ', { text: 'MetricStream', cls: 'accent' }],
                    ['  ', { text: 'Nov 2025 – Present · Bengaluru', cls: 'muted' }],
                    bullet('Build multi-agent RAG systems with LangGraph and Weaviate for an enterprise GRC platform, including a FastAPI Classification Service that processes 10K+ GRC objects'),
                    bullet('Designed an AI-assisted regulatory-change workflow: multi-step LLM pipeline on LangGraph, MongoDB-backed state, multi-level human review and write-back to the core product'),
                    bullet('Delivered LLM-driven risk-indicator analytics (rolling-window trend classification, two-level threshold breach logic), packaged as a Docker image'),
                    bullet('Built an automated pipeline to download and ingest regulatory PDFs from public legislation sites, with failure recovery across 200+ source files'),
                    '',
                    [{ text: '● ', cls: 'muted' }, { text: 'Software Engineering Intern', cls: 'bold' }, ' @ ', { text: 'Hewlett Packard Enterprise', cls: 'accent' }],
                    ['  ', { text: 'Feb 2025 – Jul 2025 · Bengaluru', cls: 'muted' }],
                    bullet('Built containerised Docker and Jenkins CI/CD pipelines handling 50+ daily deployments for SD-WAN/WLAN solutions'),
                    bullet('Created reusable deployment workflows that cut release time by 30% and deployment errors by 25%'),
                ],
            };
        }

        case 'education':
            return {
                output: [
                    [{ text: 'Education', cls: 'bold' }],
                    '',
                    [{ text: '🎓 ', cls: '' }, { text: 'B.E. Computer Science and Engineering', cls: 'bold' }],
                    [{ text: '   ' }, { text: 'RV Institute of Technology and Management', cls: 'accent' }, { text: ' · 2025', cls: 'muted' }],
                    [{ text: '   ' }, 'CGPA ', { text: '9.33', cls: 'success bold' }],
                    '',
                    ['See also: ', chip('certifications')],
                ],
            };

        case 'certifications':
            return {
                output: [
                    [{ text: 'Certifications', cls: 'bold' }],
                    '',
                    ['📜 ', { text: 'Machine Learning Specialization', cls: 'bold' }],
                    [{ text: '   ' }, { text: 'DeepLearning.AI · 2024', cls: 'muted' }],
                    '',
                    [{ text: 'Leadership', cls: 'bold' }],
                    '',
                    ['🤝 ', 'E-Cell · Datascape · NSS'],
                ],
            };

        case 'contact':
            return {
                output: [
                    [{ text: "Let's connect!", cls: 'bold' }],
                    '',
                    [{ text: pad('Email', 10), cls: 'muted' }, link(PROFILE.email, `mailto:${PROFILE.email}`)],
                    [{ text: pad('GitHub', 10), cls: 'muted' }, link('github.com/pavan-kumar-v-pkv', PROFILE.github)],
                    [{ text: pad('LinkedIn', 10), cls: 'muted' }, link('linkedin.com/in/pavan-kumar-v', PROFILE.linkedin)],
                    '',
                    'Open to full-time roles, collaborations, or just a chat.',
                ],
            };

        case 'resume':
            return {
                openUrl: PROFILE.resume,
                output: [
                    ['📄 Opening resume in a new tab… ', { text: '(blocked? ', cls: 'muted' }, link('click here', PROFILE.resume), { text: ')', cls: 'muted' }],
                ],
            };

        case 'theme': {
            const wanted = arg.toLowerCase();
            const next = THEMES.includes(wanted)
                ? wanted
                : THEMES[(THEMES.indexOf(ctx.theme || 'blue') + 1) % THEMES.length];
            if (arg && !THEMES.includes(wanted)) {
                return { output: [[{ text: `Unknown theme '${arg}'. `, cls: 'warn' }, 'Options: ', ...THEMES.flatMap((t, i) => [...(i ? [' '] : []), chip(`theme ${t}`, t)])]] };
            }
            return {
                theme: next,
                output: [['Accent set to ', { text: next, cls: 'accent bold' }, '. Options: ', ...THEMES.flatMap((t, i) => [...(i ? [' '] : []), chip(`theme ${t}`, t)])]],
            };
        }

        case 'whoami':
            return { output: [['visitor 👀  (looking for me? try ', chip('about'), ')']] };

        case 'ls':
            return {
                output: [[
                    chip('about', 'about.txt'), '   ', chip('projects', 'projects/'), '   ', chip('skills', 'skills.json'), '   ',
                    chip('experience', 'experience.yaml'), '   ', chip('education', 'education.md'), '   ', chip('contact', 'contact.vcf'), '   ', chip('resume', 'resume.pdf'),
                ]],
            };

        case 'cat': {
            const map = { 'about.txt': 'about', 'skills.json': 'skills', 'experience.yaml': 'experience', 'education.md': 'education', 'contact.vcf': 'contact', 'resume.pdf': 'resume' };
            if (map[arg]) return commandHandler(map[arg], ctx);
            return { output: [`cat: ${arg || ''}: No such file or directory`] };
        }

        case 'cd':
            return { output: [arg && arg !== '~' ? `cd: ${arg}: Permission denied (it's a portfolio, not a server 😄)` : ''] };

        case 'pwd':
            return { output: ['/home/pavan/portfolio'] };

        case 'date':
            return { output: [new Date().toString()] };

        case 'echo':
            return { output: [arg] };

        case 'history':
            return {
                output: (ctx.history || []).length
                    ? ctx.history.map((h, i) => [{ text: String(i + 1).padStart(4) + '  ', cls: 'muted' }, chip(h)])
                    : ['No history yet.'],
            };

        case 'sudo':
            return {
                output: [
                    [{ text: '[sudo] password for visitor: ', cls: 'muted' }, '********'],
                    [{ text: 'visitor is not in the sudoers file. This incident will be reported. 🚨', cls: 'warn' }],
                    '',
                    ['Nice try though. How about ', chip('contact'), ' instead?'],
                ],
            };

        case 'exit':
            return { output: [["There's no escape 🙃 — but you can always ", chip('contact'), ' me.']] };

        case 'clear':
            return { clear: true };

        default: {
            const s = suggest(cmd);
            return {
                output: [
                    [{ text: `command not found: ${cmd}`, cls: 'error' }],
                    s ? ['Did you mean ', chip(s), '?'] : ['Type ', chip('help'), ' to see what I can do.'],
                ],
            };
        }
    }
}
