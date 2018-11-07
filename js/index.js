$(function() {
    $('#btn').on('click', () => {
        let create_width = $('#width').val(),
            create_height = $('#height').val(),
            create_text = $('#text').val();
        let obj = {
            'width': create_width || 300,
            'height': create_height || 300,
            'text': create_text,
        };
        trends = new Trends('.box', obj);
    });
})

class Trends {
    constructor(parent, depict) {
        this.width = depict.width;
        this.height = depict.height;
        this.text = depict.text;
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
                    <a class="big"></a>
                    <a class="max"></a>
                    <a class="clear">x</a>
                </div>
            </header>
            <div class="content">
                <p class="text"></p>
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
                'width': _this.width + 'px',
                'height': _this.height + 'px'
            });
            this.create_box.find('.text').html(this.text);
        }
        //点击事件
    addEven() {
            const _this = this;
            const $header_box = this.create_box.find('.header');

            //点击当前div到最上层
            this.create_box.on('mousedown', function() {
                _this.box.append(_this.create_box);
            });
            $header_box.on('mousedown', function(e) {
                _this.box.append(_this.create_box);
            });
            //阻止冒泡事件
            this.create_box.find('.header_box').on('mousedown', function(e) {
                    e.stopPropagation();
                })
                //放大事件
            this.create_box.find('.big').on('click', function(e) {
                _this.box.append(_this.create_box);
                _this.create_l = _this.create_box.position().left;
                _this.create_t = _this.create_box.position().top;
                _this.create_w = _this.create_box.width();
                _this.create_h = _this.create_box.height();
                _this.create_box.css({
                    'width': _this.box.width() - 10 + 'px',
                    'height': _this.box.height() - 10 + 'px',
                    'top': '0',
                    'left': '0',
                });

                $(this).siblings('.max').show();
                $(this).hide();
            });
            //缩小事件
            this.create_box.find('.max').on('click', function(e) {
                _this.box.append(_this.create_box);
                $('.max').hide();
                $('.big').show();
                _this.create_box.css({
                    'width': _this.create_w + 'px',
                    'height': _this.create_h + 'px',
                    'top': _this.create_t,
                    'left': _this.create_l,
                });
            })

            //合闭事件
            let count = 0;
            const content_text = this.create_box.find('.content').children();
            this.create_box.find('.small').on('click', function() {
                _this.box.append(_this.create_box);
                count++;
                if (_this.inhere_h < 300) {
                    _this.inhere_h = 300;
                }
                if (count % 2 === 0) {
                    _this.create_box.stop().animate({
                        'height': _this.inhere_h
                    }, 1000, function() {
                        content_text.show();
                    });
                } else {
                    _this.inhere_h = $(this).closest(_this.create_box).height();
                    _this.create_box.stop().animate({
                        'height': $('.header').height()
                    }, 1000, function() {
                        content_text.hide();
                    });
                }
            });
        }
        //盒子移动
    move() {
            let _this = this;
            const active = function(e) {

                e.stopPropagation();
                const $box_w = $('.box').width(),
                    $box_h = $('.box').height();

                let create_box_w = _this.create_box.width() + 10,
                    create_box_h = _this.create_box.height() + 10;

                let ox = e.clientX,
                    oy = e.clientY;
                let create_box_left = _this.create_box.position().left,
                    create_box_top = _this.create_box.position().top;

                const handle = function(e) {
                    let left = e.clientX - ox,
                        top = e.clientY - oy;
                    let to_l = create_box_left + left,
                        to_t = create_box_top + top;
                    to_t = Math.min($box_h - create_box_h, Math.max(0, to_t));
                    to_l = Math.min($box_w - create_box_w, Math.max(0, to_l));
                    _this.create_box.css({
                        'left': to_l + 'px',
                        'top': to_t + 'px',
                    })

                }
                $(document).on('mousemove', handle);
                $(document).on('mouseup', function() {
                    $(document).off('mousemove', handle);
                })
            }
            this.create_box.find('.header').on('mousedown', active);
        }
        //盒子拉伸
    drawing(name, obj) {
            let isleft = obj.isleft,
                isright = obj.isright,
                istop = obj.istop,
                isbottom = obj.isbottom;
            const minW = 300,
                minh = 300;
            const _this = this;
            let disX = 0,
                disY = 0;
            const active = function(e) {
                let box_w = _this.box.width(),
                    box_h = _this.box.height(),
                    create_w = _this.create_box.width(),
                    create_h = _this.create_box.height(),
                    create_left = _this.create_box.position().left,
                    create_top = _this.create_box.position().top;

                disX = e.clientX - $(this).position().left;
                disY = e.clientY - $(this).position().top;
                const handle = function(e) {
                    let it = e.clientY - disY,
                        il = e.clientX - disX;
                    let maxr = box_w - _this.create_box.position().left - 10,
                        maxt = box_h - _this.create_box.position().top - 10;

                    let range_right = Math.max(minW, Math.min(maxr, il)),
                        range_bottom = Math.max(minh, Math.min(maxt, it)),
                        range_left = Math.max(minW, Math.min((create_left + create_w), (create_w - il))),
                        range_top = Math.max(minh, Math.min((create_top + create_h), (create_h - it))),
                        create_l = Math.max(0, Math.min(create_left + create_w - minW, create_left + il)),
                        create_t = Math.max(0, Math.min(create_top + create_h - minh, create_top + it));

                    if (isright) {
                        _this.create_box.css({
                            'left': create_left,
                            'width': range_right,
                        });
                    }
                    if (isbottom) {
                        _this.create_box.css({
                            'top': create_top,
                            'height': range_bottom,
                        })
                    }
                    if (isleft) {
                        _this.create_box.css({
                            'left': create_l,
                            'width': range_left,
                        })
                    }
                    if (istop) {
                        _this.create_box.css({
                            'top': create_t,
                            'height': range_top,
                        })
                    }
                };

                $(document).on('mousemove', handle);
                $(document).on('mouseup', function() {
                    $(document).off('mousemove', handle);
                });
            };
            $(name).on('mousedown', active);
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
        const _this = this;
        this.create_box.find('.clear').on('click', function() {
            _this.create_box.remove();
        });
    }
}
