console.log('Quiz script loaded');

let quizData = null;
const TOTAL_QUESTIONS = 10;
let currentQuestion = 0;
let score = 0;
let activeQuestions = [];

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing quiz...');
    await initializeQuiz();
});

async function loadQuiz() {
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

        // Filter out any questions that don't have all required fields
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
        showError(`Não foi possível carregar o Quiz: ${error.message}`);
        return null;
    }
}

async function initializeQuiz() {
    console.log('Initializing quiz...');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = `
        <div class="spinner"></div>
        <p>Carregando Quiz de probabilidade...</p>
    `;

    const quizArea = document.getElementById('quizArea');
    const quizHeader = document.getElementById('quizHeader');
    const questionContainer = document.getElementById('questionContainer');
    const quizControls = document.getElementById('quizControls');
    const quizSummary = document.getElementById('quizSummary');

    console.log('Quiz elements:', {
        quizArea: !!quizArea,
        quizHeader: !!quizHeader,
        questionContainer: !!questionContainer,
        quizControls: !!quizControls
    });

    if (!quizArea) {
        console.error('Quiz area element not found');
        return;
    }

    // Hide the summary if it's visible
    if (quizSummary) {
        quizSummary.style.display = 'none';
    }

    // Clear only the inner content, not the structure
    const quizOptions = document.getElementById('quizOptions');
    if (quizOptions) quizOptions.innerHTML = '';

    const feedback = document.getElementById('feedback');
    if (feedback) {
        feedback.innerHTML = '';
        feedback.style.display = 'none';
    }

    // Add loading indicator
    quizArea.appendChild(loadingIndicator);

    try {
        // Load quiz data
        quizData = await loadQuiz();
        console.log('Quiz data loaded:', quizData);

        if (!quizData) {
            throw new Error('Failed to load quiz data');
        }

        // Prepare questions
        activeQuestions = prepareQuestions(quizData.questions);
        console.log('Active questions prepared:', activeQuestions);

        if (!activeQuestions || activeQuestions.length === 0) {
            throw new Error('No questions available');
        }

        // Show quiz UI
        if (!quizHeader || !questionContainer || !quizControls) {
            console.error('Missing elements:', {
                quizHeader: !!quizHeader,
                questionContainer: !!questionContainer,
                quizControls: !!quizControls
            });
            throw new Error('Required quiz elements not found in DOM');
        }

        quizHeader.style.display = 'block';
        questionContainer.style.display = 'block';
        quizControls.style.display = 'block';

        // Update quiz title
        const quizTitle = document.getElementById('quizTitle');
        if (quizTitle) {
            quizTitle.textContent = quizData.name;
        }

        // Reset score display
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = '0';
        }

        // Show first question
        showQuestion();

    } catch (error) {
        console.error('Error in initializeQuiz:', error);
        showError(`Erro ao inicializar o Quiz: ${error.message}`);
    } finally {
        if (loadingIndicator.parentNode === quizArea) {
            quizArea.removeChild(loadingIndicator);
        }
    }
}

