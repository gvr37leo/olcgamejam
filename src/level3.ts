function loadLevel3(){
    movePlayerToSpawn()
    loadTeleports()
    var enemys = loadEnemys()
    // initBits(findObjectWithName('gunbits').pos,normalgun.data)
    // initBits(findObjectWithName('enemybits').pos,enemys[0].data.data,false,8,12)
    // loadWallsIntoBits(findObjectWithName('mark1').pos,findObjectWithName('mark2').pos,findObjectWithName('ref1').pos,92,1)
    loadFlag()
}

function unloadLevel3(){
    
}