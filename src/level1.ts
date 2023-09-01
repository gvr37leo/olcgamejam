
// var level1memory1 = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
// var level1memory2 = [1,1,1,1,1,1,1,1,1,1,1]
// var level1memory3 = [1,1,1,1,1,1,1,1,1,1,1]
// var level1memory4 = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
// var level1memory5 = [1,1,1,1,1,1,1,1,1,1,1]



function loadLevel1(){

    
    //have 5 arrays of memory
    //corresponding to the 5 walls in game

    loadWallsIntoBits(findObjectWithName('mark1').pos,findObjectWithName('mark2').pos,findObjectWithName('ref1').pos,348,1)
    var player = spawnPlayer()
    loadTeleports()
    loadFlags()
    player.data.gun.setProp('ammo',0b11111111)
}

function spawnPlayer(){
    var player = new Entity({
        type:'player',
        pos:findObjectsOfType('spawn')[0].pos.c(),
        rect:Rect.fromsize(new Vector(0,0), new Vector(20,20)),
        depth:1,
        updatecb(self) {
            self.data.updatecb(self)
        },
        drawcb(self) {
            self.data.drawcb(self)
        },
        data:new Player({
            speed:200,
    
        })
    })
    entitys.push(player)
    globalplayer = player
    return player
}

var spiralimage = loadImage('animations/spiral.png')
function loadTeleports(){
    var tpcooldown = new Cooldown(4)
    for(let object of findObjectsOfType('teleporter')){
        entitys.push(new Entity({
            type:'teleporter',
            pos:object.pos.c(),
            rect:Rect.fromCenter(object.pos.c(),tilesize),
            updatecb(self) {
                tpcooldown.update(globaldt)
                if(globalplayer.rect.collideBox(self.rect) && tpcooldown.tryfire()){
                    teleportsound.play()
                    globalplayer.pos = findObjectWithId(object.dst).pos.c()
                    globalplayer.rect.moveToCentered(globalplayer.pos)
                    globalplayer.data.inBitWorld = !globalplayer.data.inBitWorld

                    if(globalplayer.data.inBitWorld){
                        bitmusic.play()
                        normalmusic.pause()
                    }else{
                        bitmusic.pause()
                        normalmusic.play()
                    }
                }
            },
            drawcb(self) {
                rotStart(self.pos,time)
                drawImage(spiralimage,self.pos,tilesize,true)
                // drawAtlasImage(self.pos.c().sub(halfsize),new Vector(1,2),tilesize,memoryimage)
                rotEnd()
            },
        }))
    }
}

function loadFlags(){
    var res = []
    for(let flagobject of findObjectsOfType('flag')){
        let flagpos = flagobject.pos
        flagobject.enabled = true
        entitys.push(new Entity({
            type:'flag',
            pos:flagpos,
            rect:Rect.fromCenter(flagpos,tilesize),
            updatecb(self) {

                if(self.data.enabled && self.rect.collideBox(globalplayer.rect)){
                    switchLevel(self.data.dstlevel)
                    levelunlocked[self.data.dstlevel] = true
                }
            },
            drawcb(self) {
                if(self.data.enabled){
                    drawAtlasImage(self.pos.c().sub(halfsize),new Vector(2,2),tilesize,memoryimage)
                }else{
                    drawAtlasImage(self.pos.c().sub(halfsize),new Vector(0,2),tilesize,memoryimage)
                }
                // fillRect(self.pos,tilesize,true)
            },
            data:flagobject
        }))
        res.push(last(entitys))
    }
    return res
}




function switchLevel(index){
    //reset mapdata
    for(var entity of entitys){
        entity.markedForDeletion = true
    }
    entitys = []
    tiledmap = levels[index]
    tiledmap.layers[0].data = tiledmap.layers[0].backup.slice()
    loadlevelcallbacks[index]()
}

function loadWallsIntoBits(wallstl:Vector,wallsbr:Vector,destination:Vector,wallgid:number,grassgid){
    var res:Entity<Bit>[] = []
    wallstl.to(wallsbr).div(tilesize).add(new Vector(1,1)).loop(v => {
        var absrel = v.c().mul(tilesize)
        var abspos = absrel.c().add(wallstl)
        var index = vector2index(abspos.c().div(tilesize),tiledmap.width)
        var gid = tiledmap.layers[0].data[index]
        if(gid != wallgid){
            return
        }
        var bitpos = destination.c().add(v.c().mul(tilesize))
        entitys.push(new Entity<Bit>({
            pos:bitpos,
            rect:Rect.fromsize(bitpos,tilesize),
            type:'bit',
            updatecb(self) {
                var index = vector2index(abspos.c().div(tilesize),tiledmap.width)
                tiledmap.layers[0].data[index] = self.data.get() == 1 ? wallgid : grassgid
            },
            drawcb(self) {
                var bit:Bit = self.data
                ctxt.textAlign = 'center'
                ctxt.textBaseline = 'middle'
                ctxt.font = '30px Arial'
                ctxt.fillStyle = bit.get() ? 'white' : 'black'
                fillRect(self.pos,tilesize)
                ctxt.fillStyle = bit.get() ? 'black' : 'white'
                ctxt.fillText(bit.get().toString(),self.pos.x + halfsize.x,self.pos.y + halfsize.y + 3)
            },
            data:new Bit({
                array:[1],
                index:0,
            })
        }))
        res.push(last(entitys))
    })

    return res
}

function findObjectsOfType(type){
    var res = []
    for(var layer of tiledmap.layers){
        for(var object of layer.objects ?? []){
            if(object.class == type){
                res.push(object)
            }
        }
    }
    return res
}

function findObjectWithId(id){
    for(var layer of tiledmap.layers){
        for(var object of layer.objects ?? []){
            if(object.id == id){
                return object
            }
        }
    }
    return null
}

function findObjectWithName(name){
    for(var layer of tiledmap.layers){
        for(var object of layer.objects ?? []){
            if(object.name == name){
                return object
            }
        }
    }
    return null
}

