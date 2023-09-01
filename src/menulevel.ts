function loadMenulevel(){


    
    spawnPlayer()
    loadTeleports()
    var enemys = loadEnemys()
    // initBits(findObjectWithName('gunbits').pos,normalgun.data)
    // initBits(findObjectWithName('enemybits').pos,enemys[0].data.data,false,8,12)
    // loadWallsIntoBits(findObjectWithName('mark1').pos,findObjectWithName('mark2').pos,findObjectWithName('ref1').pos,92,1)
    var flags = loadFlags()
    var i = 0
    for(var flag of flags){
        flag.data.enabled = levelunlocked[i]
        i++
    }
}

