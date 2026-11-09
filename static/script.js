const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const message = document.getElementById("message");
const historyList = document.getElementById("history-list");
let expression = "";
let history = [];

function render() {
  expressionDisplay.textContent = expression || "0";
}
function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#ff858f" : "";
}
function addValue(value) {
  if (expression.length >= 60) return;
  expression += value;
  render();
  resultDisplay.textContent = "Ready";
  showMessage("Ready to calculate.");
}
function clearAll() {
  expression = "";
  render();
  resultDisplay.textContent = "Ready";
  showMessage("Cleared.");
}
function deleteLast() {
  expression = expression.slice(0, -1);
  render();
}
async function calculate() {
  if (!expression.trim()) {
    showMessage("Enter a calculation first.", true);
    return;
  }
  try {
    showMessage("Calculating…");
    const response = await fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression })
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || "Calculation failed.");
    resultDisplay.textContent = `= ${data.result}`;
    showMessage("Calculated by the Python backend.");
    history.unshift({ expression, result: data.result });
    history = history.slice(0, 12);
    renderHistory();
  } catch (error) {
    showMessage(error.message, true);
    resultDisplay.textContent = "Error";
  }
}
function renderHistory() {
  historyList.innerHTML = "";
  if (!history.length) {
    historyList.innerHTML = '<p class="empty-history">Your calculations will appear here.</p>';
    return;
  }
  history.forEach(item => {
    const row = document.createElement("div");
    row.className = "history-item";
    const exp = document.createElement("div");
    exp.className = "history-expression";
    exp.textContent = item.expression;
    const value = document.createElement("div");
    value.className = "history-result";
    value.textContent = `= ${item.result}`;
    value.title = "Click to reuse this expression";
    value.addEventListener("click", () => {
      expression = item.expression;
      render();
      resultDisplay.textContent = `= ${item.result}`;
    });
    row.append(exp, value);
    historyList.appendChild(row);
  });
}

document.querySelector(".keypad").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.action === "clear") clearAll();
  else if (button.dataset.action === "delete") deleteLast();
  else if (button.dataset.action === "calculate") calculate();
  else if (button.dataset.value) addValue(button.dataset.value);
});
document.getElementById("clear-history").addEventListener("click", () => {
  history = [];
  renderHistory();
});
document.addEventListener("keydown", event => {
  if (/^[0-9.+\-*/%()]$/.test(event.key)) addValue(event.key);
  else if (event.key === "Enter" || event.key === "=") { event.preventDefault(); calculate(); }
  else if (event.key === "Backspace") deleteLast();
  else if (event.key === "Escape") clearAll();
});
render();
