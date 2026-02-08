/**
 * @file geo-script.js
 * @description Lógica interactiva para la calculadora geométrica.
 * Maneja la selección de figuras, generación dinámica de formularios y cálculo de áreas/perímetros.
 * @author Alejandro González Hernández
 * @project Calculadora Básica - Científica - Geométrica
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos del DOM ---
    const radioFiguras = document.querySelectorAll('input[name="figura"]');
    const inputContainer = document.getElementById('geo-inputs');
    const imgFigura = document.getElementById('imgFigura');
    const btnCalcular = document.getElementById('btnCalcularGeo');
    const resultadoDiv = document.getElementById('geo-resultado');

    /**
     * @typedef {Object} FiguraDefinition
     * @property {string} img - Ruta relativa a la imagen de la figura.
     * @property {Array<{id: string, label: string, placeholder: string}>} inputs - Definición de campos de entrada necesarios.
     * @property {Function} calculo - Función que retorna un objeto con el área y el perímetro calculado.
     */

    /** 
     * @type {Object.<string, FiguraDefinition>} 
     * Diccionario de configuración para cada figura geométrica soportada.
     */
    const figuras = {
        cuadrado: {
            img: '../img/cuadrado.svg',
            inputs: [
                { id: 'lado', label: 'Lado (cm):', placeholder: 'Ej: 5' }
            ],
            calculo: (datos) => {
                const lado = datos.lado;
                return {
                    area: lado * lado,
                    perimetro: lado * 4
                };
            }
        },
        rectangulo: {
            img: '../img/rectangulo.svg',
            inputs: [
                { id: 'base', label: 'Base (cm):', placeholder: 'Ej: 8' },
                { id: 'altura', label: 'Altura (cm):', placeholder: 'Ej: 4' }
            ],
            calculo: (datos) => {
                const { base, altura } = datos;
                return {
                    area: base * altura,
                    perimetro: 2 * (base + altura)
                };
            }
        },
        circulo: {
            img: '../img/circulo.svg',
            inputs: [
                { id: 'radio', label: 'Radio (cm):', placeholder: 'Ej: 3' }
            ],
            calculo: (datos) => {
                const radio = datos.radio;
                return {
                    area: Math.PI * Math.pow(radio, 2),
                    perimetro: 2 * Math.PI * radio
                };
            }
        },
        triangulo: {
            img: '../img/triangulo_rec.svg',
            inputs: [
                { id: 'base', label: 'Base (cm):', placeholder: 'Ej: 6' },
                { id: 'altura', label: 'Altura (cm):', placeholder: 'Ej: 4' }
            ],
            calculo: (datos) => {
                const { base, altura } = datos;
                const hipotenusa = Math.sqrt(Math.pow(base, 2) + Math.pow(altura, 2));
                return {
                    area: (base * altura) / 2,
                    perimetro: base + altura + hipotenusa
                };
            }
        }
    };

    // --- Funciones de Lógica de Interfaz ---

    /**
     * Genera dinámicamente los campos de entrada según la figura seleccionada.
     * @param {string} figuraId - El identificador de la figura (ej: 'cuadrado').
     */
    function mostrarInputs(figuraId) {
        const figura = figuras[figuraId];

        // Limpiar estado previo
        inputContainer.innerHTML = '';
        resultadoDiv.innerHTML = '';

        // Actualizar visualización
        imgFigura.src = figura.img;
        imgFigura.alt = `Imagen representativa de un ${figuraId}`;

        // Construcción dinámica de campos de formulario
        figura.inputs.forEach(inputDef => {
            const label = document.createElement('label');
            label.setAttribute('for', inputDef.id);
            label.textContent = inputDef.label;

            const input = document.createElement('input');
            input.type = 'number';
            input.id = inputDef.id;
            input.placeholder = inputDef.placeholder;
            input.min = "0";

            inputContainer.appendChild(label);
            inputContainer.appendChild(input);
        });
    }

    /**
     * Valida que todos los campos del formulario dinámico contengan valores numéricos válidos y positivos.
     * @returns {boolean} - True si todos los campos son válidos.
     */
    function validarInputs() {
        let esValido = true;
        const inputs = inputContainer.querySelectorAll('input');

        inputs.forEach(input => {
            input.classList.remove('input-error');

            const valor = parseFloat(input.value);
            if (input.value === '' || isNaN(valor) || valor <= 0) {
                esValido = false;
                input.classList.add('input-error');
            }
        });
        return esValido;
    }

    /**
     * Procesa el cálculo según la figura seleccionada y muestra los resultados en el DOM.
     * Invoca la validación antes de proceder.
     */
    function ejecutarCalculo() {
        const figuraSeleccionada = document.querySelector('input[name="figura"]:checked').value;

        if (!validarInputs()) {
            resultadoDiv.innerHTML = `<p class="error-msg">Por favor, corrige los campos destacados. Solo se admiten números positivos.</p>`;
            return;
        }

        const figura = figuras[figuraSeleccionada];
        const datos = {};

        // Extracción de datos desde los inputs dinámicos
        figura.inputs.forEach(inputDef => {
            datos[inputDef.id] = parseFloat(document.getElementById(inputDef.id).value);
        });

        const resultado = figura.calculo(datos);

        // Renderizado de resultados procesados
        resultadoDiv.innerHTML = `
            <h4>Resultados para ${figuraSeleccionada.charAt(0).toUpperCase() + figuraSeleccionada.slice(1)}:</h4>
            <p><strong>Área:</strong> ${resultado.area.toFixed(2)} cm²</p>
            <p><strong>Perímetro:</strong> ${resultado.perimetro.toFixed(2)} cm</p>
        `;
    }

    // --- Vinculación de Eventos ---

    // Observador para cambios en la selección de figuras
    radioFiguras.forEach(radio => {
        radio.addEventListener('change', (e) => {
            mostrarInputs(e.target.value);
        });
    });

    // Acción de cálculo
    btnCalcular.addEventListener('click', ejecutarCalculo);

    // --- Inicialización ---
    // Carga inicial (Selección por defecto configurada en HTML)
    const seleccionInicial = document.querySelector('input[name="figura"]:checked').value;
    mostrarInputs(seleccionInicial);
});