var stage = new createjs.Stage("canvas"); //link stage

var sheet = []; //container for subTiles

//subTile types
var grass = new createjs.Graphics().beginStroke("#000000").beginFill("#00ff00").drawRect(0, 0, 16, 16);
var path = new createjs.Graphics().beginStroke("#000000").beginFill("#ff8888").drawRect(0, 0, 16, 16);

var num;

sheetGen(20, 20, 16, 16);
changeTile(22, path);
stage.update();

//changes a subTile's type

function changeTile(subTile, type) {
  sheet[subTile].set({graphics: path})
}


//generates subTile sheet
function sheetGen(numTileX, numTileY, tileSizeX, tileSizeY) {
  for(var n = 0; n < numTileY; n++) {
    console.log("row " + n);

    for(var i = 0; i < numTileX; i++) {
      num = i + (n*numTileY);
      sheet[num] = new createjs.Shape(grass);
      sheet[num].x = i * tileSizeX;
      sheet[num].y = n * tileSizeY;
      stage.addChild(sheet[num]);

      console.log("drawing " + i);
    }
  }
}

function treeGen(numTileX, numTileY) {

}
