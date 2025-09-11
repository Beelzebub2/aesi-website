document.addEventListener('DOMContentLoaded', () => {
    // Check for theme preference from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const quizContainer = document.querySelector('.quiz-container');
    if (!quizContainer || !quizContainer.dataset.quizType) return;

    const quizType = quizContainer.dataset.quizType;
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    const startSection = document.getElementById('quiz-start');
    const questionsSection = document.getElementById('quiz-questions');
    const resultsSection = document.getElementById('quiz-results');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const progressBar = document.querySelector('.progress');
    const scoreDisplay = document.getElementById('score');
    const finalScoreDisplay = document.getElementById('final-score');
    const feedback = document.getElementById('feedback');

    // Enhanced Quiz System
    class QuizSystem {
        constructor() {
            this.currentQuestions = [];
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.startTime = null;
            this.endTime = null;
            this.answered = [];
        }

        async init() {
            this.bindEvents();
            await this.loadQuiz();
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
                // Get current subject from URL path
                const pathParts = window.location.pathname.split('/');
                const subject = pathParts[1] || 'analise_estatistica'; // fallback to analise_estatistica

                const response = await fetch(`/api/quiz/${subject}`);
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
                    q && q.question && q.options && Array.isArray(q.options) &&
                    typeof q.correctAnswer === 'number' && q.options.length > 0
                );

                if (validQuestions.length === 0) {
                    throw new Error('No valid questions found in quiz data');
                }

                this.currentQuestions = this.prepareQuestions(validQuestions);
                console.log(`Loaded ${this.currentQuestions.length} valid questions`);

            } catch (error) {
                console.error('Error loading quiz:', error);
                this.showError((window.translations?.general?.quiz_error_prefix || 'Erro ao carregar o quiz: ') + error.message);
            }
        }

        startQuiz() {
            if (this.currentQuestions.length === 0) {
                this.showError((window.translations?.general?.no_questions_available || 'Nenhuma pergunta disponível. Tente recarregar a página.'));
                return;
            }

            this.currentQuestionIndex = 0;
            this.score = 0;
            this.answered = [];
            this.startTime = new Date();

            this.showSection('quiz-questions');
            this.updateProgressDisplay();
            this.showQuestion();
        }

        showSection(sectionId) {
            const sections = document.querySelectorAll('.quiz-section');
            sections.forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
            });

            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.display = 'block';
            }
        }

        prepareQuestions(questions) {
            const shuffled = this.shuffleArray([...questions]);
            return shuffled.slice(0, Math.min(10, shuffled.length));
        }

        shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        updateProgressDisplay() {
            if (currentQuestionSpan) {
                currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
            }
            if (totalQuestionsSpan) {
                totalQuestionsSpan.textContent = this.currentQuestions.length;
            }
            if (progressBar) {
                const progress = ((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100;
                progressBar.style.width = `${progress}%`;
            }
            if (scoreDisplay) {
                scoreDisplay.textContent = this.score;
            }
        }

        showQuestion() {
            if (this.currentQuestionIndex >= this.currentQuestions.length) {
                this.showResults();
                return;
            }

            const question = this.currentQuestions[this.currentQuestionIndex];

            if (questionText) {
                questionText.textContent = question.question;
            }
            if (optionsContainer) {
                optionsContainer.innerHTML = '';

                question.options.forEach((option, index) => {
                    const button = document.createElement('button');
                    button.className = 'quiz-option';
                    button.textContent = option;
                    button.addEventListener('click', () => this.selectOption(index));
                    optionsContainer.appendChild(button);
                });
            }

            if (feedback) {
                feedback.style.display = 'none';
            }

            const controls = document.querySelector('.quiz-controls');
            if (controls) {
                controls.style.display = 'none';
            }

            this.updateProgressDisplay();
        }

        selectOption(selectedIndex) {
            const question = this.currentQuestions[this.currentQuestionIndex];
            const isCorrect = selectedIndex === question.correctAnswer;

            if (isCorrect) {
                this.score++;
            }

            this.answered.push({
                question: question.question,
                selected: selectedIndex,
                correct: question.correctAnswer,
                isCorrect: isCorrect
            });

            // Highlight the selected option and show correct answer
            const options = optionsContainer.querySelectorAll('.quiz-option');
            options.forEach((btn, index) => {
                btn.disabled = true;
                if (index === selectedIndex) {
                    btn.classList.add(isCorrect ? 'correct' : 'incorrect');
                }
                // If user was wrong, also highlight the correct answer
                if (!isCorrect && index === question.correctAnswer) {
                    btn.classList.add('correct');
                }
            });

            // Show feedback
            if (feedback) {
                feedback.innerHTML = `
                    <div class="feedback-content ${isCorrect ? 'correct' : 'incorrect'}">
                        <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        <p>${isCorrect ? (window.translations?.general?.correct || 'Correto!') : (window.translations?.general?.incorrect || 'Incorreto!')}</p>
                        ${question.explanation ? `<p class="explanation">${question.explanation}</p>` : ''}
                    </div>
                `;
                feedback.style.display = 'block';

                // Auto-scroll to feedback after a short delay
                setTimeout(() => {
                    feedback.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300);
            }

            // Show next button
            const controls = document.querySelector('.quiz-controls');
            if (controls) {
                controls.style.display = 'block';
                const nextBtn = controls.querySelector('.next-question');
                if (nextBtn) {
                    nextBtn.onclick = () => this.nextQuestion();
                }
            }
        }

        nextQuestion() {
            this.currentQuestionIndex++;
            this.showQuestion();
        }

        showResults() {
            this.endTime = new Date();
            const duration = Math.round((this.endTime - this.startTime) / 1000);
            const percentage = Math.round((this.score / this.currentQuestions.length) * 100);

            this.showSection('quiz-results');

            if (finalScoreDisplay) {
                finalScoreDisplay.textContent = percentage;
            }

            // Show performance message
            const resultsMessage = document.querySelector('.results-message');
            if (resultsMessage) {
                let message = '';
                if (percentage >= 90) {
                    message = window.translations?.general?.quiz_feedback?.excellent?.general || '🎉 Excelente! Você domina bem os conceitos!';
                } else if (percentage >= 70) {
                    message = window.translations?.general?.quiz_feedback?.very_good?.general || '👍 Muito bom! Você tem um bom conhecimento.';
                } else if (percentage >= 50) {
                    message = window.translations?.general?.quiz_feedback?.fair?.general || '📚 Bom trabalho! Continue estudando para melhorar.';
                } else {
                    message = window.translations?.general?.quiz_feedback?.keep_trying?.general || '💪 Continue praticando! O conhecimento vem com a prática.';
                }

                resultsMessage.innerHTML = `
                    <p>${message}</p>
                    <p><strong>${window.translations?.general?.time || 'Tempo:'}:</strong> ${duration} ${window.translations?.general?.seconds || 'segundos'}</p>
                    <p><strong>${window.translations?.general?.score_hits || 'Acertos:'}:</strong> ${this.score} ${window.translations?.general?.of || 'de'} ${this.currentQuestions.length}</p>
                `;
            }
        }

        restartQuiz() {
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.answered = [];
            this.startTime = null;
            this.endTime = null;

            this.showSection('quiz-start');

            if (progressBar) {
                progressBar.style.width = '0%';
            }
            if (scoreDisplay) {
                scoreDisplay.textContent = '0';
            }
        }

        showError(message) {
            console.error('Quiz Error:', message);

            if (startSection) {
                startSection.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle fa-3x"></i>
                        <h2>${window.translations?.general?.error || 'Erro'}</h2>
                        <p>${message}</p>
                        <button onclick="location.reload()" class="btn btn-primary">
                            <i class="fas fa-redo"></i>
                            ${window.translations?.general?.try_again || 'Tentar Novamente'}
                        </button>
                    </div>
                `;
            }
        }
    }

    // Initialize the quiz system
    const quiz = new QuizSystem();
    quiz.init();
});
