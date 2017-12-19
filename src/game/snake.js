'use strict';
import {DIRECTIONS} from "./directions.js";
import {Point} from "./point.js";


/**
 * 贪吃蛇
 */
export {Snake};

function Snake(position = new Point()) {
    this.body = [position];// 贪吃蛇主体所在的位置，postion是一个对象，可能贪吃蛇由好几个点组成
    this.length = this.initLength;
    this.isAlive = true;
    this.score = 0;

    // 初始一个随机的指令，开始时，蛇是一个点
    let direction = DIRECTIONS.getRandom();
    while (this.length < this.body.length) {
        this.move(direction);
    }
    return this;
}

/**
 * 贪吃蛇第一个身体点
 * @return {[type]} [description]
 */
function head() {
    return this.body[0];
}

/**
 * 移动
 * 进行偏移
 * 蛇的body进行
 * @param  {[type]} direction [description]
 * @return {[type]}           [description]
 */
function move(direction) {
    let head = this.body[0].add(direction);
    this.body.unshift(head);
    return this;
}
/**
 * 获得食物时增加分数
 * @return {[type]} [description]
 */
function grow() {
    this.score++;
    if (this.length<this.maxLength) this.length++;
    return this;
}

/**
 * 迟到食物
 * @param  {[type]} food [description]
 * @return {[type]}      [description]
 */
function eat(food) {
    food.kill();
    return this.grow();
}

/**
 * 尾部多余部分删除
 * @return {[type]} [description]
 */
function trim() {
    while (this.body.length > this.length) {
        this.body.pop();
    }
    return this;
}

function kill() {
    this.isAlive = false;
}
// 获取贪吃蛇的所有cells，以对象｛点对象，食物对象｝返回
function getCells() {
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
    getCells,
    initLength: 3,
    maxLength: 3,
    kind: "snake"
};
