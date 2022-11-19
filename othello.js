grid = createGrid();
document.getElementById('grid-container').appendChild(grid);

function createGrid(){
    let i = 0;
    let htmlTableGrid = document.createElement('table');
    htmlTableGrid.className = 'grid';
    htmlTableGrid.id = 'gridId';
    

    for(let r = 0; r<8 ; r++){
        let tr = htmlTableGrid.appendChild(document.createElement('tr'));
        for(let c=0 ; c<8 ; c++){
            let node = tr.appendChild(document.createElement('td'));
            node.id = 'grid' + '_' + r + c;
            node.setAttribute('row', r); //we set a row attribute with the row value
            node.setAttribute('col', c); //we set a col attribute with the col value
            if((r==3 && c==4) || (r==4 && c==3)){
                node.setAttribute('state', 'black'); //default black pieces on board at start
            }else if((r==3 & c==3 || (r==4 && c==4))){
                node.setAttribute('state', 'white');//default white pieces on board at start
            }
            else{
                node.setAttribute('state', 'free'); //free cases at start
            }
            node.addEventListener('click', function(){
                return playSquare(r, c);
            });
        }
    }
    return htmlTableGrid;
}
