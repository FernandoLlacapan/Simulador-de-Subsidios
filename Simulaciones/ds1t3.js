document.getElementById('ds1t3-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe y la página se recargue

    const propertyValue = parseInt(document.getElementById('property-value').value);
    const savingsUf = parseInt(document.getElementById('savings-uf').value);
    const location = document.getElementById('location').value;
    const ufValue = parseFloat(document.getElementById('uf-value').value); // Obtener el valor actual de la UF en CLP
    const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
    const loanTerm = parseInt(document.getElementById('loan-term').value);
    const resultsDiv = document.getElementById('results');

    // Verificar que el ahorro no sea menor a 80 UF
    if (savingsUf < 80) {
        resultsDiv.innerHTML = 'El ahorro debe ser de al menos 80 UF.';
        return;
    }

    // Calcular el subsidio basado en las reglas del DS1 Tramo 3
    let subsidy;
    if (location === 'north') {
        if (propertyValue <= 1200) {
            subsidy = 500;
        } else if (propertyValue >= 1600) {
            subsidy = 350;
        } else {
            // Calcular la pendiente de la recta entre 1200 UF y 1600 UF
            subsidy = 500 - ((propertyValue - 1200) * (150 / 400));
        }
    } else if (location === 'south') {
        if (propertyValue <= 1200) {
            subsidy = 550;
        } else if (propertyValue >= 1600) {
            subsidy = 400;
        } else {
            // Calcular la pendiente de la recta entre 1200 UF y 1600 UF
            subsidy = 550 - ((propertyValue - 1200) * (150 / 400));
        }
    } else {
        if (propertyValue <= 1200) {
            subsidy = 400;
        } else if (propertyValue >= 1600) {
            subsidy = 250;
        } else {
            // Calcular la pendiente de la recta entre 1200 UF y 1600 UF
            subsidy = 400 - ((propertyValue - 1200) * (150 / 400));
        }
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

    // Verificar si el valor máximo de la vivienda excede el límite
    const maxPropertyValue = (location === 'none') ? 2200 : 2600;
    if (propertyValue > maxPropertyValue) {
        resultsDiv.innerHTML = `El valor máximo de la vivienda no puede exceder ${maxPropertyValue} UF.`;
        return;
    }

    // Calcular el monto del crédito necesario
    const loanAmount = propertyValue - savingsUf - subsidy;

    // Cálculo del crédito hipotecario
    const monthlyRate = interestRate / 12;
    const totalPayments = loanTerm * 12;
    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
    const monthlyPaymentCLP = monthlyPayment * ufValue; // Convertir el dividendo mensual a CLP
    
    // Suposición de que la renta mínima debe ser aproximadamente 4 veces el dividendo mensual
    const minimumIncome = monthlyPayment * 4;
    const minimumIncomeCLP = minimumIncome * ufValue; // Convertir la renta mínima a CLP

    // Formatear los resultados en miles
    const formatCurrency = (value) => value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

    // Mostrar el resultado
    resultsDiv.innerHTML = `
        <p>El subsidio total que podría recibir es de ${subsidy.toFixed(2)} UF.</p>
        <p>Monto del Crédito Hipotecario necesario: ${loanAmount.toFixed(2)} UF.</p>
        <p>Dividendo Mensual Estimado: ${monthlyPayment.toFixed(2)} UF (${formatCurrency(monthlyPaymentCLP)}).</p>
        <p>Renta Mínima Requerida (aprox. 4 veces el dividendo): ${minimumIncome.toFixed(2)} UF (${formatCurrency(minimumIncomeCLP)}).</p>
    `;
});
