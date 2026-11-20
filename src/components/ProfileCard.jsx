import { useEffect, useRef } from 'react';
import { PROFILE } from '../utils/commandHandler';
import '../styles/profileCard.css';

const Icon = {
    github: (
        <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
    ),
    linkedin: (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>
    ),
    mail: (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm18 2-10 7L2 6"/></svg>
    ),
    file: (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M8 13h8M8 17h5"/></svg>
    ),
};

const SOCIALS = [
    { label: 'GitHub', href: PROFILE.github, icon: Icon.github },
    { label: 'LinkedIn', href: PROFILE.linkedin, icon: Icon.linkedin },
    { label: 'Email', href: `mailto:${PROFILE.email}`, icon: Icon.mail },
    { label: 'Resume', href: PROFILE.resume, icon: Icon.file },
];

/**
 * Tilt card with spring-smoothed rotation and a glare that follows the cursor.
 * Animation runs in rAF and writes CSS variables directly, so React never re-renders on mousemove.
 */
export default function ProfileCard() {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (reduce || !fine) return;

        const target = { rx: 0, ry: 0, gx: 50, gy: 50, s: 1 };
        const cur = { ...target };
        let raf = 0;
        let running = false;

        const loop = () => {
            let moving = false;
            for (const k of Object.keys(cur)) {
                const d = target[k] - cur[k];
                cur[k] += d * 0.12;
                if (Math.abs(d) > 0.01) moving = true;
            }
            card.style.setProperty('--rx', `${cur.rx}deg`);
            card.style.setProperty('--ry', `${cur.ry}deg`);
            card.style.setProperty('--gx', `${cur.gx}%`);
            card.style.setProperty('--gy', `${cur.gy}%`);
            card.style.setProperty('--s', cur.s);
            if (moving) raf = requestAnimationFrame(loop);
            else running = false;
        };
        const kick = () => { if (!running) { running = true; raf = requestAnimationFrame(loop); } };

        const onMove = (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            target.ry = (px - 0.5) * 16;
            target.rx = (0.5 - py) * 16;
            target.gx = px * 100;
            target.gy = py * 100;
            target.s = 1.025;
            kick();
        };
        const onLeave = () => {
            Object.assign(target, { rx: 0, ry: 0, gx: 50, gy: 50, s: 1 });
            card.classList.remove('is-hover');
            kick();
        };
        const onEnter = () => card.classList.add('is-hover');

        card.addEventListener('pointermove', onMove);
        card.addEventListener('pointerleave', onLeave);
        card.addEventListener('pointerenter', onEnter);
        return () => {
            cancelAnimationFrame(raf);
            card.removeEventListener('pointermove', onMove);
            card.removeEventListener('pointerleave', onLeave);
            card.removeEventListener('pointerenter', onEnter);
        };
    }, []);

    return (
        <div className="profile-stage">
            <article className="profile-card" ref={cardRef}>
                <div className="profile-card-inner">
                    <div className="avatar">
                        <img src="/profile-image.jpeg" alt={PROFILE.name} width="260" height="260" decoding="async" />
                        <span className="avatar-ring" aria-hidden="true" />
                    </div>

                    <div className="profile-info">
                        <span className="status"><span className="status-dot" />Open to opportunities</span>
                        <h2>{PROFILE.name}</h2>
                        <p className="role">{PROFILE.role}</p>
                        <ul className="tags" aria-label="Focus areas">
                            <li>Python</li><li>GenAI</li><li>RAG</li><li>FastAPI</li>
                        </ul>
                        <nav className="socials" aria-label="Links">
                            {SOCIALS.map(s => (
                                <a key={s.label} href={s.href} aria-label={s.label} title={s.label}
                                   {...(s.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}>
                                    {s.icon}
                                </a>
                            ))}
                        </nav>
                    </div>
                    <div className="glare" aria-hidden="true" />
                </div>
            </article>
        </div>
    );
}
