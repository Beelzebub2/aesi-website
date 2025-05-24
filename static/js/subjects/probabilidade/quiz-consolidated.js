console.log('Consolidated Quiz script loaded');

// Enhanced Quiz System
class QuizSystem {
    constructor() {
        this.quizData = null;
        this.TOTAL_QUESTIONS = 10;
        this.currentQuestion = 0;
        this.score = 0;
        this.activeQuestions = [];
        this.startTime = null;
        this.endTime = null;

        this.initializeComponents();
    }

    initializeComponents() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        console.log('Initializing quiz system...');
        this.bindEvents();
        await this.initializeQuiz();
    }

    bindEvents() {
        const startBtn = document.getElementById('start-quiz');
        const restartBtn = document.getElementById('restart-quiz');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.startQuiz());
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartQuiz());
        }
    }

    async loadQuiz() {
        console.log('Loading quiz data...');
        try {
            const response = await fetch('/api/quiz/probabilidade');
            console.log('Quiz response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`Failed to load quiz data: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Quiz data loaded:', data);

            if (!data || !data.questions || !Array.isArray(data.questions)) {
                console.error('Invalid quiz data structure:', data);
                throw new Error('Invalid quiz data format');
            }

            const validQuestions = data.questions.filter(q =>
                q && q.question && q.options && Array.isArray(q.options) && q.correct && q.options.length > 0
            );

            if (validQuestions.length === 0) {
                throw new Error('No valid questions found in quiz data');
            }

            console.log(`Found ${validQuestions.length} valid questions`);
            data.questions = validQuestions;
            return data;
        } catch (error) {
            console.error('Error in loadQuiz:', error);
            this.showError(`Não foi possível carregar o Quiz: ${error.message}`);
            return null;
        }
    }

    async initializeQuiz() {
        console.log('Initializing quiz...');
        try {
            this.quizData = await this.loadQuiz();
            if (!this.quizData) {
                throw new Error('Failed to load quiz data');
            }

            this.activeQuestions = this.prepareQuestions(this.quizData.questions);
            if (!this.activeQuestions || this.activeQuestions.length === 0) {
                throw new Error('No questions available');
            }

            console.log('Quiz initialized successfully');
        } catch (error) {
            console.error('Error in initializeQuiz:', error);
            this.showError(`Erro ao inicializar o Quiz: ${error.message}`);
        }
    }

    startQuiz() {
        console.log('Starting quiz...');
        this.currentQuestion = 0;
        this.score = 0;
        this.startTime = new Date();

        this.showSection('quiz-questions');
        this.updateProgressDisplay();
        this.showQuestion();
    }

    showSection(sectionId) {
        const sections = ['quiz-start', 'quiz-questions', 'quiz-results'];
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                element.classList.toggle('active', section === sectionId);
            }
        });
    }

    prepareQuestions(questions) {
        const shuffled = this.shuffleArray(questions);
        return shuffled.slice(0, Math.min(this.TOTAL_QUESTIONS, shuffled.length));
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    updateProgressDisplay() {
        const currentElement = document.getElementById('current-question');
        const totalElement = document.getElementById('total-questions');
        const progressBar = document.getElementById('quiz-progress');
        const scoreElement = document.getElementById('score');

        if (currentElement) currentElement.textContent = this.currentQuestion + 1;
        if (totalElement) totalElement.textContent = this.activeQuestions.length;
        if (scoreElement) scoreElement.textContent = this.score;

        if (progressBar) {
            const percentage = ((this.currentQuestion + 1) / this.activeQuestions.length) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }

    showQuestion() {
        if (this.currentQuestion >= this.activeQuestions.length) {
            this.showResults();
            return;
        }

        const question = this.activeQuestions[this.currentQuestion];
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const feedback = document.getElementById('feedback');
        const controls = document.querySelector('.quiz-controls');

        if (questionText) {
            questionText.textContent = question.question;
        }

        if (optionsContainer) {
            optionsContainer.innerHTML = '';

            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.textContent = option;
                button.addEventListener('click', () => this.selectOption(index));
                optionsContainer.appendChild(button);
            });
        }

        if (feedback) {
            feedback.style.display = 'none';
            feedback.innerHTML = '';
        }

        if (controls) {
            controls.style.display = 'none';
        }

        this.updateProgressDisplay();
    }

    selectOption(selectedIndex) {
        const question = this.activeQuestions[this.currentQuestion];
        const optionButtons = document.querySelectorAll('.option-btn');
        const feedback = document.getElementById('feedback');
        const controls = document.querySelector('.quiz-controls');

        // Disable all option buttons
        optionButtons.forEach(btn => btn.disabled = true);

        const isCorrect = selectedIndex === question.correct;

        // Add visual feedback
        optionButtons.forEach((btn, index) => {
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('wrong');
            }
        });

        if (isCorrect) {
            this.score++;
        }

        // Show feedback
        if (feedback) {
            feedback.innerHTML = `
                <div class="feedback-content ${isCorrect ? 'correct' : 'wrong'}">
                    <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    <p>${isCorrect ? 'Correto!' : 'Incorreto!'}</p>
                    ${question.explanation ? `<p class="explanation">${question.explanation}</p>` : ''}
                </div>
            `;
            feedback.style.display = 'block';
        }

        // Show next button
        if (controls) {
            controls.style.display = 'block';
            const nextBtn = controls.querySelector('.next-question');
            if (nextBtn) {
                nextBtn.onclick = () => this.nextQuestion();
            }
        }
    }

    nextQuestion() {
        this.currentQuestion++;
        this.showQuestion();
    }

    showResults() {
        this.endTime = new Date();
        const percentage = Math.round((this.score / this.activeQuestions.length) * 100);

        this.showSection('quiz-results');

        const finalScore = document.getElementById('final-score');
        if (finalScore) {
            finalScore.textContent = percentage;
        }

        const resultsMessage = document.querySelector('.results-message');
        if (resultsMessage) {
            let message = '';
            if (percentage >= 90) {
                message = '🎉 Excelente! Você domina bem os conceitos de probabilidade!';
            } else if (percentage >= 70) {
                message = '👍 Muito bom! Você tem um bom conhecimento sobre probabilidade.';
            } else if (percentage >= 50) {
                message = '📚 Razoável. Continue estudando para melhorar ainda mais!';
            } else {
                message = '💪 Continue praticando! A probabilidade pode ser desafiadora no início.';
            }

            resultsMessage.innerHTML = `
                <p>${message}</p>
                <p>Você acertou ${this.score} de ${this.activeQuestions.length} questões.</p>
            `;
        }
    }

    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.startTime = null;
        this.endTime = null;

        // Reset option buttons
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'wrong');
        });

        this.showSection('quiz-start');
    }

    showError(message) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erro</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary">
                    <i class="fas fa-redo"></i>
                    Tentar Novamente
                </button>
            </div>
        `;

        const container = document.querySelector('.quiz-container');
        if (container) {
            container.innerHTML = '';
            container.appendChild(errorContainer);
        }
    }
}

// Initialize the quiz system
new QuizSystem();
