/**
 * Shared Quiz Utilities
 * Common functionality for all quiz types to eliminate code duplication
 */

class QuizUtils {
    /**
     * Fisher-Yates shuffle algorithm with crypto random if available
     * @param {Array} array - Array to shuffle
     * @returns {Array} - New shuffled array
     */
    static shuffleArray(array) {
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

    /**
     * Prepare questions by shuffling and limiting count
     * @param {Array} questions - Original questions array
     * @param {number} maxQuestions - Maximum number of questions
     * @returns {Array} - Prepared questions
     */
    static prepareQuestions(questions, maxQuestions = 10) {
        if (!questions || !Array.isArray(questions)) {
            throw new Error('Invalid questions array');
        }

        const preparedQuestions = JSON.parse(JSON.stringify(questions));
        const shuffledQuestions = this.shuffleArray(preparedQuestions)
            .slice(0, Math.min(maxQuestions, preparedQuestions.length));

        // For each question, randomize options while preserving correct answer
        shuffledQuestions.forEach(question => {
            if (!question.options || !Array.isArray(question.options)) {
                return;
            }

            const correctAnswerText = question.options[question.correctAnswer];
            const shuffledOptions = this.shuffleArray(question.options);

            question.options = shuffledOptions;
            question.correctAnswer = shuffledOptions.indexOf(correctAnswerText);
            question.correctAnswerText = correctAnswerText;
        });

        return shuffledQuestions;
    }

    /**
     * Load quiz data from API
     * @param {string} quizType - Type of quiz (e.g., 'probabilidade', 'descobrir')
     * @returns {Promise<Object>} - Quiz data
     */
    static async loadQuizData(quizType) {
        try {
            let response;

            // Handle different quiz types with different endpoints
            if (quizType === 'descobrir') {
                response = await fetch(`/static/quizzes/descobrir_distribuição.json`);
            } else {
                response = await fetch(`/api/quiz/${quizType}`);
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch quiz data: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
                throw new Error('No questions found in quiz data');
            }

            return data;
        } catch (error) {
            console.error('Error loading quiz data:', error);
            throw error;
        }
    }

    /**
     * Calculate score message based on percentage
     * @param {number} percentage - Score percentage
     * @param {string} subject - Subject context for specific messages
     * @returns {Object} - Message and icon
     */
    static getScoreMessage(percentage, subject = 'general') {
        let message = '';
        let iconClass = '';

        if (percentage === 100) {
            message = subject === 'descobrir'
                ? 'Excelente! Você domina completamente a identificação das distribuições de probabilidade!'
                : '🎉 Excelente! Você domina bem os conceitos de probabilidade!';
            iconClass = 'fa-trophy';
        } else if (percentage >= 90) {
            message = subject === 'descobrir'
                ? 'Muito bom! Você tem um ótimo entendimento das distribuições de probabilidade.'
                : '🎉 Excelente! Você domina bem os conceitos de probabilidade!';
            iconClass = 'fa-star';
        } else if (percentage >= 80) {
            message = subject === 'descobrir'
                ? 'Muito bom! Você tem um ótimo entendimento das distribuições de probabilidade.'
                : '👍 Muito bom! Você tem um bom conhecimento sobre probabilidade.';
            iconClass = 'fa-star';
        } else if (percentage >= 70) {
            message = '👍 Muito bom! Você tem um bom conhecimento sobre probabilidade.';
            iconClass = 'fa-thumbs-up';
        } else if (percentage >= 60) {
            message = subject === 'descobrir'
                ? 'Bom trabalho! Continue praticando para melhorar sua compreensão.'
                : '📚 Razoável. Continue estudando para melhorar ainda mais!';
            iconClass = 'fa-thumbs-up';
        } else if (percentage >= 50) {
            message = '📚 Razoável. Continue estudando para melhorar ainda mais!';
            iconClass = 'fa-book';
        } else {
            message = subject === 'descobrir'
                ? 'Continue praticando! Reveja os conceitos básicos de cada distribuição.'
                : '💪 Continue praticando! A probabilidade pode ser desafiadora no início.';
            iconClass = 'fa-book';
        }

        return { message, iconClass };
    }

    /**
     * Create option button element
     * @param {string} option - Option text
     * @param {number} index - Option index
     * @param {Function} clickHandler - Click handler function
     * @returns {HTMLElement} - Button element
     */
    static createOptionButton(option, index, clickHandler) {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = option;
        button.style.animationDelay = `${index * 0.05}s`;
        button.addEventListener('click', () => clickHandler(index));
        return button;
    }

    /**
     * Update progress display
     * @param {number} current - Current question number (0-based)
     * @param {number} total - Total questions
     * @param {number} score - Current score
     */
    static updateProgress(current, total, score) {
        const elements = {
            currentQuestion: document.getElementById('current-question'),
            totalQuestions: document.getElementById('total-questions'),
            progressBar: document.getElementById('quiz-progress'),
            scoreDisplay: document.getElementById('score')
        };

        if (elements.currentQuestion) elements.currentQuestion.textContent = current + 1;
        if (elements.totalQuestions) elements.totalQuestions.textContent = total;
        if (elements.scoreDisplay) elements.scoreDisplay.textContent = score;

        if (elements.progressBar) {
            const percentage = ((current + 1) / total) * 100;
            elements.progressBar.style.width = `${percentage}%`;
        }
    }

    /**
     * Show feedback for answer
     * @param {boolean} isCorrect - Whether answer is correct
     * @param {string} explanation - Optional explanation text
     */
    static showFeedback(isCorrect, explanation = '') {
        const feedback = document.getElementById('feedback');
        const controls = document.querySelector('.quiz-controls');

        if (feedback) {
            feedback.innerHTML = `
                <div class="feedback-content ${isCorrect ? 'correct' : 'wrong'}">
                    <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    <p>${isCorrect ? 'Correto!' : 'Incorreto!'}</p>
                    ${explanation ? `<p class="explanation">${explanation}</p>` : ''}
                </div>
            `;
            feedback.style.display = 'block';
            feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        }

        if (controls) {
            controls.style.display = 'block';
        }

        // Smooth scroll to feedback on larger screens
        setTimeout(() => {
            if (feedback && window.innerWidth > 768) {
                feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }

    /**
     * Reset option buttons to initial state
     */
    static resetOptionButtons() {
        const buttons = document.querySelectorAll('.quiz-option, .option-btn');
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'wrong', 'incorrect', 'disabled');
        });
    }

    /**
     * Apply theme to elements
     */
    static applyTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

// Make QuizUtils available globally
window.QuizUtils = QuizUtils;
