document.getElementById('subsidy-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe y la página se recargue

    const totalIncome = parseFloat(document.getElementById('total-income').value);
    const householdSize = parseInt(document.getElementById('household-size').value);
    const rent = parseFloat(document.getElementById('rent').value);

    // Almacenar el sueldo y el arriendo en el almacenamiento local
    localStorage.setItem('totalIncome', totalIncome);
    localStorage.setItem('rent', rent);

    const adjustedIncome = (totalIncome - rent) / householdSize;
    const percentil = getPercentile(adjustedIncome);
    let subsidyInfo = `<p>El percentil de ingreso es: ${percentil}%</p>`;
    subsidyInfo += '<div class="subsidy-options">';
    if (percentil <= 40) {
        subsidyInfo += `
            <div class="subsidy-card">
                <a href="Simulaciones/DS49.html">
                    <h2>Subsidio DS49</h2>
                    <p>Subsidio para personas del 40% más vulnerables</p>
                </a>
            </div>
        `;
    }
    if (percentil <= 60) {
        subsidyInfo += `
            <div class="subsidy-card">
                <a href="Valor_Casa/DS1T1.html">
                    <h2>Subsidio DS1 Tramo 1</h2>
                    <p>Subsidio para la compra de viviendas de hasta 1.100UF (Hasta un 60% del vulnerabilidad)</p>

                </a>
            </div>
        `;
    }
    if (percentil <= 70) {
        subsidyInfo += `
            <div class="subsidy-card">
                <a href="Valor_Casa/DS1T2.html">
                    <h2>Subsidio DS1 Tramo 2</h2>
                    <p>Subsidio para la compra de viviendas de hasta 1.600 UF (Hasta un 70% de vulnerabilidad)</p>
                </a>
            </div>
        `;
    }
    if (percentil <= 100) {
        subsidyInfo += `
            <div class="subsidy-card">
                <a href="Valor_Casa/DS1T3.html">
                    <h2>Subsidio DS1 Tramo 3</h2>
                    <p>Subsidio para la compra de viviendas de hasta 2.200 UF (Solamente pide RHS)</p>
                </a>
            </div>
        `;
    }
    subsidyInfo += '</div>';

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = subsidyInfo;
});

function getPercentile(income) {
    if (income < 69518) {
        return 10;
    } else if (income < 109984) {
        return 20;
    } else if (income < 145631) {
        return 30;
    } else if (income < 181532) {
        return 40;
    } else if (income < 221249) {
        return 50;
    } else if (income < 278403) {
        return 60;
    } else if (income < 353729) {
        return 70;
    } else if (income < 476523) {
        return 80;
    } else if (income < 774525) {
        return 90;
    } else {
        return 100;
    }
}
