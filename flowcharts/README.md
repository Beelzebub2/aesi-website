# AESI Website Flowcharts - Index

This directory contains detailed flowcharts for each major functionality of the AESI educational website. Each flowchart is designed to be exportable individually and provides comprehensive documentation of the system architecture.

## Flowchart Files

### 1. [Main Routing System](./01-main-routing-system.md)
**Core functionality**: Dynamic route generation, subject validation, error handling
- Route types: Homepage, Subject Home, Subject Features, API endpoints
- Translation-driven architecture
- Centralized 404 error handling

### 2. [Quiz System](./02-quiz-system.md)
**Interactive learning**: Multiple choice quizzes with real-time feedback
- Dynamic question loading via API
- Progress tracking and scoring
- Performance analysis and recommendations
- Support for multiple quiz types

### 3. [Statistical Calculator](./03-statistical-calculator.md)
**Mathematical tools**: Probability calculations with visualizations
- Binomial, Poisson, and Normal distributions
- Real-time parameter validation
- Interactive charts using Chart.js
- Auto-calculation features

### 4. [Podcast System](./04-podcast-system.md)
**Audio content**: Educational podcasts with advanced player
- Howler.js integration for professional audio playback
- Persistent minimized player
- Auto-play and episode management
- Cross-page audio continuity

### 5. [Translation & Global Features](./05-translation-global-features.md)
**System infrastructure**: Translation management, themes, navigation
- Portuguese translation system with caching
- Dual theme support (Light/Dark)
- Mobile navigation and responsive design
- Background animations and global state management

### 6. [Discovery Quiz System](./06-discovery-quiz-system.md)
**Scenario-based learning**: Interactive distribution identification
- Real-world scenarios for practical learning
- Multiple distribution types coverage
- Adaptive feedback and explanations
- Performance analysis by distribution type

## Usage Guidelines

### For Developers
- Each flowchart represents a self-contained system module
- Use these diagrams for understanding system architecture
- Reference when implementing new features or debugging
- Follow the established patterns for consistency

### For Documentation
- Flowcharts are Mermaid.js compatible
- Can be exported as PNG, SVG, or PDF
- Suitable for technical documentation and presentations
- Include detailed feature descriptions for each system

### For Project Management
- Visual representation of system complexity
- Clear separation of concerns between modules
- Helpful for task assignment and sprint planning
- Identifies dependencies between systems

## System Integration

While each flowchart shows a distinct system, they are interconnected:

- **Translation System** provides content for all other systems
- **Main Routing** determines which system to load
- **Global Features** provide consistent UI/UX across all systems
- **API System** serves data to Quiz and Calculator systems
- **Theme System** affects visual presentation of all components

## Export Instructions

Each Mermaid flowchart can be exported using:
1. Mermaid CLI tools
2. Online Mermaid editors
3. VS Code Mermaid extensions
4. GitHub's native Mermaid rendering

Choose the format based on your documentation needs:
- **PNG**: For presentations and documentation
- **SVG**: For scalable web documentation
- **PDF**: For formal documentation packages
