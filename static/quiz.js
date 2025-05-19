const quizQuestions = [
    {
        question: "Qual distribuição discreta é mais adequada para modelar o número de sucessos num número fixo de tentativas independentes?",
        options: ["Binomial", "Poisson", "Normal", "Uniforme Discreta"],
        correct: 0
    },
    {
        question: "A distribuição de Poisson é mais adequada para modelar:",
        options: [
            "Eventos raros em intervalos fixos de tempo/espaço",
            "Distribuição de medidas contínuas",
            "Número fixo de sucessos em tentativas",
            "Eventos equiprováveis"
        ],
        correct: 0
    },
    {
        question: "A distribuição Normal é utilizada para:",
        options: [
            "Modelar fenómenos contínuos com distribuição simétrica",
            "Contar sucessos em tentativas fixas",
            "Contar eventos raros em intervalos",
            "Modelar tempos entre eventos"
        ],
        correct: 0
    },
    {
        question: "Na distribuição Binomial, quais condições devem ser satisfeitas?",
        options: [
            "Número fixo de tentativas e probabilidade constante",
            "Taxa média constante e eventos independentes",
            "Eventos raros e independentes",
            "Tentativas infinitas e probabilidade variável"
        ],
        correct: 0
    },
    {
        question: "A média da distribuição de Poisson é igual a:",
        options: [
            "Lambda (λ)",
            "np",
            "1/p",
            "n/2"
        ],
        correct: 0
    }
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function prepareQuestions() {
    // Create a deep copy of questions and shuffle them
    const shuffledQuestions = JSON.parse(JSON.stringify(quizQuestions));
    shuffleArray(shuffledQuestions);

    // Shuffle options for each question
    shuffledQuestions.forEach(question => {
        const correctAnswer = question.options[question.correct];
        shuffleArray(question.options);
        // Update correct answer index
        question.correct = question.options.indexOf(correctAnswer);
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

document.addEventListener('DOMContentLoaded', () => {
    logDebug('Document loaded');

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
    showQuestion();

    function initializeQuiz() {
        logDebug('Initializing quiz');
        currentQuestion = 0;
        score = 0;
        activeQuestions = prepareQuestions();

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
    }

    function checkAnswer(selectedIndex) {
        logDebug(`Checking answer: selected ${selectedIndex}`);
        const correct = selectedIndex === activeQuestions[currentQuestion].correct;
        const options = document.querySelectorAll('.quiz-option');

        options.forEach(option => option.disabled = true);
        options[selectedIndex].classList.add(correct ? 'correct' : 'wrong');
        options[activeQuestions[currentQuestion].correct].classList.add('correct');

        if (correct) {
            score += 20;
            if (document.getElementById('score')) {
                document.getElementById('score').textContent = score;
            }
            feedback.innerHTML = '<div class="feedback-correct">✨ Correto! +20 pontos</div>';
        } else {
            feedback.innerHTML = '<div class="feedback-wrong">❌ Incorreto!</div>';
        }

        nextBtn.classList.remove('hidden');
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
            quizArea.innerHTML = `
                <div class="final-score glass-card">
                    <h3>Questionário Concluído!</h3>
                    <p>A sua pontuação final: ${score} de ${activeQuestions.length * 20}</p>
                </div>`;

            nextBtn.innerHTML = `
                <i class="fas fa-redo"></i>
                <span>Tentar Novamente</span>
                <div class="button-effect"></div>`;

            nextBtn.classList.remove('hidden');
            nextBtn.addEventListener('click', () => {
                location.reload();
            }, { once: true });
        }
    });
});
