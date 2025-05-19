// Debug helper
function logDebug(message) {
    console.log(`[GAME DEBUG] ${message}`);
}

const scenarios = [
    {
        description: "Numa fábrica, estamos a contar o número de produtos defeituosos em lotes de 100 itens. A probabilidade de cada item ser defeituoso é constante.",
        correct: "binomial"
    },
    {
        description: "A contar o número de clientes que chegam a uma loja em intervalos de 1 hora. A taxa média é constante.",
        correct: "poisson"
    },
    {
        description: "Número de acidentes de viação por dia numa cidade grande.",
        correct: "poisson"
    },
    {
        description: "A lançar uma moeda 10 vezes e a contar o número de caras.",
        correct: "binomial"
    },
    {
        description: "Número de sucessos em 20 tentativas independentes de venda, onde cada venda tem 30% de chance de sucesso.",
        correct: "binomial"
    },
    {
        description: "Número médio de erros de digitação por página em um documento longo.",
        correct: "poisson"
    },
    {
        description: "Número de chamadas recebidas por minuto em uma central de atendimento.",
        correct: "poisson"
    },
    {
        description: "Em um jogo de dados, número de vezes que sai o número 6 em 12 lançamentos.",
        correct: "binomial"
    },
    {
        description: "Número de mutações genéticas em um segmento específico de DNA.",
        correct: "poisson"
    },
    {
        description: "Altura média dos estudantes numa universidade, considerando uma distribuição simétrica em torno da média.",
        correct: "normal"
    },
    {
        description: "Peso de recém-nascidos num hospital, sabendo que segue uma distribuição simétrica.",
        correct: "normal"
    },
    {
        description: "Pontuações num teste padronizado de QI, com média 100 e desvio padrão 15.",
        correct: "normal"
    },
    {
        description: "Tempo de vida útil de lâmpadas LED, assumindo variabilidade simétrica em torno da média.",
        correct: "normal"
    },
    {
        description: "Medidas de pressão arterial numa população adulta saudável.",
        correct: "normal"
    },
    {
        description: "Número de gols marcados por um time de futebol em um jogo.",
        correct: "poisson"
    },
    {
        description: "Em um teste de 20 questões verdadeiro/falso, número de respostas corretas ao chutar todas.",
        correct: "binomial"
    },
    {
        description: "Número de carros que passam por um pedágio em 5 minutos.",
        correct: "poisson"
    },
    {
        description: "Entre 50 sementes plantadas, número das que germinam, sabendo que cada uma tem 80% de chance.",
        correct: "binomial"
    },
    {
        description: "Número de peças defeituosas encontradas em uma hora de inspeção contínua.",
        correct: "poisson"
    },
    {
        description: "Quantidade de tarefas de suporte recebidas em 2 horas, dada uma taxa média constante.",
        correct: "poisson"
    },
    {
        description: "Número de vezes em que a face 3 aparece ao lançar um dado 8 vezes.",
        correct: "binomial"
    },
    {
        description: "Quantidade de e-mails recebidos a cada 30 minutos, de forma independente.",
        correct: "poisson"
    }
];

let currentScenario = 0;
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
    logDebug("Game script loaded");

    // Get all required elements
    const nextBtn = document.getElementById("nextBtn");
    const gameArea = document.getElementById("gameArea");
    const scenarioDiv = document.getElementById("scenario");
    const feedbackDiv = document.getElementById("feedback");
    const optionBtns = document.querySelectorAll('.option-btn');
    const scoreValue = document.getElementById("scoreValue");
    const totalQuestionsEl = document.getElementById("totalQuestions");
    const currentQuestionEl = document.getElementById("currentQuestion");

    // Check if all elements exist
    if (!nextBtn) logDebug("nextBtn not found");
    if (!gameArea) logDebug("gameArea not found");
    if (!scenarioDiv) logDebug("scenarioDiv not found");
    if (!feedbackDiv) logDebug("feedbackDiv not found");
    if (!scoreValue) logDebug("scoreValue not found");
    if (!totalQuestionsEl) logDebug("totalQuestionsEl not found");
    if (!currentQuestionEl) logDebug("currentQuestionEl not found");

    // Set total number of scenarios
    if (totalQuestionsEl) {
        totalQuestionsEl.textContent = scenarios.length;
    }

    // Initialize game immediately
    initializeGame();

    function initializeGame() {
        logDebug("Initializing game");
        currentScenario = 0;
        score = 0;

        if (scoreValue) {
            scoreValue.textContent = "0";
        }

        showScenario();

        // Add click handlers to option buttons
        optionBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                logDebug(`Option clicked: ${btn.dataset.distribution}`);
                checkAnswer(btn.dataset.distribution);
            });
        });

        // Add click handler to next button
        nextBtn.addEventListener("click", () => {
            logDebug("Next button clicked");
            currentScenario++;

            if (currentScenario < scenarios.length) {
                logDebug(`Moving to scenario ${currentScenario + 1}`);
                showScenario();
                nextBtn.classList.add("hidden");
            } else {
                logDebug("Game ended");
                gameArea.innerHTML = `
                    <div class="final-score glass-card">
                        <h3>Jogo Concluído!</h3>
                        <p>A sua pontuação final: ${score} de ${scenarios.length * 10}</p>
                    </div>`;

                nextBtn.innerHTML = `
                    <i class="fas fa-redo"></i>
                    <span>Jogar Novamente</span>
                    <div class="button-effect"></div>`;

                nextBtn.classList.remove("hidden");
                nextBtn.addEventListener("click", () => {
                    location.reload();
                }, { once: true });
            }
        });
    }

    function updateProgressBar() {
        logDebug("Updating progress bar");
        const progress = document.querySelector('.progress-fill');
        if (progress) {
            const percentage = ((currentScenario + 1) / scenarios.length) * 100;
            logDebug(`Progress bar width: ${percentage}%`);
            progress.style.width = `${percentage}%`;
        } else {
            logDebug("Progress bar element not found");
        }
    }

    function showScenario() {
        logDebug(`Showing scenario ${currentScenario + 1}`);

        if (currentQuestionEl) {
            currentQuestionEl.textContent = currentScenario + 1;
        }

        if (scenarioDiv) {
            scenarioDiv.textContent = scenarios[currentScenario].description;
        }

        if (feedbackDiv) {
            feedbackDiv.innerHTML = "";
        }

        updateProgressBar();

        // Reset button states
        optionBtns.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'wrong');
        });
    }

    function checkAnswer(selectedDistribution) {
        logDebug(`Checking answer: ${selectedDistribution} vs ${scenarios[currentScenario].correct}`);
        const correct = scenarios[currentScenario].correct === selectedDistribution;

        optionBtns.forEach(btn => {
            btn.disabled = true;

            if (btn.dataset.distribution === selectedDistribution) {
                btn.classList.add(correct ? 'correct' : 'wrong');
            }

            if (btn.dataset.distribution === scenarios[currentScenario].correct) {
                btn.classList.add('correct');
            }
        });

        if (correct) {
            score += 10;
            if (scoreValue) {
                scoreValue.textContent = score;
            }
            feedbackDiv.innerHTML = '<div class="feedback-correct">✨ Correto! +10 pontos</div>';
        } else {
            feedbackDiv.innerHTML = '<div class="feedback-wrong">❌ Incorreto!</div>';
        }

        nextBtn.classList.remove('hidden');
    }
});