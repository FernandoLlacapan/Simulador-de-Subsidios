document.getElementById('ds1-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe y la página se recargue

    const savingsUf = parseInt(document.getElementById('ds1-savings-uf').value);
    const propertyValue = parseInt(document.getElementById('property-value').value);
    const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
    const ufValue = parseFloat(document.getElementById('uf-value').value);
    const location = document.getElementById('location').value;
    const loanTerm = parseInt(document.getElementById('loan-term').value);
    const resultsDiv = document.getElementById('results');

    // Determinar el subsidio fijo basado en la ubicación
    let baseSubsidy;
    if (location === 'north') {
        baseSubsidy = 700; // Subsidio fijo para Extremo Norte
    } else if (location === 'south') {
        baseSubsidy = 750; // Subsidio fijo para Extremo Sur
    } else {
        baseSubsidy = 600; // Subsidio base
    }

    const subsidy = baseSubsidy + savingsUf; // Sumar ahorro al subsidio
    const loanAmount = propertyValue - subsidy; // Monto del crédito necesario

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
        <p>El subsidio total que podría recibir es de ${subsidy.toFixed(2)} UF. (${formatCurrency(subsidy*ufValue)})</p>
        <p>Monto del Crédito Hipotecario necesario: ${loanAmount.toFixed(2)} UF. (${formatCurrency(loanAmount*ufValue)})</p>
        <p>Dividendo Mensual Estimado: ${monthlyPayment.toFixed(2)} UF (${formatCurrency(monthlyPaymentCLP)}).</p>
        <p>Renta Mínima Requerida (aprox. 4 veces el dividendo): ${minimumIncome.toFixed(2)} UF (${formatCurrency(minimumIncomeCLP)}).</p>
    `;
});
