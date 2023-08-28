class Cooldown{
    cooldown
    maxcooldown

    constructor(maxcooldown){
        this.cooldown = 0
        this.maxcooldown = maxcooldown
    }

    isready(){
        return this.cooldown <= 0
    }

    tryfire(){
        if(this.isready()){
            this.cooldown = this.maxcooldown
            return true
        }
        return false
    }

    update(dt){
        this.cooldown -= dt
        if(this.cooldown < 0){
            this.cooldown = 0
        }
    }
}