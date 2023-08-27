
function initBits(pos:Vector,array:number[]){
    var res = []
    for(var i = 0; i < array.length;i++){
        entitys.push(new Entity<Bit>({
            pos:pos.c(),
            rect:Rect.fromsize(pos,tilesize),
            type:'bit',
            updatecb(self) {
                var bit:Bit = self.data
                if(0){
                    bit.flip()
                }
            },
            drawcb(self) {
                var bit:Bit = self.data

                ctxt.textAlign = 'center'
                ctxt.textBaseline = 'middle'
                ctxt.font = '30px Arial'
                ctxt.fillStyle = bit.get() ? 'black' : 'white'
                fillRect(self.pos,tilesize)
                ctxt.fillStyle = bit.get() ? 'white' : 'black'
                ctxt.fillText(bit.get().toString(),self.pos.x + halfsize.x,self.pos.y + halfsize.y + 3)
            },
            data:new Bit({
                array,
                index:i,
            })
        }))
        pos.x += tilesize.x
        res.push(last(entitys))
    }
    return res
}

function fillRect(pos:Vector,size:Vector,centered=false){
    if(centered){
        pos = pos.c().sub(size.c().scale(0.5))
    }
    ctxt.fillRect(pos.x,pos.y,size.x + 1,size.y  + 1)
}

class Particle{
    vel:Vector
    acc:Vector

    constructor(data:Partial<Particle>){
        Object.assign(this,data)
    }
}

function spawnBitParticles(pos:Vector,duration,amountPerSecond){
    // var particles:Entity[] = []
    // var rng = new RNG(0)
    https://w7.pngwing.com/pngs/877/720/png-transparent-explosion-sprite-pixel-art-particle-background-orange-video-game-desktop-wallpaper-thumbnail.png
    var fireimage = new Image()
    // fireimage.src = 'res/explosion.png'
    fireimage.src = 'res/blood.png'

    var lifespan = 2
    var handle = setInterval(() => {
        entitys.push(new Entity({
            pos:pos.c(),
            createdAt:time,
            updatecb:(self) => {
                var particle:Particle = self.data
                particle.vel.add(particle.acc.c().scale(globaldt))
                self.pos.add(particle.vel.c().scale(globaldt))
                var age = to(self.createdAt,time)
                if(age > lifespan){
                    self.markedForDeletion = true
                }
            },
            drawcb:(self) => {
                var age = to(self.createdAt,time)
                var completion = inverseLerp(age,0,lifespan)
                ctxt.fillStyle = 'red'
                
                ctxt.globalAlpha = 1 - tween(completion,0,0)
                rotStart(self.pos.c().add(new Vector(10,10)),completion * 6)
                ctxt.drawImage(fireimage,self.pos.x,self.pos.y,20,20)
                rotEnd()
                // ctxt.fillRect(self.pos.x,self.pos.y,20,20)
            },
            data:new Particle({
                vel:new Vector(rng.range(-50,50), -200),
                acc:new Vector(0, 400),
            })
        }))
    }, 1000 / amountPerSecond )
    setTimeout(() => {
        clearInterval(handle)
    },duration * 1000)
}

function collissionCheck(rect:Rect,type){


    return collissionCheckWorld(rect) || collisionCheckEntitys(rect,type)
}

function collissionCheckWorld(rect:Rect){
    var tl = rect.getPoint(new Vector(0,0)).div(tilesize).floor()
    var br = rect.getPoint(new Vector(1,1)).div(tilesize).floor()

    for(var layer of tiledmap.layers){
        if(layer.type == 'objectgroup'){
            continue
        }
        for(var x = tl.x; x <= br.x;x++){
            for(var y = tl.y; y <= br.y;y++){
                if(x < 0 || y < 0){
                    continue
                }
                var gid = layer.data[y * layer.width + x]
                if(gid == 0 || gid == undefined){
                    continue
                }
                var {lid,tileset} = gid2local(gid,tiledmap.tilesets)
                if(tileset.tilesdict[lid]?.isSolid){
                    return true
                }
            }
        }
    }

    return false
}


function collisionCheckEntitys(rect:Rect,type:string){
    var fentitys = entitys.filter(e => e.type == type)
    for(var entity of fentitys){
        if(entity.rect.collideBox(rect)){
            return entity
        }
    }
    return null
}


function rotStart(center:Vector,turns){
    ctxt.save()
    ctxt.translate(center.x,center.y)
    ctxt.rotate(turns*TAU)
    ctxt.translate(-center.x,-center.y)
}

function rotEnd(){
    ctxt.restore()
}

function drawImage(image,pos:Vector,size:Vector,centered = false){
    if(centered){
        pos = pos.c().sub(halfsize)
    }
    ctxt.drawImage(image,pos.x,pos.y,size.x + 1,size.y + 1)
}

function drawImage2(image,src:Rect,dst:Rect){
    var srcsize = src.size()
    var dstsize = dst.size()
    ctxt.drawImage(image,src.min.x,src.min.y,srcsize.x,srcsize.y,dst.min.x,dst.min.y,dstsize.x + 1,dstsize.y + 1)
}

function loadImage(src){
    var image = new Image()
    image.src = src
    return image
}

function index2Vector(index, width) {
    return new Vector(index % width,Math.floor(index / width));
}


function tween(x,a,b){
    return (a + b - 2) * x * x * x + (3 - 2*a - b) * x * x + a * x
}
