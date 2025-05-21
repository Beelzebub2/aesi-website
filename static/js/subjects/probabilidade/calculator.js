let distributionChart = null;

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
    // Aproximação da função de erro
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
    // Get theme colors
    const getThemeColors = () => ({
        primary: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
        secondary: getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim(),
        text: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(),
        background: getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
    });

    const distributionSelect = document.getElementById('distribution');
    const paramGroups = document.querySelectorAll('.param-group');
    const calculateBtn = document.getElementById('calculate');
    const resultContainer = document.getElementById('result');
    const resultValue = document.querySelector('.result-value');
    const resultExplanation = document.querySelector('.result-explanation');

    const probabilityType = document.getElementById('probability-type');
    const betweenInput = document.getElementById('between-input');

    const form = document.querySelector('.calculator-container');
    const allInputs = form.querySelectorAll('input, select');

    // Initialize chart with theme colors
    const colors = getThemeColors();
    const ctx = document.getElementById('distributionChart').getContext('2d');
    distributionChart = new Chart(ctx, {
        type: 'line', data: {
            labels: [],
            datasets: [{
                label: 'Distribuição',
                data: [],
                borderColor: colors.primary,
                backgroundColor: colors.primary + '40',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição de Probabilidade',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20,
                    color: colors.text
                },
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Valor',
                        font: {
                            size: 14,
                            weight: '500'
                        }
                    }, grid: {
                        display: true,
                        color: colors.gridLines
                    },
                    ticks: {
                        color: colors.text
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Probabilidade',
                        font: {
                            size: 14,
                            weight: '500'
                        }
                    }, grid: {
                        display: true,
                        color: colors.gridLines
                    },
                    ticks: {
                        color: colors.text
                    },
                    beginAtZero: true
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            layout: {
                padding: {
                    left: 10,
                    right: 30,
                    top: 20,
                    bottom: 10
                }
            }
        }
    });

    function updateResult() {
        resultContainer.classList.add('updating');
        setTimeout(() => {
            calculateProbability();
            resultContainer.classList.remove('updating');
        }, 150);
    }

    // Atualizar gráfico quando os parâmetros mudarem
    allInputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            updateResult();
            updateChartData();
        }, 300));
    });

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
        updateChartData();
    });

    probabilityType.addEventListener('change', () => {
        betweenInput.classList.toggle('hidden', probabilityType.value !== 'between');
        updateResult();
    });

    calculateBtn.addEventListener('click', () => {
        updateResult();
        updateChartData();
    });

    function updateChartData() {
        const distribution = distributionSelect.value;
        const params = getDistributionParams();
        updateChart(distributionChart, distribution, params);
    }

    function getDistributionParams() {
        switch (distributionSelect.value) {
            case 'binomial':
                return {
                    n: parseInt(document.getElementById('n').value),
                    p: parseFloat(document.getElementById('p').value)
                };
            case 'poisson':
                return {
                    lambda: parseFloat(document.getElementById('lambda').value)
                };
            case 'normal':
                return {
                    mean: parseFloat(document.getElementById('mean').value),
                    std: parseFloat(document.getElementById('std').value)
                };
        }
    }    // Update chart colors when theme changes
    document.addEventListener('themeChanged', () => {
        const colors = getThemeColors();

        // Update dataset colors
        distributionChart.data.datasets[0].borderColor = colors.primary;
        distributionChart.data.datasets[0].backgroundColor = colors.primary + '40';

        // Update text colors
        distributionChart.options.plugins.title.color = colors.text;
        distributionChart.options.scales.x.title.color = colors.text;
        distributionChart.options.scales.y.title.color = colors.text;
        distributionChart.options.scales.x.ticks.color = colors.text;
        distributionChart.options.scales.y.ticks.color = colors.text;

        // Update grid colors
        distributionChart.options.scales.x.grid.color = colors.gridLines;
        distributionChart.options.scales.y.grid.color = colors.gridLines;

        distributionChart.update();
    });

    function calculateProbability() {
        let probability;
        let explanation;

        try {
            switch (distributionSelect.value) {
                case 'binomial':
                    const n = parseInt(document.getElementById('n').value);
                    const p = parseFloat(document.getElementById('p').value);
                    const k = parseInt(document.getElementById('k').value);

                    if (k > n) throw new Error('k não pode ser maior que n');
                    if (p < 0 || p > 1) throw new Error('p deve estar entre 0 e 1');

                    probability = binomialProbability(n, p, k);
                    explanation = `P(X = ${k}) = C(${n},${k}) × ${p}^${k} × (1-${p})^${n - k}`;
                    break;

                case 'poisson':
                    const lambda = parseFloat(document.getElementById('lambda').value);
                    const kPoisson = parseInt(document.getElementById('k-poisson').value);

                    if (lambda < 0) throw new Error('λ deve ser positivo');

                    probability = poissonProbability(lambda, kPoisson);
                    explanation = `P(X = ${kPoisson}) = (${lambda}^${kPoisson} × e^-${lambda}) / ${kPoisson}!`;
                    break;

                case 'normal':
                    const mean = parseFloat(document.getElementById('mean').value);
                    const std = parseFloat(document.getElementById('std').value);
                    const x = parseFloat(document.getElementById('x').value);
                    const probType = document.getElementById('probability-type').value;

                    if (std <= 0) throw new Error('O desvio padrão deve ser positivo');

                    if (probType === 'between') {
                        const x2 = parseFloat(document.getElementById('x2').value);
                        probability = normalCDF(x2, mean, std) - normalCDF(x, mean, std);
                        explanation = `P(${x} ≤ X ≤ ${x2}) = P(X ≤ ${x2}) - P(X ≤ ${x})`;
                    } else {
                        probability = probType === 'less' ? normalCDF(x, mean, std) : 1 - normalCDF(x, mean, std);
                        explanation = probType === 'less' ? `P(X ≤ ${x})` : `P(X > ${x})`;
                    }
                    break;
            }

            resultValue.textContent = probability.toFixed(6);
            resultExplanation.textContent = explanation;
        } catch (error) {
            resultValue.textContent = 'Erro';
            resultExplanation.textContent = error.message;
        }
    }

    // Inicializar com os valores padrão
    updateResult();
    updateChartData();
});
