'use strict';

/**
 * 点（二维坐标点）
 */

export {Point};

function Point(x = this.rnd(this.size.x), y = this.rnd(this.size.y)) {
    this.x = x;
    this.y = y;
}

/**
 * 是否与另一个点相同
 * @param  {[type]} other [description]
 * @return {[type]}       [description]
 */
function equals(other) {
    if (!other) return;
    return other.x === this.x && other.y === this.y;
}

/**
 * 获取该点的hash
 * @param  {[type]} size [description]
 * @return {[type]}      [description]
 */
function getHash(size = this.size) {
    return this.x + this.y * size.x;
}

/**
 * 如果不存在指定点，直接返回当前点
 * 存在则，在当前点的基础上继续点的偏移
 * 用在蛇移动上
 * @param {[type]} point [description]
 */
function add(point) {
    if (!point) {
        return this;
    }
    return new Point(this.x + point.x, this.y + point.y).overflow();
}
/**
 * 减偏移坐标
 * @param  {[type]} other [description]
 * @return {[type]}       [description]
 */
function distance(other) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
}

/**
 * 点的位置超过点大小的边缘中心点
 * @param  {[type]} size [description]
 * @return {[type]}      [description]
 */
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
}

