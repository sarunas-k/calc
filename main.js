class Calculator {
  domElement;
  displayElement;
  keyboardButtons = {};
  MAX_LENGTH = 16;

  constructor(keyboardElements) {
    if (!keyboardElements || !(keyboardElements instanceof HTMLElement))
      throw new Error("Constructor argument should be DOM element.");
    this.domElement = keyboardElements;
    this.initKeyboard();
    this.clear();
  }

  setTo(value) {
    document.getElementsByClassName("display")[0].textContent = value
      .toString()
      .replace(",", ".");
  }

  clear() {
    this.setTo("0");
  }

  replace(value) {
    if (value.toString().length > this.MAX_LENGTH)
      value = value.toString().slice(0, 16);
    this.setTo(value);
  }

  replaceLast(value) {
    this.setTo(
      this.valueOnDisplay().slice(0, this.valueOnDisplay().length - 1) +
        value.toString()
    );
  }

  write(value) {
    if (this.valueOnDisplay().length < this.MAX_LENGTH)
      this.setTo(this.valueOnDisplay() + value);
  }

  pop() {
    this.setTo(this.valueOnDisplay().slice(0, -1));
  }

  makeNegative(value) {
    if (this.valueOnDisplay().length < this.MAX_LENGTH)
      return "-" + value.toString();
    return value;
  }

  makePositive(value) {
    return value.toString().slice(1);
  }

  valueOnDisplay() {
    return document.getElementsByClassName("display")[0].textContent;
  }

  initKeyboard() {
    for (let i = 0; i < this.domElement.children.length; i++) {
      const button = this.domElement.children[i];
      if (button.textContent === null) return;
      if (typeof this.keyboardButtons[button.textContent] === "undefined") {
        this.keyboardButtons[button.textContent] = [button];
        continue;
      }

      this.keyboardButtons[button.textContent].push(button);
    }
    for (const key in this.keyboardButtons) {
      this.keyboardButtons[key].forEach((button) => {
        button.addEventListener("click", () => {
          const displayVal = this.valueOnDisplay();
          if (displayVal === "0") {
            if (key.match(/(=|C|Del|√x|%|\+\/\-){1}/)) return;
            if (key.match(/\d{1}/)) {
              this.replace(key);
            } else {
              this.write(key);
            }
          } else if (displayVal.slice(displayVal.length - 1).match(/\d{1}/)) {
            if (key.match(/C{1}/)) {
              this.clear();
              return;
            }
            if (key.match(/(Del){1}/)) {
              if (displayVal.length === 1) this.replace("0");
              else this.pop();
              return;
            }
            if (key.match(/\%{1}/)) {
              const valOperator = displayVal.replace(
                /\B\-{1}\d+\b|(\d|\.)+/g,
                ""
              );
              if (valOperator.length === 0) {
                this.replace("0");
                return;
              } else {
                let values = null;
                if (valOperator.match(/\-/) && displayVal[0] === "-") {
                  values = displayVal.slice(1).split(valOperator);
                  values[0] = makeNegative(values[0]);
                } else {
                  values = displayVal.split(valOperator);
                }
                let result = "";
                if (values.length === 2 && values[1] > 0 && values[1] <= 100) {
                  switch (valOperator) {
                    case "*":
                      result = values[0] * (values[1] / 100);
                      break;
                    case "/":
                      result = values[0] / (values[1] / 100);
                      break;
                    case "+":
                      result =
                        parseFloat(values[0]) + (values[0] * values[1]) / 100;
                      break;
                    case "-":
                      result =
                        parseFloat(values[0]) - (values[0] * values[1]) / 100;
                      break;
                  }
                  this.replace(result !== "" ? result : "0");
                }
              }
            } else if (!key.match(/\d{1}/)) {
              const valOperator = displayVal.replace(
                /\B\-{1}\d+\b|(\d|\.)+/g,
                ""
              );
              if (valOperator.length !== 0) {
                let values = null;
                if (valOperator.match(/\-/) && displayVal[0] === "-") {
                  values = displayVal.slice(1).split(valOperator);
                  values[0] = this.makeNegative(values[0]);
                } else {
                  values = displayVal.split(valOperator);
                }
                if (key.match(/,{1}/)) {
                  if (!values[1].match(/\./)) {
                    this.write(key);
                  }
                  return;
                }
                let result = null;
                if (
                  values.length === 2 &&
                  values[0].length &&
                  values[1].length
                ) {
                  if (
                    valOperator.match(/\/{1}/) &&
                    parseFloat(values[1]) === 0
                  ) {
                    this.replace("Error/Klaida");
                    setTimeout(() => this.clear(), 2000);
                    return;
                  } else if (key.match(/(√x){1}/)) {
                    values[1] = Math.sqrt(parseFloat(values[1]));
                  } else if (key.match(/(\+\/-){1}/)) {
                    values[1] = this.makeNegative(values[1]);
                  }

                  switch (valOperator) {
                    case "*":
                      result = values[0] * values[1];
                      break;
                    case "/":
                      result = values[0] / values[1];
                      break;
                    case "+":
                      result = parseFloat(values[0]) + parseFloat(values[1]);
                      break;
                    case "-":
                      result = parseFloat(values[0]) - parseFloat(values[1]);
                      break;
                  }
                  this.replace(result !== null ? result : "0");
                }
              } else if (key.match(/(√x){1}/)) {
                if (!displayVal.match(/^-\w+(\w|\.)*$/)) {
                  this.replace(Math.sqrt(displayVal));
                } else {
                  this.replace("Error/Klaida");
                  setTimeout(() => this.clear(), 2000);
                }
                return;
              } else if (key.match(/(\+\/-){1}/)) {
                if (!displayVal.match(/^-\w+$/))
                  this.replace(this.makeNegative(displayVal));
                else this.replace(this.makePositive(displayVal));
                return;
              } else if (key.match(/,{1}/) && displayVal.match(/\./)) {
                return;
              }
              if (key.match(/(=|√x|\+\/-){1}/)) return;

              this.write(key);
            } else {
              this.write(key);
            }
          } else {
            if (key.match(/\d{1}/)) {
              this.write(key);
            } else if (key.match(/\C{1}/)) {
              this.clear();
            } else if (key.match(/(Del){1}/)) {
              if (displayVal.match(/0\.\B/) && displayVal.length !== 2)
                this.pop();
              this.pop();
            } else if (key.match(/\%{1}/)) {
              this.replace("0");
            } else if (key.match(/√x{1}/)) {
              this.pop();
              this.replace(Math.sqrt(this.valueOnDisplay()));
            } else if (key.match(/(\+\/-){1}/)) {
              return;
            } else if (
              key.match(/,{1}/) &&
              displayVal[displayVal.length - 1] !== "."
            ) {
              this.write("0.");
            } else {
              this.replaceLast(key);
            }
          }
        });
      });
    }
  }
}
window.addEventListener("load", () => {
  window.calculator = new Calculator(
    document.getElementsByClassName("keyboard-operations")[0]
  );
  document.getElementsByTagName("main")[0].style.left = "0";
  document.getElementsByTagName("main")[0].style.backgroundColor = "#4b7c7c";
});
window.addEventListener(
  "keydown",
  (event) => {
    if (window.calculator.keyboardButtons[event.key]) {
      event.preventDefault();
      event.stopPropagation();
      window.calculator.keyboardButtons[event.key].dispatchEvent(
        new MouseEvent("click")
      );
    } else if (
      event.key === "Backspace" &&
      window.calculator.keyboardButtons["Del"]
    ) {
      window.calculator.keyboardButtons["Del"].dispatchEvent(
        new MouseEvent("click")
      );
    } else if (
      event.key === "Delete" &&
      window.calculator.keyboardButtons["C"]
    ) {
      window.calculator.keyboardButtons["C"].dispatchEvent(
        new MouseEvent("click")
      );
    } else if (
      event.key === "Enter" &&
      window.calculator.keyboardButtons["="]
    ) {
      window.calculator.keyboardButtons["="].dispatchEvent(
        new MouseEvent("click")
      );
    } else if (event.key === "." && window.calculator.keyboardButtons[","]) {
      window.calculator.keyboardButtons[","].dispatchEvent(
        new MouseEvent("click")
      );
    }
  },
  true
);
module.exports = Calculator;
