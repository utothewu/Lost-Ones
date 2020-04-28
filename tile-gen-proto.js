"use strict";

let sheet;
let columns = 10;
let rows = 10;
let tDim = 16


function setup() {
  createCanvas(320, 320);
  tileGen(0, 0);
  tileGen(160, 0);
  tileGen(0, 160);
  tileGen(160, 160);
}

function draw() {

}

function init() {

}

function tileGen(startX, startY) {
  sheet = new Array(columns);
  for (let i = 0; i < columns; i++) {
    sheet[i] = new Array(rows);
  }

  for ( let i = 0; i < columns; i++) {
    for ( let j = 0; j < rows; j++) {
      let x = startX + tDim * i;
      let y = startY + tDim * j;

      noiseDetail(4, 0.35);
      let RGB = Math.round(Math.abs(255 * noise(x, y)));
      fill(RGB);

      if(RGB > 179) fill("#0000ff")
      if(RGB < 180) fill("#a4c903")
      if(RGB < 100) fill("#80b405");
      if(RGB < 60) fill("#008f00");
      if(RGB < 45) fill("#006f5f");

      stroke(0);
      square(x, y, tDim);
    }
  }
}
