'use strict';
import {Point} from "./point.js";

/**
 * 食物
 */
export {Food};

function Food(position = new Point()) {
    this.body = [position]; // 食物主体所在的位置，postion是一个对象，可能食物由好几个点组成
    this.isAlive = true;    // 是否新鲜
    this.age = 0;           // 新鲜程度？
}

//食物第一个身体点
function head() {
    return this.body[0];
}

function kill() {
    this.isAlive = false;
}

// 获取食物的所有cells，以对象｛点对象，食物对象｝返回
function getCells() {
    let being = this;
    return this.body.map(function (point) {
        return {point, being}
    });
}

Food.prototype = {
    head,
    kill,
    getCells,
    kind : "food"
};
