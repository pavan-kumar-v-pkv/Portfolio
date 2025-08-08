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

    useEffect(() => { inputRef.current?.focus(); }, []); //Focus the input field on component mount

    function runCommand(cmd) {
        const trimmed = cmd.trim(); // Trim whitespace from the command
        if (!trimmed) return; // If the command is empty, do nothing
        // show the entered command 
        setLines(prev => [...prev, { type: "input", text: trimmed }]); // Add the command to the terminal output
        const result = commandHandler(trimmed); // Process the command using the command handler
        if(result.clear) {
            setLines(result.output?.map(t => ({ type: "output", text: t })) || []); // Clear the terminal output if specified
        }
        else{
            setLines(prev => [
                ...prev,
                ...(result.output || [{ text: "No output" }]).map(t => ({type: "output", text: t }))
            ]);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        runCommand(input); // Run the command entered in the input field
        setInput(""); // Clear the input field after submission
    }

    return (
        <div className="terminal" onClick={() => inputRef.current?.focus()}>
            <div className="terminal-output">
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
                />
            </form>
        </div>
    );
}