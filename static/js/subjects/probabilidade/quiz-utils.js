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

            // All quiz types now use the API endpoint
            response = await fetch(`/api/quiz/${quizType}`);

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
        let messageKey = '';
        let iconClass = '';

        if (percentage === 100) {
            messageKey = 'perfect';
            iconClass = 'fa-trophy';
        } else if (percentage >= 90) {
            messageKey = 'excellent';
            iconClass = 'fa-star';
        } else if (percentage >= 80) {
            messageKey = 'very_good';
            iconClass = 'fa-star';
        } else if (percentage >= 70) {
            messageKey = 'good';
            iconClass = 'fa-thumbs-up';
        } else if (percentage >= 60) {
            messageKey = 'fair';
            iconClass = 'fa-thumbs-up';
        } else if (percentage >= 50) {
            messageKey = 'needs_improvement';
            iconClass = 'fa-book';
        } else {
            messageKey = 'keep_trying';
            iconClass = 'fa-book';
        }

        // Get message from translations with fallback
        let message = '';
        if (window.translations && window.translations.general && window.translations.general.quiz_feedback) {
            const feedback = window.translations.general.quiz_feedback[messageKey];
            if (feedback) {
                message = feedback[subject] || feedback.general || '';
            }
        }

        // Simplified fallback - just use generic messages if translations fail
        if (!message) {
            switch (messageKey) {
                case 'perfect':
                case 'excellent':
                    message = window.translations?.general?.quiz_feedback?.excellent?.general || '🎉 Excelente!';
                    break;
                case 'very_good':
                case 'good':
                    message = window.translations?.general?.quiz_feedback?.very_good?.general || '👍 Muito bom!';
                    break;
                case 'fair':
                case 'needs_improvement':
                    message = window.translations?.general?.quiz_feedback?.fair?.general || '📚 Continue estudando!';
                    break;
                default:
                    message = window.translations?.general?.quiz_feedback?.keep_trying?.general || '💪 Continue praticando!';
            }
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
                    <p>${isCorrect ? (window.translations?.general?.correct || 'Correto!') : (window.translations?.general?.incorrect || 'Incorreto!')}</p>
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
