'use strict';
import {
  Point
} from "./point.js"; // 点的概念

/**
 * 指令（上下左右）二维数据点阵
 */


export const DIRECTIONS = {
    UP: new Point(0, -1),
    DOWN: new Point(0, 1),
    RIGHT: new Point(1, 0),
    LEFT: new Point(-1, 0),

    // 随机指令的内部方法
    getAll: function() { 
        console.log("DIRECTIONS.getAll");
        console.log([this.UP, this.RIGHT, this.DOWN, this.LEFT]);
        return [this.UP, this.RIGHT, this.DOWN, this.LEFT]
    },

    // 随机的指令
    getRandom: function () {
        let all = this.getAll();
        let rndIndex = Math.floor((Math.random() * all.length));
        console.log("DIRECTIONS.getRandom");
        console.log(all[rndIndex]);
        return all[rndIndex];
    },

    // 有目标的指令
    getFromTo: function (point1, point2) {
        let dx = point2.x - point1.x;
        let dy = point2.y - point1.y;
        let direction = new Point(Math.sign(dx), Math.sign(dy));
        console.log("DIRECTIONS.getFromTo");
        console.log(direction);
        return direction;
    }
};