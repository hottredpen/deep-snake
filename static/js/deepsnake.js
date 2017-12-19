(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.deepsnake = global.deepsnake || {})));
}(this, (function (exports) { 'use strict';

function Point(x = this.rnd(this.size.x), y = this.rnd(this.size.y)) {
    this.x = x;
    this.y = y;
}

function equals(other) {
    if (!other) return;
    return other.x === this.x && other.y === this.y;
}

function getHash(size = this.size) {
    return this.x + this.y * size.x;
}

function add(point) {
    if (!point) {
        return this;
    }
    return new Point(this.x + point.x, this.y + point.y).overflow();
}

function distance(other) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
}

function overflow(size = this.size) {
    return new Point(this.x.mod(size.x), this.y.mod(size.y));
}

Point.prototype = {
    equals,
    add,
    getHash,
    distance,
    overflow,
    size : new Point(20,20),
    rnd: function(max) {return Math.floor(Math.random() * max)}
};


Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

const DIRECTIONS = {
    UP: new Point(0, -1),
    DOWN: new Point(0, 1),
    RIGHT: new Point(1, 0),
    LEFT: new Point(-1, 0),

    // 获取当前指令
    getAll: function() { 
        // console.log("DIRECTIONS.getAll");
        // console.log([this.UP, this.RIGHT, this.DOWN, this.LEFT]);
        return [this.UP, this.RIGHT, this.DOWN, this.LEFT]
    },

    getRandom: function () {
        let all = this.getAll();
        let rndIndex = Math.floor((Math.random() * all.length));
        // console.log("DIRECTIONS.getRandom");
        // console.log(all[rndIndex]);
        return all[rndIndex];
    },

    getFromTo: function (point1, point2) {
        let dx = point2.x - point1.x;
        let dy = point2.y - point1.y;
        let direction = new Point(Math.sign(dx), Math.sign(dy));
        // console.log("DIRECTIONS.getFromTo");
        // console.log(direction);
        return direction;
    }
};

function Snake(position = new Point()) {
    this.body = [position];
    this.length = this.initLength;
    this.isAlive = true;
    this.score = 0;

    let direction = DIRECTIONS.getRandom();
    while (this.length < this.body.length) {
        this.move(direction);
    }
    return this;
}

function head() {
    return this.body[0];
}

function move(direction) {
    let head = this.body[0].add(direction);
    this.body.unshift(head);
    return this;
}
function grow() {
    this.score++;
    if (this.length<this.maxLength) this.length++;
    return this;
}

function eat(food) {
    food.kill();
    return this.grow();
}

function trim() {
    while (this.body.length > this.length) {
        this.body.pop();
    }
    return this;
}

function kill() {
    this.isAlive = false;
}

function getCells$1() {
    let being = this;
    return this.body.map(function (point) {
        return {point, being}
    });
}

Snake.prototype = {
    head,
    move,
    eat,
    grow,
    trim,
    kill,
    getCells: getCells$1,
    initLength: 3,
    maxLength: 3,
    kind: "snake"
};

function Food(position = new Point()) {
    this.body = [position];
    this.isAlive = true;
    this.age = 0;
}


function head$1() {
    return this.body[0];
}

function kill$1() {
    this.isAlive = false;
}

function getCells$2() {
    let being = this;
    return this.body.map(function (point) {
        return {point, being}
    });
}

Food.prototype = {
    head: head$1,
    kill: kill$1,
    getCells: getCells$2,
    kind : "food"
};

function Universe(snk = new Snake(), fd = new Food()) {
    this.snake = snk;
    this.food = fd;
}

function tick(direction) {
    this.snake.move(direction);
    let head = this.snake.head();
    var others = this.getAt(head);
    others.forEach(other => this.snake.eat(other));
    this.snake.trim();
    this.food.age++;
    if (this.food.age>100) this.food.kill();
    if (!this.food.isAlive) this.food = new Food();
    return this.getCells();
}


function getCells() {
    return [this.snake.getCells(), this.food.getCells()].reduce((acc, cur) => acc.concat(cur), [])
}

function getAt(point) {
    return point.equals(this.food.head()) ? [this.food] : []  ;
}

Universe.prototype = {
    tick,
    getCells,
    getAt
};

function Game(size = new Point(20, 20), universe =  new Universe()) {
    this.size = size;
    Point.prototype.size = size;
    this.universe = universe;
    this.directions = DIRECTIONS.getAll();
    this.dir2id = {};
    this.directions.forEach((point,index)=>this.dir2id[point.getHash()]=index);
}

function state() {
    //let cells = this.universe.getCells();
    let output = new Array(this.size.x * this.size.y).fill(UNKNOWN_CODE);
    let f = this.universe.food.head();
    let s = this.universe.snake.head();

    output[f.y * this.size.x + f.x] =  FOOD_CODE;
    output[s.y * this.size.x + s.x] =  SNAKE_CODE;
    //cells.forEach( cell => output[cell.point.x + this.size.y * cell.point.y] = encodeKind(cell.being))
    return output
}

function state2() {
    let f = this.universe.food.head();
    let s = this.universe.snake.head();
    return [f.x, f.y, s.x, s.y];
}

function tick$1(input, draw = () => {}) {
    let direction = new Point(input[0], input[1]);
        let cells = this.universe.tick(direction);
    draw(cells);
}

function score() {
    return this.universe.snake.score;
}

function hint() {
    var direction = DIRECTIONS.getFromTo(this.universe.snake.head(), this.universe.food.head());
    return [direction.x, direction.y];
}

const SNAKE_CODE = 100;
const FOOD_CODE = -100;
const UNKNOWN_CODE = 0;


Game.prototype = {
    tick: tick$1,
    score,
    hint,
    state,
    state2
};

function Grid(element = 'body', pixel = 12, size = {x: 20, y: 20}) {
    /* global d3:true */
    this._color = {snake: "silver", food: "green"};
    let grid = this;
    this.svg = d3.select(element)
        .append('svg')
        .attr('width', size.x * pixel)
        .attr('height', size.y * pixel)
        .on("mousemove", () => {grid.hasFocus = true;})
        .on("mouseout", () => {grid.hasFocus = false;});
    this.pixel = pixel;
}

function draw(cells) {
    var blocks = this.svg
        .selectAll("rect")
        .data(cells, d => d.point.getHash() << 8 + encodeKind$1(d.being.kind) );

    blocks.enter()
        .append('rect')
            .attr('width', this.pixel)
            .attr('height', this.pixel)
            .attr('x', d => d.point.x * this.pixel)
            .attr('y', d => d.point.y * this.pixel)
            .style('fill', d => this._color[d.being.kind])
        .merge(blocks)
            .attr('class', d => d.being.kind);

    blocks.exit().remove();
}

const SNAKE_CODE$1 = 1;
const FOOD_CODE$1 = 2;
const UNKNOWN_CODE$1 = 255;


function encodeKind$1(kind) {
    if (kind==="snake") return SNAKE_CODE$1;
    if (kind==="food") return FOOD_CODE$1;
    return UNKNOWN_CODE$1;
}


function color(snake, food) {
    if (snake) this._color['snake'] = snake;
    if (food) this._color['food'] = food;
    return this;
}


Grid.prototype = {
    draw,
    color
};

function Map(element = 'body', pixel = 12, size = {x: 20, y: 20}) {
    this.color();
    /* global d3:true */
    this.svg = d3.select(element)
        .append('svg')
        .attr('width', size.x * pixel)
        .attr('height', size.y * pixel);
    this.pixel = pixel;
    this.size = size;
}


function draw$1(weights) {

    let data = [];

    let colorScale  = d3.scaleLinear()
        .domain([Math.min(...weights),Math.max(...weights)])
        //.domain([-3000,10000])
        .interpolate(d3.interpolateHcl)
        .range(["white", "green"]);

    // console.log(Math.max(...weights));
    // console.log(Math.min(...weights));

    weights.forEach(function(value, id) {
        data.push({
            value,
            id
        });
    });

    var blocks = this.svg
        .selectAll("rect")
        .data(data, d=> d.id);

    blocks.enter()
        .append('rect')
            .attr('width', this.pixel)
            .attr('height', this.pixel)
            .attr('x', d => (d.id % this.size.x)  * this.pixel )
            .attr('y', d => (Math.floor(d.id / this.size.x)) * this.pixel)
        .merge(blocks)
            .style('fill', d => colorScale(d.value) );

    blocks.exit().remove();
}

function drawFocus(point) {
    var focus  = this.svg
        .selectAll("circle")
        .data([point], d => d.getHash());

    focus.enter()
        .append('circle')
        .attr('r', this.pixel)
        .attr('cx', d => d.x * this.pixel)
        .attr('cy', d => d.y * this.pixel)
        .style('stroke', 'red')
        .style('fill', 'rgba(0,0,0,0)')
        .merge(focus);

    focus.exit().remove();
}

function color$1(low = "white", high = "green") {
    this._color  = d3.scaleLinear()
        .domain([-1,1])
        .interpolate(d3.interpolateHcl)
        .range([low, high]);
    return this;
}


Map.prototype = {
    draw: draw$1,
    drawFocus,
    color: color$1
};

function Controls() {

    const left = 37;
    const up = 38;
    const right = 39;
    const down = 40;


    let keyMap = {};
    keyMap[up] = [0, -1];
    keyMap[right] = [1, 0];
    keyMap[down] = [0, 1];
    keyMap[left] = [-1, 0];

    this.value = [1,0];
    let controls = this;

    document.addEventListener("keydown", function (e) {
        let input = keyMap[e.keyCode];
        if (!(input+1)) return;
        controls.value = input;
        e.preventDefault();
    });

}

function Chart(parent ="body", label = "", size = [300, 200] , xcount = 20, ymax = 100) {

  this.data = [];

  var _color = "steelblue";
  var tickCount = 0;

  var svg = d3.select(parent)
    .append("svg")
    .attr("width", size[0])
    .attr("height", size[1]);

  var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  };

  var width = +svg.attr("width") - margin.left - margin.right;
  var height = +svg.attr("height") - margin.top - margin.bottom;
  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//scale x and y values
  var x = d3.scaleLinear()
      .domain([0, ymax])
      .rangeRound([0, width]);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  //function to generate svg path from values
  var area = d3.area()
    .x(function(d) {
      return x(d.ticks);
    })
    .y1(function(d) {
      return y(d.value);
    });

    y.domain([0, ymax]);

    //Add y axes label
    g.append("g")
      .attr("class", "yaxes")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text(label);


  //call this function to add one more value
  this.push = function(value) {
    this.data.push({
      ticks: tickCount++,
      value: Math.max(0, Math.min(ymax, value)) ,
    });

    if (this.data.length > xcount+1) {
      this.data.shift();
    }

    var xmin = d3.min(this.data, d => d.ticks);
    var xmax = xmin + xcount;
    x.domain([xmin, xmax]);


    area.y0(y(0));

    g.selectAll(".replace").remove();

    g.append("path")
      .attr("class", "replace")
      .datum(this.data)
      .attr("fill", _color)
      .attr("d", area);


      g.append("g")
        .attr("class", "replace")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues([xmin, xmax]));
  };

  this.avg = function() {
      return this.data.reduce( (sum, cur) => sum + cur.value, 0) / this.data.length;
  };

  this.color = function color(value) {
    _color = value;
  };
}