function shuffleArray(array) {
    // Create a new array to avoid modifying the original array
    const newArray = [...array];

    // Fisher-Yates (Knuth) shuffle algorithm - more thorough randomization
    for (let i = newArray.length - 1; i > 0; i--) {
        // Generate a more random index using crypto API if available
        let j;
        if (window.crypto && window.crypto.getRandomValues) {
            const randomArray = new Uint32Array(1);
            window.crypto.getRandomValues(randomArray);
            j = Math.floor((randomArray[0] / (0xffffffff + 1)) * (i + 1));
        } else {
            j = Math.floor(Math.random() * (i + 1));
        }

        // Swap elements
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
}

function prepareQuestions(questions) {
    console.log('Preparing and randomizing questions...');

    // Create a deep copy of questions
    const copiedQuestions = JSON.parse(JSON.stringify(questions));

    // Shuffle the entire question array
    const shuffledQuestions = shuffleArray(copiedQuestions);

    // Take only TOTAL_QUESTIONS questions
    const selectedQuestions = shuffledQuestions.slice(0, TOTAL_QUESTIONS);
    // For each question, store the correct answer and then shuffle options
    selectedQuestions.forEach(question => {
        if (question.options && Array.isArray(question.options)) {
            // Store the correct answer text
            const correctAnswer = question.correct;

            // Store the correct answer for future reference
            question.correctAnswer = correctAnswer;

            // Shuffle the options (this returns a new array that doesn't modify the original)
            const shuffledOptions = shuffleArray(question.options);

            // Update the question with shuffled options
            question.options = shuffledOptions;

            // Update the correct index to match the new position
            const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
            question.correctIndex = newCorrectIndex;

            console.log(`Question prepared: "${question.question.substring(0, 30)}..." 
                       Correct answer: ${correctAnswer}, 
                       New position: ${newCorrectIndex}`);
        }
    });

    console.log('Questions prepared with randomized answer positions');
    return selectedQuestions;
}

function updateScore(correct) {
    if (correct) {
        score += 10;
        document.getElementById('score').textContent = score;
    }
}

function showQuestion() {
    console.log('Showing question:', currentQuestion + 1);
    const question = activeQuestions[currentQuestion];
    const questionContainer = document.getElementById('questionContainer');

    if (!questionContainer) {
        console.error('Question container not found');
        return;
    }

    // Fade out current question
    questionContainer.style.opacity = '0';

    setTimeout(() => {
        // Update question text and options
        const questionText = document.getElementById('questionText');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        const totalQuestionsSpan = document.getElementById('totalQuestions');
        const optionsContainer = document.getElementById('quizOptions');

        if (!questionText || !currentQuestionSpan || !totalQuestionsSpan || !optionsContainer) {
            console.error('Required elements not found:', {
                questionText: !!questionText,
                currentQuestionSpan: !!currentQuestionSpan,
                totalQuestionsSpan: !!totalQuestionsSpan,
                optionsContainer: !!optionsContainer
            });
            return;
        }

        questionText.textContent = question.question;
        currentQuestionSpan.textContent = currentQuestion + 1;
        totalQuestionsSpan.textContent = TOTAL_QUESTIONS;
        optionsContainer.innerHTML = '';

        // Re-shuffle options again for extra randomness
        // This creates a new shuffled array but doesn't modify the original
        const displayOptions = shuffleArray(question.options);

        // Update the correct answer index to match the new order
        const newCorrectIndex = displayOptions.indexOf(question.correctAnswer);
        question.correctIndex = newCorrectIndex;

        // Store the reshuffled options back in the question
        question.options = displayOptions;

        // Create option buttons with randomized positions
        displayOptions.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;

            // Add subtle animation delay for cascading appearance
            button.style.animationDelay = `${index * 0.05}s`;

            button.onclick = () => checkAnswer(index);
            optionsContainer.appendChild(button);
        });

        // Fade in new question
        questionContainer.style.opacity = '1';

        // Update progress bar
        updateProgressBar();
    }, 300);
}

function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const progress = ((currentQuestion + 1) / TOTAL_QUESTIONS) * 100;
    progressFill.style.width = `${progress}%`;
}

function checkAnswer(selectedIndex) {
    const question = activeQuestions[currentQuestion];

    // Get the option text that was selected
    const selectedOptionText = question.options[selectedIndex];

    // Check if selected option matches the correct answer text
    const correct = selectedOptionText === question.correctAnswer;

    console.log(`Selected: ${selectedOptionText}, Correct: ${question.correctAnswer}, Result: ${correct}`);

    const options = document.querySelectorAll('.quiz-option');

    // Disable all options
    options.forEach(option => {
        option.disabled = true;
        option.classList.add('disabled');
    });

    // Highlight selected answer
    options[selectedIndex].classList.add(correct ? 'correct' : 'wrong');

    // Show correct answer if wrong
    if (!correct) {
        // Find the correct option by text content
        options.forEach((option, index) => {
            if (question.options[index] === question.correctAnswer) {
                option.classList.add('correct');
            }
        });
    }

    // Show feedback
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = `
        <div class="feedback ${correct ? 'correct' : 'incorrect'}">
            <i class="fas fa-${correct ? 'check-circle' : 'times-circle'}"></i>
            <p>${correct ? 'Correto!' : 'Incorreto!'}</p>
            ${question.explanation ? `<p class="explanation">${question.explanation}</p>` : ''}
        </div>
    `;
    feedback.style.display = 'block';

    // Update score
    updateScore(correct);

    // Show next button
    document.getElementById('nextBtn').style.display = 'block';
}

