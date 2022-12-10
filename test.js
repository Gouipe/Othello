test = function(){
    game.p1 = new AiNegaMax(EASY)
    game.p2 = new AiNegaMax(MEDIUM)

    let nbWinsp1 = 0;
    let nbWinsp2 = 0;
    let start = performance.now();

    // On fait x oppositions entre p1 et p2 et on enregistre les résultats
    for(let i=0 ; i<50 ; i++){
        game.run()
        if (game.currentState.isGameOver()){
            if (game.currentState.winner() == game.p1){
                nbWinsp1++;
            }else if (game.currentState.winner() == game.p2){
                nbWinsp2++;
            }
        }
    }
    //durée d'execution du match complet en secondes
    let time = parseInt((performance.now() - start) / 1000);

    //Affichage du nombre de victoires de chaque joueur et la durée d'éxécution
    console.log("Player 1 : " + nbWinsp1);
    console.log("Player 2 : " + nbWinsp2);
    console.log("Durée d'éxécution : " + time + " sec");
}