function Brain(neurons = 40) {

    let defs = [];
    defs.push({type: 'input', out_sx: 1, out_sy: 1, out_depth: 4});
    defs.push({type: 'fc', num_neurons: neurons, activation: 'relu'});
    defs.push({type: 'fc', num_neurons: neurons, activation: 'relu'});
    defs.push({type: 'fc', num_neurons: neurons, activation: 'relu'});
    defs.push({type: 'fc', num_neurons: neurons, activation: 'relu'});
    defs.push({type: 'fc', num_neurons: neurons, activation: 'relu'});
    defs.push({type: 'regression', num_neurons: 2});

    let options = {learning_rate: 0.001, l2_decay: 0.001};


    this.net = new convnetjs.Net();
    this.net.makeLayers(defs);
    this.loss = 100;
    this.trainer = new convnetjs.SGDTrainer(this.net, options);
}

function reward(state, action) {
    let x = new convnetjs.Vol(state);
    let stats = this.trainer.train(x, action);
    this.loss = stats.loss;
}

function decide(state) {
    let x = new convnetjs.Vol(state);
    let result = this.net.forward(x);
    return [getSign(result.w[0]), getSign(result.w[1])];
}

const THRESHOLD= 0.1;
function getSign(d) {
    if (Math.abs(d)<THRESHOLD) return 0;
    return Math.sign(d);
}

