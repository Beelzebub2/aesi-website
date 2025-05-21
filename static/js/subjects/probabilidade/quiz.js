let quizData = null;
let availableQuizzes = ['math', 'science', 'history'];

async function loadQuiz(quizType) {
    try {
        const response = await fetch(`/static/quizzes/${quizType}_quiz.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${quizType} quiz`);
        }
        quizData = await response.json();
        return quizData.questions;
    } catch (error) {
        console.error('Error loading quiz:', error);
        return [];
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function prepareQuestions(questions) {
    // Create a deep copy of questions and shuffle them
    const shuffledQuestions = JSON.parse(JSON.stringify(questions));
    shuffleArray(shuffledQuestions);

    // Shuffle options for each question
    shuffledQuestions.forEach(question => {
        const correctAnswer = question.correct;
        shuffleArray(question.options);
        // Update correct answer to be the new index of the correct option
        question.correctIndex = question.options.indexOf(correctAnswer);
    });

    return shuffledQuestions;
}

// Debug helper
function logDebug(message) {
    console.log(`[DEBUG] ${message}`);
}

let currentQuestion = 0;
let score = 0;
let activeQuestions;
let currentQuizType = '';

document.addEventListener('DOMContentLoaded', async () => {
    logDebug('Document loaded');

    // Create quiz type selector
    const quizSelector = document.createElement('div');
    quizSelector.className = 'quiz-selector';
    quizSelector.innerHTML = `
        <h2>Select a Quiz Type</h2>
        <div class="quiz-types">
            ${availableQuizzes.map(type => `
                <button class="quiz-type-btn" data-quiz="${type}">
                    <i class="fas ${getQuizIcon(type)}"></i>
                    ${type.charAt(0).toUpperCase() + type.slice(1)} Quiz
                </button>
            `).join('')}
        </div>
    `;

    const quizArea = document.getElementById('quizArea');
    quizArea.appendChild(quizSelector);

    // Add click handlers for quiz type buttons
    document.querySelectorAll('.quiz-type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const quizType = e.currentTarget.dataset.quiz;
            quizSelector.remove();
            initializeQuiz(quizType);
        });
    });
});

