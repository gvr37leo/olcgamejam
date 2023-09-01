
class Bullet{
    vel:Vector
    isBitBullet = false
}

class Player{
    isDead = false
    health = 1
    inBitWorld = false
    speed:number
    guncooldown = new Cooldown(0.1)
    gun = new Gun({
        ammo:0b11111111,
        firerate:0b0100,
        bulletspeed:0b100,
    })

    constructor(data:Partial<Player>){
        Object.assign(this,data)
    }

    updatecb(self:Entity<Player>){
        var dir = new Vector(0,0)

        if(keys['w'] || keys['ArrowUp']){
            dir.y--
        }
        if(keys['s'] || keys['ArrowDown']){
            dir.y++
        }
        if(keys['a'] || keys['ArrowLeft']){
            dir.x--
            flipx = true
        }
        if(keys['d'] || keys['ArrowRight']){
            dir.x++
            flipx = false
        }
        if(dir.length() > 0){
            dir.normalize()
            var oldpos = self.pos.c()
            moveEntity(self,dir.c().scale(self.data.speed * globaldt))
            var newpos = self.pos.c()
            currentanimation = witchRunAnimation
            if(self.data.inBitWorld == false){
                dustCooldown.update(globaldt)
                if(dustCooldown.tryfire()){
                    spawnDustParticles(self.pos.c().add(new Vector(0,20)),oldpos.equal(newpos) ? new Vector(0,0) : dir.c().scale(self.data.speed))
                }
            }
        }else{
            currentanimation = witchIdleAnimation
        }
        
        camera.pos.overwrite(globalplayer.pos)
        self.data.guncooldown.update(globaldt)


        if(mousebuttonsPressed[0] && self.data.gun.getProp('ammo') > 0 && self.data.guncooldown.tryfire()){
            self.data.gun.decr('ammo')
            if(self.data.inBitWorld){
                lasersound.play()
            }else{
                fireballsound.play()
            }

            var mouse = camera.screen2world(mousepos)
            var bulletspeed = 400;
            entitys.push(new Entity<Bullet>({
                pos:self.pos.c(),
                type:'bullet',
                createdAt:time,
                updatecb(self) {
                    var age = to(self.createdAt,time)
                    if(age > 2){
                        self.markedForDeletion = true
                        return 
                    }
                    self.pos.add(self.data.vel.c().scale(globaldt))
        
                    var bulletrect = Rect.fromCenter(self.pos, new Vector(5,5))
                    var hitbit:Entity<Bit> = collisionCheckEntitys(bulletrect, 'bit')
                    var hitenemy:Entity<Enemy> = collisionCheckEntitys(bulletrect, 'enemy')
                    
                    if(collissionCheckWorld(bulletrect)){
                        self.markedForDeletion = true
                    }
                    if(hitbit){
                        self.markedForDeletion = true
                        hitbit.data.flip()
                    }
                    if(hitenemy){
                        hitenemy.data.setProp('health', hitenemy.data.getProp('health') - 1)//todo use gun damage 
                        self.markedForDeletion = true
                        if(hitenemy.data.getProp('health') <= 0){
                            hitenemy.data.isDead = true
                            hitenemy.data.deadTimeStamp = time
                            hitenemy.rect = null
                            // hitenemy.markedForDeletion = true
                            //spawnparticles
                            //play sound
                        }
                    }
                    if(self.markedForDeletion){
                        if(self.data.isBitBullet){
                            spawnBitParticles(self.pos)
                        }else{
                            spawnFireParticles(self.pos,self.data.vel)
                        }
                    }
                },
                drawcb(self) {
                    if(self.data.isBitBullet){
                        ctxt.font = '30px Arial'
                        ctxt.fillStyle = 'white'
                        ctxt.fillText('!',self.pos.x,self.pos.y)
                    }else{
                        ctxt.fillStyle = 'red'
                        drawAnimation(self.pos,fireballAnimation,time,false,true)
                        // fillRect(self.pos,new Vector(5,5),true)
                    }
                },
                data:{
                    vel:self.pos.to(mouse).normalize().scale(bulletspeed),
                    isBitBullet:self.data.inBitWorld
                }
            }))
        }
    }

    drawcb(self:Entity<Player>){
        if(self.data.inBitWorld){
            ctxt.strokeStyle = 'white'
            drawRectBorder(self.rect)
        }else{
            drawAnimation(self.pos,currentanimation,time,flipx,true)
        }
    }
}



 