Brain.prototype = {
    reward,
    decide
};

function Brain1(neurons = 40) {

    let defs = [];
    defs.push({type: 'input', out_sx: 1, out_sy: 1, out_depth: 4});
    defs.push({type: 'fc', num_neurons: neurons, activation: 'relu'});
    defs.push({type: 'fc', num_neurons: neurons, activation: 'relu'});
    defs.push({type: 'fc', num_neurons: neurons, activation: 'relu'});
    defs.push({type: 'fc', num_neurons: neurons, activation: 'relu'});
    defs.push({type: 'fc', num_neurons: neurons, activation: 'relu'});
    defs.push({type: 'regression', num_neurons: 2});

    this.net = new convnetjs.Net();
    this.net.makeLayers(defs);
    this.trainer = new convnetjs.Trainer(this.net, {method: 'sgd', learning_rate: 0.001, l2_decay: 0.001, batch_size: 1});

    this.epsilon = 1;
    this.loss = 1;
}

const depsilon = 0.0001;
function reward$1(state, action) {
    this.epsilon -=depsilon;
    let x = new convnetjs.Vol(state);
    let stats = this.trainer.train(x, action);
    this.loss = stats.loss ? stats.loss  : 1 ;
}

function decide$1(state) {
    this.epsilon +=depsilon*0.5;
    let chance = Math.random();
    return (chance < this.epsilon ) ? random() : this.conscious(state);
}

