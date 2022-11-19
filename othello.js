/* -------------- GAME -----------------*/
turn = 'black';
player1 = 'human';
player2 = AI;
currentPlayer = player1; //joueur dont c'est le tour

// async function runGame(){
//     while (!gameOver()){
//         if (currentPlayer != 'human'){
//             currentPlayer.chooseSquare();
//             toggleTurn();
//         }
//     }
// }

function gameOver() {
    return false;
}

/*
* Callback to every square.
* Plays a token on the square whose coordinates are (@r,@c)
*/
function playSquare(r, c) {
    modified = modifiedSquares(r, c); // gets all the squares modifies by the play
    // modifies every square if move  is legal
    if (modified.length != 0) {
        let currentNode = null;
        for (coord of modified) {
            currentNode = document.getElementById('grid_' + coord[0] + coord[1])
            currentNode.setAttribute('state', turn);
        }
        //switch turn
        toggleTurn();
        //checks if game is over
        let score = null;
        if (isGameOver()) {
            score = getScore();
            document.getElementById('blackScore').innerHTML = score.black;
            document.getElementById('whiteScore').innerHTML = score.white;
            document.getElementById('score').innerHTML += 'GAME OVER';
        }
        // Notifies the other player to play if the other player is an ai.
        // If other player is human, human has to click a square.
        else if (currentPlayer != 'human')
            currentPlayer.play();
    }
}

function isGameOver() {
    return legalSquares().length == 0;
}

function getScore() {
    var res = { 'white': 0, 'black': 0 };
    let color = null;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            color = document.getElementById('grid_' + r + c).getAttribute('state');
            if (color == 'white') {
                res.white++;
            } else if (color == 'black') {
                res.black++;
            }
        }
    }
    return res;
}
/*
* Returns an array of {row, col} corresponding to all squares that can be played by currentPlayer
*/
function legalSquares() {
    res = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (modifiedSquares(r, c).length != 0) {
                res.push({ row: r, col: c });
            }
        }
    }
    return res;
}

function toggleTurn() {
    turn = turn == 'black' ? 'white' : 'black'; //switch color
    currentPlayer = currentPlayer === player1 ? player2 : player1; //switch player
}

/*
* Checks if node is not null and opposite color than @color2
*/
function oppositeColor(node, color2) {
    if (node == null)
        return false;
    color1 = node.getAttribute('state');
    if (color1 == 'black' && color2 == 'white')
        return true;
    if (color1 == 'white' && color2 == 'black')
        return true;
    return false;
}

/*
 Checks if node is not null and same color than @color2
*/
function sameColor(node, color2) {
    if (node == null)
        return false;
    let color1 = node.getAttribute('state');
    if (color1 == color2)
        return true;
    return false;
}
/*
* Returns a list of all the modified squares if the @node whose coordinates are (@row,@col)
* is clicked
*/
function modifiedSquares(row, col) {
    node = document.getElementById('grid_' + row + col);
    //If square chosen is already occupied
    if (node.getAttribute('state') != 'free') {
        return [];
    }

    let res = [];//what will be returned

    /*----------CHECKS 8 DIRECTIONS----------------------*/
    //BELOW
    let r = row + 1; //current checked row
    let c = col;//current checked column
    let currentNode = document.getElementById('grid_' + r + c);//get square below chosen square  
    if (oppositeColor(currentNode, turn)) {//square below is opposite color
        do {
            r++;
            currentNode = document.getElementById('grid_' + r + c);
        } while (oppositeColor(currentNode, turn));//series of square below are still opposite color
        if (sameColor(currentNode, turn)) {//final square is same color
            do {
                r--;
                res.push([r, c]);
            } while (r != row);
        }
    }
    //LEFT
    r = row; //current checked row
    c = col - 1;//current checked column
    currentNode = document.getElementById('grid_' + r + c);
    if (oppositeColor(currentNode, turn)) {
        do {
            c--;
            currentNode = document.getElementById('grid_' + r + c);
        } while (oppositeColor(currentNode, turn));
        if (sameColor(currentNode, turn)) {//final square is same color
            do {
                c++;
                res.push([r, c]);
            } while (c != col);
        }
    }
    //RIGHT
    r = row; //current checked row
    c = col + 1;//current checked column
    currentNode = document.getElementById('grid_' + r + c);
    if (oppositeColor(currentNode, turn)) {
        do {
            c++;
            currentNode = document.getElementById('grid_' + r + c);
        } while (oppositeColor(currentNode, turn));
        if (sameColor(currentNode, turn)) {//final square is same color
            do {
                c--;
                res.push([r, c]);
            } while (c != col);
        }
    }
    //TOP
    r = row - 1; //current checked row
    c = col;//current checked column
    currentNode = document.getElementById('grid_' + r + c);//get square on top of chosen square  
    if (oppositeColor(currentNode, turn)) {//square on top is opposite color
        do {
            r--;
            currentNode = document.getElementById('grid_' + r + c);
        } while (oppositeColor(currentNode, turn));//series of square on top are different color
        if (sameColor(currentNode, turn)) {//final square is same color
            do {
                r++;
                res.push([r, c])
            } while (r != row);
        }
    }
    //Bottom RIGHT
    r = row + 1; //current checked row
    c = col + 1;//current checked column
    currentNode = document.getElementById('grid_' + r + c);
    if (oppositeColor(currentNode, turn)) {
        do {
            c++;
            r++;
            currentNode = document.getElementById('grid_' + r + c);
        } while (oppositeColor(currentNode, turn));
        if (sameColor(currentNode, turn)) {//final square is same color
            do {
                r--;
                c--;
                res.push([r, c]);
            } while (r != row);
        }
    }
    //TOP LEFT
    r = row - 1; //current checked row
    c = col - 1;//current checked column
    currentNode = document.getElementById('grid_' + r + c);
    if (oppositeColor(currentNode, turn)) {
        do {
            c--;
            r--;
            currentNode = document.getElementById('grid_' + r + c);
        } while (oppositeColor(currentNode, turn));
        if (sameColor(currentNode, turn)) {//final square is same color
            do {
                r++;
                c++;
                res.push([r, c]);
            } while (r != row);
        }
    }
    //TOP RIGHT
    r = row - 1; //current checked row
    c = col + 1;//current checked column
    currentNode = document.getElementById('grid_' + r + c);
    if (oppositeColor(currentNode, turn)) {
        do {
            c++;
            r--;
            currentNode = document.getElementById('grid_' + r + c);
        } while (oppositeColor(currentNode, turn));
        if (sameColor(currentNode, turn)) {//final square is same color
            do {
                r++;
                c--;
                res.push([r, c]);
            } while (r != row);
        }
    }
    //BELOW LEFT
    r = row + 1; //current checked row
    c = col - 1;//current checked column
    currentNode = document.getElementById('grid_' + r + c);
    if (oppositeColor(currentNode, turn)) {
        do {
            c--;
            r++;
            currentNode = document.getElementById('grid_' + r + c);
        } while (oppositeColor(currentNode, turn));
        if (sameColor(currentNode, turn)) {//final square is same color
            do {
                r--;
                c++;
                res.push([r, c]);
            } while (r != row);
        }
    }
    /*----------------------8 DIRECTION CHECKED-----------------------*/

    return res;
}

// runGame();
if (currentPlayer != 'human') {
    playSquare(2, 3)
}