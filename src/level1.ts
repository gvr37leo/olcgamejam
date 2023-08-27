
var level1memory = [0,0,0,0,1,0,0,1,1,0]

function loadLevel1(){

    var bits = initBits(new Vector(80,120),level1memory)
    movePlayerToSpawn()
    loadTeleports()
    loadFlag()


    entitys.push(new Entity({
        updatecb(self) {
            
            // world.map[0] = level1memory.map(v => v == 1 ? 'X' : '0').join('')

            
        },
    }))
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
                }
            },
            drawcb(self) {
                ctxt.fillStyle = 'purple'
                fillRect(self.pos,tilesize)
            },
        }))
    }
}

function loadFlag(){
    var flagpos = findObjectsOfType('flag')[0].pos
    entitys.push(new Entity({
        type:'flag',
        pos:flagpos,
        rect:Rect.fromCenter(flagpos,tilesize),
        updatecb(self) {
            if(collisionCheckEntitys(player.rect,'flag')){
                entitys = []
                loadLevel2()//todo should always load level2
            }
        },
        drawcb(self) {
            ctxt.fillStyle = 'red'
            fillRect(self.pos,tilesize)
        },
    }))
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