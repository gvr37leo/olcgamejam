




//make 2 guns 1 for overworld, 1 for bitworld

//lets do enemys first
//only show 1 variable with 4 bits, speed
//makes it more obvious what is what
//in a second level also add health

function loadLevel2(){
    var player = spawnPlayer()
    loadTeleports()
    // initBits(findObjectWithName('gunbits').pos,normalgun.data)
    var dummy = new Enemy({})
    // loadWallsIntoBits(findObjectWithName('mark1').pos,findObjectWithName('mark2').pos,findObjectWithName('ref1').pos,92,1)
    var enemys = loadEnemys()
    initBits(findObjectWithName('enemybits').pos,enemys[0].data.data,false,8,14)
    loadFlags()
    player.data.gun.setProp('ammo',0b11111111)
}



function loadEnemys(){
    var res:Entity<Enemy>[] = []
    var enemys = findObjectsOfType('enemy')
    for(let object of enemys){
        entitys.push(new Entity<Enemy>({
            type:'enemy',
            pos:object.pos.c(),
            rect:Rect.fromCenter(object.pos.c(),new Vector(26,50)),
            updatecb(self) {
                if(self.data.isDead){
                    return
                }
                var playerdir = self.pos.to(globalplayer.pos)
                self.data.flipx = playerdir.x < 0 ? true : false

                self.data.attackcd.update(globaldt)
                
                if(globalplayer.data.inBitWorld == false){
                    var oldpos = self.pos.c()
                    moveEntity(self,self.pos.to(globalplayer.pos).normalize().scale(150 * globaldt))
                    self.data.changepos = oldpos.to(self.pos)
                }
                if(globalplayer.rect.collideBox(self.rect) && self.data.attackcd.tryfire()){
                    globalplayer.data.health -= self.data.getProp('damage')
                    if(globalplayer.data.health <= 0){
                        switchLevel(3)
                    }
                }
            },
            drawcb(self) {
                

                if(self.data.isDead){
                    drawAnimation(self.pos,skeletonDieAnimation,to(self.data.deadTimeStamp,time),self.data.flipx,true,false)
                }else{
                    if(self.data.changepos.length() > 0.05){
                        drawAnimation(self.pos,skeletonWalkAnimation,time,self.data.flipx,true)
                    }else{
                        drawAnimation(self.pos,skeletonIdleAnimation,time,self.data.flipx,true)
                    }
                }
            },
            data:new Enemy({
                damage:0b0100,
                speed:0b0110,
                health:0b111111,
                changepos:new Vector(0,0),
            })
        }))
        res.push(last(entitys))
    }
    return res
}