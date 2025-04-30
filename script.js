let isEqual = false; // to clear display calculation for any click, soon after an = click
let isOperated = false; // not to append display for any click, soon after an operator (+,-*,/) click
let isSpecialOperator = false; // clear the display calc after clicking any special operator

const handleClick = (value) => { // For numbers and .
    const display = document.getElementById("result"); // to display result
    const displayCalc = document.getElementById("dispayCalc");   // to display calculation

    if (display.innerHTML == 0 || isOperated || isEqual) {
        display.innerHTML = value
    } else {
        display.innerHTML += value
    }
    if (isEqual) {
        displayCalc.innerHTML = "";
    }
    isEqual = false;
    isOperated = false;
}

const doOperations = (operator) => { // For operators +,-,*,/
    const display = document.getElementById("result");
    const displayCalc = document.getElementById("dispayCalc");
    if (isOperated) return;

    if (isEqual) {  // clean up history after =
        displayCalc.innerHTML = "";
    } else if (displayCalc.innerHTML.length > 0)  // if history
    {
        if (isSpecialOperator) { // if special functions are included in history
           const expression = correct_HistoryAfterSpecialOperation(displayCalc.innerHTML, display.innerHTML);
           displayCalc.innerHTML = expression;
        }
        const result = evalResult(displayCalc.innerHTML, display.innerHTML)
        display.innerHTML = result;
    }
    displayCalc.innerHTML = display.innerHTML + operator;
    isOperated = true;
    isEqual = false;
}

const onEqual = () => {  // For =
    const display = document.getElementById("result");
    const displayCalc = document.getElementById("dispayCalc");

    let result = display.innerHTML;
    if (displayCalc.innerHTML.length > 0) // if history 
    {
        if (isSpecialOperator) { // if special functions are included in history
            const expression = correct_HistoryAfterSpecialOperation(displayCalc.innerHTML, display.innerHTML);           
            displayCalc.innerHTML = expression;
        }
        // evaluate and return the result using history and current value
        result = evalResult(displayCalc.innerHTML, display.innerHTML);
    }
    displayCalc.innerHTML += display.innerHTML + '='; // displaying the expression with history, current value and operator
    display.innerHTML = result; // updating the result to display

    isEqual = true;
}

const evalResult = (history, currentValue) => {
    let expression = history + currentValue;
    expression = expression.replaceAll("÷", "/");
    return eval(expression);
}

const correct_HistoryAfterSpecialOperation = (history) => {
    const pattern =/sqr|1\/|negate|√|∛|=/  
    let specialOperatorResult = history.match(pattern)    
    if (specialOperatorResult?.length > 0) {
        const specialOperatorIndex = history.indexOf(specialOperatorResult[0])
        const tempResult = history.substring(0, specialOperatorIndex)
        return tempResult;       
    } 
      isSpecialOperator = false;
      return history;
}

const clearResult = () => { // clearing the results
    document.getElementById("result").innerHTML = "0";
    document.getElementById("dispayCalc").innerHTML = "";
}

const calculateResult = (func) => { // For special functions
    const display = document.getElementById("result");
    const displayCalc = document.getElementById("dispayCalc");
    isSpecialOperator = true;

    if (isEqual) {
        displayCalc.innerHTML = "";
        isEqual = false;
    }

    let result = parseFloat(display.innerHTML);
    let output;
    let label;

    switch (func) {
        case "x²":
            output = Math.pow(result, 2);
            label = `sqr(${result})`;
            break;
        case "1/x":
            if (result === 0) {
                output = "Error";
                label = "Cannot divide by 0";
            } else {
                output = 1 / result;
                label = `1/${result}`;
            }
            break;
        case "√x":
            output = Math.sqrt(result);
            label = `√(${result})`;
            break;
        case "∛x":
            output = Math.cbrt(result);
            label = `∛(${result})`;
            break;
        default:
            output = result;
            label = "";
    }

    displayCalc.innerHTML += label;
    display.innerHTML = output;
}

function deleteLast() {
    const display = document.getElementById("result");
    const displayCalc = document.getElementById("dispayCalc");
    display.innerHTML = display.innerHTML.slice(0, -1);
    if (display.innerHTML == "") display.innerHTML = "0"

    if (isEqual) {
        displayCalc.innerHTML = "";
        isEqual = false;
    }
}

const negateValue = () => {
    const display = document.getElementById("result");
    const displayCalc = document.getElementById("dispayCalc");

    if (isEqual || displayCalc.innerHTML.indexOf('negate') == 0) {
        displayCalc.innerHTML = `negate(${display.innerHTML})`
        isEqual = false;
    }
    display.innerHTML = parseFloat(display.innerHTML) * -1;
    isSpecialOperator = true;
}

function calculatePercentage() {
    const display = document.getElementById("result");
    const displayCalc = document.getElementById("dispayCalc");

    const value = parseFloat(display.innerHTML);
    if (!isNaN(value)) {
      const percent = value / 100;
      display.innerHTML = percent;
      displayCalc.innerHTML = `${value}% = ${percent}`;  
      isEqual = true;    
    }
  }
  