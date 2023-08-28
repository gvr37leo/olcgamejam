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
/// <reference path="src/utils.ts" />
/// <reference path="src/bit.ts" />
/// <reference path="src/enemy.ts" />
/// <reference path="src/cooldown.ts" />
/// <reference path="src/gun.ts" />
/// <reference path="src/entity.ts" />
/// <reference path="src/player.ts" />
/// <reference path="src/tiled.js" />
/// <reference path="src/level1.ts" />
/// <reference path="src/level2.ts" />
/// <reference path="src/level3.ts" />
/// <reference path="src/menulevel.ts" />



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

//
//todo cooldown for teleporter and gun and enemy attack
var memoryimage = loadImage('res/memomryworld.png')
var TileMaps:any
var levels = [TileMaps.level1,TileMaps.level2,TileMaps.level3,TileMaps.menulevel]
var levelindex = 3
var tiledmap = levels[levelindex]
for(var level of levels){
    preprocessTiledMap(level)    
}

var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var {canvas,ctxt} = crret
console.log('here')
var tilesize = new Vector(tiledmap.tilewidth,tiledmap.tileheight)

declare var Howl;
var riflesound = new Howl({
    src:['sounds/rifle.wav'],
    volume:0.5,
})
var lasersound = new Howl({
    src:['sounds/laser.wav'],
    volume:0.5,
})
var shotgunsound = new Howl({
    src:['sounds/shotgun.wav'],
    volume:0.5,
})
var pistolsound = new Howl({
    src:['sounds/pistol.wav'],
    volume:0.5,
})
var halfsize = tilesize.c().scale(0.5)

var player = new Entity({
    pos:new Vector(0,0),
    rect:Rect.fromsize(new Vector(0,0), new Vector(30,60)),
    data:new Player({
        speed:200,

    })
})
var entitys:Entity<any>[] = []
var camera = new Camera(ctxt)




document.addEventListener('keydown',(e) => {
    if(e.key == 'f'){

    }
})

class Bullet{
    vel:Vector
    isBitBullet = false
}


var mousebuttons = []
var mousebuttonsPressed = []

var mousepos = new Vector(0,0)
document.addEventListener('mousemove', e => {
    mousepos = getMousePos(canvas,e)
})
document.addEventListener('mousedown', e => {
    mousebuttonsPressed[e.button] = true
    mousebuttons[e.button] = true
})

document.addEventListener('mouseup', e => {
    mousebuttons[e.button] = false
})

var loadlevelcallbacks = [loadLevel1,loadLevel2,loadLevel3,loadMenulevel]

loadlevelcallbacks[levelindex]()


var globaldt = 0;
var time = 0;
loop((dt) => {

    dt = clamp(dt,1/144,1/30)
    globaldt = dt;
    time += dt;
    // ctxt.clearRect(0,0,screensize.x,screensize.y)
    ctxt.fillStyle = 'gray'
    ctxt.fillRect(0,0,screensize.x,screensize.y)
    


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
    moveEntity(player,dir.scale(player.data.speed * dt))

    playercb(player)
    for(var entity of entitys){
        entity.updatecb?.(entity)
    }
    entitys = entitys.filter(e => e.markedForDeletion == false)
    
    camera.pos.overwrite(player.pos)
    camera.begin()
        renderTiled(tiledmap)

        for(var entity of entitys){
            ctxt.globalAlpha = 1
            entity.drawcb?.(entity)
        }
        ctxt.globalAlpha = 1
        ctxt.fillStyle = 'red'
        fillRect(player.pos,player.rect.size(),true)

    camera.end()
    mousebuttonsPressed.fill(false)
})

function moveEntity(entity:Entity<any>,vel:Vector){
    var oldpos = entity.pos.c()
    if(vel.x == 0 && vel.y == 0){
        return
    }

    entity.pos.x += vel.x
    entity.rect.moveToCentered(entity.pos)
    if(collissionCheckWorld(entity.rect)){
        entity.pos.x = oldpos.x
        entity.rect.moveToCentered(entity.pos)
    }


    entity.pos.y += vel.y
    entity.rect.moveToCentered(entity.pos)
    if(collissionCheckWorld(entity.rect)){
        entity.pos.y = oldpos.y
        entity.rect.moveToCentered(entity.pos)
    }
}




