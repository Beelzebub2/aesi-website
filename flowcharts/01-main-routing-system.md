# AESI Website - Main Routing System

```mermaid
flowchart TD
    %% Entry Points
    START([User visits AESI Website]) --> INIT[Initialize Flask App]
    INIT --> LOAD_TRANS[Load Translation Manager]
    LOAD_TRANS --> ROUTE_HANDLER{Route Handler}
    
    %% Main Routes
    ROUTE_HANDLER -->|"/"| HOME_PAGE[Homepage Route]
    ROUTE_HANDLER -->|"/<subject>"| SUBJECT_HOME[Subject Home Route]
    ROUTE_HANDLER -->|"/<subject>/<feature>"| SUBJECT_FEATURE[Subject Feature Route]
    ROUTE_HANDLER -->|"/api/..."| API_ROUTES[API Routes]
    ROUTE_HANDLER -->|Invalid Route| ERROR_404_MAIN[404 Error Handler]
    
    %% Homepage Flow
    HOME_PAGE --> GET_HOMEPAGE_TRANS[Get Homepage Translations]
    GET_HOMEPAGE_TRANS --> GET_SUBJECTS_LIST[Get Available Subjects]
    GET_SUBJECTS_LIST --> GET_COMING_SOON[Get Coming Soon Subjects]
    GET_COMING_SOON --> RENDER_HOMEPAGE[Render Homepage Template]
    RENDER_HOMEPAGE --> HOMEPAGE_DISPLAY[Display Homepage with Subject Cards]
    
    %% Subject Home Flow
    SUBJECT_HOME --> VALIDATE_SUBJECT{Subject Exists?}
    VALIDATE_SUBJECT -->|No| ERROR_404_SUBJECT[404 Error - Subject Not Found]
    VALIDATE_SUBJECT -->|Yes| GET_SUBJECT_TRANS[Get Subject Translations]
    GET_SUBJECT_TRANS --> RENDER_SUBJECT_HOME[Render Subject Index Template]
    RENDER_SUBJECT_HOME --> SUBJECT_HOME_DISPLAY[Display Subject Homepage with Features]
    
    %% Subject Feature Flow
    SUBJECT_FEATURE --> VALIDATE_SUBJECT_FEAT{Subject & Feature Exist?}
    VALIDATE_SUBJECT_FEAT -->|No| ERROR_404_FEATURE[404 Error - Feature Not Found]
    VALIDATE_SUBJECT_FEAT -->|Yes| GET_FEATURE_TRANS[Get Feature Translations]
    GET_FEATURE_TRANS --> RENDER_FEATURE[Render Feature Template]
    RENDER_FEATURE --> FEATURE_DISPLAY{Feature Type}
    
    %% Feature Types
    FEATURE_DISPLAY -->|Quiz| QUIZ_INTERFACE[Quiz Interface]
    FEATURE_DISPLAY -->|Calculator| CALC_INTERFACE[Statistical Calculator]
    FEATURE_DISPLAY -->|Podcasts| PODCAST_INTERFACE[Podcast Player]
    FEATURE_DISPLAY -->|Discover| DISCOVER_INTERFACE[Distribution Discovery Quiz]
    
    %% Error Handling
    ERROR_404_MAIN --> LOAD_ERROR_TRANS[Load Error Page Translations]
    ERROR_404_SUBJECT --> LOAD_ERROR_TRANS
    ERROR_404_FEATURE --> LOAD_ERROR_TRANS
    LOAD_ERROR_TRANS --> RENDER_404[Render 404 Template]
    RENDER_404 --> SHOW_404[Show 404 Page with Back Button]
    
    %% Styling
    classDef primaryRoute fill:#4361ee,stroke:#fff,stroke-width:2px,color:#fff
    classDef feature fill:#3a86ff,stroke:#fff,stroke-width:2px,color:#fff
    classDef decision fill:#fb5607,stroke:#fff,stroke-width:2px,color:#fff
    
    class HOME_PAGE,SUBJECT_HOME,SUBJECT_FEATURE primaryRoute
    class QUIZ_INTERFACE,CALC_INTERFACE,PODCAST_INTERFACE,DISCOVER_INTERFACE feature
    class VALIDATE_SUBJECT,FEATURE_DISPLAY,VALIDATE_SUBJECT_FEAT decision
```

## Main Routing System Overview

### Core Functionality
- **Dynamic Route Generation**: Routes are automatically generated based on translation structure
- **Subject Validation**: Checks if requested subjects exist in the translation system
- **Feature Validation**: Validates that requested features are available for the subject
- **Error Handling**: Centralized 404 error handling for all invalid routes

### Route Types
1. **Homepage Route** (`/`): Main landing page with subject overview
2. **Subject Home Route** (`/<subject>`): Individual subject homepage with feature list
3. **Subject Feature Route** (`/<subject>/<feature>`): Specific feature pages (quiz, calculator, etc.)
4. **API Routes** (`/api/...`): RESTful endpoints for data access
