const display = document.getElementById("display");
const expression = document.getElementById("expression");
const keypad = document.querySelector(".keypad");

const operationSymbols = {
    add: "+",
    subtract: "−",
    multiply: "×",
    divide: "÷"
};

let currentValue = "0";
let storedValue = null;
let pendingOperation = null;
let waitingForOperand = false;
let hasError = false;

function updateDisplay() {
    display.textContent = currentValue;
}

function enterDigit(digit) {
    if (hasError || waitingForOperand) {
        currentValue = digit;
        waitingForOperand = false;
        hasError = false;
    } else if (currentValue === "0") {
        currentValue = digit;
    } else {
        currentValue += digit;
    }

    updateDisplay();
}

function enterDecimal() {
    if (hasError || waitingForOperand) {
        currentValue = "0.";
        waitingForOperand = false;
        hasError = false;
    } else if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}

function calculate(firstValue, secondValue, operation) {
    switch (operation) {
        case "add":
            return firstValue + secondValue;
        case "subtract":
            return firstValue - secondValue;
        case "multiply":
            return firstValue * secondValue;
        case "divide":
            return firstValue / secondValue;
        default:
            return secondValue;
    }
}

function formatNumber(value) {
    return String(Number(value.toPrecision(12)));
}

function showError(message) {
    currentValue = message;
    hasError = true;
    waitingForOperand = true;
    updateDisplay();
}

function chooseOperation(operation) {
    if (hasError) {
        return;
    }

    const inputValue = Number(currentValue);

    if (pendingOperation && !waitingForOperand) {
        const result = calculate(storedValue, inputValue, pendingOperation);

        if (!Number.isFinite(result)) {
            showError("Tidak dapat dibagi dengan nol");
            expression.textContent = "";
            storedValue = null;
            pendingOperation = null;
            return;
        }

        currentValue = formatNumber(result);
        updateDisplay();
    } else if (storedValue === null) {
        storedValue = inputValue;
    }

    pendingOperation = operation;
    waitingForOperand = true;
    expression.textContent = `${currentValue} ${operationSymbols[operation]}`;
}

function calculateResult() {
    if (!pendingOperation || storedValue === null || hasError) {
        return;
    }

    const firstValue = storedValue;
    const secondValue = Number(currentValue);
    const operation = pendingOperation;
    const result = calculate(firstValue, secondValue, operation);

    if (!Number.isFinite(result)) {
        showError("Tidak dapat dibagi dengan nol");
        expression.textContent = "";
    } else {
        expression.textContent = `${formatNumber(firstValue)} ${operationSymbols[operation]} ${formatNumber(secondValue)} =`;
        currentValue = formatNumber(result);
        updateDisplay();
    }

    storedValue = null;
    pendingOperation = null;
    waitingForOperand = true;
}

function clearCalculator() {
    currentValue = "0";
    storedValue = null;
    pendingOperation = null;
    waitingForOperand = false;
    hasError = false;
    expression.textContent = "";
    updateDisplay();
}

function deleteLastDigit() {
    if (hasError) {
        clearCalculator();
        return;
    }

    if (waitingForOperand) {
        return;
    }

    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
    if (currentValue === "-") {
        currentValue = "0";
    }
    updateDisplay();
}

function handleInput(button) {
    if (button.dataset.digit !== undefined) {
        enterDigit(button.dataset.digit);
    } else if (button.dataset.operation) {
        chooseOperation(button.dataset.operation);
    } else if (button.dataset.action === "decimal") {
        enterDecimal();
    } else if (button.dataset.action === "equals") {
        calculateResult();
    } else if (button.dataset.action === "clear") {
        clearCalculator();
    } else if (button.dataset.action === "delete") {
        deleteLastDigit();
    }
}

keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button) {
        handleInput(button);
    }
});

document.addEventListener("keydown", (event) => {
    if (/^\d$/.test(event.key)) {
        enterDigit(event.key);
    } else if (event.key === ".") {
        enterDecimal();
    } else if (event.key === "+") {
        chooseOperation("add");
    } else if (event.key === "-") {
        chooseOperation("subtract");
    } else if (event.key === "*") {
        chooseOperation("multiply");
    } else if (event.key === "/") {
        event.preventDefault();
        chooseOperation("divide");
    } else if (event.key === "Enter" || event.key === "=") {
        calculateResult();
    } else if (event.key === "Backspace") {
        deleteLastDigit();
    } else if (event.key === "Escape") {
        clearCalculator();
    } else {
        return;
    }

    event.preventDefault();
});

updateDisplay();
