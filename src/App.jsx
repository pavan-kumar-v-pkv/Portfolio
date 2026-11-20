import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileCard from './components/ProfileCard';
import Background from './components/Background';
import Terminal from './components/Terminal';

function loadTheme() {
    try { return localStorage.getItem('theme') || 'blue'; } catch { return 'blue'; }
}

export default function App() {
    const [active, setActive] = useState(null);
    const [theme, setTheme] = useState(loadTheme);
    const runnerRef = useRef(null);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        try { localStorage.setItem('theme', theme); } catch { /* ignore */ }
    }, [theme]);

    const registerRunner = useCallback((fn) => { runnerRef.current = fn; }, []);

    return (
        <div className="portfolio-container">
            <Header active={active} onCommandClick={(cmd) => runnerRef.current?.(cmd)} />
            <main className="main-content">
                <aside className="left-panel">
                    <Background />
                    <div className="spotlight" aria-hidden="true" />
                    <ProfileCard />
                </aside>
                <div className="right-panel">
                    <Terminal
                        theme={theme}
                        onThemeChange={setTheme}
                        onActiveCommand={setActive}
                        registerRunner={registerRunner}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
}
