game = {
    //Attributes will be initialised in run()
    currentPlayer: null,
    currentState : null,
    p1: null, //player1
    p2: null, //player2


    run() {
        ui.init();
        this.currentState = new State(null, this.p1, this.p2);
        ui.display(this.currentState);
        this.currentPlayer = this.currentState.player1;

        //AI vs AI 
        //n.b. : human vs ai case is taken care by callback : playSquare() (cf ui.js)
        if (this.currentState.player1 != 'human') {
            while (!this.currentState.isGameOver()) {
                this.currentState = this.currentPlayer.play();
                ui.display(this.currentState)
                // switch turn
                this.currentPlayer = this.currentPlayer == this.currentState.player1 ? this.currentState.player2 : this.currentState.player1;
            }
        }
    }
}

