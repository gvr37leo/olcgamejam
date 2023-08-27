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
/// <reference path="src/bit.ts" />
/// <reference path="src/enemy.ts" />
/// <reference path="src/gun.ts" />
/// <reference path="src/entity.ts" />
/// <reference path="src/player.ts" />
/// <reference path="src/tiled.js" />


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



var TileMaps:any
// var tiledmap = TileMaps.tiles
var tiledmap = TileMaps.testmap

var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var {canvas,ctxt} = crret
console.log('here')
var tilesize = new Vector(tiledmap.tilewidth,tiledmap.tileheight)



var halfsize = tilesize.c().scale(0.5)

var player = new Player({
    pos:new Vector(0,0),
    speed:200,
    rect:Rect.fromsize(new Vector(0,0), new Vector(30,60))
})
var entitys:Entity<any>[] = []
var camera = new Camera(ctxt)




document.addEventListener('keydown',(e) => {
    if(e.key == 'f'){

        //interact with the entity below you
        //check if it's a bit entity
        // spawnParticles(player.pos,3,20)
    }
})

class Bullet{
    vel:Vector
}

document.addEventListener('mousedown', e => {
    var mouse = camera.screen2world(getMousePos(canvas,e))
    var bulletspeed = 700;
    

    entitys.push(new Entity<Bullet>({
        pos:player.pos.c(),
        type:'bullet',
        createdAt:time,
        updatecb(self) {
            var age = to(self.createdAt,time)
            if(age > 4){
                self.markedForDeletion
                return 
            }
            self.pos.add(self.data.vel.c().scale(globaldt))

            var bulletrect = Rect.fromCenter(self.pos, new Vector(5,5))
            var hitbit:Entity<Bit> = collisionCheckEntitys(bulletrect, 'bit')
            
            if(collissionCheckWorld(bulletrect)){
                self.markedForDeletion = true
            }
            if(hitbit){
                self.markedForDeletion = true
                hitbit.data.flip()
            }
            //check if it hit anything
            //if so, particle effect
        },
        drawcb(self) {
            ctxt.fillStyle = 'red'
            fillRect(self.pos,new Vector(5,5),true)
        },
        data:{
            vel:player.pos.to(mouse).normalize().scale(bulletspeed),
        }
    }))

    entitys.push()
})

preprocessTiledMap(tiledmap)
loadLevel1()
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
    var oldpos = player.pos.c()
    player.pos.add(dir.scale(player.speed * dt))
    var playerrectsize = player.rect.size()
    var halfsize = playerrectsize.c().scale(0.5)
    player.rect.moveTo(player.pos.c().sub(halfsize))
    if(collissionCheckWorld(player.rect)){
        player.pos.overwrite(oldpos)
    }
    for(var entity of entitys){
        entity.updatecb?.(entity)
    }
    entitys = entitys.filter(e => e.markedForDeletion == false)
    
    ctxt.globalAlpha = 1
    camera.pos.overwrite(player.pos)
    camera.begin()
        renderTiled(tiledmap)

        for(var entity of entitys){
            entity.drawcb?.(entity)
        }
        ctxt.fillStyle = 'red'
        fillRect(player.pos,player.rect.size(),true)

    camera.end()
})




