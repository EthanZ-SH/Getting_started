const expressionDisplay = document.getElementById("display-expression");
const valueDisplay = document.getElementById("display-value");
const keypad = document.querySelector(".keypad");

const state = {
  left: "0",
  right: null,
  operation: null,
  justEvaluated: false,
};

function render() {
  let expressionText = state.left;

  if (state.right !== null && state.operation) {
    const symbol = operationToSymbol(state.operation);
    expressionText = `${state.left} ${symbol} ${state.right}`;
  } else if (state.operation) {
    const symbol = operationToSymbol(state.operation);
    expressionText = `${state.left} ${symbol}`;
  }

  expressionDisplay.textContent = expressionText;
  valueDisplay.textContent = state.right !== null ? state.right : state.left;
}

function operationToSymbol(operation) {
  const map = {
    add: "+",
    subtract: "-",
    multiply: "x",
    divide: "/",
  };
  return map[operation] || "?";
}

function resetCalculator() {
  state.left = "0";
  state.right = null;
  state.operation = null;
  state.justEvaluated = false;
  render();
}

function appendDigit(digit) {
  const targetKey = state.operation ? "right" : "left";

  if (state.justEvaluated && targetKey === "left") {
    state.left = digit;
    state.justEvaluated = false;
    render();
    return;
  }

  if (state[targetKey] === null || state[targetKey] === "0") {
    state[targetKey] = digit;
  } else {
    state[targetKey] += digit;
  }

  render();
}

function appendDecimal() {
  const targetKey = state.operation ? "right" : "left";

  if (state.justEvaluated && targetKey === "left") {
    state.left = "0.";
    state.justEvaluated = false;
    render();
    return;
  }

  if (state[targetKey] === null) {
    state[targetKey] = "0.";
  } else if (!state[targetKey].includes(".")) {
    state[targetKey] += ".";
  }

  render();
}

function negateCurrent() {
  const targetKey = state.operation ? "right" : "left";
  const current = state[targetKey] || "0";

  if (current === "0") {
    return;
  }

  state[targetKey] = current.startsWith("-") ? current.slice(1) : `-${current}`;
  render();
}

function chooseOperation(operation) {
  if (state.right !== null) {
    return;
  }
  state.operation = operation;
  state.justEvaluated = false;
  render();
}

async function evaluate() {
  if (!state.operation || state.right === null) {
    return;
  }

  const payload = {
    a: Number(state.left),
    b: Number(state.right),
    operation: state.operation,
  };

  try {
    const response = await fetch("/api/calc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await response.json();

    if (!response.ok) {
      return;
    }

    state.left = String(body.result);
    state.right = null;
    state.operation = null;
    state.justEvaluated = true;
    render();
  } catch (error) {
    console.error("Network error while calculating:", error);
  }
}

keypad.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  if (button.dataset.digit) {
    appendDigit(button.dataset.digit);
    return;
  }

  if (button.dataset.op) {
    chooseOperation(button.dataset.op);
    return;
  }

  const action = button.dataset.action;
  if (action === "decimal") {
    appendDecimal();
  } else if (action === "negate") {
    negateCurrent();
  } else if (action === "clear") {
    resetCalculator();
  } else if (action === "equals") {
    await evaluate();
  }
});

resetCalculator();
