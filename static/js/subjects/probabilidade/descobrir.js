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
    const optionsContainer = document.getElementById('options-container'); const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const progressBar = document.querySelector('.progress');
    const scoreDisplay = document.getElementById('score');
    const finalScoreDisplay = document.getElementById('final-score');
    const feedbackContainer = document.querySelector('.quiz-feedback');
    const feedbackTitle = feedbackContainer.querySelector('h3');
    const feedbackText = feedbackContainer.querySelector('p');
    const nextButton = feedbackContainer.querySelector('.next-question');
    const restartButton = document.getElementById('restart-quiz');
    const resultsMessage = document.querySelector('.results-message');

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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

            return {
                questions: shuffleArray(data.questions).slice(0, data.questionsPerSession || 10),
                questionsPerSession: data.questionsPerSession || 10
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
            button.textContent = option;
            button.classList.add('quiz-option');
            button.addEventListener('click', () => checkAnswer(index));
            optionsContainer.appendChild(button);
        });

        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        progressBar.style.width = `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`;

        // Hide the feedback container when showing a new question
        feedbackContainer.classList.add('hidden');
    } function checkAnswer(selectedIndex) {
        const currentQuestion = currentQuestions[currentQuestionIndex];
        const isCorrect = selectedIndex === currentQuestion.correctAnswer;

        // Disable all option buttons
        const options = optionsContainer.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.disabled = true;
            option.classList.remove('correct', 'incorrect');
        });

        // Highlight correct and incorrect answers
        options[currentQuestion.correctAnswer].classList.add('correct');
        if (!isCorrect) {
            options[selectedIndex].classList.add('incorrect');
        }

        // Update score and show feedback
        const feedbackIcon = document.querySelector('.feedback-icon');
        const nextButton = document.querySelector('.next-question');
        nextButton.style.display = 'block';

        if (isCorrect) {
            score++;
            scoreDisplay.textContent = score;
            feedbackTitle.textContent = 'Correto!';
            feedbackIcon.classList.remove('fa-times');
            feedbackIcon.classList.add('fa-check');
            feedbackIcon.style.color = 'var(--success)';
        } else {
            feedbackTitle.textContent = 'Incorreto';
            feedbackIcon.classList.remove('fa-check');
            feedbackIcon.classList.add('fa-times');
            feedbackIcon.style.color = 'var(--error)';
        }

        feedbackText.textContent = currentQuestion.explanation;
        feedbackContainer.classList.remove('hidden');
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
        feedbackContainer.classList.add('hidden');

        // Hide the next button at the start
        document.querySelector('.next-question').style.display = 'none';

        showQuestion(currentQuestions[0]);
    }

    function nextQuestion() {
        feedbackContainer.classList.add('hidden');
        currentQuestionIndex++;

        if (currentQuestionIndex < currentQuestions.length) {
            showQuestion(currentQuestions[currentQuestionIndex]);
        } else {
            showResults();
        }
    }    // Event Listeners
    document.getElementById('start-quiz').addEventListener('click', startQuiz);
    document.querySelector('.next-question').addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', startQuiz);
});
