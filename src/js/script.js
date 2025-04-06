require('../css/style.css');

const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.buttons button');

// Переменные для хранения состояния
let currentInput = '';
let lastResult = null; // Для хранения последнего результата
let hasDecimal = false; // Флаг для отслеживания точки
let numbersArray = []; // Массив для хранения чисел
let lastValue = ''; // Переменная для хранения последнего числа

// Инициализация дисплея
display.value = '0';

// Обработчик кликов по кнопкам
buttons.forEach(button => {
     button.addEventListener('click', () => {
          const value = button.getAttribute('data-value');
          handleInput(value);
     });
});

// Обработчик ввода с клавиатуры
document.addEventListener('keydown', (event) => {
     const key = event.key;

     if (/[0-9]/.test(key)) {
          handleInput(key);
     } else if (['+', '-', '*', '/'].includes(key)) {
          handleInput(key);
     } else if (key === 'Enter' || key === '=') {
          handleInput('=');
     } else if (key === 'Backspace') {
          handleInput('DEL');
     } else if (key === 'Escape') {
          handleInput('AC');
     } else if (key === '.' || key === ',' || key === 'ю' || key === 'б') {
          // поддержка точки в разных раскладках
          handleInput('.');
     }
});


// Основная функция обработки ввода
function handleInput(value) {
     switch (value) {
          case 'AC':
               currentInput = '';
               lastResult = null;
               hasDecimal = false;
               display.value = '0';
               break;

          case 'DEL':
               currentInput = currentInput.slice(0, -1);
               numbersArray = currentInput.split(/[+\-*/]/);
               lastValue = numbersArray[numbersArray.length - 1];

               hasDecimal = lastValue.includes('.');
               display.value = currentInput || '0';

               numbersArray = [];
               lastValue = '';
               break;

          case '%':
               if (currentInput) {
                    try {
                         const result = eval(currentInput) / 100;
                         currentInput = result.toString();
                         lastResult = result;
                         display.value = currentInput;
                    } catch (error) {
                         display.value = 'Error';
                         currentInput = '';
                    }
               }
               break;

          case '=':
               if (currentInput) {
                    try {
                         // Заменяем двойной минус на плюс
                         const safeInput = currentInput.replace(/--/g, '+');
                         const result = eval(safeInput);
          
                         const roundedResult = parseFloat(result.toFixed(10));
          
                         currentInput = roundedResult.toString();
                         lastResult = roundedResult;
                         hasDecimal = currentInput.includes('.');
                         display.value = currentInput;
                    } catch (error) {
                         display.value = 'Error';
                         currentInput = '';
                    }
               }
               break;
               
          case '.':
               // Если это первый символ, добавляем 0
               if (!currentInput) {
                    currentInput = '0';
                    display.value = '0';
               }
               // Запрещаем ввод второй точки
               if (!hasDecimal) {
                    numbersArray = currentInput.split(/[+\-*/]/);
                    lastValue = numbersArray[numbersArray.length - 1];
                    if(lastValue.length == 0)
                         currentInput += '0.';
                    else
                         currentInput += '.';

                    hasDecimal = true;
                    display.value = currentInput;

                    numbersArray = [];
                    lastValue = '';
               }

               break;

          case '+':
          case '*':
          case '/':
               if (!currentInput && lastResult !== null)
                    currentInput = lastResult.toString();
          
               currentInput += value;
               hasDecimal = false;
               display.value = currentInput;
               break;
          
          case '-':
               // Разрешаем минус в начале
               if (!currentInput && lastResult !== null)
                    currentInput = lastResult.toString();
          
               currentInput += '-';
               hasDecimal = false;
               display.value = currentInput;
               break;

          case 'F1':
          case 'F2':
          case 'F3':
          case 'F4':
          case 'F5':
          case 'F6':
          case 'F7':
          case 'F8':
          case 'F9':
          case 'F10':
          case 'F11':
          case 'F12':
               break;
               
          default:
               numbersArray = currentInput.split(/[+\-*/]/);
               lastValue = numbersArray[numbersArray.length - 1];

               if(lastValue === '0' && value === '0') return;
               if (currentInput.length == 1 && currentInput == '0')
                    currentInput = value;
               else
                    lastValue === '0' ? currentInput = currentInput.slice(0, -1) + value : currentInput += value;
               display.value = currentInput;

               numbersArray = [];
               lastValue = '';
               break;
     }
}