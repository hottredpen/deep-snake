// 宇宙外在的法则，主要为时间空间的展示（表现为ui的变化）
var pk_universe_theorem = {
    createObj : function(){
        var o_this = {};

        var config = {
            "ui_element"  : "",
            "snake_color" : "",
            "food_color"  : "",

            "size"        : {x: 20, y: 20}
        }
        const SNAKE_CODE   = 1;
        const FOOD_CODE    = 2;
        const UNKNOWN_CODE = 255;


        function encodeKind(kind) {
            if (kind==="snake") return SNAKE_CODE;
            if (kind==="food") return FOOD_CODE;
            return UNKNOWN_CODE;
        }


        function color(snake, food) {
            if (snake) this._color['snake'] = snake;
            if (food) this._color['food'] = food;
            return this;
        };

        o_this._color = {'snake': "silver", 'food': "green"};
        // 对外属性
        o_this.size     = config.size;
        o_this.pixel    = 12;
        o_this.hasFocus = false;

        // 对外方法
        o_this.init = function(userconfig){
            config = Object.assign({}, config, userconfig);
            _init_something();
        }

        o_this.draw = function (cells) {
            var blocks = o_this.svg
                .selectAll("rect")
                .data(cells, d => d.point.getHash() << 8 + encodeKind(d.being.kind) );

            blocks.enter()
                .append('rect')
                    .attr('width', o_this.pixel)
                    .attr('height', o_this.pixel)
                    .attr('x', d => d.point.x * o_this.pixel)
                    .attr('y', d => d.point.y * o_this.pixel)
                    .style('fill', d => o_this._color[d.being.kind])
                .merge(blocks)
                    .attr('class', d => d.being.kind);

            blocks.exit().remove();
        }




        // 私有方法
        function _init_something(){
            o_this.svg = d3.select(config.ui_element)
                .append('svg')
                .attr('width', o_this.size.x * o_this.pixel)
                .attr('height', o_this.size.y * o_this.pixel)
                .on("mousemove", () => {o_this.hasFocus = true;})
                .on("mouseout", () => {o_this.hasFocus = false;});
        }
        return o_this;
    },
    staticfunction:function(){
        // 类的静态方法

    }
}

