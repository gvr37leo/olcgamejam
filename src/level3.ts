


//change ammo and firerate

function loadLevel3(){
    var player = spawnPlayer()
    player.data.gun.setProp('ammo',0b00000100)
    loadTeleports()
    var enemys = loadEnemys()
    for(var enemy of enemys){
        enemy.data.setProp('health',9)
    }
    initBits(findObjectWithName('gunbits').pos,globalplayer.data.gun.data,false,0,8)
    loadWallsIntoBits(findObjectWithName('mark1').pos,findObjectWithName('mark2').pos,findObjectWithName('ref1').pos,92,1)
    loadFlags()
}

function loadLevel4(){
    var player = spawnPlayer()
    player.data.gun.setProp('ammo',0b11111111)
    loadTeleports()
    
    loadWallsIntoBits(findObjectWithName('mark1').pos,findObjectWithName('mark2').pos,findObjectWithName('ref1').pos,92,1)
    loadFlags()
}
