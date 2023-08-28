
// var level1memory1 = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
// var level1memory2 = [1,1,1,1,1,1,1,1,1,1,1]
// var level1memory3 = [1,1,1,1,1,1,1,1,1,1,1]
// var level1memory4 = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
// var level1memory5 = [1,1,1,1,1,1,1,1,1,1,1]



function loadLevel1(){

    
    //have 5 arrays of memory
    //corresponding to the 5 walls in game

    loadWallsIntoBits(findObjectWithName('mark1').pos,findObjectWithName('mark2').pos,findObjectWithName('ref1').pos,348,1)
    movePlayerToSpawn()
    loadTeleports()
    loadFlag()
}

function movePlayerToSpawn(){
    player.pos = findObjectsOfType('spawn')[0].pos.c()
}

function loadTeleports(){
    for(let object of findObjectsOfType('teleporter')){
        entitys.push(new Entity({
            type:'teleporter',
            pos:object.pos.c(),
            updatecb(self) {
                if(player.rect.collideBox(Rect.fromCenter(self.pos,tilesize))){
                    player.pos = findObjectWithId(object.dst).pos.c()
                    player.data.inBitWorld = !player.data.inBitWorld
                }
            },
            drawcb(self) {
                ctxt.fillStyle = 'purple'
                fillRect(self.pos,tilesize,true)
            },
        }))
    }
}

function loadFlag(){
    for(let flagobject of findObjectsOfType('flag')){
        let flagpos = flagobject.pos
        entitys.push(new Entity({
            type:'flag',
            pos:flagpos,
            rect:Rect.fromCenter(flagpos,tilesize),
            updatecb(self) {
                if(self.rect.collideBox(player.rect)){
                    switchLevel(self.data.dstlevel)
                }
            },
            drawcb(self) {
                ctxt.fillStyle = 'red'
                fillRect(self.pos,tilesize,true)
            },
            data:flagobject
        }))
    }
}

function drawAtlasImage(absdstpos:Vector,srctile:Vector,tilesize:Vector,image){
    var abssrc = srctile.c().mul(tilesize)
    ctxt.drawImage(image,abssrc.x,abssrc.y,tilesize.x,tilesize.y,absdstpos.x,absdstpos.y,tilesize.x,tilesize.y)
}


function switchLevel(index){
    //reset mapdata
    entitys = []
    tiledmap = levels[index]
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

