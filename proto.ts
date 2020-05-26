export const hash = {
  CELL_SIZE: 60,

  add: function(obj: {x: number, y: number}) {
    let X = Math.round(obj.x / this.this.CELL_SIZE) * this.CELL_SIZE;
    let Y = Math.round(obj.y / this.CELL_SIZE) * this.CELL_SIZE;
    let key = X + "," + Y;
    if(hash[key] === undefined) hash[key] = [];
    hash[key].push(obj)
    console.log("added: " + obj)
  },

  remove: function(obj: {x: number, y: number}) {
    let X = Math.round(obj.x / this.CELL_SIZE) * this.CELL_SIZE;
    let Y = Math.round(obj.y / this.CELL_SIZE) * this.CELL_SIZE;
    let key = X + "," + Y;
    let pos = hash[key].indexOf(obj);
    let removed = hash[key].splice(pos, 1);
    console.log("removed: " + removed);
  },

  getList: function(X: number, Y: number){
  		X = Math.round(X / this.CELL_SIZE) * this.CELL_SIZE;
  		Y = Math.round(Y / this.CELL_SIZE) * this.CELL_SIZE;
  		let key = X + "," + Y;
  		return hash[key]
  	},

  grab: function(distanceCells: number, x: number, y: number) {
    let X = Math.round(x / this.CELL_SIZE) * this.CELL_SIZE;
    let Y = Math.round(y / this.CELL_SIZE) * this.CELL_SIZE;
    distanceCells *= this.CELL_SIZE;
    let startX = X - distanceCells;
    let startY = Y - distanceCells;
    let endX = X + distanceCells;
    let endY = Y + distanceCells;
    let output = new Array;
    for(let i = startX; i < endX; i += this.CELL_SIZE) {
      for(let j = startY; j < endY; j += this.CELL_SIZE) {
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

//credit Job Talle
export const noise = {
  randomize: function (seed: any, x: number, y: number) {
  	const RND_A = 134775813;
  	const RND_B = 1103515245;

  	return (((((x ^ y) * RND_A) ^ (seed + x)) * (((RND_B * x) << 16) ^ (RND_B * y) - RND_A)) >>> 0) / 4294967295;
  },

  tile: function (coordinate: number, period: number) {
    if(coordinate < 0) while (coordinate < 0)
      coordinate += period;
    else
      return coordinate % period;
  },

  interpolate: function (a: number, b: number, c: number, d: number, x: number) {
  	const p = (d - c) - (a - b);

  	return x * (x * (x * p + ((a - b) - p)) + (c - a)) + b;
  },

  config: function (seed: number, periodX = Number.MAX_SAFE_INTEGER, periodY = Number.MAX_SAFE_INTEGER) {
  	return {
  		seed: Math.floor(seed * Number.MAX_SAFE_INTEGER),
  		periodX: periodX,
  		periodY: periodY
  	}
  },

  sample: function (config: { periodX: number; periodY: number; seed: any; }, x: number, y: number): number {
  	const xi = Math.floor(x);
  	const lerpX = x - xi;
  	const yi = Math.floor(y);
  	const lerpY = y - yi;
  	const x0 = this.tile(xi - 1, config.periodX);
  	const x1 = this.tile(xi, config.periodX);
  	const x2 = this.tile(xi + 1, config.periodX);
  	const x3 = this.tile(xi + 2, config.periodX);

  	const xSamples = new Array(4);

  	for(let i = 0; i < 4; ++i) {
  		const y = this.tile(yi - 1 + i, config.periodY);

  		xSamples[i] = this.interpolate(
  			this.randomize(config.seed, x0, y),
  			this.randomize(config.seed, x1, y),
  			this.randomize(config.seed, x2, y),
  			this.randomize(config.seed, x3, y),
  			lerpX);
  	}

  	return this.interpolate(xSamples[0], xSamples[1], xSamples[2], xSamples[3], lerpY) * 0.5 + 0.25;
  }
}
