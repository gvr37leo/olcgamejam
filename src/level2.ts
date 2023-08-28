

var normalgun = new Gun({
    bulletspeed:0b0001,
    damage:0b0001,
    firerate:0b0001,
})

var bitgun = new Gun({
    bulletspeed:0b0001,
    damage:0b0001,
    firerate:0b0001,
})


//make 2 guns 1 for overworld, 1 for bitworld

//lets do enemys first
//only show 1 variable with 4 bits, speed
//makes it more obvious what is what
//in a second level also add health

function loadLevel2(){
    movePlayerToSpawn()
    loadTeleports()
    // initBits(findObjectWithName('gunbits').pos,normalgun.data)
    var dummy = new Enemy({})
    loadWallsIntoBits(findObjectWithName('mark1').pos,findObjectWithName('mark2').pos,findObjectWithName('ref1').pos,92,1)
    var enemys = loadEnemys()
    initBits(findObjectWithName('enemybits').pos,enemys[0].data.data,false,8,14)
    loadFlag()
}



function loadEnemys(){
    var res:Entity<Enemy>[] = []
    var enemys = findObjectsOfType('enemy')
    for(let object of enemys){
        entitys.push(new Entity<Enemy>({
            type:'enemy',
            pos:object.pos.c(),
            rect:Rect.fromCenter(object.pos.c(),new Vector(32,64)),
            updatecb(self) {
                self.data.attackcd.update(globaldt)

                if(player.data.inBitWorld == false){
                    moveEntity(self,self.pos.to(player.pos).normalize().scale(self.data.getProp('speed') * 50 * globaldt))
                }
                if(self.data.attackcd.tryfire() && player.rect.collideBox(self.rect)){
                    player.data.health -= self.data.getProp('damage')
                    if(player.data.health <= 0){
                        switchLevel(3)
                    }
                }
            },
            drawcb(self) {
                ctxt.fillStyle = 'blue'
                fillRect(self.pos,self.rect.size(),true)
            },
            data:new Enemy({
                damage:0b0100,
                speed:0b0110,
                health:0b111111
            })
        }))
        res.push(last(entitys))
    }
    return res
}