async function initializeQuiz(quizType) {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = `
        <div class="spinner"></div>
        <p>Loading ${quizType} quiz...</p>
    `;

    const quizArea = document.getElementById('quizArea');
    quizArea.appendChild(loadingIndicator);

    try {
        const questions = await loadQuiz(quizType);
        if (!questions || questions.length === 0) {
            throw new Error('No questions available');
        }

        currentQuizType = quizType;
        activeQuestions = prepareQuestions(questions);
        currentQuestion = 0;
        score = 0;

        // Update UI elements
        document.querySelector('.quiz-header').style.display = 'block';
        document.querySelector('.question-container').style.display = 'block';
        document.querySelector('.quiz-title').textContent = `${quizType.charAt(0).toUpperCase() + quizType.slice(1)} Quiz`;
        document.getElementById('totalQuestions').textContent = activeQuestions.length;

        displayQuestion();
    } catch (error) {
        showError(`Failed to load quiz: ${error.message}`);
    } finally {
        loadingIndicator.remove();
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
        <button onclick="location.reload()">Try Again</button>
    `;

    const quizArea = document.getElementById('quizArea');
    quizArea.innerHTML = '';
    quizArea.appendChild(errorDiv);
}

function displayQuestion() {
    logDebug(`Showing question ${currentQuestion + 1}`);
    const question = activeQuestions[currentQuestion];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });

    if (document.getElementById('currentQuestion')) {
        document.getElementById('currentQuestion').textContent = currentQuestion + 1;
    }
    updateProgressBar();
}

function updateProgressBar() {
    logDebug('Updating progress bar');
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const progress = ((currentQuestion + 1) / activeQuestions.length) * 100;
        progressFill.style.width = `${progress}%`;
    } else {
        logDebug('Progress bar element not found');
    }
} function checkAnswer(selectedIndex) {
    logDebug(`Checking answer: selected ${selectedIndex}`);
    const currentQ = activeQuestions[currentQuestion];
    const correct = currentQ.options[selectedIndex] === currentQ.correct;
    const options = document.querySelectorAll('.quiz-option');

    // Disable all options and show feedback
    options.forEach(option => {
        option.disabled = true;
        option.classList.add('disabled');
    });

    // Mark selected answer
    options[selectedIndex].classList.add(correct ? 'correct' : 'wrong');

    // Show correct answer if wrong
    if (!correct) {
        options[currentQ.correctIndex].classList.add('correct');
    }

    // Show feedback with explanation
    feedback.style.display = 'block';
    if (correct) {
        score += 10;
        document.getElementById('score').textContent = score;
        feedback.innerHTML = `
            <div class="feedback correct">
                <i class="fas fa-check-circle"></i>
                <p>Correct! +10 points</p>
                <p class="explanation">${currentQ.explanation}</p>
            </div>`;
    } else {
        feedback.innerHTML = `
            <div class="feedback incorrect">
                <i class="fas fa-times-circle"></i>
                <p>Incorrect!</p>
                <p class="explanation">${currentQ.explanation}</p>
            </div>`;
    }

    nextBtn.style.display = 'block';
}

const nextBtn = document.getElementById('nextBtn');
const quizArea = document.getElementById('quizArea');
const questionText = document.getElementById('questionText');
const optionsContainer = document.querySelector('.quiz-options');
const feedback = document.getElementById('feedback');

// Verify DOM elements
if (!nextBtn) logDebug('nextBtn not found');
if (!quizArea) logDebug('quizArea not found');
if (!questionText) logDebug('questionText not found');
if (!optionsContainer) logDebug('optionsContainer not found');
if (!feedback) logDebug('feedback not found');

// Initialize quiz immediately
initializeQuiz();
showQuestion(); function initializeQuiz() {
    logDebug('Initializing quiz');
    currentQuestion = 0;
    score = 0;

    // Show quiz UI elements
    document.querySelector('.quiz-header').style.display = 'block';
    document.querySelector('.question-container').style.display = 'block';
    document.querySelector('.quiz-controls').style.display = 'block';

    // Update quiz title
    document.querySelector('.quiz-title').textContent = quizData.name;

    // Make sure these elements exist
    if (document.getElementById('totalQuestions')) {
        document.getElementById('totalQuestions').textContent = activeQuestions.length;
    } else {
        logDebug('totalQuestions element not found');
    }

    if (document.getElementById('score')) {
        document.getElementById('score').textContent = '0';
    } else {
        logDebug('score element not found');
    }
}

function showQuestion() {
    logDebug(`Showing question ${currentQuestion + 1}`);
    const question = activeQuestions[currentQuestion];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });

    if (document.getElementById('currentQuestion')) {
        document.getElementById('currentQuestion').textContent = currentQuestion + 1;
    }
    updateProgressBar();
}

function updateProgressBar() {
    logDebug('Updating progress bar');
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const progress = ((currentQuestion + 1) / activeQuestions.length) * 100;
        progressFill.style.width = `${progress}%`;
    } else {
        logDebug('Progress bar element not found');
    }
} function checkAnswer(selectedIndex) {
    logDebug(`Checking answer: selected ${selectedIndex}`);
    const currentQ = activeQuestions[currentQuestion];
    const correct = currentQ.options[selectedIndex] === currentQ.correct;
    const options = document.querySelectorAll('.quiz-option');

    // Disable all options and show feedback
    options.forEach(option => {
        option.disabled = true;
        option.classList.add('disabled');
    });

    // Mark selected answer
    options[selectedIndex].classList.add(correct ? 'correct' : 'wrong');

    // Show correct answer if wrong
    if (!correct) {
        options[currentQ.correctIndex].classList.add('correct');
    }

    // Show feedback with explanation
    feedback.style.display = 'block';
    if (correct) {
        score += 10;
        document.getElementById('score').textContent = score;
        feedback.innerHTML = `
            <div class="feedback correct">
                <i class="fas fa-check-circle"></i>
                <p>Correct! +10 points</p>
                <p class="explanation">${currentQ.explanation}</p>
            </div>`;
    } else {
        feedback.innerHTML = `
            <div class="feedback incorrect">
                <i class="fas fa-times-circle"></i>
                <p>Incorrect!</p>
                <p class="explanation">${currentQ.explanation}</p>
            </div>`;
    }

    nextBtn.style.display = 'block';
}

nextBtn.addEventListener('click', () => {
    logDebug('Next button clicked');
    currentQuestion++;
    feedback.innerHTML = '';

    if (currentQuestion < activeQuestions.length) {
        logDebug('Moving to next question');
        nextBtn.classList.add('hidden');
        showQuestion();
    } else {
        logDebug('Quiz completed');
        // Hide quiz elements
        document.querySelector('.quiz-header').style.display = 'none';
        document.querySelector('.question-container').style.display = 'none';
        document.querySelector('.quiz-controls').style.display = 'none';
        document.getElementById('feedback').style.display = 'none';

        // Show summary
        const summary = document.querySelector('.quiz-summary');
        summary.style.display = 'block';
        document.getElementById('finalScore').textContent = `${score} of ${activeQuestions.length * 10}`;

        // Add event listener to restart button
        document.querySelector('.restart-btn').addEventListener('click', () => {
            location.reload();
        });
    }
});

// Progress tracking and persistence
const PROGRESS_KEY = 'quiz_progress';
const HIGH_SCORES_KEY = 'quiz_high_scores';

function saveProgress() {
    const progress = {
        quizType: currentQuizType,
        currentQuestion,
        score,
        timestamp: Date.now()
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function loadProgress() {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    if (savedProgress) {
        try {
            return JSON.parse(savedProgress);
        } catch (e) {
            console.error('Failed to parse saved progress:', e);
            return null;
        }
    }
    return null;
}

function updateHighScores(quizType, newScore) {
    const highScores = getHighScores();
    if (!highScores[quizType] || newScore > highScores[quizType]) {
        highScores[quizType] = newScore;
        localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores));
        return true;
    }
    return false;
}

function getHighScores() {
    const savedScores = localStorage.getItem(HIGH_SCORES_KEY);
    if (savedScores) {
        try {
            return JSON.parse(savedScores);
        } catch (e) {
            return {};
        }
    }
    return {};
}

// Update the quiz completion handler
function handleQuizCompletion() {
    const scorePercentage = (score / activeQuestions.length) * 100;
    const isHighScore = updateHighScores(currentQuizType, scorePercentage);

    const quizArea = document.getElementById('quizArea');
    quizArea.innerHTML = `
        <div class="quiz-completion">
            <h2>Quiz Complete!</h2>
            <div class="completion-stats">
                <p>Final Score: ${score} out of ${activeQuestions.length}</p>
                <p>Percentage: ${scorePercentage.toFixed(1)}%</p>
                ${isHighScore ? '<p class="new-high-score">New High Score! 🎉</p>' : ''}
            </div>
            <div class="completion-actions">
                <button onclick="restartQuiz('${currentQuizType}')">Try Again</button>
                <button onclick="showQuizSelection()">Choose Another Quiz</button>
            </div>
        </div>
    `;

    // Clear saved progress since quiz is complete
    localStorage.removeItem(PROGRESS_KEY);
}

function restartQuiz(quizType) {
    initializeQuiz(quizType);
}

function showQuizSelection() {
    document.querySelector('.quiz-completion').remove();
    const quizSelector = document.createElement('div');
    quizSelector.className = 'quiz-selector';
    quizSelector.innerHTML = `
        <h2>Select a Quiz Type</h2>
        <div class="quiz-types">
            ${availableQuizzes.map(type => `
                <button class="quiz-type-btn" data-quiz="${type}">
                    <i class="fas ${getQuizIcon(type)}"></i>
                    ${type.charAt(0).toUpperCase() + type.slice(1)} Quiz
                    <small class="high-score">Best: ${(getHighScores()[type] || 0).toFixed(1)}%</small>
                </button>
            `).join('')}
        </div>
    `;

    const quizArea = document.getElementById('quizArea');
    quizArea.innerHTML = '';
    quizArea.appendChild(quizSelector);

    // Reattach click handlers
    document.querySelectorAll('.quiz-type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const quizType = e.currentTarget.dataset.quiz;
            quizSelector.remove();
            initializeQuiz(quizType);
        });
    });
}

// Update displayQuestion to save progress
function displayQuestion() {
    // ...existing displayQuestion code...
    saveProgress();
}

// Check for saved progress on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedProgress = loadProgress();
    if (savedProgress && (Date.now() - savedProgress.timestamp) < 3600000) { // 1 hour expiry
        const resumeQuiz = confirm('Would you like to resume your previous quiz?');
        if (resumeQuiz) {
            currentQuizType = savedProgress.quizType;
            currentQuestion = savedProgress.currentQuestion;
            score = savedProgress.score;
            initializeQuiz(savedProgress.quizType);
            return;
        }
    }
    // Show quiz selection if not resuming
    showQuizSelection();
});
