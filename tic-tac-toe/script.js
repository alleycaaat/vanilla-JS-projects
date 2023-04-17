const gameOver = document.querySelector('.gameOver');
const board = document.querySelector('#board');
const newGameBtn = document.querySelector('button')
const winner = document.querySelector('h1');
const token = 'token';
const x = 'X';
const o = 'O';
let turns = 0;
let xTurn;

const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
        const box = document.createElement('div');
        box.setAttribute('id', `row: ${ i } -- col: ${ j }`);
        box.setAttribute('aria-label', `row: ${ i } -- col: ${ j }`);
        box.classList.add('box');
        board.appendChild(box);
    }
}
const boxes = document.querySelectorAll('.box');

const handleClick = (e) => {
    const currBox = e.target;
    const currPlayer = xTurn ? o : x;
    turns++;
    addToken(currBox, currPlayer);
    changeTurn();
    if (turns > 3) checkForWin(currPlayer)
        ? showWinner(currPlayer)
        : turns >= 9
            ? drawGame()
            : null;
};

//add mark, change cursor
const addToken = (box, player) => {
    box.classList.add(player, token);
};

const changeTurn = () => {
    board.classList.remove(x);
    board.classList.remove(o);
    //change turns
    xTurn = !xTurn;
    const boardClasses = xTurn ? x : o;
    board.classList.add(boardClasses);
};

const checkForWin = (currPlayer) => {
    let winStatus = winCombos.some(combo => {
        return combo.every(i => {
            return boxes[i].classList.contains(currPlayer);
        });
    });
    return winStatus;
};

const showWinner = (currPlayer) => {
    gameOver.classList.remove('hidden');

    winner.innerText = `${ currPlayer }'s win!`;
};

const drawGame = () => {
    winner.innerText = 'It`s a draw!';
};

const resetButton = () => {
    turns = 0;
    xTurn = '';
    board.classList.remove(x)
    board.classList.remove(o)
    board.classList.add(o)
    gameOver.classList.add('hidden')
    newGame()
};

const newGame = () => {
    boxes.forEach(box => {
        box.classList.remove(x, token);
        box.classList.remove(o);
        box.addEventListener('click', handleClick, { once: true });
    });
}
newGame()

newGameBtn.addEventListener('click', resetButton)
