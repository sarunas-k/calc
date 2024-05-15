class Calculator {

    domElement;
    displayElement;
    keyboardButtons = {};
    MAX_LENGTH = 16;

    constructor(keyboardElements) {
        if (!keyboardElements || !(keyboardElements instanceof HTMLElement))
            throw new Error('Constructor argument should be DOM element.');
        this.domElement = keyboardElements;
        this.initKeyboard();
        this.clear();
    }

    setTo(value) {
        document.getElementsByClassName('display')[0].textContent = value;
    }

    clear() {
        this.setTo('0');
    }

    replace(value) {
        if (value.toString().length > this.MAX_LENGTH)
            value = value.toString().slice(0, 16);
        this.setTo(value);
    }

    replaceLast(value) {
        this.setTo(this.valueOnDisplay().slice(0, this.valueOnDisplay().length - 1) + value.toString());
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
            return '-' + value.toString();
        return value;
    }

    makePositive(value) {
        return value.toString().slice(1);
    }

    valueOnDisplay() {
        return document.getElementsByClassName('display')[0].textContent;
    }

    initKeyboard() {
        for (let i = 0; i < this.domElement.children.length; i++) {
            const button = this.domElement.children[i];
            this.keyboardButtons[button.textContent] = button;
        }
        for (const key in this.keyboardButtons) {
            this.keyboardButtons[key].addEventListener('click', () => {
                const displayVal = this.valueOnDisplay();
                if (displayVal === '0') {
                    if (key.match(/(=|C|Del|√x|%|\+\/\-){1}/))
                        return;
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
                        if (displayVal.length === 1)
                            this.replace('0');
                        else
                            this.pop();
                        return;
                    }
                    if (key.match(/\%{1}/)) {
                        const valOperator = displayVal.replace(/^-?\d\B|\B\-{1}\d+\b|\d/g, '');
                        if (valOperator.length === 0) {
                            this.replace('0');
                            return;
                        } else {
                            let values = null;
                            if (valOperator.match(/\-/) && displayVal[0] === '-') {
                                values = displayVal.slice(1).split(valOperator);
                                values[0] = makeNegative(values[0]);
                            } else {
                                values = displayVal.split(valOperator);
                            }
                            let result = '';
                            if (values.length === 2 && values[1].match(/^(100|\d{1,2})$/)) {
                                switch (valOperator) {
                                    case '*':
                                        result = values[0] * (values[1] / 100);
                                        break;
                                    case '/':
                                        result = values[0] / (values[1] / 100);
                                        break;
                                    case '+':
                                        result = parseInt(values[0]) + (values[0] * values[1] / 100);
                                        break;
                                    case '-':
                                        result = parseInt(values[0]) - (values[0] * values[1] / 100);
                                        break;
                                }
                                this.replace(result !== '' ? Math.fround(result) : '0')
                            }
                        }
                    } else if (!key.match(/\d{1}/)) {
                        const valOperator = displayVal.replace(/^-?\d\B|\B\-{1}\d+\b|\d/g, '');
                        if (valOperator.length !== 0) {
                            let values = null;
                            if (valOperator.match(/\-/) && displayVal[0] === '-') {
                                values = displayVal.slice(1).split(valOperator);
                                values[0] = this.makeNegative(values[0]);
                            } else {
                                values = displayVal.split(valOperator);
                            }

                            let result = null;
                            if (values.length === 2 && values[0].length && values[1].length) {
                                if (valOperator.match(/\/{1}/) && parseInt(values[1]) === 0) {
                                    this.replace('Error/Klaida');
                                    setTimeout(() => this.clear(), 2000);
                                    return;
                                } else if (key.match(/(√x){1}/)) {
                                    values[1] = Math.fround(Math.sqrt(parseInt(values[1])));
                                } else if (key.match(/(\+\/-){1}/)) {
                                    values[1] = this.makeNegative(values[1]);
                                }

                                switch (valOperator) {
                                    case '*':
                                        result = values[0] * values[1];
                                        break;
                                    case '/':
                                        result = values[0] / values[1];
                                        break;
                                    case '+':
                                        result = parseInt(values[0]) + parseInt(values[1]);
                                        break;
                                    case '-':
                                        result = parseInt(values[0]) - parseInt(values[1]);
                                        break;
                                }
                                this.replace(result !== null ? Math.fround(result) : '0')
                            }
                        } else if (key.match(/(√x){1}/)) {
                            if (!displayVal.match(/^-\w+$/)) {
                                this.replace(Math.fround(Math.sqrt(displayVal)));
                            } else {
                                this.replace('Error/Klaida');
                                setTimeout(() => this.clear(), 2000);
                            }
                            return;
                        } else if (key.match(/(\+\/-){1}/)) {
                            if (!displayVal.match(/^-\w+$/))
                                this.replace(this.makeNegative(displayVal));
                            else
                                this.replace(this.makePositive(displayVal))
                            return;
                        }
                        if (key.match(/(=|√x|\+\/-){1}/))
                            return;

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
                        this.pop();
                    } else if (key.match(/\%{1}/)) {
                        this.replace('0');
                    } else if (key.match(/√x{1}/)) {
                        this.pop();
                        this.replace(Math.fround(Math.sqrt(this.valueOnDisplay())));
                    } else if (key.match(/(\+\/-){1}/)) {
                        return;
                    } else {
                        this.replaceLast(key);
                    }
                }
            });
        }
    }
}
window.addEventListener('load', () => {
    new Calculator(document.getElementsByClassName('keyboard-operations')[0])
    document.getElementsByTagName('main')[0].style.left = '0';
    document.getElementsByTagName('main')[0].style.backgroundColor = 'tomato';
});
module.exports = Calculator;
