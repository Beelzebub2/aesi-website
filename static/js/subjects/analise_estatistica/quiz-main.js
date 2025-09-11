// Análise Estatística - Quiz Principal
class AnaliseEstatisticaQuiz {
    constructor() {
        this.quizData = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.questions = [];

        this.init();
    }

    async init() {
        try {
            await this.loadQuizData();
            this.setupEventListeners();
            this.showQuestion();
        } catch (error) {
            console.error('Erro ao inicializar quiz:', error);
            this.showError('Erro ao carregar o quiz. Tente novamente.');
        }
    }

    async loadQuizData() {
        const response = await fetch('/static/quizzes/analise_estatistica_quiz.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar dados do quiz');
        }
        this.quizData = await response.json();
        this.questions = this.quizData.questions;
    }

    setupEventListeners() {
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('finish-btn').addEventListener('click', () => this.finishQuiz());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartQuiz());
        document.getElementById('home-btn').addEventListener('click', () => this.goHome());
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        const questionCard = document.getElementById('question-card');
        const explanationCard = document.getElementById('explanation-card');

        // Esconder explicação
        explanationCard.style.display = 'none';

        // Mostrar pergunta
        document.getElementById('question-text').textContent = question.question;

        // Criar opções
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.textContent = option;
            optionBtn.dataset.index = index;
            optionBtn.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(optionBtn);
        });

        // Atualizar progresso
        this.updateProgress();

        // Resetar estado
        this.selectedAnswer = null;
    }

    selectAnswer(index) {
        if (this.selectedAnswer !== null) return;

        this.selectedAnswer = index;
        const options = document.querySelectorAll('.option-btn');
        const question = this.questions[this.currentQuestionIndex];

        options.forEach((btn, i) => {
            btn.classList.add('selected');
            if (i === question.correct) {
                btn.classList.add('correct');
            } else if (i === index && i !== question.correct) {
                btn.classList.add('incorrect');
            }
        });

        // Atualizar pontuação
        if (index === question.correct) {
            this.score++;
        }

        // Mostrar explicação
        this.showExplanation();
    }

    showExplanation() {
        const question = this.questions[this.currentQuestionIndex];
        const explanationCard = document.getElementById('explanation-card');
        const explanationText = document.getElementById('explanation-text');

        explanationText.textContent = question.explanation;
        explanationCard.style.display = 'block';

        // Atualizar botões
        const nextBtn = document.getElementById('next-btn');
        const finishBtn = document.getElementById('finish-btn');

        if (this.currentQuestionIndex >= this.questions.length - 1) {
            nextBtn.style.display = 'none';
            finishBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            finishBtn.style.display = 'none';
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    showResults() {
        const questionCard = document.getElementById('question-card');
        const explanationCard = document.getElementById('explanation-card');

        questionCard.style.display = 'none';
        explanationCard.style.display = 'none';

        // Criar card de resultados
        const resultsCard = document.createElement('div');
        resultsCard.className = 'question-card';
        resultsCard.innerHTML = `
            <h2>Quiz Concluído!</h2>
            <div class="results-summary">
                <p class="final-score">Pontuação Final: ${this.score}/${this.questions.length}</p>
                <p class="percentage">Porcentagem: ${Math.round((this.score / this.questions.length) * 100)}%</p>
                <div class="performance-message">
                    ${this.getPerformanceMessage()}
                </div>
            </div>
        `;

        const quizContent = document.querySelector('.quiz-content');
        quizContent.appendChild(resultsCard);
    }

    getPerformanceMessage() {
        const percentage = (this.score / this.questions.length) * 100;
        if (percentage >= 90) {
            return '<p class="excellent">Excelente! Você dominou os conceitos de análise estatística.</p>';
        } else if (percentage >= 70) {
            return '<p class="good">Muito bom! Você tem um bom entendimento dos conceitos.</p>';
        } else if (percentage >= 50) {
            return '<p class="fair">Bom trabalho! Continue praticando para melhorar.</p>';
        } else {
            return '<p class="needs-improvement">Continue estudando! Pratique mais os conceitos básicos.</p>';
        }
    }

    finishQuiz() {
        this.showResults();
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedAnswer = null;

        // Remover card de resultados se existir
        const resultsCard = document.querySelector('.results-summary');
        if (resultsCard) {
            resultsCard.parentElement.remove();
        }

        // Mostrar pergunta novamente
        const questionCard = document.getElementById('question-card');
        questionCard.style.display = 'block';

        this.showQuestion();
    }

    goHome() {
        window.location.href = '/subjects/analise_estatistica';
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent =
            `Pergunta ${this.currentQuestionIndex + 1} de ${this.questions.length}`;
        document.getElementById('score-text').textContent =
            `Pontuação: ${this.score}/${this.currentQuestionIndex + (this.selectedAnswer !== null ? 1 : 0)}`;
    }

    showError(message) {
        const questionCard = document.getElementById('question-card');
        questionCard.innerHTML = `
            <h2>Erro</h2>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="location.reload()">Tentar Novamente</button>
        `;
    }
}

// Inicializar quiz quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new AnaliseEstatisticaQuiz();
});
