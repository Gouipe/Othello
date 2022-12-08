aiMiniMax ={
    level:EASY,

    // Play a move depending of the state of the game which is modeled by the object : currentGame 
    // which is in main.js and initialised in game.run()  
    // Returns new state corresponding to the new state after playing
    play(){
        // get all possible moves
        let options = game.currentState.getLegalMoves();

        let currentValue;
        let bestValue = -999999;
        let currState;
        let bestState; //result to return

        // look for the option with most value according to minimax()
        for (let option of options){
            currState = game.currentState.placeToken(option.row, option.col);
            currentValue = this.miniMax(currState, 2);
            if (currentValue > bestValue){
                bestValue = currentValue;
                bestState = currState;
            }
        }
        return bestState;
    },

    // Returns a heuristic value 
    miniMax(state, depth){
        //Terminal node
        if (depth == 0 || state.isGameOver()){
            return state.heuristicValue(this.level);
        }
        //get all children of node = get all possible next states 
        stateChildren = [];
        let options = state.getLegalMoves();
        for (let option of options){
            stateChildren.push(state.placeToken(option.row, option.col))
        }
        let value = -99999
        for(child of stateChildren){
            value = Math.max(value, -this.miniMax(child, depth-1))
        }
        return value;
    },

    // function negamax(node, depth, color) is
    // if depth = 0 or node is a terminal node then
    //     return color × the heuristic value of node
    // value := −∞
    // for each child of node do
    //     value := max(value, −negamax(child, depth − 1, −color))
    // return value

    miniMax1(state, depth, maximizingPlayer){
        //Terminal node
        if (depth == 0 || state.isGameOver()){
            return state.heuristicValue(this.level);
        }
        //get all children of node = get all possible next states 
        stateChildren = [];
        let options = state.getLegalMoves();
        for (let option of options){
            stateChildren.push(state.placeToken(option.row, option.col))
        }

        //Maximising player
        if (maximizingPlayer){
            let value = -999999;
            // Return the max value of all children
            for(child of stateChildren){
                value = Math.max(value, this.miniMax(child, depth-1, false))
            }
            return value;
        }

        //Minimising player
        else{
            let value = 999999;
            // Return the min value of all children
            for(child of stateChildren){
                value = Math.min(value, this.miniMax(child, depth-1, true))
            }
            return value;
        }
    }
}