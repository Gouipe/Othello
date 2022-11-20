game = {
    currentPlayer: null,
    p1 : null,
    p2 : ai,
    run() {
        currentState = new State(null, this.p1, this.p2);
        ui.display(currentState);
        this.currentPlayer = currentState.player1;

        //AI vs AI 
        //n.b. : human vs ai case is taken care by callback : playSquare() (cf ui.js)
        if (currentState.player1 != 'human') {
            while (!currentState.isGameOver()) {
                currentState = this.currentPlayer.play();
                ui.display(currentState)
                // switch turn
                this.currentPlayer = this.currentPlayer == currentState.player1 ? currentState.player2 : currentState.player1;
            }
        }
    }
}