ai ={
    // Play a move depending of the state of the game which is modeled by the object : currentGame 
    // which is in main.js and initialised in game.run()  
    // Returns new state corresponding to the new state after playing
    play(){
        options = game.currentState.getLegalMoves();
        //Choose the first legal move
        return game.currentState.placeToken(options[0].row,options[0].col);
    }

    ,minmax(State, player){

        copyState = new State(old);

        maxi = -10000;
        mini = 10000;
        player = copyState.currentPlayer;
        if (player == p1){
            jmax = true;
        }
        else{
            jmax = false;
        }
        let tab = game.copyState.getLegalMoves();
        let c = game.copyState.board;
        let b = game.copyState.board;
        if(jmax){
             for (i=0; i<tab.length();i++){
                b.placeToken(tab[i])
                maxi = max(maxi, minmax(copyState, player))
            }
            return maxi;
        }
        else{
            for (i=0; i<tab.length();i++){
                b.placeToken(tab[i])
                mini = min(mini, minmax(copyState, player))
            }
            return mini;

        }
    

        
    }
}