const main = document.querySelector('main');
const forest = document.querySelector('.forest');
const earthDayMsg = document.querySelector('h2');
const howLong = document.querySelector('h1');

const year = new Date().getFullYear();
const earthDay = new Date(year + 1, 3, 22).getTime();

const days = document.querySelector('.days');
const hours = document.querySelector('.hours');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');

const colors = [
    '#2c8437',
    '#84c68c',
    '#52a55d',
    '#10631b',
    '#004208',
    '#2d8440',
    '#82c491',
    '#51a464',
    '#136726',
    '#014610',
    '#2a7d4e',
    '#7bb996',
    '#4d9b6f',
    '#126234',
    '#01421d'
];

const populate = (treeCount) => {
    forest.innerHTML = '';
    for (let i = 1; i <= treeCount; i++) {
        forest.appendChild(plantTree());
    }
};

const plantTree = () => {
    let row = treeRow(),
        color = colors[treeColor()],
        left = Math.floor(Math.random() * (100 - 1) + 1),
        tree = document.createElement('div'),
        treeHeight,
        top;

    if (row === 1) {
        treeHeight = frontRow();
        top = 10;
    }
    if (row === 2) {
        treeHeight = middleRow();
        top = 7;
    }
    if (row === 3) {
        treeHeight = backRow();
        top = 3;
    }
    console.log('color:', color);

    let treeDescription = `z-index: -${ row } !important; margin-bottom: ${ top }px !important;`;

    let template = `
    <div class='tree'
        style='border: ${ treeHeight / 2 }px solid transparent;
        border-bottom: ${ treeHeight }px solid ${ color };'>
    </div>
    <div class='trunk'
        style='height: ${ top }px; margin-bottom: -${ top }px'>
    </div>
    `;

    tree.setAttribute('class', 'tree-wrap');
    tree.setAttribute('style', `left: ${ left }%; ${ treeDescription }`);
    tree.innerHTML = template;
    return tree;
};
const getCountdown = () => {
    const now = new Date();
    let diff = earthDay - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
        diff,
        days,
        hours,
        minutes,
        seconds
    };
};
const initClock = () => {
    const updateClock = () => {
        const time = getCountdown();

        days.innerText = time.days;
        hours.innerText = time.hours;
        minutes.innerText = time.minutes;
        seconds.innerText = time.seconds;

        if (time.diff <= 0) {
            howLong.classList.add('hidden');
            earthDayMsg.classList.remove('hidden');
            earthDayMsg.classList.add('display');
            clearInterval(updateClock, 1000);
        }
    };

    updateClock();
    setInterval(updateClock, 1000);
};

// ** get what row the tree is in
const treeRow = () => {
    return Math.floor(Math.random() * (4 - 1) + 1);
};
// ** get height of tree in front row
const frontRow = () => {
    return Math.floor(Math.random() * (65 - 58) + 58);
};
// ** get height of tree in middle row
const middleRow = () => {
    return Math.floor(Math.random() * (57 - 49) + 49);
};
// ** get height of tree in back row
const backRow = () => {
    return Math.floor(Math.random() * (48 - 41) + 41);
};

const treeColor = () => {
    return Math.floor(Math.random() * (15 - 1) + 1);
};
const treeAmt = () => {
    return Math.floor(Math.random() * (21 - 9) + 9);
};

initClock();
let treeCount = treeAmt();
populate(treeCount);