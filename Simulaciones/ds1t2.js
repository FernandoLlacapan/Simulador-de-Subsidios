document.getElementById('ds1t2-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe y la página se recargue

    const propertyValue = parseInt(document.getElementById('property-value').value);
    const savingsUf = parseInt(document.getElementById('savings-uf').value);
    const location = document.getElementById('location').value;
    const ufValue = parseFloat(document.getElementById('uf-value').value); // Obtener el valor actual de la UF en CLP
    const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
    const loanTerm = parseInt(document.getElementById('loan-term').value);
    const isNewHome = document.getElementById('is-new-home').checked;
    const resultsDiv = document.getElementById('results');

    // Verificar que el ahorro no sea menor a 40 UF
    if (savingsUf < 40) {
        resultsDiv.innerHTML = 'El ahorro debe ser de al menos 40 UF.';
        return;
    }

    // Ajustar el valor máximo de la vivienda y subsidio si la vivienda es nueva y el ahorro es 40 UF o más
    let maxPropertyValue = 1600;
    let additionalSubsidy = 0;

    if (isNewHome && savingsUf >= 80) {
        maxPropertyValue = 3000;
        additionalSubsidy = 150;
    }

    // Calcular el subsidio basado en la ubicación y el valor de la vivienda
    let subsidy;
    if (location === 'north') {
        if (propertyValue <= 800) {
            subsidy = 650;
        } 
        else {
            subsidy = 650 - ((propertyValue - 800) * (300 / 800));
        }
    } else if (location === 'south') {
        if (propertyValue <= 800) {
            subsidy = 700;
        }
        else {
            subsidy = 700 - ((propertyValue - 800) * (300 / 800));
        }
    } else {
        if(propertyValue <= 800) {
            subsidy = 550
            }
        else{
            subsidy = 550 - ((propertyValue - 800) * (300 / 800));
            }
    }

    // Ajustar el subsidio para valores superiores al límite de propiedad definido
    if (propertyValue > 1600) {
        if (location === 'north') {
            subsidy = 350;
        } else if (location === 'south') {
            subsidy = 400;
        } else {
            subsidy = 250;
        }
    }

    // Agregar el subsidio adicional si aplica
    subsidy += additionalSubsidy;

    // Verificar si el valor máximo de la vivienda es menor a 500 UF
    if (propertyValue < 500) {
        resultsDiv.innerHTML = 'No le sirve este subsidio.';
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

    // Función para formatear en CLP
    const formatCurrency = (value) => value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

    // Mostrar el resultado
    resultsDiv.innerHTML = `
        <p>El subsidio total que podría recibir es de ${subsidy.toFixed(2)} UF. (${formatCurrency(subsidy * ufValue)})</p>
        <p>Monto del Crédito Hipotecario necesario: ${loanAmount.toFixed(2)} UF. (${formatCurrency(loanAmount * ufValue)})</p>
        <p>Dividendo Mensual Estimado: ${monthlyPayment.toFixed(2)} UF (${formatCurrency(monthlyPaymentCLP)}).</p>
        <p>Renta Mínima Requerida (aprox. 4 veces el dividendo): ${minimumIncome.toFixed(2)} UF (${formatCurrency(minimumIncomeCLP)}).</p>
    `;
});
