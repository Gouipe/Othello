aiRandom ={
    // Play a move depending of the state of the game which is modeled by the object : game.currentState
    // Returns new state corresponding to the new state after playing
    play(){
        let options = game.currentState.getLegalMoves();
        //Choose randomly among legals moves
        let randomIndex = Math.floor(Math.random() * options.length)
        return game.currentState.placeToken(options[randomIndex].row, options[randomIndex].col);
    }
}