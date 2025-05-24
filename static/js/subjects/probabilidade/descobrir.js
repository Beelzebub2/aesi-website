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
    const quizControls = document.querySelector('.quiz-controls');
    const nextButton = document.querySelector('.next-question');
    const restartButton = document.getElementById('restart-quiz');
    const resultsMessage = document.querySelector('.results-message'); function shuffleArray(array) {
        // Create a new array to avoid modifying the original
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
    } async function loadQuestions() {
        try {
            const response = await fetch(`/static/quizzes/${quizType}_distribuição.json`);
            if (!response.ok) {
                throw new Error(`Failed to fetch quiz data: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            console.log("Quiz data loaded:", data);

            if (!data.questions || data.questions.length === 0) {
                throw new Error("No questions found in quiz data");
            }

            // Create a deep copy of questions to prepare
            const preparedQuestions = JSON.parse(JSON.stringify(data.questions));

            // Shuffle all questions and pick the first N
            const shuffledQuestions = shuffleArray(preparedQuestions)
                .slice(0, data.questionsPerSession || 10);

            // For each question, randomize the options while keeping track of the correct answer
            shuffledQuestions.forEach(question => {
                // Store the correct answer text based on index
                const correctAnswerText = question.options[question.correctAnswer];

                // Shuffle the options
                const shuffledOptions = shuffleArray(question.options);
                question.options = shuffledOptions;

                // Find the new index of the correct answer
                const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);
                question.correctAnswer = newCorrectIndex;

                // Store the correct answer text for reference
                question.correctAnswerText = correctAnswerText;

                console.log(`Prepared question: "${question.question.substring(0, 30)}..."`);
                console.log(`  Correct answer: ${correctAnswerText} (new index: ${newCorrectIndex})`);
            });

            return {
                questions: shuffledQuestions,
                questionsPerSession: data.questionsPerSession || 10
            };
        } catch (error) {
            console.error('Error loading quiz:', error);
            alert('Erro ao carregar as questões do quiz. Por favor, tente novamente.');
            return null;
        }
    } function showQuestion(question) {
        questionText.textContent = question.question;
        optionsContainer.innerHTML = '';

        // Re-shuffle options for even more randomness
        const displayOptions = shuffleArray([...question.options]);

        // Find the new position of the correct answer
        const correctAnswerText = question.correctAnswerText || question.options[question.correctAnswer];
        const newCorrectIndex = displayOptions.indexOf(correctAnswerText);

        // Update the question's correct answer index
        question.correctAnswer = newCorrectIndex;

        // Update options in the question object
        question.options = displayOptions;

        // Create the option buttons with animations
        displayOptions.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('quiz-option');

            // Add animation delay for cascading effect
            button.style.animationDelay = `${index * 0.05}s`;

            button.addEventListener('click', () => checkAnswer(index));
            optionsContainer.appendChild(button);
        });

        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        progressBar.style.width = `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`;

        // Hide the feedback and controls when showing a new question
        feedback.style.display = 'none';
        quizControls.style.display = 'none';
    } function checkAnswer(selectedIndex) {
        const currentQuestion = currentQuestions[currentQuestionIndex];
        const isCorrect = selectedIndex === currentQuestion.correctAnswer;
        const selectedOptionText = currentQuestion.options[selectedIndex];
        const correctOptionText = currentQuestion.correctAnswerText || currentQuestion.options[currentQuestion.correctAnswer];

        console.log(`Selected: ${selectedOptionText}`);
        console.log(`Correct: ${correctOptionText}`);
        console.log(`Result: ${isCorrect ? "Correct!" : "Incorrect!"}`);

        // Disable all option buttons
        const options = optionsContainer.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.disabled = true;
            option.classList.add('disabled');
        });

        // Highlight correct and incorrect answers
        options[currentQuestion.correctAnswer].classList.add('correct');
        if (!isCorrect) {
            options[selectedIndex].classList.add('incorrect');
        }

        // Update score and show feedback
        feedback.innerHTML = `
            <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}"></i>
                <p>${isCorrect ? 'Correto!' : 'Incorreto!'}</p>
                ${currentQuestion.explanation ? `<p class="explanation">${currentQuestion.explanation}</p>` : ''}
            </div>
        `;
        feedback.style.display = 'block';

        // Show the next button
        quizControls.style.display = 'block';

        // Update score
        if (isCorrect) {
            score++;
            scoreDisplay.textContent = score;
        }
    } function showResults() {
        const percentage = Math.round((score / currentQuestions.length) * 100);
        finalScoreDisplay.textContent = percentage;

        let message = '';
        let iconClass = '';

        if (percentage === 100) {
            message = 'Excelente! Você domina completamente a identificação das distribuições de probabilidade!';
            iconClass = 'fa-trophy';
        } else if (percentage >= 80) {
            message = 'Muito bom! Você tem um ótimo entendimento das distribuições de probabilidade.';
            iconClass = 'fa-star';
        } else if (percentage >= 60) {
            message = 'Bom trabalho! Continue praticando para melhorar sua compreensão.';
            iconClass = 'fa-thumbs-up';
        } else {
            message = 'Continue praticando! Reveja os conceitos básicos de cada distribuição.';
            iconClass = 'fa-book';
        }

        resultsMessage.textContent = message;

        // Update the results icon based on score
        const resultIcon = document.querySelector('#quiz-results .fa-3x');
        if (resultIcon) {
            resultIcon.className = `fas ${iconClass} fa-3x`;
        }

        questionsSection.classList.remove('active');
        resultsSection.classList.add('active');
    } async function startQuiz() {
        const quizData = await loadQuestions();
        if (!quizData) return;

        currentQuestions = quizData.questions;
        currentQuestionIndex = 0;
        score = 0;
        scoreDisplay.textContent = '0';
        totalQuestionsSpan.textContent = currentQuestions.length;

        startSection.classList.remove('active');
        resultsSection.classList.remove('active');
        questionsSection.classList.add('active');

        // Hide the feedback and controls at start
        feedback.style.display = 'none';
        quizControls.style.display = 'none';

        showQuestion(currentQuestions[0]);
    }

    function nextQuestion() {
        currentQuestionIndex++;

        if (currentQuestionIndex < currentQuestions.length) {
            showQuestion(currentQuestions[currentQuestionIndex]);
        } else {
            showResults();
        }
    }// Event Listeners
    document.getElementById('start-quiz').addEventListener('click', startQuiz);
    document.querySelector('.next-question').addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', startQuiz);
});