function conscious(state) {
    let x = new convnetjs.Vol(state);
    let result = this.net.forward(x);
    return [getSign$1(result.w[0]), getSign$1(result.w[1])];
}

const THRESHOLD$1= 0.1;
function getSign$1(d) {
    if (Math.abs(d)<THRESHOLD$1) return 0;
    return Math.sign(d);
}

function random() {
    return [getRandomSign(), getRandomSign()];
}

function getRandomSign() {
    return Math.sign(Math.floor(Math.random() * 3)-1);
}

function cloneFrom(other) {
    let json = other.net.toJSON();
    this.net.fromJSON(json);
}

Brain1.prototype = {
    reward: reward$1,
    decide: decide$1,
    conscious,
    cloneFrom
};

function Brain2(size = {x:20, y:20}) {

    this.frameCount = 2;
    let outputSize = size.x * size.y;
    let inputSize = outputSize * this.frameCount;

    let defs = [];
    this.size = size;
    defs.push({type:'input', out_sx:size.x, out_sy:size.y, out_depth: 2});
    defs.push({type: 'fc', num_neurons: 1000, activation:'relu'});
    defs.push({type: 'fc', num_neurons: 1000, activation:'relu'});
    //defs.push({type: 'fc', num_neurons: outputSize / 4, activation:'relu'});
    //defs.push({type: 'fc', num_neurons: 100, activation:'relu'});
    defs.push({type: 'svm', num_classes: outputSize});


    this.net = new convnetjs.Net();
    this.net.makeLayers(defs);
    this.loss = 1;
    this.trainer = new convnetjs.Trainer(this.net, {method: 'sgd', l1_decay: 0.0001, l2_decay: 0.00001, learning_rate: 0.000001, batch_size: 10});

    this.frames = [];
}

function reward$2(point) {
    if (this.frames.length<this.frameCount) return;
    let inputs = flatten(this.frames);
    let x = new convnetjs.Vol(inputs);
    let answer = point[1] * this.size.x + point[0];
    let stats = this.trainer.train(x, [answer]);
    this.loss = stats.loss;
}

function decide$2(state) {
    this.frames.push(state);
    if (this.frames.length<this.frameCount) {return random$1()}
    while (this.frames.length>3) {this.frames.shift();}
    let inputs = flatten(this.frames);
    let v = new convnetjs.Vol(inputs);
    return this.net.forward(v).w;
}

function random$1() {
    return [Math.random() * 20, Math.random() * 20]
}

function flatten(states) {
    return states.reduce((a, b) => a.concat(b), []);
}

function cloneFrom$1(other) {
    let json = other.net.toJSON();
    this.net.fromJSON(json);
}

Brain2.prototype = {
    reward: reward$2,
    decide: decide$2,
    cloneFrom: cloneFrom$1
};

exports.Universe = Universe;
exports.Point = Point;
exports.Game = Game;
exports.Grid = Grid;
exports.Map = Map;
exports.Controls = Controls;
exports.Chart = Chart;
exports.Brain = Brain;
exports.Brain1 = Brain1;
exports.Brain2 = Brain2;

Object.defineProperty(exports, '__esModule', { value: true });

})));
