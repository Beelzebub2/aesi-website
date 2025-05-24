# Quiz Component Documentation

## 🧩 Quiz System Architecture

The quiz system is built with a modular, component-based architecture that provides flexibility, maintainability, and excellent user experience.

## 📋 Core Components

### QuizManager
Central controller that manages quiz state and orchestrates all quiz operations.

```javascript
class QuizManager {
    constructor(quizType, container) {
        this.quizType = quizType;
        this.container = container;
        this.state = {
            questions: [],
            currentIndex: 0,
            score: 0,
            isComplete: false
        };
        this.initialize();
    }
    
    async initialize() {
        await this.loadQuestions();
        this.render();
        this.bindEvents();
    }
}
```

### QuestionRenderer
Handles the display and animation of individual questions.

```javascript
class QuestionRenderer {
    render(question, index) {
        const questionElement = this.createQuestionElement(question);
        this.animateIn(questionElement);
        return questionElement;
    }
    
    animateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
}
```

### ProgressTracker
Manages and visualizes quiz progress with smooth animations.

```javascript
class ProgressTracker {
    updateProgress(current, total) {
        const percentage = (current / total) * 100;
        const progressBar = this.container.querySelector('.progress-fill');
        
        progressBar.style.width = `${percentage}%`;
        this.animateScoreUpdate(current, total);
    }
    
    animateScoreUpdate(current, total) {
        const counter = this.container.querySelector('.current-question');
        this.animateNumber(counter, current);
    }
}
```

## 🎨 Animation System

### Animation Principles

#### 1. **Entrance Animations**
Questions and options use staggered entrance animations for visual appeal.

```css
.quiz-option {
    opacity: 0;
    transform: translateY(10px);
    animation: fadeInUp 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.quiz-option:nth-child(1) { animation-delay: 0ms; }
.quiz-option:nth-child(2) { animation-delay: 100ms; }
.quiz-option:nth-child(3) { animation-delay: 200ms; }
.quiz-option:nth-child(4) { animation-delay: 300ms; }

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

#### 2. **Interactive Feedback**
Immediate visual feedback for user interactions.

```css
.quiz-option {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.quiz-option::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: var(--primary);
    opacity: 0.2;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
}

.quiz-option:hover::before {
    width: 300px;
    height: 300px;
}
```

#### 3. **State Transitions**
Smooth transitions between different quiz states.

```css
.quiz-section {
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    pointer-events: none;
}

.quiz-section.active {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
}
```

## 🔧 Enhanced Features

### Smart Randomization System

#### Multi-Level Shuffling
```javascript
class QuizRandomizer {
    constructor() {
        this.useCryptoRandom = window.crypto && window.crypto.getRandomValues;
    }
    
    shuffleQuestions(questions, count = 10) {
        const shuffled = this.secureShuffleArray([...questions]);
        return shuffled.slice(0, count);
    }
    
    shuffleOptions(question) {
        const correctAnswer = question.options[question.correct];
        const shuffledOptions = this.secureShuffleArray([...question.options]);
        
        return {
            ...question,
            options: shuffledOptions,
            correct: shuffledOptions.indexOf(correctAnswer),
            correctAnswer: correctAnswer
        };
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

### Advanced Progress Tracking

#### Visual Progress Indicators
```javascript
class EnhancedProgressTracker {
    constructor(container) {
        this.container = container;
        this.progressBar = container.querySelector('.progress-fill');
        this.scoreDisplay = container.querySelector('.score-display');
        this.questionCounter = container.querySelector('.question-counter');
    }
    
    updateProgress(current, total, score) {
        this.animateProgressBar(current, total);
        this.animateScore(score);
        this.updateQuestionCounter(current, total);
    }
    
    animateProgressBar(current, total) {
        const percentage = (current / total) * 100;
        const currentWidth = parseFloat(this.progressBar.style.width) || 0;
        
        this.animateValue(currentWidth, percentage, (value) => {
            this.progressBar.style.width = `${value}%`;
        });
    }
    
    animateScore(newScore) {
        const currentScore = parseInt(this.scoreDisplay.textContent) || 0;
        
        this.animateValue(currentScore, newScore, (value) => {
            this.scoreDisplay.textContent = Math.round(value);
        });
    }
    
    animateValue(start, end, callback) {
        const duration = 500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-out cubic function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const value = start + (end - start) * easeOut;
            
            callback(value);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}
```

### Rich Feedback System

#### Enhanced Feedback Display
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
    
    animateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px) scale(0.95)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
        });
    }
}
```

## 📱 Responsive Design

### Mobile-First Approach

```css
/* Base mobile styles */
.quiz-container {
    margin: 0.5rem;
    padding: 1rem;
    border-radius: var(--card-radius);
}

