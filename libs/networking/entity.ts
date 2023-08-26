class NetEntity{
    static globalEntityStore:Store<NetEntity>

    id:number = null
    parent:number = null
    type:string = ''
    name:string =''
    children:number[] = []
    // ordercount = 0
    // sortorder = 0
    synced = false

    public constructor(init?:Partial<NetEntity>) {
        Object.assign(this, init);
        this.type = 'entity'
    }

    setChild(child:NetEntity){
        //remove child from old parent
        var oldparent = NetEntity.globalEntityStore.get(child.parent)
        if(oldparent != null){
            remove(oldparent.children,child.id)
        }
        this.children.push(child.id)
        child.parent = this.id
        // child.sortorder = this.ordercount++
    }

    setParent(parent:NetEntity){
        if(parent == null){
            this.parent = null
        }else{
            parent.setChild(this)
        }
    }

    getParent(){
        return NetEntity.globalEntityStore.get(this.parent)
    }

    descendant(cb:(ent:NetEntity) => boolean):NetEntity{
        return this.descendants(cb)[0]

    }

    descendants(cb:(ent:NetEntity) => boolean):NetEntity[]{
        var children = this._children(cb)
        var grandchildren = children.flatMap(c => c.descendants(cb))
        return children.concat(grandchildren)
    }
    
    child(cb:(ent:NetEntity) => boolean):NetEntity{
        return this._children(cb)[0]
    }

    _children(cb:(ent:NetEntity) => boolean):NetEntity[]{
        return this.children.map(id => NetEntity.globalEntityStore.get(id)).filter(cb)
    }

    allChildren(){
        return this._children(() => true)
    }

    remove(){
        remove(this.getParent().children,this.id)
        NetEntity.globalEntityStore.remove(this.id)
        this.removeChildren()
        return this
    }

    inject(parent){
        NetEntity.globalEntityStore.add(this)
        this.setParent(parent)
        return this
    }

    removeChildren(){
        this.descendants(() => true).forEach(e => NetEntity.globalEntityStore.remove(e.id))
        this.children = []
    }

    ancestor(cb:(ent:NetEntity) => boolean):NetEntity{
        var current:NetEntity = this
        while(current != null && cb(current) == false){
            current = NetEntity.globalEntityStore.get(current.parent)
        }
        return current
    }
}

