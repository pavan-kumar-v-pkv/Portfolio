import React, { useState, useEffect } from 'react';
import '../styles/footer.css';

export default function Footer() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric', 
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    return (
        <footer className="portfolio-footer">
            <div className="footer-content">
                <div className="footer-left">
                    <span className="prompt-indicator">pavan@portfolio:~$</span>
                </div>
                <div className="footer-right">
                    <span className="live-clock">{formatTime(currentTime)}</span>
                </div>
            </div>
        </footer>
    );
}
