import { useEffect, useRef } from 'react';

/**
 * Drifting particle constellation that gently reacts to the cursor.
 * Pauses when the tab is hidden and renders a single static frame for reduced-motion users.
 */
export default function Background() {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = 0, h = 0, raf = 0;
        let particles = [];
        const mouse = { x: -9999, y: -9999 };

        const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '88, 166, 255';

        const resize = () => {
            const r = canvas.getBoundingClientRect();
            w = r.width; h = r.height;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.round(Math.min(70, (w * h) / 14000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 1.4 + 0.4,
            }));
        };

        const draw = () => {
            const rgb = accent();
            ctx.clearRect(0, 0, w, h);
            const LINK = 120;
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                if (!reduce) {
                    // soft repulsion from the cursor
                    const dx = p.x - mouse.x, dy = p.y - mouse.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 140 * 140 && d2 > 0) {
                        const f = (1 - Math.sqrt(d2) / 140) * 0.6;
                        p.x += (dx / Math.sqrt(d2)) * f;
                        p.y += (dy / Math.sqrt(d2)) * f;
                    }
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
                    if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
                }
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const d = Math.hypot(dx, dy);
                    if (d < LINK) {
                        ctx.strokeStyle = `rgba(${rgb}, ${(1 - d / LINK) * 0.18})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                    }
                }
                ctx.fillStyle = `rgba(${rgb}, 0.55)`;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            }
            if (!reduce && !document.hidden) raf = requestAnimationFrame(draw);
        };

        const onMove = (e) => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
            canvas.parentElement?.style.setProperty('--mx', `${mouse.x}px`);
            canvas.parentElement?.style.setProperty('--my', `${mouse.y}px`);
        };
        const onLeave = () => { mouse.x = mouse.y = -9999; };
        const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(draw); };

        resize();
        raf = requestAnimationFrame(draw);
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        const host = canvas.parentElement;
        host?.addEventListener('pointermove', onMove);
        host?.addEventListener('pointerleave', onLeave);
        document.addEventListener('visibilitychange', onVis);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            host?.removeEventListener('pointermove', onMove);
            host?.removeEventListener('pointerleave', onLeave);
            document.removeEventListener('visibilitychange', onVis);
        };
    }, []);

    return <canvas ref={ref} className="bg-canvas" aria-hidden="true" />;
}
