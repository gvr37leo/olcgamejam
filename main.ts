/// <reference path="libs/vector/vector.ts" />
/// <reference path="libs/utils/rng.ts" />
/// <reference path="libs/utils/store.ts" />
/// <reference path="libs/utils/table.ts" />
/// <reference path="libs/utils/utils.ts" />
/// <reference path="libs/utils/stopwatch.ts" />
/// <reference path="libs/utils/ability.ts" />
/// <reference path="libs/utils/anim.ts" />
/// <reference path="libs/rect/rect.ts" />
/// <reference path="libs/event/eventqueue.ts" />
/// <reference path="libs/event/eventsystem.ts" />
/// <reference path="libs/utils/camera.ts" />
/// <reference path="libs/networking/entity.ts" />
/// <reference path="libs/networking/server.ts" />
/// <reference path="libs/utils/domutils.js" />
/// <reference path="src/level1.ts" />
/// <reference path="src/level2.ts" />
/// <reference path="src/level3.ts" />
/// <reference path="src/utils.ts" />


//idea for memory game

//puzzle/shooter game
//you can walk through the memory of the computer
//stuff like enemies,your gun, your ammo, the map are visible as 1's and 0's on the map
//goal of the game is get to the flag
//limited amount of memory changes
//readonly memory


//level 1 = edit the map to remove walls, //button to switch to the memory world,teleport?
//level 2 = edit your gun to shoot faster, and do more damage
//level 3 = edit the enemies to have less health, be slower, or set the array to zero
//level 4 = bring it all together




var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var {canvas,ctxt} = crret
console.log('here')
//var player input
//worlds with simple colliders
//camera
//string world

class World{
    stringmap:string
    map:string[]
    mapsize:Vector
    tilesize:Vector

    constructor(data:Partial<World>){
        Object.assign(this,data)
        this.map = data.stringmap.trim().split('\n').map(s => s.trim())
        this.mapsize = new Vector(this.map[0].length,this.map.length)
    }
}

class Entity{
    id:number
    name:string
    type:string
    pos:Vector
    createdAt:number
    updatecb:(self:Entity) => void
    drawcb:(self:Entity) => void
    markedForDeletion:boolean = false
    data:any

    constructor(data:Partial<Entity>){
        Object.assign(this,data)
    }
}

class Player{
    pos:Vector
    speed
    rect:Rect

    constructor(data:Partial<Player>){
        Object.assign(this,data)
    }
}

var world = new World({
    stringmap:`
    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    X0000000000000000000000000000X000X
    X0000000000000000000000000000X000X
    X0000000000000000000000000000X000X
    X0000000000000000000000000000X000X
    X0000000000000000000000000000X000X
    X0000000000000000000000000000X000X
    X0000000000000000000000000000X0f0X
    X0000000000000000000000000000X000X
    X0000000000000000000000000000X000X
    X0000000000000000000000000000X000X
    X0000000000s00000000000000000X000X
    X0000000000000000000000000000X000X
    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`,
    tilesize:new Vector(40,40)
})

var player = new Player({
    pos:new Vector(0,0),
    speed:200,
    rect:Rect.fromsize(new Vector(0,0), new Vector(30,60))
})
var entitys:Entity[] = []
var camera = new Camera(ctxt)

spawnplayer()


document.addEventListener('keydown',(e) => {
    if(e.key == 'f'){

        //interact with the entity below you
        //check if it's a bit entity
        // spawnParticles(player.pos,3,20)
    }
})

document.addEventListener('mousedown', e => {
    var mouse = camera.screen2world(getMousePos(canvas,e))
    
    player.pos.to(mouse)

    entitys.push()
})

function setupBits(pos,amount){

    for(var i = 0; i < amount;i++){
        entitys.push(new Entity({
            pos:new Vector(0,0),
            type:'bit',
            updatecb(self){
                //check if memory bullet hit this
            },
            drawcb(self) {
                
            },
            data:{
                val:1
            }
        }))
    }
}

var globaldt = 0;
var time = 0;
loop((dt) => {
    globaldt = dt;
    time += dt;
    ctxt.clearRect(0,0,screensize.x,screensize.y)

    


    var dir = new Vector(0,0)

    if(keys['w']){
        dir.y--
    }
    if(keys['s']){
        dir.y++
    }
    if(keys['a']){
        dir.x--
    }
    if(keys['d']){
        dir.x++
    }
    if(dir.length() > 0){
        dir.normalize()
    }
    var oldpos = player.pos.c()
    player.pos.add(dir.scale(player.speed * dt))
    var playerrectsize = player.rect.size()
    var halfsize = playerrectsize.c().scale(0.5)
    player.rect.moveTo(player.pos.c().sub(halfsize))
    

    var collrect = Rect.fromsize(new Vector(0,0),world.tilesize.c())
    player.pos
    for(var entity of entitys){
        entity.updatecb(entity)
    }
    for(let x = 0; x < world.mapsize.x;x++){
        for(let y = 0; y < world.mapsize.y;y++){
            collrect.moveTo(new Vector(x,y).mul(world.tilesize))
            if(world.map[y][x] == 'X' && player.rect.collideBox(collrect)){
                player.pos.overwrite(oldpos)
                break
            }          
        }
    }
    entitys = entitys.filter(e => e.markedForDeletion == false)
    
    ctxt.globalAlpha = 1
    camera.pos.overwrite(player.pos)
    camera.begin()
        for(let x = 0; x < world.mapsize.x;x++){
            for(let y = 0; y < world.mapsize.y;y++){
                if(world.map[y][x] == 'X'){
                    ctxt.fillStyle = 'black'
                }else if(world.map[y][x] == '0'){
                    ctxt.fillStyle = 'white'
                }
                ctxt.fillRect(x * world.tilesize.x, y * world.tilesize.y, world.tilesize.x + 1, world.tilesize.y + 1)
            }
        }
        ctxt.fillStyle = 'red'
        var playerrectsize = player.rect.size()
        var halfsize = playerrectsize.c().scale(0.5)
        ctxt.fillRect(player.pos.x - halfsize.x,player.pos.y - halfsize.y,playerrectsize.x,playerrectsize.y)

        for(var entity of entitys){
            entity.drawcb(entity)
        }
    camera.end()
})

class Particle{
    vel:Vector
    acc:Vector

    constructor(data:Partial<Particle>){
        Object.assign(this,data)
    }
}

function spawnParticles(pos:Vector,duration,amountPerSecond){
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

//variant for each level
//use array with index
function loadDataIntoBits(){

}

function loadBitsIntoData(){

}

function tween(x,a,b){
    return (a + b - 2) * x * x * x + (3 - 2*a - b) * x * x + a * x
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