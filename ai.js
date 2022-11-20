ai ={
    // Play a move depending of the state of the game which is modeled by the object : currentGame 
    // which is in main.js and initialised in game.run()  
    // Returns new state corresponding to the new state after playing
    play(){
        options = game.currentState.getLegalMoves();
        //Choose the first legal move
        return game.currentState.placeToken(options[0].row,options[0].col);
    }
}