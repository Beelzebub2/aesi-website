# Development Guide

## 🛠️ Setup and Installation

### Development Environment Setup

1. **Python Environment**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

2. **Development Server**
   ```bash
   # Start development server
   python app.py
   
   # Server will start on http://localhost:5000
   ```

## 🎨 UI/UX Enhancement Guidelines

### Animation Principles

All animations should follow these principles:
- **Performance First**: Use CSS transforms and opacity for smooth 60fps animations
- **Purposeful Motion**: Every animation should serve a functional purpose
- **Consistent Timing**: Use standardized easing functions and durations
- **Respect Accessibility**: Honor `prefers-reduced-motion` settings

### Animation Implementation

#### Standard Animation Durations
```css
:root {
    --animation-fast: 150ms;
    --animation-normal: 300ms;
    --animation-slow: 500ms;
    --animation-extra-slow: 800ms;
}
```

#### Standard Easing Functions
```css
:root {
    --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
    --ease-in-out-back: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### Quiz Animation Enhancements

#### Question Transitions
- **Slide-in Effect**: New questions slide in from the right
- **Fade Transition**: Smooth opacity changes for content updates
- **Staggered Options**: Answer options appear with cascading delays

#### Feedback Animations
- **Success Pulse**: Correct answers get a gentle pulse effect
- **Error Shake**: Incorrect answers receive a subtle shake
- **Progress Flow**: Progress bar smoothly animates to new values

#### Interactive Elements
- **Hover Lift**: Buttons and cards lift slightly on hover
- **Ripple Effect**: Click feedback with expanding circles
- **Loading States**: Skeleton loaders for content loading

## 📱 Responsive Design Guidelines

### Breakpoint System
```css
/* Mobile First Approach */
:root {
    --bp-xs: 480px;    /* Extra small devices */
    --bp-sm: 768px;    /* Small devices */
    --bp-md: 1024px;   /* Medium devices */
    --bp-lg: 1200px;   /* Large devices */
    --bp-xl: 1400px;   /* Extra large devices */
}
```

### Component Scaling
- **Fluid Typography**: Use `clamp()` for responsive text sizing
- **Flexible Spacing**: Implement responsive spacing scales
- **Adaptive Layouts**: Grid and flexbox for layout adaptation

## 🎯 Quiz System Enhancement

### Advanced Randomization
```javascript
// Enhanced Fisher-Yates shuffle with crypto API
function secureShuffleArray(array) {
    const newArray = [...array];
    
    for (let i = newArray.length - 1; i > 0; i--) {
        let j;
        if (window.crypto && window.crypto.getRandomValues) {
            const randomArray = new Uint32Array(1);
            window.crypto.getRandomValues(randomArray);
            j = Math.floor((randomArray[0] / (0xffffffff + 1)) * (i + 1));
        } else {
            j = Math.floor(Math.random() * (i + 1));
        }
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    
    return newArray;
}
```

### Smart Progress Tracking
- **Visual Progress**: Animated progress bars with percentage
- **Score Feedback**: Real-time score updates with animations
- **Performance Analytics**: Track completion time and accuracy

### Enhanced Feedback System
- **Detailed Explanations**: Rich feedback with mathematical formulas
- **Visual Indicators**: Icons and colors for instant recognition
- **Adaptive Hints**: Progressive hint system for struggling users

## 🔧 Code Quality Standards

### JavaScript Guidelines

#### ES6+ Features
```javascript
// Use modern JavaScript features
const loadQuizData = async () => {
    try {
        const response = await fetch('/api/quiz');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load quiz:', error);
        throw error;
    }
};

// Use destructuring and template literals
const displayQuestion = ({ question, options, explanation }) => {
    return `
        <div class="question-card">
            <h3>${question}</h3>
            <div class="options">${options.map(opt => `<button>${opt}</button>`).join('')}</div>
            ${explanation ? `<p class="explanation">${explanation}</p>` : ''}
        </div>
    `;
};
```

#### Error Handling
```javascript
// Comprehensive error handling
class QuizError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'QuizError';
        this.code = code;
    }
}

const handleQuizError = (error) => {
    console.error('Quiz Error:', error);
    
    const errorMap = {
        'NETWORK_ERROR': 'Erro de conexão. Verifique sua internet.',
        'DATA_ERROR': 'Erro nos dados do quiz. Tente novamente.',
        'VALIDATION_ERROR': 'Dados inválidos fornecidos.'
    };
    
    const userMessage = errorMap[error.code] || 'Erro inesperado. Tente novamente.';
    showUserFriendlyError(userMessage);
};
```

### CSS Guidelines

#### Component Architecture
```css
/* Use BEM methodology */
.quiz-card {
    /* Block styles */
}

.quiz-card__title {
    /* Element styles */
}

.quiz-card--highlighted {
    /* Modifier styles */
}

/* Use CSS custom properties for theming */
.quiz-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: var(--card-radius);
    transition: all var(--animation-normal) var(--ease-out-quart);
}
```

#### Performance Optimizations
```css
/* Use transform and opacity for animations */
.quiz-option {
    transform: translateY(0);
    opacity: 1;
    transition: transform var(--animation-normal) var(--ease-out-quart),
                opacity var(--animation-normal) var(--ease-out-quart);
}

.quiz-option:hover {
    transform: translateY(-2px);
}

/* Use will-change for heavy animations */
.animated-element {
    will-change: transform, opacity;
}

/* Remove will-change after animation */
.animated-element.animation-complete {
    will-change: auto;
}
```

## 🧪 Testing Guidelines

### Manual Testing Checklist

#### Quiz Functionality
- [ ] Questions load correctly
- [ ] Answer randomization works
- [ ] Progress tracking updates
- [ ] Score calculation is accurate
- [ ] Feedback displays properly
- [ ] Theme switching works
- [ ] Mobile responsiveness

#### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Contrast ratios meet WCAG standards
- [ ] Focus indicators are visible
- [ ] Alternative text for images

#### Performance Testing
- [ ] Page load times under 3 seconds
- [ ] Animations run at 60fps
- [ ] No layout shifts during load
- [ ] Memory usage remains stable

## 🚀 Deployment Guidelines

### Production Optimizations

1. **Asset Optimization**
   - Minify CSS and JavaScript
   - Optimize images (WebP format when possible)
   - Enable gzip compression

2. **Caching Strategy**
   - Set appropriate cache headers
   - Use versioned assets
   - Implement service worker for offline support

3. **Security Measures**
   - Implement CSP headers
   - Validate all user inputs
   - Use HTTPS in production

## 📊 Performance Monitoring

### Key Metrics to Track
- Page load time
- Time to interactive
- Quiz completion rates
- User engagement metrics
- Error rates and types

### Monitoring Tools
- Browser DevTools
- Lighthouse audits
- User feedback collection
- Error tracking systems

## 🔍 Debugging Tips

### Common Issues and Solutions

1. **Quiz Not Loading**
   - Check network tab for failed requests
   - Verify JSON data structure
   - Ensure proper error handling

2. **Animation Performance**
   - Use Chrome DevTools Performance tab
   - Check for layout thrashing
   - Optimize CSS selectors

3. **Theme Switching Issues**
   - Verify CSS custom property inheritance
   - Check localStorage functionality
   - Ensure all components use theme variables
