class Enemy{

    data:number[] = []

    damage
    speed
    health

    attackcd = new Cooldown(1)

    constructor(incdata:Partial<Enemy>){
        this.data = new Array<number>(12)
        for(var key in incdata){
            this.setProp(key,incdata[key])
        }
    }
    


    props:Prop[] = [
        new Prop({
            name:'damage',
            size:4,
        }),
        new Prop({
            name:'speed',
            size:4,
        }),
        new Prop({
            name:'health',
            size:6,
        }),
        
    ]


    setProp(name,value){
        var offset = 0
        for(var prop of this.props){
            if(prop.name == name){
                var bits = number2Bits(value,prop.size)
                this.data.splice(offset,prop.size,...bits)
            }
            offset += prop.size
        }
    }

    getProp(name){
        var offset = 0
        for(var prop of this.props){
            if(prop.name == name){
                var bits = this.data.slice(offset,offset + prop.size)
                return bits2Number(bits)
            }
            offset += prop.size
        }
    }
}