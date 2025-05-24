# 🎓 GitHub Copilot Instructions for AESI Website

## 🌟 Project Overview

**AESI** (Advanced Educational Statistics Interface) is a modern, interactive educational platform in Portuguese focused on probability and statistics. The platform features sophisticated quizzes, interactive calculators, and comprehensive learning resources with a beautiful, modern UI.

### 🎯 Core Philosophy
- **Educational Excellence**: Provide high-quality, interactive learning experiences
- **Modern Design**: Beautiful, responsive, and accessible user interfaces
- **Performance First**: Fast, optimized, and smooth user interactions
- **Code Quality**: Clean, maintainable, and well-documented code

## 🏗️ Project Architecture

### 📁 Backend Stack
- **Framework**: Flask (Python 3.11+)
- **Architecture**: MVC pattern with feature-based organization
- **APIs**: RESTful endpoints for quiz data and translations
- **Data**: JSON-based content management system

### 🎨 Frontend Stack
- **Styling**: Modern CSS with custom properties and advanced animations
- **JavaScript**: ES6+ with component-based architecture
- **Animations**: CSS transitions, transforms, and custom easing functions
- **Responsive**: Mobile-first design with progressive enhancement

### 📊 Key Features
- 🧠 **Interactive Quizzes**: Advanced randomization with beautiful animations
- 🧮 **Educational Calculators**: Interactive probability and statistics tools
- 📱 **Responsive Design**: Seamless experience across all devices
- 🌓 **Theme System**: Dark/light mode with smooth transitions
- 🌍 **Internationalization**: Portuguese-first with translation management
- ♿ **Accessibility**: WCAG 2.1 compliant with keyboard navigation

## 🎨 UI/UX Design System

### 🎭 Design Principles
1. **Modern Aesthetics**: Clean, minimalist design with subtle gradients and shadows
2. **Smooth Animations**: All interactions should feel responsive and delightful
3. **Accessibility First**: Every component must be usable by everyone
4. **Performance Optimized**: Animations should not impact performance

