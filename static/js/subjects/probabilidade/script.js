// Debug helper
function logDebug(message) {
    console.log(`[GAME DEBUG] ${message}`);
}

let scenarios = [];

async function loadScenarios() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const scenarioSection = document.querySelector('.scenario-section');

    try {
        const response = await fetch('/static/quizzes/scenarios.json');
        if (!response.ok) {
            throw new Error('Failed to load scenarios');
        }
        const data = await response.json();
        scenarios = data.scenarios;

        // Hide loading indicator and show scenario section
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (scenarioSection) scenarioSection.style.display = 'block';

        initializeGame();
    } catch (error) {
        console.error('Error loading scenarios:', error);
        showError('Failed to load game scenarios. Please try again later.');
    }
}

function showError(message) {
    const gameArea = document.getElementById("gameArea");
    const loadingIndicator = document.getElementById('loadingIndicator');

    if (loadingIndicator) loadingIndicator.style.display = 'none';

    if (gameArea) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button onclick="location.reload()">Try Again</button>
        `;
        gameArea.appendChild(errorDiv);
    }
}

let currentScenario = 0;
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
    logDebug("Game script loaded");
    loadScenarios();

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