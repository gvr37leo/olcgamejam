
class Player{
    pos:Vector
    speed
    rect:Rect

    constructor(data:Partial<Player>){
        Object.assign(this,data)
    }
}
 