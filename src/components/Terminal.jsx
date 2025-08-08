import React, { useEffect, useRef, useState } from 'react'; // import React library and hooks used in the component
import commandHandler from '../utils/commandHandler'; // import command handler utility
import Header from './Header';
import Footer from './Footer';
import ProfileCard from './ProfileCard';
import "../styles/terminal.css"; // import terminal styles

export default function Terminal() {
    const [lines, setLines] = useState([
        { type: "output", text: "Welcome to Pavan Kumar V's Interactive Portfolio Terminal!" },
        { type: "output", text: "" },
        { type: "output", text: "Type 'help' and press Enter to see available commands." }
    ]);
    const [input, setInput] = useState(""); // State to hold the current input
    const inputRef = useRef(null); // Ref to focus on the input field
    const outputRef = useRef(null); // Ref to the terminal output area
    const [history, setHistory] = useState([]); // State to hold command history
    const [historyIndex, setHistoryIndex] = useState(-1); // Index for navigating command history

    useEffect(() => {
        document.documentElement.className = "dark"; // Set the document's class name to dark theme
    }, []); // Effect to set dark theme on mount

    useEffect(() => { inputRef.current?.focus(); }, []); //Focus the input field on component mount

    function runCommand(cmd) {
        const trimmed = cmd.trim(); // Trim whitespace from the command
        if (!trimmed) return; // If the command is empty, do nothing
        setHistory(prev => [...prev, trimmed]); // Add the command to history
        setHistoryIndex(-1); // Reset history index
        // show the entered command 
        setLines(prev => [...prev, { type: "input", text: trimmed }]); // Add the command to the terminal output
        const result = commandHandler(trimmed); // Process the command using the command handler
        
        if (result.clear) {
            setLines([
                { type: "output", text: "Welcome to Pavan Kumar V's Interactive Portfolio Terminal!" },
                { type: "output", text: "" },
                { type: "output", text: "Type 'help' and press Enter to see available commands." }
            ]); // Reset to welcome message when clearing
        } else if (result.async && result.asyncHandler) {
            // Handle async commands (like GitHub API calls)
            pushTypedLines(result.output || ["Loading..."]);
            
            result.asyncHandler().then(asyncOutput => {
                // Replace the loading message with actual data
                setLines(prev => {
                    const newLines = [...prev];
                    // Remove the loading lines and add the real output
                    const inputIndex = newLines.findLastIndex(line => line.type === "input" && line.text === trimmed);
                    if (inputIndex !== -1) {
                        // Remove everything after the input command
                        newLines.splice(inputIndex + 1);
                        // Add the real output
                        asyncOutput.forEach(line => {
                            newLines.push({ type: "output", text: line });
                        });
                    }
                    return newLines;
                });
            }).catch(error => {
                console.error('Async command error:', error);
                setLines(prev => [...prev, { type: "output", text: "❌ Error loading data. Please try again." }]);
            });
        } else {
            pushTypedLines(result.output || ["No output"]);
        }
    }

    function pushTypedLines(linesToType = [], speed = 15) {
        (async () => {
            for (const line of linesToType) {
                setLines(prev => [...prev, { type: "output", text: "" }]);
                for (let i=1;i<=line.length;i++) {
                    setLines(prev => {
                        const copy = [...prev];
                        copy[copy.length - 1] = { type: "output", text: line.slice(0, i) };
                        return copy;
                    });
                    await new Promise(resolve => setTimeout(resolve, speed)); // Wait for the specified speed before typing the next character
                }
            }
        })();
    }

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [lines]); // Scroll whenever lines change (including during typing animation)

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        runCommand(input); // Run the command entered in the input field
        setInput(""); // Clear the input field after submission
    }

    const handleNavCommand = (command) => {
        runCommand(command);
        // Focus the input after running nav command
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    }

    return (
        <div className="portfolio-container">
            <Header onCommandClick={handleNavCommand} />
            
            <main className="portfolio-main">
                <div className="main-content">
                    {/* Left side - 3D Profile Card */}
                    <div className="left-panel">
                        <ProfileCard />
                    </div>
                    
                    {/* Right side - Terminal */}
                    <div className="right-panel">
                        <div className="terminal" onClick={() => inputRef.current?.focus()}>
                            <div className="terminal-output" ref={outputRef}>
                                {lines.map((l, i) => (
                                    <div key={i} className={`line ${l.type}`}>
                                        {l.type === "input" && <span className="prompt">pavan@portfolio:~$</span>}
                                        <span 
                                            className="text"
                                            dangerouslySetInnerHTML={{
                                                __html: l.text.replace(
                                                    /<a href="([^"]*)" target="_blank" rel="noopener noreferrer" style="([^"]*)">/g,
                                                    '<a href="$1" target="_blank" rel="noopener noreferrer" style="$2" onClick="event.stopPropagation();">'
                                                )
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <form className='terminal-input' onSubmit={handleSubmit}>
                                <span className="prompt">pavan@portfolio:~$</span>
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)} // Update input state on change
                                    aria-label="Terminal input"
                                    autoComplete="off"
                                    placeholder="Type a command..."
                                    onKeyDown={(e) => {
                                        if (e.key === "ArrowUp") {
                                            e.preventDefault();
                                            if (history.length > 0){
                                                // Navigate to the previous command in history
                                                const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
                                                setHistoryIndex(newIndex);
                                                setInput(history[newIndex] || "");
                                            }
                                        } else if (e.key === "ArrowDown") {
                                            e.preventDefault();
                                            if (history.length > 0) {
                                                const newIndex = historyIndex === -1
                                                    ? -1
                                                    : Math.min(history.length - 1, historyIndex + 1);
                                                setHistoryIndex(newIndex);
                                                setInput(newIndex === -1 ? "" : history[newIndex] || "");
                                            }
                                        }
                                    }}
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}