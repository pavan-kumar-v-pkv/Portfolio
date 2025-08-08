import React from 'react';
import '../styles/header.css';

export default function Header({ onCommandClick }) {
    const commands = ['help', 'about', 'projects', 'skills', 'experience', 'contact', 'education', 'sudo', 'clear'];

    return (
        <header className="portfolio-header">
            <div className="header-content">
                <div className="header-title">
                    <h1>Pavan Kumar V</h1>
                    <p>Software Engineer</p>
                </div>
                <nav className="header-nav">
                    {commands.map((cmd, index) => (
                        <React.Fragment key={cmd}>
                            <button 
                                className="nav-link"
                                onClick={() => onCommandClick(cmd)}
                            >
                                {cmd}
                            </button>
                            {index < commands.length - 1 && <span className="nav-separator"> | </span>}
                        </React.Fragment>
                    ))}
                </nav>
            </div>
        </header>
    );
}
