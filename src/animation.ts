
class SpriteAnimation{

    constructor(data:Partial<SpriteAnimation>){
        Object.assign(this,data)
    }

    imageatlas
    spritesize
    

    startpos
    direction
    framecount
    duration

    
}

function drawAnimation(pos:Vector,animation:SpriteAnimation,time,flipx = false,centered = true){
    if(centered){
        pos = pos.c().sub(animation.spritesize.c().scale(0.5))
    }
    var frame = Math.floor(map(time % animation.duration,0,animation.duration,0,animation.framecount))
    if(flipx){
        var center = pos.c().add(animation.spritesize.c().scale(0.5))
        ctxt.save()
        ctxt.translate(center.x,center.y)
        ctxt.scale(-1,1)
        ctxt.translate(-center.x,-center.y)
        
    }
    drawAtlasImage(pos,animation.startpos.c().add(animation.direction.c().scale(frame)),animation.spritesize,animation.imageatlas)
    if(flipx){
        ctxt.restore()
    }
}

function drawAtlasImage(absdstpos:Vector,srctile:Vector,tilesize:Vector,image){
    var abssrc = srctile.c().mul(tilesize)
    ctxt.drawImage(image,abssrc.x,abssrc.y,tilesize.x,tilesize.y,absdstpos.x,absdstpos.y,tilesize.x,tilesize.y)
}