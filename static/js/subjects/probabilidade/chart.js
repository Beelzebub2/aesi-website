// Função para gerar dados do gráfico
function generateChartData(distribution, params) {
    const data = [];
    switch (distribution) {
        case 'binomial':
            const { n, p } = params;
            for (let k = 0; k <= n; k++) {
                data.push({
                    x: k,
                    y: binomialProbability(n, p, k)
                });
            }
            break;

        case 'poisson':
            const { lambda } = params;
            const maxK = Math.ceil(lambda + 4 * Math.sqrt(lambda));
            for (let k = 0; k <= maxK; k++) {
                data.push({
                    x: k,
                    y: poissonProbability(lambda, k)
                });
            }
            break;

        case 'normal':
            const { mean, std } = params;
            const range = 4 * std;
            for (let x = mean - range; x <= mean + range; x += std / 10) {
                data.push({
                    x: x,
                    y: normalPDF(x, mean, std)
                });
            }
            break;
    }
    return data;
}

// Função de densidade de probabilidade normal
function normalPDF(x, mean = 0, std = 1) {
    return (1 / (std * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
}

// Função para atualizar o gráfico
function updateChart(chart, distribution, params) {
    const data = generateChartData(distribution, params);

    chart.data.labels = data.map(point => point.x);
    chart.data.datasets[0].data = data.map(point => point.y);

    let title = '';
    switch (distribution) {
        case 'binomial':
            title = `Distribuição Binomial (n=${params.n}, p=${params.p})`;
            break;
        case 'poisson':
            title = `Distribuição de Poisson (λ=${params.lambda})`;
            break;
        case 'normal':
            title = `Distribuição Normal (μ=${params.mean}, σ=${params.std})`;
            break;
    }

    chart.options.plugins.title.text = title;
    chart.update();
}
