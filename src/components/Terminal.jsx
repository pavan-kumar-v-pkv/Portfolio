import { useCallback, useEffect, useRef, useState } from 'react';
import commandHandler, { COMMANDS, PROFILE, welcomeLines } from '../utils/commandHandler';
import '../styles/terminal.css';

const PROMPT_USER = 'visitor';
const PROMPT_HOST = 'portfolio';
const TICK = 16;
const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

let nextId = 0;

/** Normalise a Line (string | Segment[]) into a render-ready object. */
function makeLine(line, extra = {}) {
    const raw = typeof line === 'string' ? [line] : line;
    const segs = raw.map(s => (typeof s === 'string' ? { text: s } : s));
    const len = segs.reduce((n, s) => n + s.text.length, 0);
    return { id: nextId++, kind: 'output', segs, len, shown: 0, wait: 0, step: 1, ...extra };
}

/** Give a batch of lines a typing speed so the whole batch finishes in ~targetMs. */
function pace(lines, { targetMs, firstWait = 0 } = {}) {
    if (prefersReducedMotion()) return lines.map(l => ({ ...l, shown: l.len }));
    const total = lines.reduce((n, l) => n + l.len, 0) || 1;
    const budget = targetMs ?? Math.min(900, 220 + total * 3);
    const step = Math.max(1, Math.ceil(total / (budget / TICK)));
    return lines.map((l, i) => ({ ...l, step, wait: i === 0 ? firstWait : l.wait }));
}

const BOOT = [
    ['[ ', { text: ' OK ', cls: 'success' }, ' ] Mounting /home/pavan'],
    ['[ ', { text: ' OK ', cls: 'success' }, ' ] Loading projects, skills, experience'],
    ['[ ', { text: ' OK ', cls: 'success' }, ' ] Starting pksh — portfolio shell'],
];

