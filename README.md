# Pavan Kumar V - Interactive Terminal Portfolio

A modern, interactive terminal-style portfolio built with React and Vite. Experience my professional journey through a unique command-line interface with real-time GitHub integration and AI assistance.

## 🚀 Features

### Core Terminal Experience
- **Interactive Terminal Interface**: Navigate through my portfolio using familiar command-line commands
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Typing Animation**: Realistic terminal typing effects with customizable speed
- **Command History**: Use arrow keys to navigate through command history
- **Real Terminal Behavior**: Fixed input at bottom, scrolling output area

### Advanced Features
- **GitHub API Integration**: Live project data fetched from GitHub with clickable links
- **AI Assistant**: Ask questions about my background, skills, and experience
- **Clickable Links**: All URLs are clickable and open in new tabs
- **Profile Card**: Clean, hoverable profile display with responsive design
- **Professional Navigation**: Header with direct access to key sections

### Technical Excellence
- **Component Architecture**: Modular React components for maintainability
- **Error Handling**: Graceful fallbacks for API failures
- **Performance Optimized**: Lightweight and fast loading
- **Modern CSS**: Flexbox layouts with smooth animations

## 🛠️ Available Commands

### Essential Commands
- `help` - Show all available commands with descriptions
- `about` - Learn about my background and expertise
- `projects` - View my latest GitHub projects (live data)
- `skills` - See my technical skills and technologies
- `experience` - Browse my work experience and achievements
- `education` - Check my educational background
- `contact` - Get my contact information with clickable links
- `resume` - View/download my resume
- `clear` - Clear the terminal output

### Fun Commands
- `sudo` - Try it for a surprise! 😉
- `ls` - List available "files"
- `pwd` - Print working directory
- `whoami` - Display user information
- `certifications` - View my certifications and courses

### AI Assistant
- `ai <question>` - Ask AI about my background, skills, or experience
- Examples:
  - `ai What technologies does Pavan work with?`
  - `ai Tell me about his experience at HPE`
  - `ai What projects has he built?`

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pavan-kumar-v-pkv/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Built With

### Frontend Technologies
- **React 18** - Modern frontend framework with hooks
- **Vite** - Fast build tool and development server
- **CSS3** - Advanced styling with custom properties and flexbox
- **JavaScript ES6+** - Modern JavaScript features

### APIs & Integration
- **GitHub API** - Live project data fetching
- **Fetch API** - Modern HTTP client for data requests

### Architecture
- **Component-based Design** - Modular and reusable React components
- **Custom Hooks** - Efficient state management
- **Responsive Design** - Mobile-first approach with CSS Grid/Flexbox

## 📁 Project Structure

```
src/
├── components/
│   ├── Terminal.jsx          # Main terminal component with command handling
│   ├── Header.jsx            # Navigation header component
│   ├── Footer.jsx            # Footer component
│   └── ProfileCard.jsx       # Profile display card
├── utils/
│   ├── commandHandler.js     # Command processing and routing logic
│   ├── githubApi.js          # GitHub API integration
│   └── aiAssistant.js        # AI query processing
├── styles/
│   ├── terminal.css          # Terminal styling and animations
│   ├── header.css            # Header component styles
│   ├── footer.css            # Footer component styles
│   └── profileCard.css       # Profile card styles
├── App.jsx                   # Root component
└── main.jsx                  # Application entry point
```

## 🎨 Customization

### Adding New Commands

Edit `src/utils/commandHandler.js` to add new commands:

```javascript
case "newcommand":
    return {
        output: [
            "Your command output here",
            "Multiple lines supported",
            "HTML links: <a href='https://example.com' target='_blank'>Click me</a>"
        ]
    };
```

### Adding Async Commands (API Integration)

For commands that fetch data:

```javascript
case "asynccommand":
    return {
        output: ["🔄 Loading..."],
        async: true,
        asyncHandler: async () => {
            const data = await fetchSomeData();
            return formatData(data);
        }
    };
```

### Updating Personal Information

Update the constants in `commandHandler.js`:

```javascript
const YOUR_EMAIL = "your-email@example.com";
const GITHUB = "https://github.com/yourusername";
const LINKEDIN = "https://linkedin.com/in/yourprofile";
const RESUME = "https://your-resume-link.com";
```

### GitHub Integration

Update your GitHub username in `src/utils/githubApi.js`:

```javascript
const GITHUB_USERNAME = 'your-github-username';
```

### Styling Customization

Modify component CSS files to customize appearance:

- **Colors**: Update CSS custom properties in respective CSS files
- **Fonts**: Change the `font-family` in component styles
- **Animations**: Adjust timing and effects in CSS transitions
- **Layout**: Modify flexbox and grid properties for different layouts

### AI Assistant Customization

Update knowledge base in `src/utils/aiAssistant.js`:

```javascript
const knowledge = {
    personal: {
        name: "Your Name",
        title: "Your Title",
        // ... add your information
    }
};
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build files will be generated in the `dist` directory.

### Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on every push to main branch

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

## 🌟 Features Showcase

### Real-time GitHub Integration
- Fetches live project data from GitHub API
- Displays project descriptions, languages, stars, and forks
- Clickable project links that open in new tabs
- Graceful fallback for API failures

### AI Assistant
- Context-aware responses about my background
- Handles various question formats
- Provides helpful suggestions and examples
- Maintains conversation context

### Professional Design
- Clean, modern terminal interface
- Smooth typing animations
- Responsive layout for all devices
- Professional color scheme with hover effects

## 🔧 Development

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Git for version control

### Local Development

1. Clone and install:
```bash
git clone https://github.com/pavan-kumar-v-pkv/portfolio.git
cd portfolio
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/pavan-kumar-v-pkv/portfolio/issues).

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Inspired by classic terminal interfaces
- Built with modern web technologies
- Thanks to the open-source community for the tools and libraries

## 📈 Future Enhancements

- [ ] Theme customization options
- [ ] More interactive animations
- [ ] Additional AI capabilities
- [ ] Blog integration
- [ ] Project filtering and search
- [ ] Command auto-completion
- [ ] Terminal session persistence

## 📞 Contact

**Pavan Kumar V**
- Email: [pkvstarscream@gmail.com](mailto:pkvstarscream@gmail.com)
- GitHub: [pavan-kumar-v-pkv](https://github.com/pavan-kumar-v-pkv)
- LinkedIn: [pavan-kumar-v-53881524b](https://www.linkedin.com/in/pavan-kumar-v-53881524b/)

**Project Link**: [https://github.com/pavan-kumar-v-pkv/portfolio](https://github.com/pavan-kumar-v-pkv/portfolio)

---

⭐ **Star this repository if you found it helpful!** ⭐

*Built with ❤️ by Pavan Kumar V*
