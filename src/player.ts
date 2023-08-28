
class Player{
    isDead = false
    health = 1
    inBitWorld = false
    speed:number
    guncooldown = new Cooldown(0.1)

    constructor(data:Partial<Player>){
        Object.assign(this,data)
    }
}

 
function playercb(self:Entity<Player>){
    self.data.guncooldown.update(globaldt)


    if(mousebuttonsPressed[0] && self.data.guncooldown.tryfire()){

        if(player.data.inBitWorld){
            lasersound.play()
        }else{
            pistolsound.play()
        }

        var mouse = camera.screen2world(mousepos)
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
                if(self.markedForDeletion && self.data.isBitBullet){
                    spawnBitParticles(self.pos)
                }
            },
            drawcb(self) {
                ctxt.fillStyle = 'red'
                fillRect(self.pos,new Vector(5,5),true)
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