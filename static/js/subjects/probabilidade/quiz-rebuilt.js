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
    const resultsMessage = document.querySelector('.results-message');

    function shuffleArray(array) {
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
    }

    async function loadQuestions() {
        try {
            const response = await fetch('/api/quiz/probabilidade');
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
                .slice(0, 10); // Quiz has 10 questions            // For each question, randomize the options while keeping track of the correct answer
            shuffledQuestions.forEach(question => {
                // Store the correct answer text based on index
                const correctAnswerText = question.options[question.correctAnswer];

                // Shuffle the options
                const shuffledOptions = shuffleArray(question.options);
                question.options = shuffledOptions;

                // Find the new index of the correct answer
                const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);
                question.correctAnswer = newCorrectIndex;                // Store the correct answer text for reference
                question.correctAnswerText = correctAnswerText;

                console.log(`Prepared question: "${question.question.substring(0, 30)}..."`);
                console.log(`  Correct answer: ${correctAnswerText} (new index: ${newCorrectIndex})`);
            });

            return {
                questions: shuffledQuestions,
                questionsPerSession: 10
            };
        } catch (error) {
            console.error('Error loading quiz:', error);
            alert('Erro ao carregar as questões do quiz. Por favor, tente novamente.');
            return null;
        }
    }

    function showQuestion(question) {
        questionText.textContent = question.question;
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', () => selectAnswer(index, question));
            optionsContainer.appendChild(button);
        });

        // Update progress
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        totalQuestionsSpan.textContent = currentQuestions.length;

        const progressPercentage = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Update score display
        scoreDisplay.textContent = score;

        // Hide feedback and controls
        feedback.style.display = 'none';
        quizControls.style.display = 'none';
    } function selectAnswer(selectedIndex, question) {
        // Disable all option buttons
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => btn.disabled = true);

        const isCorrect = selectedIndex === question.correctAnswer;

        // Add visual feedback to buttons
        optionButtons.forEach((btn, index) => {
            if (index === question.correctAnswer) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('wrong');
            }
        });

        if (isCorrect) {
            score++;
            scoreDisplay.textContent = score;
        }

        // Show feedback
        feedback.innerHTML = `
            <div class="feedback-content ${isCorrect ? 'correct' : 'wrong'}">
                <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                <p>${isCorrect ? 'Correto!' : 'Incorreto!'}</p>
                ${question.explanation ? `<p class="explanation">${question.explanation}</p>` : ''}
            </div>
        `;
        feedback.style.display = 'block';

        // Show next button after a short delay
        setTimeout(() => {
            quizControls.style.display = 'block';
        }, 1000);
    }

    function nextQuestion() {
        currentQuestionIndex++;

        if (currentQuestionIndex >= currentQuestions.length) {
            showResults();
        } else {
            // Reset option buttons
            const optionButtons = document.querySelectorAll('.option-btn');
            optionButtons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('correct', 'wrong');
            });

            showQuestion(currentQuestions[currentQuestionIndex]);
        }
    }

    function showResults() {
        startSection.classList.remove('active');
        questionsSection.classList.remove('active');
        resultsSection.classList.add('active');

        const percentage = Math.round((score / currentQuestions.length) * 100);
        finalScoreDisplay.textContent = percentage;

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
            <p>Você acertou ${score} de ${currentQuestions.length} questões.</p>
        `;
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;

        startSection.classList.remove('active');
        questionsSection.classList.add('active');
        resultsSection.classList.remove('active');

        showQuestion(currentQuestions[0]);
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;

        startSection.classList.add('active');
        questionsSection.classList.remove('active');
        resultsSection.classList.remove('active');
    }

    // Event listeners
    document.getElementById('start-quiz').addEventListener('click', startQuiz);
    nextButton.addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', restartQuiz);

    // Initialize quiz
    async function init() {
        const quizData = await loadQuestions();
        if (quizData) {
            currentQuestions = quizData.questions;
            console.log(`Quiz initialized with ${currentQuestions.length} questions`);
        }
    }

    init();
});
