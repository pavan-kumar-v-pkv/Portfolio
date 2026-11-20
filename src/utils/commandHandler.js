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
    role: 'Software Engineer',
    email: 'pkvstarscream@gmail.com',
    github: 'https://github.com/pavan-kumar-v-pkv',
    linkedin: 'https://www.linkedin.com/in/pavan-kumar-v-53881524b/',
    resume: 'https://drive.google.com/file/d/1z0NmKa8u_Dsn6eteyJq-gdyZiW8b40vC/view?usp=drive_link',
};

const SKILLS = {
    Languages: ['JavaScript', 'Python', 'Java', 'C++'],
    Frontend: ['React', 'HTML5', 'CSS3', 'Tailwind CSS'],
    Backend: ['Node.js', 'Express', 'Django'],
    Databases: ['PostgreSQL', 'MySQL'],
    DevOps: ['Docker', 'Jenkins', 'CI/CD'],
    Tools: ['Git', 'VS Code', 'Postman'],
};

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
    ['neofetch', 'System info, portfolio edition'],
    ['theme', 'Cycle the accent colour'],
    ['clear', 'Clear the screen'],
];

// Every command the shell knows (used for Tab-completion and "did you mean").
export const COMMANDS = [
    ...HELP.map(([c]) => c),
    'help', 'whoami', 'ls', 'pwd', 'date', 'echo', 'history',
    'certifications', 'sudo', 'exit',
];

const startedAt = Date.now();

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

function uptime() {
    const s = Math.floor((Date.now() - startedAt) / 1000);
    const m = Math.floor(s / 60);
    return m ? `${m} min ${s % 60} sec` : `${s} sec`;
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
                    ["I'm ", { text: PROFILE.name, cls: 'accent' }, ', a software engineer who enjoys building'],
                    'for the web and exploring Generative AI.',
                    '',
                    ['Most recently I was a ', { text: 'DevOps Intern at HPE', cls: 'success' }, ', containerising'],
                    'simulators and wiring them into Jenkins CI pipelines.',
                    '',
                    ['Next: ', chip('projects'), ' · ', chip('experience'), ' · ', chip('contact')],
                ],
            };

        case 'projects':
            return {
                loading: 'Fetching latest projects from GitHub',
                async: async () => {
                    const projects = await fetchGitHubProjects();
                    return formatProjectsForTerminal(projects, PROFILE.github);
                },
            };

        case 'skills':
            return {
                output: [
                    [{ text: 'Technical Skills', cls: 'bold' }],
                    '',
                    ...Object.entries(SKILLS).flatMap(([group, items]) => [
                        [{ text: pad(group, 12), cls: 'accent' }, ...items.flatMap((s, i) => [
                            ...(i ? [{ text: ' · ', cls: 'muted' }] : []),
                            { text: s, cls: 'tag' },
                        ])],
                    ]),
                ],
            };

        case 'experience':
            return {
                output: [
                    [{ text: 'Work Experience', cls: 'bold' }],
                    '',
                    [{ text: '● ', cls: 'success' }, { text: 'DevOps Intern', cls: 'bold' }, ' @ ', { text: 'Hewlett Packard Enterprise', cls: 'accent' }],
                    [{ text: '│ ', cls: 'muted' }, { text: 'Feb 2025 – Jul 2025', cls: 'muted' }],
                    [{ text: '│ ', cls: 'muted' }, '▸ Dockerised simulators for Ubuntu'],
                    [{ text: '│ ', cls: 'muted' }, '▸ Integrated Docker-based simulators into the Jenkins CI pipeline'],
                    [{ text: '│ ', cls: 'muted' }, '▸ Automated smoke/unit tests with Python and shell scripting'],
                    [{ text: '│ ', cls: 'muted' }, '▸ Maintained Confluence documentation for CI/CD processes'],
                    [{ text: '╵', cls: 'muted' }],
                ],
            };

        case 'education':
            return {
                output: [
                    [{ text: 'Education', cls: 'bold' }],
                    '',
                    [{ text: '🎓 ', cls: '' }, { text: 'B.E. Computer Science and Engineering', cls: 'bold' }],
                    [{ text: '   ' }, { text: 'RV Institute of Technology and Management', cls: 'accent' }, { text: ' · 2022 – 2025', cls: 'muted' }],
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
                    [{ text: '   ' }, { text: 'Stanford Online (Coursera) · 2023', cls: 'muted' }],
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

        case 'neofetch': {
            const info = [
                [{ text: 'pavan', cls: 'accent bold' }, '@', { text: 'portfolio', cls: 'accent bold' }],
                [{ text: '───────────────', cls: 'muted' }],
                [{ text: 'OS       ', cls: 'accent' }, 'PortfolioOS (React 19 + Vite)'],
                [{ text: 'Role     ', cls: 'accent' }, PROFILE.role],
                [{ text: 'Focus    ', cls: 'accent' }, 'Web · GenAI · DevOps'],
                [{ text: 'Shell    ', cls: 'accent' }, 'pksh 2.0'],
                [{ text: 'Uptime   ', cls: 'accent' }, uptime()],
                [{ text: 'Theme    ', cls: 'accent' }, ctx.theme || 'blue'],
                [{ text: 'Langs    ', cls: 'accent' }, 'JS, Python, Java, C++'],
                '',
                [{ text: '███', cls: 'c1' }, { text: '███', cls: 'c2' }, { text: '███', cls: 'c3' }, { text: '███', cls: 'c4' }, { text: '███', cls: 'c5' }, { text: '███', cls: 'c6' }],
            ];
            return { output: info };
        }

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
