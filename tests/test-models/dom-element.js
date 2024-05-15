function setDOM() {
    document.body.insertAdjacentHTML('afterbegin', `<main>
<div class="display"></div>
<div class="keyboard-operations">
            <button>%</button>
            <button>*</button>
            <button>7</button>
            <button>4</button>
            <button>1</button>
            <button>√x</button>
            <button>/</button>
            <button>8</button>
            <button>5</button>
            <button>2</button>
            <button>0</button>
            <button>C</button>
            <button>+</button>
            <button>9</button>
            <button>6</button>
            <button>3</button>
            <button>Del</button>
            <button>-</button>
            <button>+/-</button>
            <button>=</button>
            <button>,</button>
        </div>
</main>`);
}

const buttonLabels = ['%',
    '*',
    '1',
    '4',
    '7',
    '√x',
    '/',
    '2',
    '5',
    '8',
    'C',
    '+',
    '3',
    '6',
    '9',
    'Del',
    '-',
    '+/-',
    '=',
    '0',
    ','];

module.exports = {
    buttonLabels,
    setDOM
}