"use strict";

let sheet;
let columns = 10;
let rows = 10;
let tDim = 32;

class tile {
  draw() {
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

function setup() {
  createCanvas(640, 640);
  tileGen(0, 0)
}

function draw() {

}

function init() {

}

//function for generating a chunk
function tileGen(startX, startY) {
  //initialise arrays
  sheet = new Array(columns);
  for (let i = 0; i < columns; i++) {
    sheet[i] = new Array(rows);
  }
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      sheet[i][j] = new tile;
    }
  }

  //targets each block I don't know if I can use for in and return the right order
  for ( let i = 0; i < columns; i++) {
    for ( let j = 0; j < rows; j++) {
      //perlin noise
      let xOff = i * 0.5;
      let yOff = j * 0.5;
      noiseDetail(3, 0.35);
      let noiseOut = Math.round(Math.abs(255 * noise(xOff, yOff)));

      //type assignment
      if(noiseOut > 179 && noiseOut < 255) sheet[i][j].type = "flowers";
      if(noiseOut > 99 && noiseOut < 180) sheet[i][j].type = "grass";
      if(noiseOut > 79 && noiseOut < 100) sheet[i][j].type = "tallGrass";
      if(noiseOut > 54 && noiseOut < 80) sheet[i][j].type = "bush";
      if(noiseOut > 0 && noiseOut < 55) sheet[i][j].type = "tree";

      console.log(sheet[i][j]);

      let x = (i * tDim) + startX;
      let y = (j * tDim) + startY;
      sheet[i][j].x = x;
      sheet[i][j].y = y;

      fill(noiseOut);
      textSize(20);
      sheet[i][j].draw()
    }
  }
}

function tileDraw(startX, startY) {



}
