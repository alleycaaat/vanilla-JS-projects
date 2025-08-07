const keyboard = document.querySelector(".keyboard");
const gameboard = document.querySelector(".gameboard");
const message = document.querySelector(".message");
let display = document.createElement("p"); //create p element to display message
let wordle;

const keys = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "",
    "ENTER",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "<<"
];

const getWordle = () => {
    fetch("https://random-word-api.herokuapp.com/word?length=5")
        .then((response) => response.json())
        .then((json) => {
            let word = json.toString();
            wordle = word.toUpperCase();
            return;
        })
        .catch((e) => {
            console.log("fetch error:", e);
            return wordleless();
        });
};

getWordle();

const guessRows = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""]
];

let currentRow = 0,
    currentTile = 0,
    gameOver = false;

//build the rows of tiles
guessRows.forEach((guessRow, rowIndex) => {
    const row = document.createElement("div");
    row.setAttribute("id", `row-${ rowIndex }`);
    //build the tiles
    guessRow.forEach((guess, guessIndex) => {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.setAttribute("id", `row-${ rowIndex }-tile-${ guessIndex }`);
        row.appendChild(tile);
    });
    gameboard.appendChild(row);
});

//build the keyboard on screen
keys.forEach((key) => {
    const keyButton = document.createElement("button");
    keyButton.textContent = key; //adds the letter into each button/key on keyboard
    keyButton.setAttribute("id", key);
    keyButton.addEventListener("click", () => handleClick(key));
    keyboard.append(keyButton);
});

//handles mouse clicks
const handleClick = (key) => {
    if (gameOver) {
        return;
    }
    if (key === "<<") {
        backspace();
        return;
    }
    if (key === "ENTER") {
        enter();
        return;
    }
    addKey(key);
};

//allow for keyboard use
window.addEventListener("keydown", (e) => {
    //remove keyboard functionality after game is done
    if (gameOver) {
        return;
    }
    let key = e.key.toUpperCase(),
        pressed = e.key,
        ascii = pressed.charCodeAt(0);

    if (ascii > 90 && ascii < 123) {
        if (currentTile < 5 && currentRow < 6) {
            const clicked = document.getElementById(
                `row-${ currentRow }-tile-${ currentTile }`
            );
            clicked.textContent = key;
            guessRows[currentRow][currentTile] = key; //set guess to key pressed
            clicked.setAttribute("data", key);
            currentTile++; //advance tile count
        }
    }
    if (key === "ENTER") {
        enter();
        return;
    }
    if (key === "BACKSPACE") {
        backspace();
        return;
    }
});

//add letter to gameboard tile
const addKey = (key) => {
    if (currentTile < 5 && currentRow < 6) {
        const clicked = document.getElementById(
            `row-${ currentRow }-tile-${ currentTile }`
        );
        clicked.textContent = key;
        guessRows[currentRow][currentTile] = key; //set guess to key pressed
        clicked.setAttribute("data", key);
        currentTile++; //advance tile count
    }
};

//handle the backspace key, but only if the currentTile is greater than zero
const backspace = () => {
    if (currentTile > 0) {
        currentTile--; //go to previous tile
        const tile = document.getElementById(
            `row-${ currentRow }-tile-${ currentTile }`
        );
        tile.textContent = ""; //set it to an empty string
        guessRows[currentRow][currentTile] = ""; //update guess
        tile.setAttribute("data", "");
    }
};

//handles the enter button to check the answer
const enter = () => {
    if (currentTile > 4) {
        color();
        //if entire row is filled with letters
        const guess = guessRows[currentRow].join("");
        if (wordle == guess) {
            messageDisplay("Winner!");
            gameOver = true;
            return;
        } else {
            //if guess is not correct but all the guesses have been used up
            if (currentRow >= 5) {
                gameOver = true;
                messageDisplay("Out of guesses :(");
                return;
            }
            //if guess is not correct but more guesses are available
            if (currentRow < 5) {
                currentRow++;
                currentTile = 0;
            }
        }
    }
};

//updates the message to inform user of game status
const messageDisplay = (msg) => {
    display.textContent = msg;
    message.append(display); //add display to parent div
    setTimeout(() => message.removeChild(display), 5000); //remove the message after five seconds
};

//if no wordle is returned
const wordleless = () => {
    if (wordle === undefined) {
        display.textContent =
            "API call quota exceeded, no Wordle can be retrieved :(";
        message.append(display);
    }
};

//changes the color of keyboard keys after guess is submitted
const colorKey = (letter, color) => {
    const key = document.getElementById(letter);
    key.classList.add(color);
};

//changes the color of tiles after guess is submitted
const color = () => {
    const tiles = document.querySelector(`#row-${ currentRow }`).childNodes;
    let checkGuess = wordle.toUpperCase(),
        guess = [];

    tiles.forEach((tile) => {
        guess.push({ letter: tile.getAttribute("data"), color: "incorrect" });
    });

    guess.forEach((guess, idx) => {
        if (guess.letter == wordle[idx]) {
            guess.color = "correct";
            //if letter has been checked, remove it so it doesn't get re-checked
            checkGuess = checkGuess.replace(guess.letter, "");
        }
    });

    guess.forEach((guess) => {
        if (checkGuess.includes(guess.letter) && guess.color != "correct") {
            guess.color = "semi";
            checkGuess = checkGuess.replace(guess.letter, "");
        }
    });

    tiles.forEach((tile, idx) => {
        tile.classList.add(guess[idx].color);
        colorKey(guess[idx].letter, guess[idx].color);
    });
};