function Segment({ seg, text, onCmd }) {
    const cls = ['seg', seg.cls].filter(Boolean).join(' ');
    const style = seg.color ? { color: seg.color } : undefined;
    if (seg.href) {
        const external = !seg.href.startsWith('mailto:');
        return (
            <a className={`${cls} link`} href={seg.href} style={style}
               onClick={e => e.stopPropagation()}
               {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {text}
            </a>
        );
    }
    if (seg.cmd) {
        return (
            <button type="button" className={`${cls} cmd-chip`} style={style}
                    onClick={e => { e.stopPropagation(); onCmd(seg.cmd); }}>
                {text}
            </button>
        );
    }
    return <span className={cls} style={style}>{text}</span>;
}

function Line({ line, onCmd, isTyping }) {
    if (line.kind === 'input') {
        return (
            <div className="line input">
                <Prompt />
                <span className="typed">{line.text}</span>
            </div>
        );
    }
    let remaining = line.shown;
    const nodes = [];
    let indent = 0;
    for (let i = 0; i < line.segs.length && remaining > 0; i++) {
        const seg = line.segs[i];
        if (i === 0 && line.segs.length > 1 && seg.text && !seg.text.trim() && !seg.cls) {
            // leading spaces → hanging indent so wrapped text stays aligned
            indent = seg.text.length;
            remaining -= seg.text.length;
            continue;
        }
        const text = seg.text.slice(0, remaining);
        remaining -= text.length;
        nodes.push(<Segment key={i} seg={seg} text={text} onCmd={onCmd} />);
    }
    return (
        <div className={`line output${line.spinner ? ' loading' : ''}`}
             style={indent ? { paddingLeft: `${indent}ch` } : undefined}>
            {nodes}
            {line.spinner && <span className="spinner" aria-hidden="true" />}
            {isTyping && <span className="cursor typing" aria-hidden="true" />}
            {!nodes.length && !isTyping && '​'}
        </div>
    );
}

function Prompt() {
    return (
        <span className="prompt">
            <span className="p-user">{PROMPT_USER}</span>
            <span className="p-at">@</span>
            <span className="p-host">{PROMPT_HOST}</span>
            <span className="p-path">:~</span>
            <span className="p-sym">$</span>
        </span>
    );
}

export default function Terminal({ onActiveCommand, onThemeChange, theme, registerRunner }) {
    const [lines, setLines] = useState([]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [focused, setFocused] = useState(false);
    const [caret, setCaret] = useState(0);

    const inputRef = useRef(null);
    const outputRef = useRef(null);
    const linesRef = useRef(lines);
    linesRef.current = lines;

    const typing = lines.some(l => l.kind === 'output' && l.shown < l.len);

    // ── Typing loop ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!typing) return;
        const t = setInterval(() => {
            setLines(prev => {
                const i = prev.findIndex(l => l.kind === 'output' && l.shown < l.len);
                if (i === -1) return prev;
                const l = prev[i];
                const copy = prev.slice();
                copy[i] = l.wait > 0
                    ? { ...l, wait: l.wait - TICK }
                    : { ...l, shown: Math.min(l.len, l.shown + l.step) };
                return copy;
            });
        }, TICK);
        return () => clearInterval(t);
    }, [typing]);

    const flush = useCallback(() => {
        setLines(prev => prev.some(l => l.shown < l.len) ? prev.map(l => ({ ...l, shown: l.len, wait: 0 })) : prev);
    }, []);

    const append = useCallback((newLines) => setLines(prev => [...prev, ...newLines]), []);

    // ── Boot sequence ────────────────────────────────────────────────────────
    useEffect(() => {
        const boot = BOOT.map((l, i) => makeLine(l, { wait: i === 0 ? 150 : 120 }));
        const welcome = welcomeLines().map(l => makeLine(l));
        setLines([
            ...pace(boot, { targetMs: 450 }).map(l => ({ ...l, wait: l.wait || 120 })),
            ...pace(welcome, { targetMs: 900, firstWait: 200 }),
        ]);
    }, []);

    // Programmatic input changes (history, Tab) put the caret at the end.
    useEffect(() => {
        const el = inputRef.current;
        if (el && document.activeElement === el && el.selectionStart === el.value.length) setCaret(input.length);
        else if (el && document.activeElement !== el) setCaret(input.length);
    }, [input]);

    // ── Auto-scroll ──────────────────────────────────────────────────────────
    useEffect(() => {
        const el = outputRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [lines, input]);

    // ── Run a command ────────────────────────────────────────────────────────
    const runCommand = useCallback((raw) => {
        const trimmed = raw.trim();
        flush();
        if (!trimmed) {
            append([{ id: nextId++, kind: 'input', text: '' }]);
            return;
        }

        setHistory(prev => (prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed]));
        setHistoryIndex(-1);

        const name = trimmed.split(/\s+/)[0].toLowerCase();
        onActiveCommand?.(COMMANDS.includes(name) ? name : null);

        const result = commandHandler(trimmed, { history: [...history, trimmed], theme });

        if (result.clear) {
            setLines([]);
            return;
        }

        const inputLine = { id: nextId++, kind: 'input', text: trimmed };

        if (result.theme) onThemeChange?.(result.theme);
        if (result.openUrl) window.open(result.openUrl, '_blank', 'noopener,noreferrer');

        if (result.async) {
            const loader = makeLine([{ text: result.loading, cls: 'muted' }], { spinner: true });
            loader.shown = loader.len;
            append([inputLine, loader]);
            result.async()
                .then(out => out.map(l => makeLine(l)))
                .catch(() => [
                    [{ text: "Couldn't reach GitHub right now (rate-limited or offline).", cls: 'warn' }],
                    ['Browse everything directly at ', { text: 'github.com/pavan-kumar-v-pkv', href: PROFILE.github }],
                ].map(l => makeLine(l)))
                .then(out => {
                    const paced = pace(out);
                    setLines(prev => {
                        const i = prev.findIndex(l => l.id === loader.id);
                        if (i === -1) return [...prev, ...paced];
                        return [...prev.slice(0, i), ...paced, ...prev.slice(i + 1)];
                    });
                });
            return;
        }

        append([inputLine, ...pace((result.output || []).map(l => makeLine(l)))]);
    }, [append, flush, history, onActiveCommand, onThemeChange, theme]);

    // Let the header trigger commands.
    useEffect(() => {
        registerRunner?.((cmd) => {
            runCommand(cmd);
            inputRef.current?.focus({ preventScroll: true });
        });
    }, [registerRunner, runCommand]);

    // Focus the prompt on load — only with a real keyboard, so phones don't pop the on-screen keyboard.
    useEffect(() => {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) inputRef.current?.focus({ preventScroll: true });
    }, []);

    // Any keypress while output is typing skips the animation; typing anywhere focuses the prompt.
    useEffect(() => {
        const onKey = (e) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (linesRef.current.some(l => l.shown < l.len)) flush();
            const el = inputRef.current;
            const tag = document.activeElement?.tagName;
            if (el && document.activeElement !== el && e.key.length === 1 && tag !== 'INPUT' && tag !== 'TEXTAREA') {
                el.focus({ preventScroll: true });
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [flush]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!history.length) return;
            const i = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
            setHistoryIndex(i);
            setInput(history[i]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex === -1) return;
            const i = historyIndex + 1;
            if (i >= history.length) { setHistoryIndex(-1); setInput(''); }
            else { setHistoryIndex(i); setInput(history[i]); }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const v = input.trim().toLowerCase();
            if (!v || v.includes(' ')) return;
            const matches = COMMANDS.filter(c => c.startsWith(v));
            if (matches.length === 1) setInput(matches[0] + ' ');
            else if (matches.length > 1) {
                const list = makeLine(matches.flatMap((m, i) => [...(i ? ['  '] : []), { text: m, cmd: m }]));
                append([{ id: nextId++, kind: 'input', text: input }, { ...list, shown: list.len }]);
            }
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setLines([]);
        } else if (e.key === 'c' && e.ctrlKey && !window.getSelection()?.toString()) {
            e.preventDefault();
            flush();
            append([{ id: nextId++, kind: 'input', text: input + '^C' }]);
            setInput('');
        }
    };

    const lastTypingId = typing ? lines.find(l => l.kind === 'output' && l.shown < l.len)?.id : null;

    return (
        <section className="terminal-window" aria-label="Interactive terminal">
            <div className="terminal-chrome">
                <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                <span className="chrome-title">{PROMPT_USER}@{PROMPT_HOST}: ~</span>
                <span className="chrome-hint">{typing ? 'press any key to skip' : ''}</span>
            </div>

            <div
                className="terminal-output"
                ref={outputRef}
                onClick={() => {
                    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
                    if (typing) flush();
                }}
                role="log"
                aria-live="polite"
            >
                {lines.map(l => (
                    <Line key={l.id} line={l} onCmd={(c) => { runCommand(c); inputRef.current?.focus({ preventScroll: true }); }} isTyping={l.id === lastTypingId} />
                ))}

                <form
                    className={`line input prompt-line${typing ? ' is-hidden' : ''}`}
                    onSubmit={(e) => { e.preventDefault(); runCommand(input); setInput(''); }}
                >
                    <Prompt />
                    <span className="input-wrap">
                        <span className="input-mirror" aria-hidden="true">
                            {input.slice(0, caret)}
                            <span className={`cursor block${focused ? '' : ' idle'}`}>{input[caret] ?? ' '}</span>
                            {input.slice(caret + 1)}
                        </span>
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => { setInput(e.target.value); setCaret(e.target.selectionStart ?? e.target.value.length); }}
                            onSelect={(e) => setCaret(e.target.selectionStart ?? 0)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            aria-label="Terminal input"
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck="false"
                            enterKeyHint="send"
                        />
                    </span>
                </form>
            </div>
        </section>
    );
}
