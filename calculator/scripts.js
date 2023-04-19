let display = document.querySelector('.results');
let firstNum = document.querySelector('.firstNum');

const keypad = document.querySelector('.keypad');
const keys = document.querySelectorAll('.key');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.op');
const decimal = document.querySelector('.dec');

const isOp = /[+-/*]/;
const isNum = /[0-9]/;

let op = '',
    hasOp = false,
    hasDec = false,
    solved = false,
    hasFirstNum = false,
    negativeNum = false,
    firstKeyPress = false;


const handleKeyPress = (e) => {
    let key = e.key;
    switch (true) {
        case (isNum.test(key)):
            handleNumber(key);
            break;
        case (isOp.test(key)):
            handleOps(key);
            break;
        case (key === 'Backspace'):
            backspace();
            break;
        case (key === '=' || key === 'Enter'):
            getResult(display.innerText);
            break;
        case (key === '.'):
            handleDec();
            break;
        case (key === 'Escape'):
            clearAll();
            break;
        default:
            return;
    }
};

document.addEventListener('keydown', handleKeyPress);

const handleClick = (e) => {
    let classes = e.target;
    let value = e.target.value;

    switch (true) {
        case (classes.classList.contains('number')):
            handleNumber(value);
            break;
        case (classes.classList.contains('op')):
            handleOps(value);
            break;
        case (classes.classList.contains('dec')):
            handleDec();
            break;
        case (value === 'me'):
            clearAll();
            break;
        case (value === 'equals'):
            getResult(display.innerText);
            break;
        case (value === 'backspace'):
            backspace();
            break;
        default:
            break;
    }
};

const clearAll = () => {
    firstNum.innerText = '';
    display.innerText = '';
    firstKeyPress = false;
    hasFirstNum = false;
    negativeNum = false;
    solved = false;
    hasDec = false;
    hasOp = false;
    op = '';
};

const backspace = () => {
    let emptyDisplay = display.innerText === '',
        emptyFirstNum = firstNum.innerText === '',
        ret;

    switch (true) {
        case (emptyDisplay && emptyFirstNum || solved): // ** moot click
            break;
        case (emptyDisplay && !emptyFirstNum): // ** display empty, modify firstNum
            let check = checkForOp(firstNum); // ** is last input an operator

            check ? ret = removeLastOp(firstNum)
                : ret = removeLastInput(firstNum);
            firstNum.innerText = '';
            display.innerText = ret;
            break;
        case (!emptyDisplay): // ** modify display
            let checkDisplay = checkForOp(display);

            checkDisplay ? ret = removeLastOp(display)
                : ret = removeLastInput(display);
            display.innerText = ret;
            break;
        default:
            return;
    }
};

const checkForOp = (display) => {
    const check = display.innerText.slice(-1);
    return isOp.test(check);
};
const removeLastOp = (input) => {
    op = '';
    hasOp = false;
    return input.innerText.slice(0, input.innerText.length - 1);
};
const removeLastInput = (input) => {
    return input.innerText.slice(0, input.innerText.length - 1);
};

const getResult = (secondNum) => {
    if (op === '' || solved) return;
    solved = true;

    let firstVal = firstNum.innerText.slice(0, firstNum.innerText.length - 1);
    let secondNo = Number(secondNum),
        firstNo = Number(firstVal),
        result;

    if (display.innerText === '' || firstVal === '') return;

    switch (true) {
        case (op === '+'):
            result = firstNo + secondNo;
            break;
        case (op === '-'):
            result = firstNo - secondNo;
            break;
        case (op === '*'):
            result = firstNo * secondNo;
            break;
        case (op === '/'):
            result = firstNo / secondNo;
            break;
    }
    firstNum.innerText = `${ firstNo + ' ' + op + ' ' + secondNum } = `;
    return display.innerText = result;
};

const handleNumber = (e) => {
    firstKeyPress = true;
    if (solved) return;
    return display.innerText += e;
};

const handleOps = (e) => {
    if (!firstKeyPress && e !== '-' || solved) return;
    const lastInput = display.innerText.slice(-1);
    const result = isOp.test(lastInput);
    let displayTxt = display.innerText,
        noOperator = !hasOp && !result, // ** first operator
        secondOpMinus = result && e === '-', // ** second number is negative
        emptyResults = display.innerText === '',
        emptyDisplays = emptyResults && firstNum.innerText === '',
        negSecondNum = firstNum.innerText !== '' && emptyResults && e === '-';

    firstKeyPress = true;
    switch (true) {
        case (emptyDisplays):
            display.innerText += e;
            negativeNum = true;
            break;
        case (noOperator):
            firstNum.innerText = displayTxt += e;
            hasFirstNum = true;
            display.innerText = '';
            hasOp = true;
            op = e;
            break;
        case (secondOpMinus && !negativeNum || negSecondNum):
            display.innerText += e;
            break;
        case (hasOp && !emptyResults):
            getResult(display.innerText);
        case (negativeNum):
            break;
    }
};

const handleDec = () => {
    if (solved) return;
    const noDec = !hasDec;
    const noDecNoOp = hasDec && hasOp; // ** no decimal, no operator
    const justOp = display.innerText === '-';
    const emptyDisplay = display.innerText === '';

    switch (true) {
        case (noDec):
            display.innerText === ''
                ? display.innerText += '0.'
                : display.innerText += '.';
            hasDec = true;
            break;
        case (justOp || emptyDisplay):
            display.innerHTML += '0.';
            break;
        case (noDecNoOp):
            display.innerText += '.';
            break;
        default:
            break;
    }
};

keys.forEach(key => {
    key.addEventListener('click', handleClick);
});