### 🎨 Color Palette & Theming
```css
/* Primary Brand Colors */
--primary: #667eea;
--secondary: #764ba2;
--accent: #f093fb;

/* Semantic Colors */
--success: #2ecc71;
--warning: #f39c12;
--error: #e74c3c;
--info: #3498db;

/* Enhanced Animations */
--animation-fast: 150ms;
--animation-normal: 300ms;
--animation-slow: 500ms;
--animation-extra-slow: 800ms;

/* Advanced Easing Functions */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 🎯 Animation Standards
- **Entrance**: Staggered fade-in with slight vertical movement
- **Hover Effects**: Subtle scale and shadow changes
- **State Changes**: Smooth color and size transitions
- **Loading**: Elegant spinners and progress indicators
- **Success/Error**: Bouncing and shaking feedback animations

## 💻 Development Guidelines

### 🔧 File Editing Policy
**CRITICAL**: Always edit existing files directly. Never create backup files, enhanced versions, or duplicate files.

#### ✅ Correct Approach:
```bash
# Edit the existing file directly
static/css/subjects/probabilidade/quiz.css
static/js/subjects/probabilidade/quiz.js
```

#### ❌ Incorrect Approach:
```bash
# DON'T create these:
static/css/subjects/probabilidade/quiz-enhanced.css
static/css/subjects/probabilidade/quiz-backup.css
static/js/subjects/probabilidade/quiz-new.js
```

### 🐍 Python Guidelines

#### Code Style
- **PEP 8 Compliance**: Strict adherence to Python style guidelines
- **Type Hints**: Use for all function parameters and return values
- **Docstrings**: Google-style docstrings for all functions and classes
- **Error Handling**: Comprehensive try-catch blocks with meaningful messages

#### Example:
```python
def get_quiz_data(subject: str) -> Dict[str, Any]:
    """
    Retrieves quiz data for a specific subject.
    
    Args:
        subject: The subject identifier (e.g., 'probabilidade')
        
    Returns:
        Dictionary containing quiz questions and metadata
        
    Raises:
        FileNotFoundError: If quiz file doesn't exist
        JSONDecodeError: If quiz file is malformed
    """
    try:
        quiz_path = os.path.join(app.static_folder, "quizzes", f"{subject}_quiz.json")
        with open(quiz_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        app.logger.error(f"Quiz file not found for subject: {subject}")
        raise
```

### 🚀 JavaScript Guidelines

#### Modern ES6+ Features
- **Arrow Functions**: For concise function expressions
- **Async/Await**: For all asynchronous operations
- **Destructuring**: For clean object and array manipulation
- **Template Literals**: For dynamic string creation
- **Modules**: Use import/export for code organization

#### Component Architecture
```javascript
class QuizManager {
    constructor(container, options = {}) {
        this.container = container;
        this.options = { ...this.defaultOptions, ...options };
        this.state = new QuizState();
        this.renderer = new QuestionRenderer(container);
        this.animator = new AnimationManager();
        this.initialize();
    }
    
    async initialize() {
        try {
            await this.loadQuestions();
            this.setupEventListeners();
            this.render();
        } catch (error) {
            this.handleError(error);
        }
    }
}
```

#### Animation Implementation
```javascript
// Use requestAnimationFrame for smooth animations
animateProgressBar(percentage) {
    const progressBar = this.container.querySelector('.progress-fill');
    const currentWidth = parseFloat(progressBar.style.width) || 0;
    
    this.animateValue(currentWidth, percentage, (value) => {
        progressBar.style.width = `${value}%`;
    });
}

animateValue(start, end, callback, duration = 500) {
    const startTime = performance.now();
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const value = start + (end - start) * easeOut;
        
        callback(value);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    
    requestAnimationFrame(animate);
}
```

### 🎨 CSS Guidelines

#### Modern CSS Architecture
- **Custom Properties**: Use CSS variables for all dynamic values
- **Logical Properties**: Use logical properties for better internationalization
- **Container Queries**: Use for responsive components
- **CSS Grid & Flexbox**: Modern layout techniques

#### Component Structure
```css
/* Component: Quiz Container */
.quiz-container {
    /* Layout */
    display: grid;
    gap: clamp(1rem, 4vw, 3rem);
    max-width: min(90vw, 1000px);
    margin-inline: auto;
    padding: clamp(1rem, 4vw, 3rem);
    
    /* Visual */
    background: var(--card-bg);
    border-radius: 24px;
    box-shadow: 
        0 25px 50px var(--shadow-color),
        0 0 0 1px rgba(255, 255, 255, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    
    /* Animation */
    transition: all var(--animation-normal) var(--ease-out-quart);
    animation: containerSlideIn var(--animation-slow) var(--ease-spring);
}

/* Responsive design with container queries */
@container (min-width: 768px) {
    .quiz-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }
}
```

#### Animation Keyframes
```css
@keyframes optionSlideIn {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes correctSuccess {
    0% { transform: scale(1); }
    30% { transform: scale(1.08); }
    60% { transform: scale(1.02); }
    100% { transform: scale(1.04); }
}

@keyframes incorrectShake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
    20%, 40%, 60%, 80% { transform: translateX(8px); }
}
```

## 🧩 Feature-Specific Guidelines

### 🧠 Quiz System

#### Advanced Randomization
```javascript
class QuizRandomizer {
    constructor() {
        this.useCryptoRandom = window.crypto && window.crypto.getRandomValues;
    }
    
    shuffleQuestions(questions, count = 10) {
        const shuffled = this.secureShuffleArray([...questions]);
        return shuffled.slice(0, count);
    }
    
    secureShuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.getSecureRandomIndex(i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    getSecureRandomIndex(max) {
        if (this.useCryptoRandom) {
            const randomArray = new Uint32Array(1);
            window.crypto.getRandomValues(randomArray);
            return Math.floor((randomArray[0] / (0xffffffff + 1)) * max);
        }
        return Math.floor(Math.random() * max);
    }
}
```

#### Enhanced Feedback System
```javascript
class FeedbackRenderer {
    showFeedback(isCorrect, explanation, correctAnswer) {
        const feedback = this.createFeedbackElement(isCorrect, explanation, correctAnswer);
        this.animateIn(feedback);
        return feedback;
    }
    
    createFeedbackElement(isCorrect, explanation, correctAnswer) {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        
        feedback.innerHTML = `
            <div class="feedback-header">
                <div class="feedback-icon">
                    <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}"></i>
                </div>
                <div class="feedback-text">
                    <h4>${isCorrect ? 'Correto!' : 'Incorreto!'}</h4>
                    ${!isCorrect ? `<p class="correct-answer">Resposta correta: ${correctAnswer}</p>` : ''}
                </div>
            </div>
            ${explanation ? `
                <div class="feedback-explanation">
                    <h5>Explicação:</h5>
                    <p>${explanation}</p>
                </div>
            ` : ''}
        `;
        
        return feedback;
    }
}
```

### 📱 Responsive Design

#### Mobile-First Approach
```css
/* Base mobile styles */
.quiz-container {
    margin: 0.5rem;
    padding: 1rem;
    border-radius: var(--card-radius);
}

/* Tablet styles */
@media (min-width: 768px) {
    .quiz-container {
        margin: 2rem auto;
        padding: 2rem;
        max-width: 800px;
    }
}

/* Desktop styles */
@media (min-width: 1024px) {
    .quiz-container {
        max-width: 1000px;
        padding: 3rem;
    }
}
```

#### Touch-Friendly Interactions
```css
.quiz-option {
    min-height: 44px; /* Minimum touch target size */
    touch-action: manipulation; /* Disable double-tap zoom */
    -webkit-tap-highlight-color: transparent; /* Remove tap highlight */
}

@media (max-width: 768px) {
    .quiz-option {
        min-height: 56px;
        padding: 1rem;
    }
}
```

### ♿ Accessibility Standards

#### Keyboard Navigation
```javascript
class AccessibilityManager {
    setupKeyboardNavigation() {
        this.container.addEventListener('keydown', (e) => {
            const focusedElement = document.activeElement;
            const options = [...this.container.querySelectorAll('.quiz-option')];
            const currentIndex = options.indexOf(focusedElement);
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.focusNext(options, currentIndex);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.focusPrevious(options, currentIndex);
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (focusedElement.classList.contains('quiz-option')) {
                        focusedElement.click();
                    }
                    break;
            }
        });
    }
}
```

#### ARIA Attributes
```html
<div class="quiz-option" 
     role="button" 
     tabindex="0" 
     aria-label="Opção 1 de 4"
     aria-describedby="question-text">
    Texto da opção
</div>
```

## 🔄 State Management

### Quiz State System
```javascript
class QuizState {
    constructor() {
        this.state = {
            questions: [],
            currentIndex: 0,
            score: 0,
            answers: [],
            startTime: null,
            endTime: null,
            isComplete: false
        };
        this.listeners = [];
    }
    
    setState(newState) {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...newState };
        this.notifyListeners(prevState, this.state);
    }
    
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
}
```

## 📊 Performance Optimization

### Loading Strategies
```javascript
// Lazy load quiz components
const loadQuizComponent = async (componentName) => {
    const module = await import(`./components/${componentName}.js`);
    return module.default;
};

