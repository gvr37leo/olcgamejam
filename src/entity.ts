class Entity<T>{
    id:number
    name:string
    type:string
    pos:Vector
    depth = 0
    // vel:Vector
    createdAt:number
    updatecb:(self:Entity<T>) => void
    drawcb:(self:Entity<T>) => void
    markedForDeletion:boolean = false
    rect:Rect
    data:T


    constructor(data:Partial<Entity<T>>){
        Object.assign(this,data)
    }
}