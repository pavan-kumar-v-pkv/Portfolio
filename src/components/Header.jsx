import { PROFILE } from '../utils/commandHandler';
import '../styles/header.css';

const NAV = ['help', 'about', 'projects', 'skills', 'experience', 'education', 'contact', 'resume'];

export default function Header({ onCommandClick, active }) {
    return (
        <header className="portfolio-header">
            <div className="header-title">
                <span className="logo" aria-hidden="true">&gt;_</span>
                <div>
                    <h1>{PROFILE.name}</h1>
                    <p>{PROFILE.role}</p>
                </div>
            </div>
            <nav className="header-nav" aria-label="Commands">
                {NAV.map(cmd => (
                    <button
                        key={cmd}
                        className={`nav-link${active === cmd ? ' active' : ''}`}
                        aria-current={active === cmd ? 'true' : undefined}
                        onClick={() => onCommandClick(cmd)}
                    >
                        {cmd}
                    </button>
                ))}
            </nav>
        </header>
    );
}
