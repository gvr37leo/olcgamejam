
function spawnplayer(){
    for(let x = 0; x < world.mapsize.x;x++){
        for(let y = 0; y < world.mapsize.y;y++){
            if(world.map[y][x] == 's'){
                player.pos = new Vector(x,y).mul(world.tilesize)
            }
        }
    }
}