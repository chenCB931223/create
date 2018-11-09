$(function() {
    $('#btn').on('click', () => {
        let create_width = $('#width').val(),
            create_height = $('#height').val(),
            create_text = $('#text').val();
        let obj = {
            'width': create_width,
            'height': create_height,
            'text': create_text,
            'min_w': 300,
            'min_h': 300,
        };
        trends = new Trends('.box', obj);
    });
})

class Trends {
    constructor(parent, depict) {
        this.option = {
            width: 300,
            height: 300,
            min_w: 300,
            min_h: 300,
            max_w: 980,
            text: undefined,
            create_w: undefined,
            create_h: undefined,
            create_l: undefined,
            create_t: undefined,
        }
        Object.assign(this.option, depict);
        this.box = $(parent);
        this.init()
    }
    init() {
        this.create();
        this.getSize();
        this.addEven();
        this.move();
        this.setDrawing();
        this.clear();
    }
    create() {
            //创建节点
            const strDom = `<div class="create_box">
            <header class="header">
                <div class="header_box">
                    <a class="small">_</a>
                    <a class="max"></a>
                    <a class="narrow"></a>
                    <a class="clear">x</a>
                </div>
            </header>
            <div class="content">
                <p class="text">${this.option.text}</p>
            </div>
            <div class="left"></div>
            <div class="right"></div>
            <div class="top"></div>
            <div class="bottom"></div>
            <div class="u-l"></div>
            <div class="u-r"></div>
            <div class="b-l"></div>
            <div class="b-r"></div>
            </div>`;

            this.create_box = $(strDom)
            this.box.append(this.create_box);
        }
        //创建的盒子大小文字
    getSize() {
            const _this = this;
            this.create_box.css({
                'width': `${_this.option.width }px`,
                'height': `${_this.option.height }px`
            });
            this.create_box_b = parseInt(this.create_box.css('border-width')) * 2;
        }
        //点击事件
    addEven() {
            const $header_box = this.create_box.find('.header');
            //点击当前div到最上层
            this.create_box.on('mousedown', () => {
                this.box.append(this.create_box);
            });
            $header_box.on('mousedown', () => {
                this.box.append(this.create_box);
            });
            //阻止冒泡事件
            this.create_box.find('.header_box').on('mousedown', (e) => {
                e.stopPropagation();
            });
            //放大事件
            this.create_box.find('.max').on('click', () => {
                let position = this.create_box.position();
                this.box.append(this.create_box);
                this.option.create_l = position.left;
                this.option.create_t = position.top;
                this.option.create_w = this.create_box.width();
                this.option.create_h = this.create_box.height();
                this.create_box.css({
                    'width': `${this.box.width() - this.create_box_b}px`,
                    'height': `${this.box.height() - this.create_box_b}px`,
                    'top': '0',
                    'left': '0',
                });

                $('.narrow').show();
                $('.max').hide();

            });
            //缩小事件
            this.create_box.find('.narrow').on('click', () => {
                this.box.append(this.create_box);
                $('.narrow').hide();
                $('.max').show();
                this.create_box.css({
                    'width': `${this.option.create_w}px`,
                    'height': `${this.option.create_h}px`,
                    'top': `${this.option.create_t}px`,
                    'left': `${this.option.create_l}px`,
                });
            });

            //合闭事件
            const content_text = this.create_box.find('.content').children();
            let flag = true;
            this.create_box.find('.small').on('click', () => {
                this.box.append(this.create_box);
                if (flag) {
                    this.inhere_h = this.create_box.height();
                    this.create_box.stop().animate({
                        'height': $('.header').height()
                    }, 1000, () => {
                        content_text.hide();
                    });
                    flag = false;
                } else {
                    this.create_box.stop().animate({
                        'height': this.inhere_h
                    }, 1000, () => {
                        content_text.show();
                    });
                    flag = true;
                }
            });
        }
        //盒子移动
    move() {
            const active = (e) => {

                e.stopPropagation();
                const $box_w = $('.box').width(),
                    $box_h = $('.box').height();

                let create_box_w = this.create_box.width() + this.create_box_b,
                    create_box_h = this.create_box.height() + this.create_box_b;

                let ox = e.clientX,
                    oy = e.clientY;
                let position = this.create_box.position();
                let create_box_left = position.left,
                    create_box_top = position.top;

                const handle = (e) => {
                    let left = e.clientX - ox,
                        top = e.clientY - oy;
                    let to_l = create_box_left + left,
                        to_t = create_box_top + top;
                    to_t = Math.min($box_h - create_box_h, Math.max(0, to_t));
                    to_l = Math.min($box_w - create_box_w, Math.max(0, to_l));
                    this.create_box.css({
                        'left': to_l + 'px',
                        'top': to_t + 'px',
                    })

                }
                $(document).on('mousemove', handle);
                $(document).on('mouseup', () => {
                    $(document).off('mousemove', handle);
                })
            }
            this.create_box.find('.header').on('mousedown', active);
        }
        //盒子拉伸
    drawing(draw, direction) {
            const { isleft, isright, isbottom, istop } = direction;
            const _this = this;
            let disX = 0,
                disY = 0;
            const active = function(e) {
                let position = _this.create_box.position();
                let box_w = _this.box.width(),
                    box_h = _this.box.height(),
                    create_w = _this.create_box.width(),
                    create_h = _this.create_box.height(),
                    create_left = position.left,
                    create_top = position.top;

                disX = e.clientX - $(this).position().left;
                disY = e.clientY - $(this).position().top;
                const handle = (e) => {
                    let it = e.clientY - disY,
                        il = e.clientX - disX;
                    let maxr = box_w - position.left - _this.create_box_b,
                        maxt = box_h - position.top - _this.create_box_b;

                    let range_right = Math.max(_this.option.min_w, Math.min(maxr, il)),
                        range_bottom = Math.max(_this.option.min_h, Math.min(maxt, it)),
                        range_left = Math.max(_this.option.min_w, Math.min((create_left + create_w), (create_w - il))),
                        range_top = Math.max(_this.option.min_h, Math.min((create_top + create_h), (create_h - it))),
                        create_l = Math.max(0, Math.min(create_left + create_w - _this.option.min_w, create_left + il)),
                        create_t = Math.max(0, Math.min(create_top + create_h - _this.option.min_h, create_top + it));
                    if (isright) {
                        _this.create_box.css({
                            'left': create_left + 'px',
                            'width': range_right + 'px',
                        });
                    }
                    if (isbottom) {
                        _this.create_box.css({
                            'top': create_top + 'px',
                            'height': range_bottom + 'px',
                        })
                    }
                    if (isleft) {
                        _this.create_box.css({
                            'left': create_l + 'px',
                            'width': range_left + 'px',
                        })
                    }
                    if (istop) {
                        _this.create_box.css({
                            'top': create_t + 'px',
                            'height': range_top + 'px',
                        })
                    }
                };

                $(document).on('mousemove', handle);
                $(document).on('mouseup', () => {
                    $(document).off('mousemove', handle);
                });
            };
            draw.on('mousedown', active);
        }
        //调用拉伸
    setDrawing() {
            //四边  
            this.drawing(this.create_box.find('.top'), {
                isleft: false,
                istop: true,
                isright: false,
                isbottom: true,
            });
            this.drawing(this.create_box.find('.left'), {
                isleft: true,
                istop: false,
                isright: true,
                isbottom: false,
            });
            this.drawing(this.create_box.find('.bottom'), {
                isleft: false,
                istop: false,
                isright: false,
                isbottom: true,
            });
            this.drawing(this.create_box.find('.right'), {
                isleft: false,
                istop: false,
                isright: true,
                isbottom: false,
            });
            //四角
            this.drawing(this.create_box.find('.b-r'), {
                isleft: false,
                istop: false,
                isright: true,
                isbottom: true,
            });
            this.drawing(this.create_box.find('.u-r'), {
                isleft: false,
                istop: true,
                isright: true,
                isbottom: true,
            });
            this.drawing(this.create_box.find('.u-l'), {
                isleft: true,
                istop: true,
                isright: true,
                isbottom: true,
            });
            this.drawing(this.create_box.find('.b-l'), {
                isleft: true,
                istop: false,
                isright: true,
                isbottom: true,
            });
        }
        //清除当前盒子
    clear() {
        this.create_box.find('.clear').on('click', () => {
            this.create_box.remove();
        });
    }
}
