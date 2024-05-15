const Calculator = require('../main');
const { buttonLabels, setDOM } = require('./test-models/dom-element');

setDOM();
const calculator = new Calculator(document.getElementsByClassName('keyboard-operations')[0]);

describe('Initial tests', () => {
    test('Contructor arg should be HTML element', () => {
        expect(function() { new Calculator([]) }).toThrow();
    });
    test('keyboard buttons should be parsed to Object', () => {
        expect(Object.keys(calculator.keyboardButtons)).toHaveLength(21);
    });
    test('value on display should be "0"', () => {
        expect(calculator.valueOnDisplay()).toBe('0');
    });
    test('value on display should always be less than 17 characters', () => {
        calculator.replace('12345678901234567');
        expect(calculator.valueOnDisplay()).toBe('1234567890123456');
    });
    test('labels for buttons should be correct', () => {
            expect(Object.keys(calculator.keyboardButtons).sort()).toEqual(buttonLabels.sort());
    });
});

describe('Buttons and result screen tests', () => {
    test('screen value changes when button is pressed', () => {
        calculator.clear();
        calculator.keyboardButtons['4'].click();
        expect(calculator.valueOnDisplay()).toBe('4');
        calculator.clear();
        expect(calculator.valueOnDisplay()).toBe('0');
    });
    test('+- button should change value to negative or positive', () => {
        calculator.setTo('21');
        calculator.keyboardButtons['+/-'].click();
        expect(calculator.valueOnDisplay()).toContain('-21');
        calculator.keyboardButtons['+/-'].click();
        expect(calculator.valueOnDisplay()).toBe('21');
    });
    test('pressing Del removes last character', () => {
        calculator.setTo('120*5');
        calculator.keyboardButtons['Del'].click();
        expect(calculator.valueOnDisplay()).toBe('120*');
    });
    test('square root button works correctly', () => {
        calculator.setTo('9');
        calculator.keyboardButtons['√x'].click();
        expect(calculator.valueOnDisplay()).toBe('3');
    });
    test('C button sets value to 0', () => {
        calculator.setTo('20*50');
        calculator.keyboardButtons['C'].click();
        expect(calculator.valueOnDisplay()).toBe('0');
    });
    test('can\'t have two commas in a number', () => {
        calculator.setTo('0.218');
        calculator.keyboardButtons[','].click();
        expect(calculator.valueOnDisplay()).toBe('0.218');
    });
    test('comma button works correctly', () => {
        calculator.setTo('2-1');
        calculator.keyboardButtons[','].click();
        expect(calculator.valueOnDisplay()).toBe('2-1.');
    });
});

describe('Calculation tests', () => {
    test('percent button works correctly', () => {
        calculator.setTo('20*50');
        calculator.keyboardButtons['%'].click();
        expect(calculator.valueOnDisplay()).toBe('10');
        calculator.setTo('120-10');
        calculator.keyboardButtons['%'].click();
        expect(calculator.valueOnDisplay()).toBe('108');
    });
    test('calculations/1 /', () => {
        calculator.setTo('150/20');
        calculator.keyboardButtons['='].click();
        expect(calculator.valueOnDisplay()).toBe('7.5');
        calculator.setTo('150/0');
        calculator.keyboardButtons['='].click();
        expect(calculator.valueOnDisplay()).toBe('Error/Klaida');
    });
    test('calculations/2 *', () => {
        calculator.setTo('-21.5*10');
        calculator.keyboardButtons['='].click();
        expect(calculator.valueOnDisplay()).toBe('-215');
    });
    test('calculations/3 +', () => {
        calculator.setTo('-1+100');
        calculator.keyboardButtons['='].click();
        expect(calculator.valueOnDisplay()).toBe('99');
    });
    test('calculations/4 -', () => {
        calculator.setTo('1299.9-1299.9');
        calculator.keyboardButtons['='].click();
        expect(calculator.valueOnDisplay()).toBe('0');
    });
    test('calculations/5 root', () => {
        calculator.setTo('50-9');
        calculator.keyboardButtons['√x'].click();
        expect(calculator.valueOnDisplay()).toBe('47');
        calculator.setTo('-7');
        calculator.keyboardButtons['√x'].click();
        expect(calculator.valueOnDisplay()).toBe('Error/Klaida');
    });
    test('calculations/6 +-', () => {
        calculator.setTo('-23-23');
        calculator.keyboardButtons['+/-'].click();
        expect(calculator.valueOnDisplay()).toBe('0');
    });
});
