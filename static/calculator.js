function factorial(n) {
    if (n === 0) return 1;
    let result = 1;
    for (let i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

function combination(n, k) {
    return factorial(n) / (factorial(k) * factorial(n - k));
}

function binomialProbability(n, p, k) {
    return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function poissonProbability(lambda, k) {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function normalCDF(x, mean = 0, std = 1) {
    const z = (x - mean) / std;
    return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

function erf(x) {
    // Approximation of error function
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}

document.addEventListener('DOMContentLoaded', () => {
    const distributionSelect = document.getElementById('distribution');
    const paramGroups = document.querySelectorAll('.param-group');
    const calculateBtn = document.getElementById('calculate');
    const resultContainer = document.getElementById('result');
    const resultValue = document.querySelector('.result-value');
    const resultExplanation = document.querySelector('.result-explanation');

    const probabilityType = document.getElementById('probability-type');
    const betweenInput = document.getElementById('between-input');

    const form = document.querySelector('.calculator-form');
    const allInputs = form.querySelectorAll('input, select');

    function updateResult() {
        resultContainer.classList.add('updating');
        setTimeout(() => {
            calculateProbability();
            resultContainer.classList.remove('updating');
        }, 150);
    }

    // Add input event listeners for real-time updates
    allInputs.forEach(input => {
        input.addEventListener('input', debounce(updateResult, 300));
    });

    // Debounce function to limit update frequency
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    distributionSelect.addEventListener('change', () => {
        paramGroups.forEach(group => group.classList.add('hidden'));
        document.getElementById(`${distributionSelect.value}-params`).classList.remove('hidden');
    });

    probabilityType.addEventListener('change', () => {
        betweenInput.classList.toggle('hidden', probabilityType.value !== 'between');
    });

    calculateBtn.addEventListener('click', () => {
        calculateProbability();
    });

    function calculateProbability() {
        let probability;
        let explanation;

        switch (distributionSelect.value) {
            case 'binomial':
                const n = parseInt(document.getElementById('n').value);
                const p = parseFloat(document.getElementById('p').value);
                const k = parseInt(document.getElementById('k').value);
                probability = binomialProbability(n, p, k);
                explanation = `P(X = ${k}) = C(${n},${k}) × ${p}^${k} × (1-${p})^${n - k}`;
                break;

            case 'poisson':
                const lambda = parseFloat(document.getElementById('lambda').value);
                const kPoisson = parseInt(document.getElementById('k-poisson').value);
                probability = poissonProbability(lambda, kPoisson);
                explanation = `P(X = ${kPoisson}) = (${lambda}^${kPoisson} × e^-${lambda}) / ${kPoisson}!`;
                break;

            case 'normal':
                const mean = parseFloat(document.getElementById('mean').value);
                const std = parseFloat(document.getElementById('std').value);
                const x = parseFloat(document.getElementById('x').value);

                switch (probabilityType.value) {
                    case 'less':
                        probability = normalCDF(x, mean, std);
                        explanation = `P(X ≤ ${x}) com μ=${mean}, σ=${std}`;
                        break;
                    case 'greater':
                        probability = 1 - normalCDF(x, mean, std);
                        explanation = `P(X > ${x}) com μ=${mean}, σ=${std}`;
                        break;
                    case 'between':
                        const x2 = parseFloat(document.getElementById('x2').value);
                        probability = normalCDF(x2, mean, std) - normalCDF(x, mean, std);
                        explanation = `P(${x} ≤ X ≤ ${x2}) com μ=${mean}, σ=${std}`;
                        break;
                }
                break;
        }

        resultValue.textContent = `${(probability * 100).toFixed(4)}%`;
        resultExplanation.textContent = explanation;
        resultContainer.classList.remove('hidden');
    }
});
