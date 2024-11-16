document.getElementById('ds19-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe y la página se recargue

    const loanAmount = parseFloat(document.getElementById('loan-amount').value);
    const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
    const loanTerm = parseInt(document.getElementById('loan-term').value);
    const ufValue = parseFloat(document.getElementById('uf-value').value);
    const resultsDiv = document.getElementById('results');

    // Cálculo del dividendo mensual
    const monthlyRate = interestRate / 12;
    const totalPayments = loanTerm * 12;
    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
    const monthlyPaymentCLP = monthlyPayment * ufValue; // Convertir el dividendo mensual a CLP

    // Cálculo de la renta mínima
    const minimumIncome = monthlyPayment * 4;
    const minimumIncomeCLP = minimumIncome * ufValue; // Convertir la renta mínima a CLP

    // Formatear los resultados en CLP
    const formatCurrency = (value) => value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

    // Mostrar el resultado
    resultsDiv.innerHTML = `
        <p>Dividendo Mensual Estimado: ${monthlyPayment.toFixed(2)} UF (${formatCurrency(monthlyPaymentCLP)}).</p>
        <p>Renta Mínima Requerida (aprox. 4 veces el dividendo): ${minimumIncome.toFixed(2)} UF (${formatCurrency(minimumIncomeCLP)}).</p>
    `;
});
