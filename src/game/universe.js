'use strict';

import {
    Snake
} from "./snake.js";

import {
    Food
} from "./food.js";

export {
    Universe
};

/**
 * 宇宙
 * @param {Snake} snk [description]
 * @param {Food}  fd  [description]
 */
function Universe(snk = new Snake(), fd = new Food()) {
    this.snake = snk;
    this.food = fd;
}

// 法则 举动
function tick(direction) {
    this.snake.move(direction);
    let head = this.snake.head()
    var others = this.getAt(head);
    others.forEach(other => this.snake.eat(other));
    this.snake.trim();
    this.food.age++;
    if (this.food.age>100) this.food.kill();
    if (!this.food.isAlive) this.food = new Food();
    return this.getCells();
}

/**
 * 获取整个宇宙场景的所有对象的celss
 * @return {[type]} [description]
 */
function getCells() {

    // concat 拼接数组
    // reduce() 方法接收一个函数作为累加器
    return [this.snake.getCells(), this.food.getCells()].reduce((acc, cur) => acc.concat(cur), [])
}

function getAt(point) {
    return point.equals(this.food.head()) ? [this.food] : []  ;
}

Universe.prototype = {
    tick,
    getCells,
    getAt
}