// Preload critical resources
const preloadQuizData = (subject) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `/api/quiz/${subject}`;
    document.head.appendChild(link);
};
```

### Memory Management
```javascript
class QuizComponentManager {
    cleanup() {
        // Clean up event listeners
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Clean up components
        this.components.forEach(component => {
            if (component.cleanup) {
                component.cleanup();
            }
        });
        this.components.clear();
    }
}
```

## 🌍 Translation System

### Translation Manager Usage
```python
# Access translations in templates
{{ translations.page.title }}
{{ translations.general.next }}

# Access translations in Python
translations = translation_manager.get_translations('probabilidade', 'quiz')
title = translations['page']['title']
```

### Dynamic Translation Loading
```javascript
class TranslationLoader {
    async loadTranslations(language, subject, page) {
        const response = await fetch(`/api/translations/${language}/${subject}/${page}`);
        return response.json();
    }
}
```

## 🔒 Security Guidelines

### Input Validation
```python
def validate_quiz_answer(answer: str) -> bool:
    """Validate quiz answer input."""
    if not isinstance(answer, str):
        return False
    if len(answer.strip()) == 0:
        return False
    if len(answer) > 1000:  # Reasonable limit
        return False
    return True
```

### Content Sanitization
```javascript
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
```

## 🧪 Testing Standards

### Component Testing
```javascript
describe('QuizManager', () => {
    let quizManager;
    let mockContainer;
    
    beforeEach(() => {
        mockContainer = document.createElement('div');
        mockContainer.innerHTML = '<div class="quiz-container"></div>';
        quizManager = new QuizManager(mockContainer);
    });
    
    test('should initialize with correct state', () => {
        expect(quizManager.state.currentIndex).toBe(0);
        expect(quizManager.state.score).toBe(0);
    });
});
```

### Cross-Browser Testing
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Accessibility Testing**: Screen readers, keyboard navigation

## 📋 Quality Checklist

Before submitting any code changes, ensure:

### ✅ Code Quality
- [ ] No duplicate files created (edit originals only)
- [ ] Modern CSS with custom properties
- [ ] ES6+ JavaScript features used
- [ ] Proper error handling implemented
- [ ] Code is well-commented and documented

### ✅ UI/UX Standards
- [ ] Smooth animations with proper easing
- [ ] Responsive design across all viewports
- [ ] Accessibility standards met (WCAG 2.1)
- [ ] Dark/light theme support
- [ ] Touch-friendly interfaces

### ✅ Performance
- [ ] No layout thrashing in animations
- [ ] Optimized asset loading
- [ ] Efficient DOM manipulation
- [ ] Memory leaks prevented

### ✅ Testing
- [ ] Cross-browser compatibility verified
- [ ] Mobile device testing completed
- [ ] Accessibility testing with screen readers
- [ ] Performance metrics within acceptable ranges

---

💡 **Remember**: Always prioritize user experience, accessibility, and performance. Every line of code should contribute to making the AESI platform more educational, beautiful, and inclusive.