function showQuizCompletion() {
    console.log('Showing quiz completion');
    const finalScore = (score / (TOTAL_QUESTIONS * 10)) * 100;
    const isHighScore = updateHighScore(finalScore);

    // Instead of replacing quizArea's HTML, show the summary and hide other elements
    const quizHeader = document.getElementById('quizHeader');
    const questionContainer = document.getElementById('questionContainer');
    const quizControls = document.getElementById('quizControls');
    const feedback = document.getElementById('feedback');
    const quizSummary = document.getElementById('quizSummary');

    // Hide quiz components
    if (quizHeader) quizHeader.style.display = 'none';
    if (questionContainer) questionContainer.style.display = 'none';
    if (quizControls) quizControls.style.display = 'none';
    if (feedback) feedback.style.display = 'none';

    // Show and update summary
    if (quizSummary) {
        const finalScoreElement = document.getElementById('finalScore');
        if (finalScoreElement) {
            finalScoreElement.textContent = `${score} de ${TOTAL_QUESTIONS * 10} pontos (${finalScore.toFixed(1)}%)`;
        }

        // Remove any existing high score message
        const existingHighScore = quizSummary.querySelector('.new-high-score');
        if (existingHighScore) {
            existingHighScore.remove();
        }

        // Add high score message if applicable
        if (isHighScore) {
            const highScoreMsg = document.createElement('p');
            highScoreMsg.className = 'new-high-score';
            highScoreMsg.textContent = 'Novo recorde pessoal! 🎉';
            quizSummary.querySelector('.final-score').insertAdjacentElement('afterend', highScoreMsg);
        }

        quizSummary.style.display = 'block';
    }

    // Add event listener to the restart button
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        // Remove any existing listeners to avoid duplicates
        const newRestartBtn = restartBtn.cloneNode(true);
        restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);
        newRestartBtn.addEventListener('click', restartQuiz);
    }
}

function updateHighScore(newScore) {
    const highScores = getHighScores();
    const currentHighScore = highScores.probabilidade || 0;

    if (newScore > currentHighScore) {
        highScores.probabilidade = newScore;
        localStorage.setItem('quiz_high_scores', JSON.stringify(highScores));
        return true;
    }
    return false;
}

function getHighScores() {
    const savedScores = localStorage.getItem('quiz_high_scores');
    return savedScores ? JSON.parse(savedScores) : {};
}

function restartQuiz() {
    console.log('Restarting quiz...');
    // Reset quiz state
    currentQuestion = 0;
    score = 0;
    activeQuestions = [];

    // Hide summary and any error messages
    const quizSummary = document.getElementById('quizSummary');
    if (quizSummary) {
        quizSummary.style.display = 'none';
    }

    // Reset score display
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = '0';
    }

    // Reinitialize quiz
    initializeQuiz();
}

// Event listener for next button
document.getElementById('nextBtn').addEventListener('click', () => {
    const feedback = document.getElementById('feedback');
    feedback.style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';

    currentQuestion++;
    if (currentQuestion < TOTAL_QUESTIONS) {
        showQuestion();
    } else {
        showQuizCompletion();
    }
});

// Make sure showError is properly defined
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
        <button onclick="location.reload()">Tentar Novamente</button>
    `;

    const quizArea = document.getElementById('quizArea');
    if (quizArea) {
        quizArea.innerHTML = '';
        quizArea.appendChild(errorDiv);
    }
}
