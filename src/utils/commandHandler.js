const YOUR_EMAIL = "pkvstarscream@gmail.com";
const GITHUB = "https://github.com/pavan-kumar-v-pkv";

export default function commandHandler(raw) {
    const parts = raw.trim().split(" "); // Split the command into parts
    const cmd = parts[0].toLowerCase(); // Get the command in lowercase
    const arg = parts.slice(1).join(" "); // Get the arguments after the command

    switch (cmd) {
        case "help":
            return {
                output: [
                    "Available commands:",
                    "help - Show this help message",
                    "clear - Clear the screen",
                    "about - Short bio",
                    "projects - List top projects",
                    "contact - Contact information",
                ]
            };
        case "about":
            return { output: ["Hi - I'm Pavan Kumar V. I'm a developer interested in web development, AI, and open source."] };
        case "projects":
            return {
                output: [
                    "Top Projects:",
                    "1) MyOwnCloud - Dropbox-like cloud storage system",
                    "Visit my GitHub for more projects: " + GITHUB
                ]
            };
        case "contact":
            return {
                output: ["Email: " + YOUR_EMAIL, "GitHub: " + GITHUB]
            };
        case "clear":
            return { clear: true, output: [] }; // Indicate that the terminal should be cleared
        default:
            return {
                output: [`Command not found: ${cmd}`, "Type 'help' for available commands."]
            };
    }
}