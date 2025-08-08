import React, { useEffect, useRef, useState } from 'react'; // import React library and hooks used in the component
import commandHandler from '../utils/commandHandler'; // import command handler utility
import "../styles/terminal.css"; // import terminal styles

export default function Terminal() {
    // Create a ref for the terminal input
    const [lines, setLines] = useState([
        { type: "output", text: "Welcome! Type 'help' and press Enter to see available commands." }
    ]);
    const [input, setInput] = useState(""); // State to hold the current input
    const inputRef = useRef(null); // Ref to focus on the input field
    const outputRef = useRef(null); // Ref to the terminal output area
    const [history, setHistory] = useState([]); // State to hold command history
    const [historyIndex, setHistoryIndex] = useState(-1); // Index for navigating command history

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
            setLines(result.output?.map(t => ({ type: "output", text: t })) || []); // Clear the terminal output if specified
        }
        else{
            pushTypedLines(result.output || ["No output"]);
        }
    }

    function pushTypedLines(linesToType = [], speed = 18) {
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
            outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight,  behavior: "smooth" }); // Scroll to the bottom of the output area
        }, [lines.length]); // Scroll whenever the number of lines changes

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        runCommand(input); // Run the command entered in the input field
        setInput(""); // Clear the input field after submission
    }

    return (
        <div className="terminal" onClick={() => inputRef.current?.focus()}>
            <div className="terminal-output" ref={outputRef}>
                {lines.map((l, i) => (
                    <div key={i} className={`line ${l.type}`}>
                        {l.type === "input" && <span className="prompt">&gt;</span>}
                        <span className="text">{l.text}</span>
                    </div>
                ))}
            </div>

            <form className='terminal-input' onSubmit={handleSubmit}>
                <span className="prompt">&gt;</span>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)} // Update input state on change
                    aria-label="Terminal input"
                    autoComplete="off"
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
                                    ? history.length - 1
                                    : Math.min(history.length - 1, historyIndex + 1);
                                setHistoryIndex(newIndex);
                                setInput(history[newIndex] || "");
                            }
                        }
                    }}
                />
            </form>
        </div>
    );
}