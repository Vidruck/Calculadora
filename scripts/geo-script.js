document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos del DOM ---
    const radioFiguras = document.querySelectorAll('input[name="figura"]');
    const inputContainer = document.getElementById('geo-inputs');
    const imgFigura = document.getElementById('imgFigura');
    const btnCalcular = document.getElementById('btnCalcularGeo');
    const resultadoDiv = document.getElementById('geo-resultado');

    // --- Definición de Figuras ---
    const figuras = {
        cuadrado: {
            img: '../img/cuadrado.svg', 
            inputs: [
                { id: 'lado', label: 'Lado (cm):', placeholder: 'Ej: 5' }
            ],
            calculo: (datos) => {
                const lado = datos.lado;
                const area = lado * lado;
                const perimetro = lado * 4;
                return { area, perimetro };
            }
        },
        rectangulo: {
            img: '../img/rectangulo.svg', 
            inputs: [
                { id: 'base', label: 'Base (cm):', placeholder: 'Ej: 8' },
                { id: 'altura', label: 'Altura (cm):', placeholder: 'Ej: 4' }
            ],
            calculo: (datos) => {
                const base = datos.base;
                const altura = datos.altura;
                const area = base * altura;
                const perimetro = 2 * base + 2 * altura;
                return { area, perimetro };
            }
        },
        circulo: {
            img: '../img/circulo.svg',
            inputs: [
                { id: 'radio', label: 'Radio (cm):', placeholder: 'Ej: 3' }
            ],
            calculo: (datos) => {
                const radio = datos.radio;
                const area = Math.PI * Math.pow(radio, 2);
                const perimetro = 2 * Math.PI * radio;
                return { area, perimetro: perimetro }; // Perímetro es la circunferencia
            }
        },
        triangulo: { 
            img: '../img/triangulo_rec.svg', 
            inputs: [
                { id: 'base', label: 'Base (cm):', placeholder: 'Ej: 6' },
                { id: 'altura', label: 'Altura (cm):', placeholder: 'Ej: 4' }
            ],
            calculo: (datos) => {
                const base = datos.base;
                const altura = datos.altura;
                const hipotenusa = Math.sqrt(Math.pow(base, 2) + Math.pow(altura, 2));
                const area = (base * altura) / 2;
                const perimetro = base + altura + hipotenusa;
                return { area, perimetro };
            }
        }
    };

    // --- Funciones ---

    // 1. Mostrar Inputs según la figura seleccionada
    function mostrarInputs(figuraId) {
        const figura = figuras[figuraId];
        
        // Limpiar inputs anteriores y resultado
        inputContainer.innerHTML = '';
        resultadoDiv.innerHTML = '';
        
        // Actualizar imagen
        imgFigura.src = figura.img;
        imgFigura.alt = `Imagen de un ${figuraId}`;

        // Crear y añadir los nuevos inputs
        figura.inputs.forEach(inputDef => {
            const label = document.createElement('label');
            label.setAttribute('for', inputDef.id);
            label.textContent = inputDef.label;

            const input = document.createElement('input');
            input.type = 'number';
            input.id = inputDef.id;
            input.placeholder = inputDef.placeholder;
            input.min = "0"; // No permitir números negativos

            inputContainer.appendChild(label);
            inputContainer.appendChild(input);
        });
    }

    // 2. Validar Inputs
    function validarInputs() {
        let esValido = true;
        const inputs = inputContainer.querySelectorAll('input');
        
        inputs.forEach(input => {
            // Quitar error previo
            input.classList.remove('input-error');

            // Validar
            if (input.value === '' || isNaN(parseFloat(input.value)) || parseFloat(input.value) <= 0) {
                esValido = false;
                input.classList.add('input-error'); // Notificación visual
            }
        });
        return esValido;
    }

    // 3. Calcular y Mostrar Resultado
    function calcular() {
        const figuraSeleccionada = document.querySelector('input[name="figura"]:checked').value;
        
        if (!validarInputs()) {
            resultadoDiv.innerHTML = `<p class="error-msg">Por favor, corrige los campos en rojo. Solo se admiten números positivos.</p>`;
            return;
        }

        const figura = figuras[figuraSeleccionada];
        const datos = {};
        
        // Recolectar datos de los inputs
        figura.inputs.forEach(inputDef => {
            datos[inputDef.id] = parseFloat(document.getElementById(inputDef.id).value);
        });

        // Realizar cálculo
        const resultado = figura.calculo(datos);

        // Mostrar resultado
        resultadoDiv.innerHTML = `
            <h4>Resultados para ${figuraSeleccionada}:</h4>
            <p><strong>Área:</strong> ${resultado.area.toFixed(2)} cm²</p>
            <p><strong>Perímetro:</strong> ${resultado.perimetro.toFixed(2)} cm</p>
        `;
    }

    // --- Event Listeners ---

    // Cambiar inputs cuando se selecciona otra figura
    radioFiguras.forEach(radio => {
        radio.addEventListener('change', (e) => {
            mostrarInputs(e.target.value);
        });
    });

    // Calcular al hacer clic en el botón
    btnCalcular.addEventListener('click', calcular);

    // --- Inicialización ---
    // Mostrar inputs para la figura seleccionada por defecto (cuadrado)
    mostrarInputs('triangulo');
});