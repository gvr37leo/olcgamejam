class Prop{
    size
    name

    constructor(data:Partial<Prop>){
        Object.assign(this,data)
    }
}

class Gun{

    data:number[] = []

    ammo
    firerate
    bulletspeed

    constructor(incdata:Partial<Gun>){
        this.data = new Array<number>(12)
        for(var key in incdata){
            this.setProp(key,incdata[key])
        }
    }
    


    props:Prop[] = [
        new Prop({
            name:'ammo',
            size:8,
        }),
        new Prop({
            name:'firerate',
            size:4,
        }),
    ]



    inc(name){
        this.setProp(name,this.getProp(name) + 1)
    }

    decr(name){
        this.setProp(name,this.getProp(name) - 1)
    }

    setProp(name,value){
        this[name] = value
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
                var bits = this.data.slice(offset,prop.size)
                return bits2Number(bits)
            }
            offset += prop.size
        }
    }
}

function number2Bits(number,maxbits):number[]{
    
    var res = [];
    for(var i = 0;i < maxbits; i++) {
        res.unshift(number % 2 === 1 ? 1 : 0);
        number = Math.floor(number / 2);
    }

    return res;
}

function bits2Number(bits:number[]){
    var res = 0
    for(var i = bits.length - 1,j = 0; i >= 0; i--,j++){
        if(bits[i] == 1){
            res += Math.pow(2,j)    
        }
    }
    return res
}