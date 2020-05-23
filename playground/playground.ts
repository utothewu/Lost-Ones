const rows: number = 10;
const columns: number = 10;
const tDim = 32;
const CELL_SIZE: number = 64;
let sheet: any;

const grass = new createjs.Graphics().beginFill("00ff00");



class screenObject {
  x: number;
  y: number;
  dimX: number;
  dimY: number;
  depth: number;
  bitmap: string;
}

class screenTile extends screenObject {
  depth: 0;
  type: object;
  drawTile = function() {

  }
}

const hash = {
  add: function(obj: {x: number, y: number}) {
    let X = Math.round(obj.x / CELL_SIZE) * CELL_SIZE;
    let Y = Math.round(obj.y / CELL_SIZE) * CELL_SIZE;
    let key = X + "," + Y;
    if(hash[key] === undefined) hash[key] = [];
    hash[key].push(obj)
    console.log("added: " + obj)
  },

  remove: function(obj: {x: number, y: number}) {
    let X = Math.round(obj.x / CELL_SIZE) * CELL_SIZE;
    let Y = Math.round(obj.y / CELL_SIZE) * CELL_SIZE;
    let key = X + "," + Y;
    let pos = hash[key].indexOf(obj);
    let removed = hash[key].splice(pos, 1);
    console.log("removed: " + removed);
  },

  getList: function(X: number, Y: number){
  		X = Math.round(X / CELL_SIZE) * CELL_SIZE;
  		Y = Math.round(Y / CELL_SIZE) * CELL_SIZE;
  		let key = X + "," + Y;
  		return hash[key]
  	},

  grab: function(distanceCells: number, x: number, y: number) {
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
  },

    render: function(distanceCells: number, x: number, y: number) {
    hash.grab(distanceCells, x, y).forEach((element) => {
      element.forEach((object) => {
        //console.log(object);
        object.draw();
      });
    });
  }
};

tileGen(55555, 0, 0);
console.log(hash.grab(2, 100, 100));

//credit Job Talle
function randomize(seed: any, x: number, y: number) {
	const RND_A = 134775813;
	const RND_B = 1103515245;

	return (((((x ^ y) * RND_A) ^ (seed + x)) * (((RND_B * x) << 16) ^ (RND_B * y) - RND_A)) >>> 0) / 4294967295;
}

function tile(coordinate: number, period: number) {
	if (coordinate < 0) while (coordinate < 0)
		coordinate += period;
	else
		return coordinate % period;
}

function interpolate(a: number, b: number, c: number, d: number, x: number) {
	const p = (d - c) - (a - b);

	return x * (x * (x * p + ((a - b) - p)) + (c - a)) + b;
}

function cubicNoiseConfig(seed: number, periodX = Number.MAX_SAFE_INTEGER, periodY = Number.MAX_SAFE_INTEGER) {
	return {
		seed: Math.floor(seed * Number.MAX_SAFE_INTEGER),
		periodX: periodX,
		periodY: periodY
	}
}

function cubicNoiseSample(config: { periodX: number; periodY: number; seed: any; }, x: number, y: number): number {
	const xi = Math.floor(x);
	const lerpX = x - xi;
	const yi = Math.floor(y);
	const lerpY = y - yi;
	const x0 = tile(xi - 1, config.periodX);
	const x1 = tile(xi, config.periodX);
	const x2 = tile(xi + 1, config.periodX);
	const x3 = tile(xi + 2, config.periodX);

	const xSamples = new Array(4);

	for(let i = 0; i < 4; ++i) {
		const y = tile(yi - 1 + i, config.periodY);

		xSamples[i] = interpolate(
			randomize(config.seed, x0, y),
			randomize(config.seed, x1, y),
			randomize(config.seed, x2, y),
			randomize(config.seed, x3, y),
			lerpX);
	}

	return interpolate(xSamples[0], xSamples[1], xSamples[2], xSamples[3], lerpY) * 0.5 + 0.25;
}

//function for generating a chunk
function tileGen(seed: number, startX: number, startY: number) {
  //initialise arrays
  sheet = new Array(columns);
  for (let i = 0; i < columns; i++) {
    sheet[i] = new Array(rows);
  }
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      sheet[i][j] = new screenTile;
    }
  }

  //targets each block I don't know if I can use for in and return the right order
  for ( let i = 0; i < columns; i++) {
    for ( let j = 0; j < rows; j++) {
      //noise
      let xOff = i * 0.4;
      let yOff = j * 0.4;
      let cubeConf = cubicNoiseConfig(seed);
      let sample = cubicNoiseSample(cubeConf, xOff, yOff);
      let noiseOut = Math.round(Math.abs(255 * sample));

      //type assignment
      if(noiseOut > 179 && noiseOut < 255) sheet[i][j].type = "flowers";
      if(noiseOut > 79 && noiseOut < 180) sheet[i][j].type = "grass";
      if(noiseOut > 64 && noiseOut < 80) sheet[i][j].type = "tallGrass";
      if(noiseOut > 54 && noiseOut < 65) sheet[i][j].type = "bush";
      if(noiseOut > 0 && noiseOut < 55) sheet[i][j].type = "tree";

      //console.log(sheet[i][j]);

      let x = (i * tDim) + startX;
      let y = (j * tDim) + startY;
      sheet[i][j].x = x;
      sheet[i][j].y = y;
      sheet[i][j].grayscale = noiseOut;

      hash.add(sheet[i][j])
    }
  }
}
