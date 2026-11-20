import { useEffect, useState } from 'react';
import '../styles/footer.css';

export default function Footer() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <footer className="portfolio-footer">
            <span className="footer-status"><span className="pulse" />online</span>
            <span className="footer-hints">
                <kbd>Tab</kbd> complete <kbd>↑</kbd><kbd>↓</kbd> history <kbd>Ctrl</kbd>+<kbd>L</kbd> clear
            </span>
            <time className="live-clock" dateTime={now.toISOString()}>
                {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </time>
        </footer>
    );
}
