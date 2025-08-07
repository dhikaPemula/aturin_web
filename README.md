# Aturin Web

A modern web application for productivity and task management built with React and Vite.

## Description

Aturin Web is a comprehensive productivity platform that helps users manage their daily activities, set sleep schedules, and organize tasks efficiently. The application features an intuitive user interface with customizable preferences, activity tracking, and smart scheduling capabilities to enhance personal productivity.

## Features

- **User Preference Configuration** - Multi-step onboarding with sleep schedule setup, focus period selection, activity prioritization, and frequency targeting
- **Interactive Task Management** - Create, organize, and track tasks with drag-and-drop functionality
- **Activity Tracking** - Monitor and categorize different types of activities
- **Responsive Design** - Fully responsive UI that works across all device sizes
- **Modern UI Components** - Clean, accessible interface with smooth animations and transitions
- **Toast Notifications** - Real-time feedback and notifications for user actions
- **Icon Integration** - Comprehensive icon system using React Icons and Lucide React

## Tech Stack

- **Frontend Framework:** React 19.1.0
- **Build Tool:** Vite 6.3.5
- **Styling:** Tailwind CSS 4.1.10
- **UI Components:** Custom components with CSS modules
- **Icons:** React Icons 5.5.0, Lucide React 0.523.0
- **Animations:** GSAP 3.13.0
- **Drag & Drop:** @dnd-kit suite, @hello-pangea/dnd
- **HTTP Client:** Axios 1.10.0
- **Routing:** React Router DOM 7.6.3
- **Notifications:** React Toastify 11.0.5
- **Linting:** ESLint 9.25.0
- **Package Manager:** npm/yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhikaPemula/aturin_web.git
   cd aturin_web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see Environment Variables section below)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production** (optional)
   ```bash
   npm run build
   ```

## Usage

### Development Mode
```bash
npm run dev
```
Starts the development server on `http://localhost:5173` (default Vite port)

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist` folder

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing

### Code Linting
```bash
npm run lint
```
Runs ESLint to check for code quality and consistency

### Key Features Usage

1. **User Preferences Setup:**
   - Navigate through the multi-step preference modal
   - Configure sleep periods (night/day)
   - Select focus periods (morning, afternoon, evening, night)
   - Choose activity priorities
   - Set target frequencies

2. **Task Management:**
   - Create and organize tasks
   - Use drag-and-drop to reorder items
   - Track activity progress

3. **Responsive Design:**
   - Access the application on any device
   - Optimized layouts for mobile, tablet, and desktop

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=your_api_base_url
VITE_API_KEY=your_api_key

# Application Configuration
VITE_APP_NAME=Aturin Web
VITE_APP_VERSION=0.0.0

# Development Configuration
VITE_DEV_MODE=true
```

**Required Variables:**
- `VITE_API_BASE_URL` - Base URL for your backend API
- `VITE_API_KEY` - API key for authentication (if required)

**Optional Variables:**
- `VITE_APP_NAME` - Application name for branding
- `VITE_APP_VERSION` - Application version
- `VITE_DEV_MODE` - Enable/disable development features

## Project Structure

```
aturin_web/
├── public/
│   ├── assets/
│   │   ├── user_preference/    # User preference modal assets
│   │   ├── home/              # Home page assets
│   │   ├── icons/             # General icons
│   │   └── ...
│   └── vite.svg
├── src/
│   ├── assets/                # Static assets
│   ├── core/                  # Core functionality
│   │   ├── auth/             # Authentication
│   │   ├── context/          # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utility libraries
│   │   ├── models/           # Data models
│   │   ├── services/         # API services
│   │   ├── utils/            # Utility functions
│   │   └── widgets/          # Reusable widgets
│   ├── features/             # Feature modules
│   │   ├── activity/         # Activity management
│   │   ├── auth/             # Authentication features
│   │   ├── home_page/        # Home page
│   │   ├── landing_page/     # Landing page
│   │   ├── task_page/        # Task management
│   │   └── user_preference/  # User preferences
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── eslint.config.js
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Contributing

We welcome contributions to Aturin Web! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add appropriate comments
   - Update documentation if needed
4. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Development Guidelines

- Use modern React patterns (hooks, functional components)
- Follow Tailwind CSS conventions for styling
- Maintain responsive design principles
- Write clean, documented code
- Test thoroughly across different devices and browsers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits / Author Info

**Development Team:**
- **Repository Owner:** [dhikaPemula](https://github.com/dhikaPemula)

**Technologies & Libraries:**
- Built with [React](https://reactjs.org/)
- Powered by [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [React Icons](https://react-icons.github.io/react-icons/) and [Lucide](https://lucide.dev/)

---

## Support

If you encounter any issues or have questions, please:
1. Check the existing [Issues](https://github.com/dhikaPemula/aturin_web/issues)
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

## Changelog

### Version 0.0.0
- Initial project setup
- User preference configuration system
- Basic task management functionality
- Responsive design implementation
- Multi-step modal system

---

**Made with ❤️ for better productivity**
