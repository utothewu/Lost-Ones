"use strict";

/* I'm going to try mocking up the engine */

class tile {
  draw() {
    textSize(20);
    if(this.type === "flowers"){
      text(1, this.x, this.y);
    } else if (this.type === "grass") {
      text(2, this.x, this.y);
    } else if (this.type === "tallGrass") {
      text(3, this.x, this.y);
    } else if (this.type === "bush") {
      text(4, this.x, this.y);
    } else if (this.type === "tree") {
      text(5, this.x, this.y);
    }
  }
}

//hash map implementation
let hash = {};
const CELL_SIZE = 60;

hash.add = function(obj) {
  let X = Math.round(obj.x / CELL_SIZE) * CELL_SIZE;
  let Y = Math.round(obj.y / CELL_SIZE) * CELL_SIZE;
  let key = X + "," + Y;
  if(hash[key] === undefined) hash[key] = [];
  hash[key].push(obj)
  console.log("added: " + obj)
}

hash.remove = function(obj) {
  let X = Math.round(obj.x / CELL_SIZE) * CELL_SIZE;
  let Y = Math.round(obj.y / CELL_SIZE) * CELL_SIZE;
  let key = X + "," + Y;
  let pos = hash[key].indexOf(obj);
  let removed = hash[key].splice(pos, 1);
  console.log("removed: " + removed);
}

hash.getList = function(X,Y){// -------> And the get
		X = Math.round(X / CELL_SIZE) * CELL_SIZE;
		Y = Math.round(Y / CELL_SIZE) * CELL_SIZE;
		key = X + "," + Y;
		return hash[key]
	}

hash.grab = function(distanceCells, x, y) {
  let X = Math.round(x / CELL_SIZE) * CELL_SIZE;
  let Y = Math.round(y / CELL_SIZE) * CELL_SIZE;
  distanceCells *= CELL_SIZE;
  let startX = X - distanceCells;
  let startY = Y - distanceCells;
  let endX = X + distanceCells;
  let endY = Y + distanceCells;
  let output = new Array;
  for(let i = startX; i < endX; i += CELL_SIZE) {
    for(let j = startY; j < endY; j += CELL_SIZE) {
      let sublist = hash.getList(i, j);
      if(sublist != undefined) {
        output = [...output, sublist]
      }
    }
  }
  //console.log(output);
  return output;
}

hash.render = function(distanceCells, x, y) {
  hash.grab(distanceCells, x, y).forEach((element) => {
    element.forEach((object) => {
      //console.log(object);
      object.draw();
    });
  });
}
