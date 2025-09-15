# AESI Website - Unified Quiz System

```mermaid
flowchart TD
    %% Unified Quiz System Entry
    QUIZ_START_ENTRY[Quiz Interface Entry] --> INIT_UNIFIED_QUIZ[Initialize Unified Quiz System]
    
    %% Unified Quiz Initialization
    INIT_UNIFIED_QUIZ --> DETECT_SUBJECT[Detect Subject from URL Path]
    DETECT_SUBJECT --> LOAD_QUIZ_UTILS[Load QuizUtils Module]
    LOAD_QUIZ_UTILS --> LOAD_QUIZ_DATA[Load Quiz Data via API: /api/quiz/{subject}/{type}]
    LOAD_QUIZ_DATA --> QUIZ_DATA_CHECK{Quiz Data Valid?}
    QUIZ_DATA_CHECK -->|No| QUIZ_ERROR[Display Error Message]
    QUIZ_DATA_CHECK -->|Yes| QUIZ_START[Quiz Start Screen]
    
    %% Unified Quiz Flow
    QUIZ_START --> START_BUTTON{User Clicks Start}
    START_BUTTON -->|Yes| PREPARE_QUESTIONS[Prepare & Shuffle Questions]
    PREPARE_QUESTIONS --> DISPLAY_QUESTION[Display Question with Options]
    
    %% Question Interaction
    DISPLAY_QUESTION --> USER_ANSWER{User Selects Answer}
    USER_ANSWER --> CHECK_ANSWER[Check Answer Correctness]
    CHECK_ANSWER --> VISUAL_FEEDBACK[Apply Visual Feedback to Buttons]
    VISUAL_FEEDBACK --> SHOW_FEEDBACK[Show Contextual Feedback]
    SHOW_FEEDBACK --> UPDATE_SCORE[Update Score Counter]
    UPDATE_SCORE --> UPDATE_PROGRESS[Update Progress Bar & Display]
    UPDATE_PROGRESS --> MORE_QUESTIONS{More Questions?}
    
    %% Question Loop
    MORE_QUESTIONS -->|Yes| NEXT_BUTTON{User Clicks Next}
    NEXT_BUTTON -->|Yes| RESET_BUTTONS[Reset Button States]
    RESET_BUTTONS --> DISPLAY_QUESTION
    MORE_QUESTIONS -->|No| QUIZ_RESULTS[Display Results & Performance Analysis]
    
    %% Results and Restart
    QUIZ_RESULTS --> CALC_PERCENTAGE[Calculate Score Percentage]
    CALC_PERCENTAGE --> SHOW_MESSAGE[Show Contextual Performance Message]
    SHOW_MESSAGE --> QUIZ_RESTART{Restart Quiz?}
    QUIZ_RESTART -->|Yes| QUIZ_START
    QUIZ_RESTART -->|No| QUIZ_END[Quiz End]
    
    %% Error Handling
    QUIZ_ERROR --> RELOAD_OPTION[Show Reload Option]
    RELOAD_OPTION --> RELOAD_BUTTON{User Clicks Reload}
    RELOAD_BUTTON -->|Yes| INIT_UNIFIED_QUIZ
    
    %% Quiz Types
    subgraph QUIZ_TYPES [Supported Quiz Types]
        STANDARD_QUIZ[Standard Quiz<br/>data-quiz-type="quiz"]
        DISCOVERY_QUIZ[Discovery Quiz<br/>data-quiz-type="descobrir"]
    end
    
    INIT_UNIFIED_QUIZ --> QUIZ_TYPES
    
    %% Styling
    classDef unified fill:#3a86ff,stroke:#fff,stroke-width:2px,color:#fff
    classDef interactive fill:#7209b7,stroke:#fff,stroke-width:2px,color:#fff
    classDef decision fill:#fb5607,stroke:#fff,stroke-width:2px,color:#fff
    classDef error fill:#dc2626,stroke:#fff,stroke-width:2px,color:#fff
    
    class INIT_UNIFIED_QUIZ,DETECT_SUBJECT,LOAD_QUIZ_UTILS,PREPARE_QUESTIONS,QUIZ_START unified
    class DISPLAY_QUESTION,VISUAL_FEEDBACK,SHOW_FEEDBACK,UPDATE_PROGRESS,QUIZ_RESULTS interactive
    class USER_ANSWER,MORE_QUESTIONS,QUIZ_RESTART,START_BUTTON,NEXT_BUTTON decision
    class QUIZ_ERROR,RELOAD_OPTION error
```

## Unified Quiz System Features

### Core Architecture
- **Single Engine**: `quiz-unified.js` handles all quiz types dynamically
- **Shared Utilities**: `quiz-utils.js` provides common functionality
- **Subject Auto-Detection**: Determines subject from URL path automatically
- **Type Flexibility**: Supports multiple quiz types via `data-quiz-type` attribute

### Quiz Types
1. **Standard Quiz** (`data-quiz-type="quiz"`): Traditional multiple-choice questions
2. **Discovery Quiz** (`data-quiz-type="descobrir"`): Scenario-based learning for distribution identification

### Technical Features
- **Dynamic API Calls**: `/api/quiz/{subject}/{quizType}` endpoint pattern
- **Question Shuffling**: Cryptographically secure randomization
- **Real-time Feedback**: Immediate validation with contextual explanations
- **Progress Tracking**: Visual progress bars and live score updates
- **Performance Analysis**: Subject-specific feedback messages
- **Responsive Design**: Mobile-first with touch-friendly interactions
- **Theme Integration**: Respects user's light/dark mode preferences

### Quiz Files
- `probabilidade_quiz.json`: Probability and statistics questions
- `probabilidade_descobrir.json`: Distribution identification scenarios
- `analise_estatistica_quiz.json`: Data analysis questions

### Interactive Elements
- **Visual Answer Feedback**: Correct answers highlighted in green, incorrect in red
- **Smooth Animations**: CSS transitions for option selection and feedback
- **Auto-scroll**: Intelligent scrolling to feedback on larger screens
- **Error Recovery**: Graceful handling of network issues and data problems
- **Restart Capability**: Complete quiz reset functionality

### Code Consolidation Benefits
- **Reduced Duplication**: Single codebase instead of multiple quiz implementations
- **Easier Maintenance**: Changes apply to all quiz types automatically
- **Consistent UX**: Unified interface and behavior across subjects
- **Modular Design**: Clear separation between UI logic and utility functions
