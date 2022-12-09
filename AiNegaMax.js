class AiNegaMax {
    constructor(level){
        this.level = level; // can be EASY or MEDIUM 
    }

    /* 
    ** Play a move depending on the state of the game modeled by the object currentGame which is in main.js and initialised in game.run()  
    ** Returns new state corresponding to the new state after playing
    */
    play(){
        // get all possible moves
        let options = game.currentState.getLegalMoves();
        let currentValue;
        let bestValue = -999999;
        let currState;
        let bestState; //result to return

        // look for the option with most value according to negamax()
        for (let option of options){
            currState = game.currentState.placeToken(option.row, option.col);
            currentValue = this.negaMax(currState, DEPTH, -999999, -999999);
            if (currentValue > bestValue){
                bestValue = currentValue;
                bestState = currState;
            } // If multiple options are of equal value, we choose one randomly to not always have the same 
            // result everytime two ai face each other 
            else if (currentValue == bestValue){
                if (Math.random() > 0.5){
                    bestValue = currentValue;
                    bestState = currState;
                }
            }
        }
        //returns the best state according to negamax
        return bestState;
    }

    // Returns a heuristic value for a state
    negaMax(state, depth, alpha, beta){
        //Terminal node
        if (depth == 0 || state.isGameOver()){
            return state.heuristicValue(this.level);
        }
        //get all children of node = get all possible next states 
        let stateChildren = [];
        let options = state.getLegalMoves();
        for (let option of options){
            stateChildren.push(state.placeToken(option.row, option.col))
        }
        // maximiser and minimiser cases are simplified as one
        let value = -99999
        for(let child of stateChildren){
            value = Math.max(value, -this.negaMax(child, depth-1, -beta, -alpha))
            alpha = Math.max(alpha, value)
            if (alpha >= beta){
                break
            }
        }
        return value;
    }
}