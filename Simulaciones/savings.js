document.getElementById('savings-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe y la página se recargue

    const savingsUf = parseInt(document.getElementById('savings-uf').value);
    const zoneType = document.getElementById('zone-type').value;
    const resultsDiv = document.getElementById('results');

    // Verificar que el ahorro no exceda el máximo de 60 UF
    if (savingsUf > 60) {
        resultsDiv.innerHTML = 'El ahorro no puede exceder 60 UF.';
        return;
    }

    const baseSubsidy = 800; // Subsidio base en UF
    let totalSubsidy = baseSubsidy;

    // Si es urbano, se suman 100 UF al subsidio base
    if (zoneType === 'urban') {
        totalSubsidy += 100;
    }

    // Calcular el premio al ahorro
    const savingBonus = (savingsUf - 10) * 5;
    totalSubsidy += savingBonus + savingsUf; // Sumar ahorro y premio al ahorro al subsidio

    // Mostrar el resultado
    resultsDiv.innerHTML = `El subsidio total que podría recibir es de ${totalSubsidy} UF.`;
});
