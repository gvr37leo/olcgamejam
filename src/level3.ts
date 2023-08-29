


//change ammo and firerate

function loadLevel3(){
    player.data.gun = new Gun({
        ammo:0b00000100,
        firerate:0b0001,
    })
    movePlayerToSpawn()
    loadTeleports()
    var enemys = loadEnemys()
    for(var enemy of enemys){
        enemy.data.setProp('health',5)
    }
    initBits(findObjectWithName('gunbits').pos,player.data.gun.data,false,0,8)
    loadWallsIntoBits(findObjectWithName('mark1').pos,findObjectWithName('mark2').pos,findObjectWithName('ref1').pos,92,1)
    loadFlags()
}
