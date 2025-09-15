/**
 * Unified Quiz System
 * Modern, consolidated quiz implementation that works for all quiz types
 */

class UnifiedQuizSystem {
    constructor() {
        this.quizData = null;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.quizType = null;
        this.startTime = null;
        this.endTime = null;

        // DOM elements
        this.elements = {
            container: null,
            startSection: null,
            questionsSection: null,
            resultsSection: null,
            questionText: null,
            optionsContainer: null,
            feedback: null,
            controls: null,
            startButton: null,
            nextButton: null,
            restartButton: null,
            finalScore: null,
            resultsMessage: null
        };

        this.init();
    }

    async init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('Setting up Unified Quiz System...');

        // Apply theme
        QuizUtils.applyTheme();

        // Get quiz container and type
        this.elements.container = document.querySelector('.quiz-container');
        if (!this.elements.container) {
            console.warn('Quiz container not found');
            return;
        }

        this.quizType = this.elements.container.dataset.quizType;
        if (!this.quizType) {
            console.error('Quiz type not specified');
            return;
        }

        // Initialize DOM elements
        this.initializeElements();

        // Bind events
        this.bindEvents();

        // Load quiz data
        this.loadQuiz();
    }

    initializeElements() {
        const elementMap = {
            startSection: 'quiz-start',
            questionsSection: 'quiz-questions',
            resultsSection: 'quiz-results',
            questionText: 'question-text',
            optionsContainer: 'options-container',
            feedback: 'feedback',
            controls: '.quiz-controls',
            startButton: 'start-quiz',
            nextButton: '.next-question',
            restartButton: 'restart-quiz',
            finalScore: 'final-score',
            resultsMessage: '.results-message'
        };

        Object.keys(elementMap).forEach(key => {
            const selector = elementMap[key];
            this.elements[key] = selector.startsWith('.') || selector.startsWith('#')
                ? document.querySelector(selector)
                : document.getElementById(selector);
        });
    }

    bindEvents() {
        if (this.elements.startButton) {
            this.elements.startButton.addEventListener('click', () => this.startQuiz());
        }

        if (this.elements.nextButton) {
            this.elements.nextButton.addEventListener('click', () => this.nextQuestion());
        }

        if (this.elements.restartButton) {
            this.elements.restartButton.addEventListener('click', () => this.restartQuiz());
        }
    }

    async loadQuiz() {
        try {
            console.log(`Loading quiz data for type: ${this.quizType}`);
            this.quizData = await QuizUtils.loadQuizData(this.quizType);

            if (!this.quizData) {
                throw new Error('Failed to load quiz data');
            }

            console.log(`Quiz loaded successfully with ${this.quizData.questions.length} questions`);
        } catch (error) {
            console.error('Error loading quiz:', error);
            this.showError(window.translations?.general?.error_loading_quiz || 'Não foi possível carregar o quiz. Por favor, tente novamente.');
        }
    }

    startQuiz() {
        if (!this.quizData) {
            console.error('Quiz data not loaded');
            return;
        }

        console.log('Starting quiz...');

        // Reset state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = new Date();

        // Use questionsPerSession from quiz data, fallback to 10
        const questionsPerSession = this.quizData.questionsPerSession || 10;

        // Prepare questions
        try {
            this.currentQuestions = QuizUtils.prepareQuestions(this.quizData.questions, questionsPerSession);
        } catch (error) {
            console.error('Error preparing questions:', error);
            this.showError('Erro ao preparar as questões do quiz.');
            return;
        }

        // Show questions section
        this.showSection('questions');

        // Display first question
        this.showQuestion();
    }

    showSection(section) {
        const sections = ['start', 'questions', 'results'];
        sections.forEach(s => {
            const element = this.elements[`${s}Section`];
            if (element) {
                element.classList.toggle('active', s === section);
            }
        });
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.showResults();
            return;
        }

        const question = this.currentQuestions[this.currentQuestionIndex];

        // Update question text
        if (this.elements.questionText) {
            this.elements.questionText.textContent = question.question;
        }

        // Create option buttons
        if (this.elements.optionsContainer) {
            this.elements.optionsContainer.innerHTML = '';

            question.options.forEach((option, index) => {
                const button = QuizUtils.createOptionButton(
                    option,
                    index,
                    (selectedIndex) => this.selectAnswer(selectedIndex)
                );
                this.elements.optionsContainer.appendChild(button);
            });
        }

        // Update progress
        QuizUtils.updateProgress(this.currentQuestionIndex, this.currentQuestions.length, this.score);

        // Hide feedback and controls
        if (this.elements.feedback) {
            this.elements.feedback.style.display = 'none';
        }
        if (this.elements.controls) {
            this.elements.controls.style.display = 'none';
        }
    }

    selectAnswer(selectedIndex) {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correctAnswer;

        // Disable all option buttons and add visual feedback
        const optionButtons = this.elements.optionsContainer.querySelectorAll('.quiz-option');
        optionButtons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === question.correctAnswer) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Update score
        if (isCorrect) {
            this.score++;
        }

        // Show feedback
        QuizUtils.showFeedback(isCorrect, question.explanation);

        // Update score display
        QuizUtils.updateProgress(this.currentQuestionIndex, this.currentQuestions.length, this.score);
    }

    nextQuestion() {
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.showResults();
        } else {
            // Reset buttons for next question
            QuizUtils.resetOptionButtons();
            this.showQuestion();
        }
    }

    showResults() {
        this.endTime = new Date();
        const percentage = Math.round((this.score / this.currentQuestions.length) * 100);

        // Show results section
        this.showSection('results');

        // Update final score
        if (this.elements.finalScore) {
            this.elements.finalScore.textContent = percentage;
        }

        // Show message and update icon
        const { message, iconClass } = QuizUtils.getScoreMessage(percentage, this.quizType);

        if (this.elements.resultsMessage) {
            this.elements.resultsMessage.innerHTML = `
                <p>${message}</p>
                <p>Você acertou ${this.score} de ${this.currentQuestions.length} questões.</p>
            `;
        }

        // Update results icon
        const resultIcon = document.querySelector('#quiz-results .fa-3x');
        if (resultIcon && iconClass) {
            resultIcon.className = `fas ${iconClass} fa-3x`;
        }

        console.log(`Quiz completed: ${this.score}/${this.currentQuestions.length} (${percentage}%)`);
    }

    restartQuiz() {
        // Reset state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = null;
        this.endTime = null;

        // Reset UI
        QuizUtils.resetOptionButtons();

        // Show start section
        this.showSection('start');

        console.log('Quiz restarted');
    }

    showError(message) {
        console.error('Quiz Error:', message);

        if (this.elements.container) {
            this.elements.container.innerHTML = `
                <div class="quiz-error">
                    <div class="error-content">
                        <i class="fas fa-exclamation-triangle fa-3x"></i>
                        <h3>Erro</h3>
                        <p>${message}</p>
                        <button onclick="location.reload()" class="btn btn-primary">
                            <i class="fas fa-redo"></i>
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if there's a quiz container
    if (document.querySelector('.quiz-container')) {
        new UnifiedQuizSystem();
    }
});
