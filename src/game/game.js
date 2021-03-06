'use strict';

import {
    Universe
} from "./universe.js";

import {
    Snake
} from "./snake.js";

import {
    Food
} from "./food.js";

import {
    Point
} from "./point.js";

import {
    DIRECTIONS
} from "./directions.js";

export {Game};

function Game(size = new Point(20, 20), universe =  new Universe()) {
    this.size = size; // 单个点的大小
    Point.prototype.size = size;
    this.universe = universe;
    this.directions = DIRECTIONS.getAll(); // 可用的方向
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

// 游戏做出举动
function tick(input, draw = () => {}) {
    let direction = new Point(input[0], input[1]);// 玩家，AI的抉择（方向）
    let cells = this.universe.tick(direction);  // 此处包含了蛇的法则，和 其他法则
    draw(cells);
}

function score() {
    return this.universe.snake.score;
}

// 理想抉择（人工算法）
function hint() {
    var direction = DIRECTIONS.getFromTo(this.universe.snake.head(), this.universe.food.head());
    return [direction.x, direction.y];
}

const SNAKE_CODE = 100;
const FOOD_CODE = -100;
const UNKNOWN_CODE = 0;


function encodeKind(being) {
    if (Snake.prototype.isPrototypeOf(being)) return SNAKE_CODE;
    if (Food.prototype.isPrototypeOf(being)) return FOOD_CODE;
    return UNKNOWN_CODE;
}

Game.prototype = {
    tick,
    score,
    hint,
    state,
    state2
}