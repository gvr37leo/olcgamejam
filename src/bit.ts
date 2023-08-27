class Bit{
    array:number[]
    index:number

    constructor(data:Partial<Bit>){
        Object.assign(this,data)
    }

    get(){
        return this.array[this.index]
    }

    set(val){
        this.array[this.index] = val
    }

    flip(){
        this.set(1 - this.get())
    }
}