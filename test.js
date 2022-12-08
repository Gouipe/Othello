test = function(){
    game.p1 = aiRandom
    game.p2 = aiMiniMax
    aiMiniMax.level = MEDIUM
    let nbWinsRandom = 0;
    let nbWinsMiniMax = 0;
    let start = performance.now();

    // On fait 20 oppositions entre aiRandom et aiMiniMax et on enregistre les résultats
    for(let i=0 ; i<10 ; i++){
        game.run()
        if (game.currentState.isGameOver()){
            if (game.currentState.winner() == game.p1){
                nbWinsRandom++;
            }else if (game.currentState.winner() == game.p2){
                nbWinsMiniMax++;
            }
        }
    }
    //durée d'execution du match complet en secondes
    let time = parseInt((performance.now() - start) / 1000);

    //Affichage du nombre de victoires de chaque joueur et la durée d'éxécution
    console.log("Random : " + nbWinsRandom);
    console.log("MniMax : " + nbWinsMiniMax);
    console.log("Durée d'éxécution : " + time + " sec");
}