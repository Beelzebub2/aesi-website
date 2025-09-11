# AESI Website - Statistical Calculator

```mermaid
flowchart TD
    %% Calculator Entry
    CALC_START[Statistical Calculator Entry] --> SELECT_DISTRIBUTION[Select Distribution Type]
    
    %% Distribution Selection
    SELECT_DISTRIBUTION --> DISTRIBUTION_TYPE{Distribution Type}
    DISTRIBUTION_TYPE -->|Binomial| BINOMIAL_SETUP[Setup Binomial Calculator]
    DISTRIBUTION_TYPE -->|Poisson| POISSON_SETUP[Setup Poisson Calculator]
    DISTRIBUTION_TYPE -->|Normal| NORMAL_SETUP[Setup Normal Calculator]
    
    %% Binomial Distribution
    BINOMIAL_SETUP --> INPUT_BINOMIAL[Input n, p, k parameters]
    INPUT_BINOMIAL --> VALIDATE_BINOMIAL{Valid Parameters?}
    VALIDATE_BINOMIAL -->|No| BINOMIAL_ERROR[Show Parameter Error]
    VALIDATE_BINOMIAL -->|Yes| CALC_BINOMIAL[Calculate Binomial Probability]
    BINOMIAL_ERROR --> INPUT_BINOMIAL
    
    %% Poisson Distribution
    POISSON_SETUP --> INPUT_POISSON[Input λ, k parameters]
    INPUT_POISSON --> VALIDATE_POISSON{Valid Parameters?}
    VALIDATE_POISSON -->|No| POISSON_ERROR[Show Parameter Error]
    VALIDATE_POISSON -->|Yes| CALC_POISSON[Calculate Poisson Probability]
    POISSON_ERROR --> INPUT_POISSON
    
    %% Normal Distribution
    NORMAL_SETUP --> INPUT_NORMAL[Input μ, σ, x parameters]
    INPUT_NORMAL --> VALIDATE_NORMAL{Valid Parameters?}
    VALIDATE_NORMAL -->|No| NORMAL_ERROR[Show Parameter Error]
    VALIDATE_NORMAL -->|Yes| CALC_NORMAL[Calculate Normal Probability]
    NORMAL_ERROR --> INPUT_NORMAL
    
    %% Results Processing
    CALC_BINOMIAL --> PROCESS_RESULTS[Process Calculation Results]
    CALC_POISSON --> PROCESS_RESULTS
    CALC_NORMAL --> PROCESS_RESULTS
    
    PROCESS_RESULTS --> GENERATE_CHART[Generate Distribution Chart]
    GENERATE_CHART --> DISPLAY_RESULTS[Display Results & Visualization]
    
    %% Chart Interaction
    DISPLAY_RESULTS --> CHART_ACTIONS{User Action}
    CHART_ACTIONS -->|Change Parameters| SELECT_DISTRIBUTION
    CHART_ACTIONS -->|New Distribution| DISTRIBUTION_TYPE
    CHART_ACTIONS -->|Export Chart| EXPORT_CHART[Export Visualization]
    
    %% Auto-Calculation
    INPUT_BINOMIAL --> AUTO_CALC_BINOMIAL{Auto-Calculate?}
    INPUT_POISSON --> AUTO_CALC_POISSON{Auto-Calculate?}
    INPUT_NORMAL --> AUTO_CALC_NORMAL{Auto-Calculate?}
    
    AUTO_CALC_BINOMIAL -->|Yes| CALC_BINOMIAL
    AUTO_CALC_POISSON -->|Yes| CALC_POISSON
    AUTO_CALC_NORMAL -->|Yes| CALC_NORMAL
    
    %% Styling
    classDef calculator fill:#10b981,stroke:#fff,stroke-width:2px,color:#fff
    classDef distribution fill:#3b82f6,stroke:#fff,stroke-width:2px,color:#fff
    classDef interactive fill:#7209b7,stroke:#fff,stroke-width:2px,color:#fff
    classDef decision fill:#fb5607,stroke:#fff,stroke-width:2px,color:#fff
    classDef error fill:#dc2626,stroke:#fff,stroke-width:2px,color:#fff
    
    class SELECT_DISTRIBUTION,PROCESS_RESULTS,GENERATE_CHART calculator
    class BINOMIAL_SETUP,POISSON_SETUP,NORMAL_SETUP,CALC_BINOMIAL,CALC_POISSON,CALC_NORMAL distribution
    class INPUT_BINOMIAL,INPUT_POISSON,INPUT_NORMAL,DISPLAY_RESULTS interactive
    class DISTRIBUTION_TYPE,VALIDATE_BINOMIAL,VALIDATE_POISSON,VALIDATE_NORMAL,CHART_ACTIONS decision
    class BINOMIAL_ERROR,POISSON_ERROR,NORMAL_ERROR error
```

## Statistical Calculator Features

### Distribution Types
1. **Binomial Distribution**
   - Parameters: n (trials), p (probability), k (successes)
   - Calculates exact probabilities and cumulative distributions
   
2. **Poisson Distribution**
   - Parameters: λ (rate), k (events)
   - Ideal for modeling rare events
   
3. **Normal Distribution**
   - Parameters: μ (mean), σ (standard deviation), x (value)
   - Continuous probability calculations

### Key Features
- **Real-time Calculation**: Auto-calculates as parameters change
- **Interactive Charts**: Visual distribution representations using Chart.js
- **Parameter Validation**: Ensures mathematically valid inputs
- **Export Options**: Save charts and results
- **Educational Context**: Explanations and use cases for each distribution

### Technical Implementation
- Client-side calculations for instant feedback
- Chart.js integration for interactive visualizations
- Responsive design for mobile compatibility
- Translation support for all interface elements
- Auto-calculation features for real-time updates
