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
/// <reference path="src/animation.ts" />
/// <reference path="src/player.ts" />
/// <reference path="src/tiled.js" />
/// <reference path="src/level1.ts" />
/// <reference path="src/level2.ts" />
/// <reference path="src/level3.ts" />
/// <reference path="src/menulevel.ts" />
/// <reference path="src/finishedlevel.ts" />



//todo
//last 4 bits on level3
//testupload to see how it looks on itch.io
//write description
//record video with playthrough



// var drawdebuggraphics = location.hostname === "localhost"
var drawdebuggraphics = false
var memoryimage = loadImage('res/memoryworld.png')
var TileMaps:any
var levels = [TileMaps.level1,TileMaps.level2,TileMaps.level3,TileMaps.menulevel,TileMaps.finished]
var levelindex = 3
var tiledmap = levels[levelindex]

var levelunlocked = drawdebuggraphics ? [true,true,true,true] : [true,false,false,true]
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
var fireballsound = new Howl({
    src:['sounds/fireball.wav'],
    volume:1,
})
var bitmusic = new Howl({
    src:['sounds/bitmusic.wav'],
    volume:0.6,
    loop:true,
})
var normalmusic = new Howl({
    src:['sounds/normalmusic.mp3'],
    volume:0.6,
    loop:true,
})
var teleportsound = new Howl({
    src:['sounds/teleport.wav'],
    volume:0.6,
})
var witchRunAnimation = new SpriteAnimation({
    imageatlas:loadImage('animations/B_witch_run.png'),
    startpos:new Vector(0,0),
    direction:new Vector(0,1),
    framecount:8,
    duration:1,
    spritesize:new Vector(32,48)
})
var witchIdleAnimation = new SpriteAnimation({
    imageatlas:loadImage('animations/B_witch_idle.png'),
    startpos:new Vector(0,0),
    direction:new Vector(0,1),
    framecount:6,
    duration:1,
    spritesize:new Vector(32,48)
})
var fireballAnimation = new SpriteAnimation({
    imageatlas:loadImage('animations/All_Fire_Bullet_Pixel_16x16.png'),
    startpos:new Vector(0,14),
    direction:new Vector(1,0),
    framecount:5,
    duration:0.4,
    spritesize:new Vector(16,16)
})
var skeletonWalkAnimation = new SpriteAnimation({
    imageatlas:loadImage('animations/Skeleton enemy.png'),
    startpos:new Vector(0,2),
    direction:new Vector(1,0),
    framecount:12,
    duration:1,
    spritesize:new Vector(64,64)
})
var skeletonIdleAnimation = new SpriteAnimation({
    imageatlas:loadImage('animations/Skeleton enemy.png'),
    startpos:new Vector(0,3),
    direction:new Vector(1,0),
    framecount:4,
    duration:1,
    spritesize:new Vector(64,64)
}) 


var flipx = false
var currentanimation = witchRunAnimation

var halfsize = tilesize.c().scale(0.5)

var player = new Entity({
    pos:new Vector(0,0),
    rect:Rect.fromsize(new Vector(0,0), new Vector(20,20)),
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

var loadlevelcallbacks = [loadLevel1,loadLevel2,loadLevel3,loadMenulevel,loadFinishedLevel]

loadlevelcallbacks[levelindex]()
normalmusic.play()

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
        flipx = true
    }
    if(keys['d']){
        dir.x++
        flipx = false
    }
    if(dir.length() > 0){
        dir.normalize()
        currentanimation = witchRunAnimation
    }else{
        currentanimation = witchIdleAnimation
    }
    moveEntity(player,dir.scale(player.data.speed * dt))

    playercb(player)
    for(var entity of entitys){
        if(entity.markedForDeletion){
            continue
        }
        entity.updatecb?.(entity)
    }
    entitys = entitys.filter(e => e.markedForDeletion == false)
    
    camera.pos.overwrite(player.pos)
    // camera.scale = new Vector(1,1)
    camera.begin()
        renderTiled(tiledmap)

        for(var entity of entitys){
            ctxt.globalAlpha = 1
            if(entity.markedForDeletion){
                continue
            }
            entity.drawcb?.(entity)
        }
        if(drawdebuggraphics){
            ctxt.globalAlpha = 1
            ctxt.strokeStyle = 'magenta'
            for(var entity of entitys){
                if(entity.rect){
                    drawRectBorder(entity.rect)
                }                
            }
        }
        ctxt.globalAlpha = 1
        ctxt.fillStyle = 'red'
        if(player.data.inBitWorld){
            ctxt.strokeStyle = 'white'
            drawRectBorder(player.rect)
        }else{
            drawAnimation(player.pos,currentanimation,time,flipx,true)
        }
        // fillRect(player.pos,player.rect.size(),true)

    camera.end()
    mousebuttonsPressed.fill(false)
})

function drawRectBorder(rect:Rect){
    ctxt.beginPath()
    ctxt.moveTo(rect.min.x + 0.5,rect.min.y + 0.5)
    ctxt.lineTo(rect.max.x + 0.5,rect.min.y + 0.5)
    ctxt.lineTo(rect.max.x + 0.5,rect.max.y + 0.5)
    ctxt.lineTo(rect.min.x + 0.5,rect.max.y + 0.5)
    ctxt.closePath()
    ctxt.stroke()
}

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





