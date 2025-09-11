# AESI Website - Quiz System

```mermaid
flowchart TD
    %% Quiz System Entry
    QUIZ_START_ENTRY[Quiz Interface Entry] --> INIT_QUIZ[Initialize Quiz System]
    
    %% Quiz Initialization
    INIT_QUIZ --> LOAD_QUIZ_DATA[Load Quiz JSON Data via API]
    LOAD_QUIZ_DATA --> QUIZ_DATA_CHECK{Quiz Data Valid?}
    QUIZ_DATA_CHECK -->|No| QUIZ_ERROR[Display Error Message]
    QUIZ_DATA_CHECK -->|Yes| QUIZ_START[Quiz Start Screen]
    
    %% Quiz Flow
    QUIZ_START --> START_BUTTON{User Clicks Start}
    START_BUTTON -->|Yes| PREPARE_QUESTIONS[Prepare & Shuffle Questions]
    PREPARE_QUESTIONS --> DISPLAY_QUESTION[Display Question]
    
    %% Question Interaction
    DISPLAY_QUESTION --> USER_ANSWER{User Selects Answer}
    USER_ANSWER --> CHECK_ANSWER[Check Answer Correctness]
    CHECK_ANSWER --> SHOW_FEEDBACK[Show Answer Feedback]
    SHOW_FEEDBACK --> UPDATE_SCORE[Update Score]
    UPDATE_SCORE --> UPDATE_PROGRESS[Update Progress Display]
    UPDATE_PROGRESS --> MORE_QUESTIONS{More Questions?}
    
    %% Question Loop
    MORE_QUESTIONS -->|Yes| NEXT_BUTTON{User Clicks Next}
    NEXT_BUTTON -->|Yes| DISPLAY_QUESTION
    MORE_QUESTIONS -->|No| QUIZ_RESULTS[Display Results & Feedback]
    
    %% Results and Restart
    QUIZ_RESULTS --> CALC_PERCENTAGE[Calculate Score Percentage]
    CALC_PERCENTAGE --> SHOW_MESSAGE[Show Performance Message]
    SHOW_MESSAGE --> QUIZ_RESTART{Restart Quiz?}
    QUIZ_RESTART -->|Yes| QUIZ_START
    QUIZ_RESTART -->|No| QUIZ_END[Quiz End]
    
    %% Error Handling
    QUIZ_ERROR --> RELOAD_OPTION[Show Reload Option]
    RELOAD_OPTION --> RELOAD_BUTTON{User Clicks Reload}
    RELOAD_BUTTON -->|Yes| INIT_QUIZ
    
    %% Styling
    classDef quizFlow fill:#3a86ff,stroke:#fff,stroke-width:2px,color:#fff
    classDef interactive fill:#7209b7,stroke:#fff,stroke-width:2px,color:#fff
    classDef decision fill:#fb5607,stroke:#fff,stroke-width:2px,color:#fff
    classDef error fill:#dc2626,stroke:#fff,stroke-width:2px,color:#fff
    
    class INIT_QUIZ,LOAD_QUIZ_DATA,PREPARE_QUESTIONS,QUIZ_START quizFlow
    class DISPLAY_QUESTION,SHOW_FEEDBACK,UPDATE_PROGRESS,QUIZ_RESULTS interactive
    class USER_ANSWER,MORE_QUESTIONS,QUIZ_RESTART,START_BUTTON,NEXT_BUTTON decision
    class QUIZ_ERROR,RELOAD_OPTION error
```

## Quiz System Features

### Core Components
- **Dynamic Question Loading**: Questions loaded via API calls
- **Question Shuffling**: Random order for each quiz session
- **Real-time Feedback**: Immediate answer validation with explanations
- **Progress Tracking**: Visual progress bar and score display
- **Performance Analysis**: Detailed results with improvement suggestions

### Quiz Types
1. **Standard Quiz**: Multiple choice questions with explanations
2. **Discovery Quiz**: Interactive scenario-based learning for distribution identification
3. **Unified System**: Consolidated quiz engine for all types

### Quiz Files
- `probabilidade_quiz.json`: Probability and statistics questions
- `descobrir_distribuição.json`: Distribution identification scenarios
- `analise_estatistica_quiz.json`: Data analysis questions

### Interactive Elements
- Answer validation with visual feedback
- Smooth scrolling to feedback sections
- Auto-advance options
- Restart functionality
- Error recovery mechanisms
