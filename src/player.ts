
class Player{
    isDead = false
    health = 1
    inBitWorld = false
    speed:number
    guncooldown = new Cooldown(0.1)
    gun = new Gun({
        ammo:0b1111,
        firerate:0b0100,
        bulletspeed:0b100,
    })

    constructor(data:Partial<Player>){
        Object.assign(this,data)
    }
}

 
function playercb(self:Entity<Player>){
    self.data.guncooldown.update(globaldt)


    if(mousebuttonsPressed[0] && player.data.gun.getProp('ammo') > 0 && self.data.guncooldown.tryfire()){
        player.data.gun.decr('ammo')
        if(player.data.inBitWorld){
            lasersound.play()
        }else{
            fireballsound.play()
        }

        var mouse = camera.screen2world(mousepos)
        var bulletspeed = 400;
        entitys.push(new Entity<Bullet>({
            pos:player.pos.c(),
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
                        hitenemy.markedForDeletion = true
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
                vel:player.pos.to(mouse).normalize().scale(bulletspeed),
                isBitBullet:player.data.inBitWorld
            }
        }))
        //tryshoot
        //start cooldown
        //spawn bullet
        
        //set if bullet is real or in bitworld
        //
    }

}