
function renderTiled(tiledData){

    //now the code is looping over all the id's
    //optimization could be only loop over visible tiles
    var tl = camera.screen2world(new Vector(0,0)).div(tiledData.tilesize).floor()
    var br = camera.screen2world(screensize).div(tiledData.tilesize).floor()
    tl.x = max(0,tl.x)
    tl.y = max(0,tl.y)
    br.x = min(tiledData.size.x-1, br.x)
    br.y = min(tiledData.size.y-1, br.y)

    for(var x = tl.x; x <= br.x;x++){
        for(var y = tl.y; y <= br.y;y++){
            var index = y * tiledData.size.x + x
            for(var layer of tiledData.layers){
                if(layer.data){
                    var gid = layer.data[index]
                    if(gid == 0){
                        continue
                    }
                    var FLIPPED_HORIZONTALLY_FLAG  = 0x80000000;
                    var FLIPPED_VERTICALLY_FLAG    = 0x40000000;
                    var FLIPPED_DIAGONALLY_FLAG    = 0x20000000;
                    var ROTATED_HEXAGONAL_120_FLAG = 0x10000000;
    
                    var horflag = gid & FLIPPED_HORIZONTALLY_FLAG;
                    var verflag = gid & FLIPPED_VERTICALLY_FLAG
                    var diagflag = gid & FLIPPED_DIAGONALLY_FLAG
                    var hexflag = gid & ROTATED_HEXAGONAL_120_FLAG
                    gid &= ~(FLIPPED_HORIZONTALLY_FLAG |
                        FLIPPED_VERTICALLY_FLAG |
                        FLIPPED_DIAGONALLY_FLAG |
                        ROTATED_HEXAGONAL_120_FLAG);
    
                    //gid first 4 bits are flags
    
                    var {lid,tileset} = gid2local(gid,tiledData.tilesets)
                    var tile = tileset.tilesdict[lid]
                    if(tile?.animation){
                        var animduration = tile.animation.reduce((p,c) => p + c.duration,0) / 1000
                        var localtime = time % animduration
                        var frame = Math.floor(localtime / 0.1)
                        lid = tile.animation[frame].tileid
                    }
        
                    var srcabspos = index2Vector(lid,tileset.columns).mul(tileset.tilesize);
                    var dstabspos = index2Vector(index,tiledData.size.x).mul(tileset.tilesize);
                    var srcrect = Rect.fromsize(srcabspos, tileset.tilesize);
                    var dstrect = Rect.fromsize(dstabspos,tileset.tilesize);
                    
                    // if(horflag){
                    //     srcrect.width *= -1
                    // }
                    // if(verflag){
                    //     srcrect.height *= -1
                    // }
                    // if(diagflag){
                    //     //todo, have to do some wizarding shit with custom defined vertices and uvs
                    // }
                    drawImage2(tileset.texture,srcrect,dstrect)
                }

                
            }
            
        }
    }

    for(var layer of tiledData.layers){
        if(layer.objects){
            for(var object of layer.objects){
                if(object.text){
                    ctxt.fillStyle = 'black'
                    if(object.text.color){
                        ctxt.fillStyle = object.text.color 
                    }
                    var fontsize = object.text.pixelsize ?? 16
                    ctxt.font = `${fontsize}px Arial`
                    ctxt.textAlign = 'center'
                    ctxt.textBaseline = 'middle'
                    var center = new Vector(object.x,object.y).add(new Vector(object.width,object.height).scale(0.5))
                    ctxt.fillText(object.text.text,center.x,center.y)
                }else{
                    if(drawdebuggraphics){
                        ctxt.fillStyle = 'green'
                        fillRect(object.pos,tiledData.tilesize,true)
                    }
                }
            }
        }
    }
}


async function preprocessTiledMap(tiledmap){
    tiledmap.tilesize = new Vector(tiledmap.tilewidth,tiledmap.tileheight)
    tiledmap.size = new Vector(tiledmap.width,tiledmap.height)

    for(var layer of tiledmap.layers){
        if(layer.data){
            layer.backup = layer.data.slice()
        }

        if(layer.objects){
            for(var object of layer.objects){
                object.pos = new Vector(object.x,object.y)
                object.size = new Vector(object.width,object.height)
                embedProperties(object)
            }
        }
    }

    for(var tileset of tiledmap.tilesets){
        tileset.texture = loadImage(tileset.image)
        tileset.tilesdict = {}
        tileset.tilesize = new Vector(tileset.tilewidth,tileset.tileheight)
        for(var tile of tileset.tiles ?? []){
            tileset.tilesdict[tile.id] = tile
            embedProperties(tile)
        }
    }
}

function gid2local(gid,tilesets){
    for(var i = tilesets.length - 1; i >= 0; i--){
        if(tilesets[i].firstgid <= gid){
            return {
                tileset:tilesets[i],
                lid:gid - tilesets[i].firstgid
            }
        }
    }
}

function embedProperties(object){
    if(object.properties){
        for(var prop of object.properties){
            object[prop.name] = prop.value
        }
    }
}