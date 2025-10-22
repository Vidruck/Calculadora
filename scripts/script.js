document.addEventListener('DOMContentLoaded', () => {
    const pantalla = document.getElementById('pantalla');
    const botones = document.querySelector('.botones');
    let expresion = '';

    botones.addEventListener('click', e => {
        if (e.target.matches('button')) {
            const btn = e.target;
            const value = btn.dataset.value;

            switch (value) {
                case 'clear':
                    expresion = '';
                    pantalla.value = '';
                    break;
                case 'backspace':
                    expresion = expresion.slice(0, -1);
                    pantalla.value = expresion;
                    break;
                case '=':
                    try {
                        const resultado = calcular(expresion);
                        pantalla.value = resultado;
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
                     // Agrega la función con paréntesis para el input
                    expresion += value + '(';
                    pantalla.value = expresion;
                    break;
                case 'pi':
                    expresion += Math.PI;
                    pantalla.value = expresion;
                    break;
                default:
                    expresion += value;
                    pantalla.value = expresion;
                    break;
            }
        }
    });

    /**
     * Función para calcular el resultado de una expresión matemática de forma segura.
     * @param {string} exp - La expresión a calcular.
     * @returns {number} - El resultado del cálculo.
     */
    function calcular(exp) {
        // Reemplazar funciones científicas
        exp = exp.replace(/sin\(([^)]+)\)/g, (match, num) => Math.sin(evaluarParentesis(num) * Math.PI / 180));
        exp = exp.replace(/cos\(([^)]+)\)/g, (match, num) => Math.cos(evaluarParentesis(num) * Math.PI / 180));
        exp = exp.replace(/tan\(([^)]+)\)/g, (match, num) => Math.tan(evaluarParentesis(num) * Math.PI / 180));
        exp = exp.replace(/log\(([^)]+)\)/g, (match, num) => Math.log10(evaluarParentesis(num)));
        exp = exp.replace(/ln\(([^)]+)\)/g, (match, num) => Math.log(evaluarParentesis(num)));
        exp = exp.replace(/sqrt\(([^)]+)\)/g, (match, num) => Math.sqrt(evaluarParentesis(num)));

        // Función para resolver primero lo que está dentro de los paréntesis
        function evaluarParentesis(subExp) {
            // Llama recursivamente a 'calcular' para resolver la subexpresión
            return calcular(subExp);
        }
        
        // Función recursiva para manejar paréntesis anidados
        while (exp.includes('(')) {
            exp = exp.replace(/\(([^()]+)\)/g, (match, subExp) => evaluarParentesis(subExp));
        }

        // Se crea una función constructora para evitar el uso de eval()
        return new Function('return ' + exp)();
    }
});