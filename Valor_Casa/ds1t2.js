document.getElementById('ds1t2-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe y la página se recargue

    const totalIncome = parseFloat(document.getElementById('total-income').value);
    const savingsUf = parseInt(document.getElementById('savings-uf').value);
    const location = document.getElementById('location').value;
    const loanTerm = parseInt(document.getElementById('loan-term').value);
    const interestRate = 5.1 / 100; // Tasa de interés anual fija
    const ufValue = 37396.77; // Valor actual de la UF en CLP
    const resultsDiv = document.getElementById('results');

    // Verificar que el ahorro no sea menor a 40 UF
    if (savingsUf < 40) {
        resultsDiv.innerHTML = 'El ahorro debe ser de al menos 40 UF.';
        return;
    }

    // Calcular el monto máximo del crédito basado en el ingreso disponible
    const monthlyIncomeAvailable = totalIncome / 4; // Asumiendo que 1/4 del ingreso está disponible para el dividendo
    const monthlyRate = interestRate / 12;
    const totalPayments = loanTerm * 12;
    const maxLoanAmount = (monthlyIncomeAvailable * (1 - Math.pow(1 + monthlyRate, -totalPayments))) / monthlyRate;
    const maxLoanAmountUF = maxLoanAmount / ufValue;

    // Calcular el valor máximo de la vivienda usando la ecuación
    let propertyValue;
    let subsidy;

    if (location === 'north') {
        propertyValue = (maxLoanAmountUF + savingsUf + 950) / 1.375;
        if (propertyValue <= 800) {
            subsidy = 650;
        } else if (propertyValue >= 1600) {
            subsidy = 350;
        } else {
            subsidy = 650 - ((propertyValue - 800) * (300 / 800));
        }
    } else if (location === 'south') {
        propertyValue = (maxLoanAmountUF + savingsUf + 1000) / 1.375;
        if (propertyValue <= 800) {
            subsidy = 700;
        } else if (propertyValue >= 1600) {
            subsidy = 400;
        } else {
            subsidy = 700 - ((propertyValue - 800) * (300 / 800));
        }
    } else {
        propertyValue = (maxLoanAmountUF + savingsUf + 850) / 1.375;
        subsidy = 550 - ((propertyValue - 800) * (300 / 800));
    }

    // Ajustar el subsidio para valores superiores a 1600 UF
    if (propertyValue > 1600) {
        if (location === 'north') {
            subsidy = 350;
        } else if (location === 'south') {
            subsidy = 400;
        } else {
            subsidy = 250;
        }
    }


    

    // Verificar si el valor máximo de la vivienda es menor a 800 UF
    if (propertyValue < 800) {
        resultsDiv.innerHTML = 'No le sirve este subsidio.';
        return;
    }

    // Calcular el valor Maximo de la vivienda
    const valor = maxLoanAmountUF + savingsUf + subsidy;

    // Verificar si el valor máximo de la vivienda excede el límite
    const maxPropertyValue = (location === 'none') ? 1600 : 1800;
    if (valor > maxPropertyValue) {
        valor = maxPropertyValue;
    }

    // Mostrar el resultado
    resultsDiv.innerHTML = `
        <p>El valor máximo de la vivienda que puede comprar es ${valor.toFixed(2)} UF.</p>
        <p>El crédito máximo que puede obtener es ${maxLoanAmountUF.toFixed(2)} UF.</p>
        <p>El subsidio total que podría recibir es de ${subsidy.toFixed(2)} UF.</p>
    `;
});
