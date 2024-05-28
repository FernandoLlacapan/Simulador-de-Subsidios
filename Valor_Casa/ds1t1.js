document.getElementById('ds1-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe y la página se recargue

    const totalIncome = parseFloat(document.getElementById('total-income').value);
    const savingsUf = parseInt(document.getElementById('savings-uf').value);
    const location = document.getElementById('location').value;
    const loanTerm = parseInt(document.getElementById('loan-term').value);
    const interestRate = 5.1 / 100; // Tasa de interés anual fija
    const ufValue = 37396.77; // Valor actual de la UF en CLP
    const resultsDiv = document.getElementById('results');

    // Calcular el monto máximo del crédito basado en el ingreso disponible
    const monthlyIncomeAvailable = totalIncome / 4; // Asumiendo que 1/4 del ingreso está disponible para el dividendo
    const monthlyRate = interestRate / 12;
    const totalPayments = loanTerm * 12;
    const maxLoanAmount = (monthlyIncomeAvailable * (1 - Math.pow(1 + monthlyRate, -totalPayments))) / monthlyRate;
    const maxLoanAmountUF = maxLoanAmount / ufValue;

    // Determinar el subsidio fijo basado en la ubicación
    let subsidyUF;
    if (location === 'north') {
        subsidyUF = 700;
    } else if (location === 'south') {
        subsidyUF = 750;
    } else {
        subsidyUF = 600;
    }

    // Calcular el valor máximo de la vivienda
    let maxPropertyValue = maxLoanAmountUF + subsidyUF + savingsUf;

    // Verificar si el valor máximo de la vivienda excede 1.100 UF
    if (maxPropertyValue > 1100) {
        if (location === 'north') {
            maxPropertyValue = 1200;
        } else if (location === 'south') {
            maxPropertyValue = 1250;
        } else {
            maxPropertyValue = 1100;
        }
    }

    // Mostrar el resultado
    resultsDiv.innerHTML = `
        <p>Con su ingreso y ahorro, el valor máximo de la vivienda que puede comprar es ${maxPropertyValue.toFixed(2)} UF.</p>
        <p>El subsidio total que podría recibir es de ${subsidyUF} UF.</p>
    `;
});
