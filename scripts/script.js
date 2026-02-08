/**
 * @file script.js
 * @description Lógica de funcionamiento para las calculadoras básica y científica.
 * Maneja la captura de eventos del teclado, la construcción de expresiones y el cálculo matemático.
 * @author Alejandro González Hernández
 * @project Calculadora Básica - Científica - Geométrica
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a Elementos del DOM ---
    const pantalla = document.getElementById('pantalla');
    const botones = document.querySelector('.botones');

    /** @type {string} Almacena la expresión matemática actual en formato de texto */
    let expresion = '';

    /**
     * Manejador de eventos delegado para los botones de la calculadora.
     * Captura el clic en cualquier botón y procesa su valor según el tipo de acción.
     */
    botones.addEventListener('click', e => {
        if (e.target.matches('button')) {
            const btn = e.target;
            const value = btn.dataset.value;

            switch (value) {
                case 'clear':
                    // Limpia la memoria y la pantalla
                    expresion = '';
                    pantalla.value = '';
                    break;

                case 'backspace':
                    // Elimina el último caracter ingresado
                    expresion = expresion.slice(0, -1);
                    pantalla.value = expresion;
                    break;

                case '=':
                    // Intenta evaluar la expresión acumulada
                    try {
                        const resultado = calcular(expresion);
                        pantalla.value = resultado;
                        // Permite continuar operando con el resultado
                        expresion = resultado.toString();
                    } catch (error) {
                        pantalla.value = 'Error';
                        expresion = '';
                    }
                    break;

                case 'sin':
                case 'cos':
                case 'tan':
                case 'log':
                case 'ln':
                case 'sqrt':
                    // Agrega la función con paréntesis estructurado para el input
                    expresion += value + '(';
                    pantalla.value = expresion;
                    break;

                case 'pi':
                    // Inyecta el valor de la constante PI de Math
                    expresion += Math.PI;
                    pantalla.value = expresion;
                    break;

                default:
                    // Entrada de números y operadores básicos (+, -, *, /)
                    expresion += value;
                    pantalla.value = expresion;
                    break;
            }
        }
    });

    /**
     * Calcula el resultado de una expresión matemática de forma estructurada.
     * Reemplaza funciones de texto por llamadas a la librería Math y evalúa la expresión final.
     * 
     * @param {string} exp - La cadena de texto que contiene la expresión matemática.
     * @returns {number|string} - El resultado numérico del cálculo o un mensaje de error.
     */
    function calcular(exp) {
        if (!exp) return '';

        /**
         * Resuelve sub-expresiones contenidas entre paréntesis.
         * @param {string} subExp - La expresión interna para evaluar recursivamente.
         * @returns {number}
         */
        function evaluarParentesis(subExp) {
            return calcular(subExp);
        }

        // --- Procesamiento de Funciones Científicas ---
        // Conversión a Radianes para funciones trigonométricas
        exp = exp.replace(/sin\(([^)]+)\)/g, (match, num) => Math.sin(evaluarParentesis(num) * Math.PI / 180));
        exp = exp.replace(/cos\(([^)]+)\)/g, (match, num) => Math.cos(evaluarParentesis(num) * Math.PI / 180));
        exp = exp.replace(/tan\(([^)]+)\)/g, (match, num) => Math.tan(evaluarParentesis(num) * Math.PI / 180));

        // Logaritmos y Raíces
        exp = exp.replace(/log\(([^)]+)\)/g, (match, num) => Math.log10(evaluarParentesis(num)));
        exp = exp.replace(/ln\(([^)]+)\)/g, (match, num) => Math.log(evaluarParentesis(num)));
        exp = exp.replace(/sqrt\(([^)]+)\)/g, (match, num) => Math.sqrt(evaluarParentesis(num)));

        // --- Manejo de Paréntesis Anidados ---
        // Se resuelven de adentro hacia afuera mediante expresiones regulares recursivas
        while (exp.includes('(')) {
            exp = exp.replace(/\(([^()]+)\)/g, (match, subExp) => evaluarParentesis(subExp));
        }

        /**
         * Validación de Seguridad:
         * Verifica que la expresión procesada contenga SOLO caracteres permitidos (números, operadores, funciones Math).
         * Esto previene ataques de inyección de código (XSS/Code Injection).
         */
        const tokensPermitidos = /[0-9\.\+\-\*\/\(\)\s]|Math\.(sin|cos|tan|log|log10|sqrt|PI)/g;
        const residuos = exp.replace(tokensPermitidos, '');

        if (residuos.trim().length > 0) {
            console.error("Intento de ejecución de código no permitido:", residuos);
            throw new Error("Expresión insegura");
        }

        try {
            /**
             * Evaluación Segura de Expresión Aritmética.
             * Se utiliza el constructor de Function para ejecutar el retorno de la expresión 
             * como código JavaScript de forma controlada tras la validación.
             */
            const resultado = new Function('return ' + exp)();

            // Validaciones numéricas post-calculo
            if (!isFinite(resultado) || isNaN(resultado)) {
                throw new Error("Resultado inválido");
            }
            return resultado;
        } catch (err) {
            throw err;
        }
    }
});