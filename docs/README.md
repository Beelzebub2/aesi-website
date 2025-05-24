# AESI Website Documentation

## 📚 Overview

AESI (Aprender Estatística e Investigação) is an interactive educational platform in Portuguese focused on probability and statistics. The platform provides engaging quizzes, calculators, and learning resources with a modern, responsive design.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Flask framework
- Modern web browser

### Installation
1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Run the application: `python app.py`
4. Open `http://localhost:5000` in your browser

## 📁 Project Structure

```
aesi-website/
├── app.py                          # Main Flask application
├── requirements.txt                # Python dependencies
├── docs/                          # Documentation (this directory)
│   ├── README.md                  # Main documentation
│   ├── api/                       # API documentation
│   ├── components/                # Component documentation
│   ├── guides/                    # Development guides
│   └── ui-reference/              # UI component reference
├── static/                        # Static assets
│   ├── css/                       # Stylesheets
│   │   ├── general/               # Global styles
│   │   └── subjects/              # Subject-specific styles
│   ├── js/                        # JavaScript files
│   │   ├── general/               # Global scripts
│   │   └── subjects/              # Subject-specific scripts
│   ├── images/                    # Image assets
│   └── quizzes/                   # Quiz data (JSON)
├── templates/                     # HTML templates
│   ├── base.html                  # Base template
│   ├── general/                   # General pages
│   └── subjects/                  # Subject-specific pages
├── translations/                  # Internationalization
│   └── pt_PT.json                # Portuguese translations
└── utils/                         # Utility modules
    └── translations.py            # Translation management
```

## 🎯 Core Features

### 🧮 Interactive Quizzes
- **Dynamic Question Pool**: Questions are randomized from a larger set
- **Double-Shuffle Algorithm**: Answer options are shuffled both at load time and display time
- **Smart Answer Tracking**: Correct answers tracked by content, not position
- **Rich Feedback System**: Detailed explanations for both correct and incorrect answers
- **Progress Tracking**: Visual progress bars and score tracking
- **Responsive Design**: Optimized for both desktop and mobile

### 📊 Educational Calculators
- **Probability Distributions**: Normal, Binomial, Poisson distributions
- **Interactive Charts**: Real-time visualization using Chart.js
- **Theme-Aware Visualizations**: Charts adapt to light/dark themes
- **Parameter Input Validation**: Real-time input validation and error handling

### 🎨 Theme System
- **Dual Theme Support**: Light and dark modes
- **Persistent Preferences**: Theme choice saved in localStorage
- **Smooth Transitions**: Animated theme switching
- **Component Consistency**: All UI elements respect theme selection

## 🔧 Technical Architecture

### Frontend Stack
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern features including Grid, Flexbox, and CSS Variables
- **JavaScript ES6+**: Modern JavaScript with async/await patterns
- **Chart.js**: Data visualization library
- **Font Awesome**: Icon library

### Backend Stack
- **Flask**: Lightweight Python web framework
- **Jinja2**: Template engine for dynamic content
- **JSON**: Data storage for quizzes and translations

### Design Patterns
- **Component-Based Architecture**: Reusable UI components
- **Mobile-First Design**: Responsive design principles
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility-First**: WCAG 2.1 compliance

## 📖 Documentation Sections

- [**API Reference**](./api/) - Backend API documentation
- [**Component Guide**](./components/) - UI component documentation
- [**Development Guide**](./guides/) - Setup and development workflows
- [**UI Reference**](./ui-reference/) - Design system and styling guide

## 🤝 Contributing

Please refer to our [Development Guide](./guides/development.md) for information on:
- Code style guidelines
- Testing procedures
- Pull request process
- Issue reporting

## 📞 Support

For questions or support, please refer to the documentation sections above or create an issue in the repository.
