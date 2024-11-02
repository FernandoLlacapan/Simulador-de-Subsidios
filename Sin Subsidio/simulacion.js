document.getElementById('simulacion-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe y la página se recargue

    const propertyValue = parseFloat(document.getElementById('property-value').value);
    const downPaymentType = document.getElementById('down-payment-type').value;
    let downPayment = parseFloat(document.getElementById('down-payment').value);
    const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
    const loanTerm = parseInt(document.getElementById('loan-term').value);
    const resultsDiv = document.getElementById('results');
    const ufValue = parseFloat(document.getElementById('uf-value').value); // Obtener el valor actual de la UF en CLP

    // Ajustar el pie según el tipo seleccionado
    if (downPaymentType === 'percentage') {
        if (downPayment === 10 && propertyValue > 4500) {
            resultsDiv.innerHTML = 'No puede seleccionar un pie del 10% para viviendas de más de 4500 UF.';
            return;
        }
        downPayment = (downPayment / 100) * propertyValue;
    }

    // Calcular el monto del crédito necesario
    const loanAmount = propertyValue - downPayment;

    // Cálculo del crédito hipotecario
    const monthlyRate = interestRate / 12;
    const totalPayments = loanTerm * 12;
    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
    
    // Suposición de que la renta mínima debe ser aproximadamente 4 veces el dividendo mensual
    const minimumIncome = monthlyPayment * 4;

    // Formatear los resultados en miles
    const formatCurrency = (value) => value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

    // Mostrar el resultado
    resultsDiv.innerHTML = `
        <p>El valor de la vivienda es ${propertyValue.toFixed(2)} UF.</p>
        <p>El pie es ${downPayment.toFixed(2)} UF.</p>
        <p>Monto del Crédito Hipotecario necesario: ${loanAmount.toFixed(2)} UF.</p>
        <p>Dividendo Mensual Estimado: ${monthlyPayment.toFixed(2)} UF (${formatCurrency(monthlyPayment * 37396.77)}).</p>
        <p>Renta Mínima Requerida (aprox. 4 veces el dividendo): ${minimumIncome.toFixed(2)} UF (${formatCurrency(minimumIncome * ufValue)}).</p>
    `;
});

function adjustDownPaymentOptions() {
    const downPaymentType = document.getElementById('down-payment-type').value;
    const downPaymentInput = document.getElementById('down-payment');
    
    if (downPaymentType === 'percentage') {
        downPaymentInput.min = 10;
        downPaymentInput.max = 50;
        downPaymentInput.value = 10;
    } else {
        downPaymentInput.min = 1;
        downPaymentInput.max = 4500;
        downPaymentInput.value = 1;
    }
}
