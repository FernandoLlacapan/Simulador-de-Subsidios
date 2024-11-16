document.getElementById('ds1t3-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe y la página se recargue

    const totalIncome = parseFloat(document.getElementById('total-income').value);
    const savingsUf = parseInt(document.getElementById('savings-uf').value);
    const location = document.getElementById('location').value;
    const loanTerm = parseInt(document.getElementById('loan-term').value);
    const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
    const ufValue = await fetchUFValue(); // Obtener el valor actual de la UF desde la API
    const isNewHome = document.getElementById('is-new-home').checked; // Verificar si la vivienda es nueva
    const resultsDiv = document.getElementById('results');

    // Verificar que el ahorro no sea menor a 80 UF
    if (savingsUf < 80) {
        resultsDiv.innerHTML = 'El ahorro debe ser de al menos 80 UF.';
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
    let additionalSubsidy = 0;

    if (location === 'north') {
        propertyValue = (maxLoanAmountUF + savingsUf + 950) / 1.375;
        if (propertyValue <= 1200) {
            subsidy = 500;
        } else if (propertyValue >= 1600) {
            subsidy = 350;
        } else {
            // Calcular la pendiente de la recta entre 1200 UF y 1600 UF
            subsidy = 500 - ((propertyValue - 1200) * (150 / 400));
        }
    } else if (location === 'south') {
        propertyValue = (maxLoanAmountUF + savingsUf + 1000) / 1.375;
        if (propertyValue <= 1200) {
            subsidy = 550;
        } else if (propertyValue >= 1600) {
            subsidy = 400;
        } else {
            // Calcular la pendiente de la recta entre 1200 UF y 1600 UF
            subsidy = 550 - ((propertyValue - 1200) * (150 / 400));
        }
    } else {
        propertyValue = (maxLoanAmountUF + savingsUf + 850) / 1.375;
        if (propertyValue <= 1200) {
            subsidy = 400;
        } else if (propertyValue >= 1600) {
            subsidy = 250;
        } else {
            // Calcular la pendiente de la recta entre 1200 UF y 1600 UF
            subsidy = 400 - ((propertyValue - 1200) * (150 / 400));
        }
    }

    // Ajustar el límite de la propiedad si el ahorro es igual o mayor a 80 UF y la vivienda es nueva
    let maxPropertyValue = 2200; // Límite de 1600 UF por defecto
    if (savingsUf >= 160 && isNewHome) {
        maxPropertyValue = 3000;
        additionalSubsidy = 150; // Límite de 3000 UF si el ahorro es mayor a 80 UF y la vivienda es nueva
    }

    // Ajustar el subsidio para valores superiores a 1600 UF
    if (propertyValue > maxPropertyValue) {
        if (location === 'north') {
            subsidy = 350;
        } else if (location === 'south') {
            subsidy = 400;
        } else {
            subsidy = 250;
        }
        propertyValue = maxPropertyValue;
    }

    // Verificar si el valor máximo de la vivienda es menor a 800 UF
    if (propertyValue < 800) {
        resultsDiv.innerHTML = 'No le sirve este subsidio.';
        return;
    }

    // Calcular el valor Maximo de la vivienda
    let valor = maxLoanAmountUF + savingsUf + subsidy + additionalSubsidy;
        if (valor > maxPropertyValue) {
            valor = maxPropertyValue;
        }
    // Función para formatear en CLP
    const formatCurrency = (value) => value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

    // Mostrar el resultado
    resultsDiv.innerHTML = `
        <p>El valor máximo de la vivienda que puede comprar es ${valor.toFixed(2)} UF. (${formatCurrency(valor*ufValue)}) </p>
        <p>El crédito máximo que puede obtener es ${maxLoanAmountUF.toFixed(2)} UF. (${formatCurrency(maxLoanAmountUF*ufValue)}) </p>
        <p>El subsidio total que podría recibir es de ${subsidy.toFixed(2)} UF. (${formatCurrency(subsidy*ufValue)}) </p>
    `;
});
