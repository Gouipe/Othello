ui.init()
// State of the game
currentState = new State(null, 'human', ai);
ui.display(currentState);

//AI vs AI 
//n.b. : human vs ai case is taken care by callback : playSquare() (cf ui.js)
if(currentState.player1 != 'human'){

}

//TEST
// let state = new State('human', 'ai');
// newState = state.play(2,3)