(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("testmap",
{ "compressionlevel":-1,
 "height":20,
 "infinite":false,
 "layers":[
        {
         "data":[1, 1, 3, 4, 5, 6, 7, 8, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
            1, 10, 11, 12, 13, 14, 15, 16, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
            1, 18, 19, 20, 21, 22, 23, 24, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,
            25, 26, 27, 28, 29, 30, 31, 32, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124,
            33, 34, 35, 36, 37, 38, 39, 40, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140,
            41, 42, 43, 44, 45, 46, 47, 48, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156,
            49, 50, 51, 52, 53, 54, 55, 56, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172,
            57, 58, 59, 60, 61, 62, 63, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":20,
         "id":1,
         "name":"Tile Layer 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }, 
        {
         "draworder":"topdown",
         "id":2,
         "name":"Object Layer 1",
         "objects":[
                {
                 "class":"spawn",
                 "height":0,
                 "id":1,
                 "name":"",
                 "point":true,
                 "rotation":0,
                 "visible":true,
                 "width":0,
                 "x":128,
                 "y":160
                }, 
                {
                 "class":"flag",
                 "height":0,
                 "id":2,
                 "name":"",
                 "point":true,
                 "rotation":0,
                 "visible":true,
                 "width":0,
                 "x":384,
                 "y":288
                }, 
                {
                 "class":"teleporter",
                 "height":0,
                 "id":3,
                 "name":"",
                 "point":true,
                 "properties":[
                        {
                         "name":"dst",
                         "type":"object",
                         "value":5
                        }],
                 "rotation":0,
                 "visible":true,
                 "width":0,
                 "x":64,
                 "y":352
                }, 
                {
                 "class":"teleporter",
                 "height":0,
                 "id":4,
                 "name":"",
                 "point":true,
                 "properties":[
                        {
                         "name":"dst",
                         "type":"object",
                         "value":6
                        }],
                 "rotation":0,
                 "visible":true,
                 "width":0,
                 "x":256,
                 "y":480
                }, 
                {
                 "class":"",
                 "height":0,
                 "id":5,
                 "name":"",
                 "point":true,
                 "rotation":0,
                 "visible":true,
                 "width":0,
                 "x":352,
                 "y":480
                }, 
                {
                 "class":"",
                 "height":0,
                 "id":6,
                 "name":"",
                 "point":true,
                 "rotation":0,
                 "visible":true,
                 "width":0,
                 "x":160,
                 "y":352
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }],
 "nextlayerid":3,
 "nextobjectid":7,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.9.2",
 "tileheight":32,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"res\/TX Tileset Grass.png",
         "imageheight":256,
         "imagewidth":256,
         "margin":0,
         "name":"TX Tileset Grass",
         "spacing":0,
         "tilecount":64,
         "tileheight":32,
         "tilewidth":32
        }, 
        {
         "columns":16,
         "firstgid":65,
         "image":"res\/TX Tileset Wall.png",
         "imageheight":512,
         "imagewidth":512,
         "margin":0,
         "name":"TX Tileset Wall",
         "spacing":0,
         "tilecount":256,
         "tileheight":32,
         "tiles":[
                {
                 "class":"tile",
                 "id":17,
                 "properties":[
                        {
                         "name":"isSolid",
                         "type":"bool",
                         "value":true
                        }]
                }, 
                {
                 "class":"tile",
                 "id":18,
                 "properties":[
                        {
                         "name":"isSolid",
                         "type":"bool",
                         "value":true
                        }]
                }, 
                {
                 "class":"tile",
                 "id":19,
                 "properties":[
                        {
                         "name":"isSolid",
                         "type":"bool",
                         "value":true
                        }]
                }, 
                {
                 "class":"tile",
                 "id":33,
                 "properties":[
                        {
                         "name":"isSolid",
                         "type":"bool",
                         "value":true
                        }]
                }, 
                {
                 "class":"tile",
                 "id":34,
                 "properties":[
                        {
                         "name":"isSolid",
                         "type":"bool",
                         "value":true
                        }]
                }, 
                {
                 "class":"tile",
                 "id":35,
                 "properties":[
                        {
                         "name":"isSolid",
                         "type":"bool",
                         "value":true
                        }]
                }, 
                {
                 "class":"tile",
                 "id":49,
                 "properties":[
                        {
                         "name":"isSolid",
                         "type":"bool",
                         "value":true
                        }]
                }, 
                {
                 "class":"tile",
                 "id":50,
                 "properties":[
                        {
                         "name":"isSolid",
                         "type":"bool",
                         "value":true
                        }]
                }, 
                {
                 "class":"tile",
                 "id":51,
                 "properties":[
                        {
                         "name":"isSolid",
                         "type":"bool",
                         "value":true
                        }]
                }, 
                {
                 "class":"tile",
                 "id":65,
                 "properties":[
                        {
                         "name":"isSolid",
                         "type":"bool",
                         "value":true
                        }]
                }, 
                {
                 "class":"tile",
                 "id":66,
                 "properties":[
                        {
                         "name":"isSolid",
                         "type":"bool",
                         "value":true
                        }]
                }, 
                {
                 "class":"tile",
                 "id":67,
                 "properties":[
                        {
                         "name":"isSolid",
                         "type":"bool",
                         "value":true
                        }]
                }],
         "tilewidth":32
        }],
 "tilewidth":32,
 "type":"map",
 "version":"1.9",
 "width":20
});