.quiz-option {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

/* Tablet styles */
@media (min-width: 768px) {
    .quiz-container {
        margin: 2rem auto;
        padding: 2rem;
        max-width: 800px;
    }
    
    .quiz-option {
        padding: 1rem 1.5rem;
        font-size: 1rem;
        margin-bottom: 1rem;
    }
}

/* Desktop styles */
@media (min-width: 1024px) {
    .quiz-container {
        max-width: 1000px;
        padding: 3rem;
    }
    
    .quiz-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
}
```

### Touch-Friendly Interactions

```css
.quiz-option {
    min-height: 44px; /* Minimum touch target size */
    touch-action: manipulation; /* Disable double-tap zoom */
    -webkit-tap-highlight-color: transparent; /* Remove tap highlight */
}

/* Larger touch targets on mobile */
@media (max-width: 768px) {
    .quiz-option {
        min-height: 56px;
        padding: 1rem;
    }
}
```

## ♿ Accessibility Features

### Keyboard Navigation

```javascript
class AccessibilityManager {
    constructor(quizContainer) {
        this.container = quizContainer;
        this.setupKeyboardNavigation();
        this.setupAriaAttributes();
    }
    
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
    
    setupAriaAttributes() {
        const progressBar = this.container.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.setAttribute('role', 'progressbar');
            progressBar.setAttribute('aria-valuemin', '0');
            progressBar.setAttribute('aria-valuemax', '100');
        }
    }
}
```

### Screen Reader Support

```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.quiz-option::before {
    content: attr(data-option-number) " de " attr(data-total-options) ". ";
    @extend .sr-only;
}
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
    
    notifyListeners(prevState, newState) {
        this.listeners.forEach(listener => {
            listener(newState, prevState);
        });
    }
}
```

## 📊 Performance Optimization

### Lazy Loading and Code Splitting

```javascript
// Lazy load quiz components
const loadQuizComponent = async (componentName) => {
    const module = await import(`./components/${componentName}.js`);
    return module.default;
};

// Example usage
const enhancedQuiz = await loadQuizComponent('EnhancedQuiz');
```

### Memory Management

```javascript
class QuizComponentManager {
    constructor() {
        this.components = new Map();
        this.observers = new Set();
    }
    
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

## 🧪 Testing Framework

### Component Testing

```javascript
// Example test for QuizManager
describe('QuizManager', () => {
    let quizManager;
    let mockContainer;
    
    beforeEach(() => {
        mockContainer = document.createElement('div');
        mockContainer.innerHTML = '<div class="quiz-container"></div>';
        quizManager = new QuizManager('probability', mockContainer);
    });
    
    afterEach(() => {
        quizManager.cleanup();
    });
    
    test('should initialize with correct state', () => {
        expect(quizManager.state.currentIndex).toBe(0);
        expect(quizManager.state.score).toBe(0);
        expect(quizManager.state.isComplete).toBe(false);
    });
    
    test('should load questions correctly', async () => {
        await quizManager.loadQuestions();
        expect(quizManager.state.questions.length).toBeGreaterThan(0);
    });
});
```
