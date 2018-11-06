$(function() {
    let create_width = $('#width').val(),
        create_height = $('#height').val(),
        create_text = $('#text').val();
    let obj = {
        'width': create_width,
        'height': create_height,
        'text': create_text,
    };
    let box = $('.box');
    $('#btn').on('click', () => {
        trends = new Trends(box, obj);
    });
})

class Trends {
    constructor(parent, depict) {
        this.width = depict.width;
        this.height = depict.height;
        this.text = depict.text;
        this.box = $(parent);
        this.grounp = [];
        this.index = 0;
        this.init()
    }
    init() {
        this.create();
        this.getGrounp();
        this.getSize();
        this.clear();
    }
    create() {
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
        this.box.append(strDom);
        console.log(this);
    }
    getGrounp() {
        const _this = this;
        this.create_box = $('.create_box');
        this.grounp.length = 0;
        this.create_box.each(function() {
            _this.grounp.push(this);

            _this.getTheIndex(this);
            _this.move(this);
            //四边  
            _this.drawing(this, $(this).find('.top'), {
                isleft: false,
                istop: true,
                isright: false,
                isbottom: true,
            });
            _this.drawing(this, $(this).find('.left'), {
                isleft: true,
                istop: false,
                isright: true,
                isbottom: false,
            });
            _this.drawing(this, $(this).find('.bottom'), {
                isleft: false,
                istop: false,
                isright: false,
                isbottom: true,
            });
            _this.drawing(this, $(this).find('.right'), {
                isleft: false,
                istop: false,
                isright: true,
                isbottom: false,
            });
            //四角
            _this.drawing(this, $(this).find('.b-r'), {
                isleft: false,
                istop: false,
                isright: true,
                isbottom: true,
            });
            _this.drawing(this, $(this).find('.u-r'), {
                isleft: false,
                istop: true,
                isright: true,
                isbottom: true,
            });
            _this.drawing(this, $(this).find('.u-l'), {
                isleft: true,
                istop: true,
                isright: true,
                isbottom: true,
            });
            _this.drawing(this, $(this).find('.b-l'), {
                isleft: true,
                istop: false,
                isright: true,
                isbottom: true,
            });

        });
    }
    getTheIndex(box) {
        let _this = this;
        $(box).on('mousedown', function() {
            _this.index++;
            $(box).css('z-index', _this.index);
        });
    }
    getSize() {
        const _this = this;
        let len = this.grounp.length;
        const create_box = $('.create_box');
        const casket = $(this.grounp[len - 1]);

        casket.css({
            'width': this.width + 'px',
            'height': this.height + 'px'
        });
        casket.find('.text').html(this.text);
        this.create_box.find('.big').on('click', function() {
            let max_l = $(this).closest(create_box).width(),
                max_t = $(this).closest(create_box).height();
            console.log(max_l, max_t);
            $(this).closest(create_box).css({
                'width': _this.box.width() - 10 + 'px',
                'height': _this.box.height() - 10 + 'px',
                'top': '0',
                'left': '0'
            });

            $(this).siblings('.max').show();
            $(this).hide();
        });
        this.create_box.find('.max').on('click', function() {
            $('.max').hide();
            $('.big').show();

            $(this).closest(create_box).css({
                'width': width + 'px',
                'height': height + 'px',
                'top': '10px',
                'left': '10px',
            });
        })
        let count = 0;

        this.create_box.find('.small').on('click', function() {
            count++;
            if (count % 2 === 0) {
                $(this).closest(create_box).css({
                    'height': _this.inhere_h
                })
            } else {
                _this.inhere_h = $(this).closest(create_box).height();
                $(this).closest(create_box).css({
                    'height': $('.header').height()
                })

            }
        });

    }
    move(parent) {
        const active = function(e) {
            e.stopPropagation();
            const $box_w = $('.box').width(),
                $box_h = $('.box').height();
            let create_box_w = $(parent).width() + 10,
                create_box_h = $(parent).height() + 10;

            let ox = e.clientX,
                oy = e.clientY;
            let create_box_left = $(parent).position().left,
                create_box_top = $(parent).position().top;

            const handle = function(e) {
                let left = e.clientX - ox,
                    top = e.clientY - oy;
                let to_l = create_box_left + left,
                    to_t = create_box_top + top;
                to_t = Math.min($box_h - create_box_h, Math.max(0, to_t));
                to_l = Math.min($box_w - create_box_w, Math.max(0, to_l));
                $(parent).css({
                    'left': to_l + 'px',
                    'top': to_t + 'px',
                })

            }
            $(document).on('mousemove', handle);
            $(document).on('mouseup', function() {
                $(document).off('mousemove', handle);
            })
        }
        $(parent).find('.header').on('mousedown', active);
    }
    drawing(parent, name, obj) {
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
                create_w = $(parent).width(),
                create_h = $(parent).height(),
                create_left = $(parent).position().left,
                create_top = $(parent).position().top;

            disX = e.clientX - $(this).position().left;
            disY = e.clientY - $(this).position().top;
            const handle = function(e) {
                let it = e.clientY - disY,
                    il = e.clientX - disX;
                let maxr = box_w - $(parent).position().left - 10,
                    maxt = box_h - $(parent).position().top - 10;

                let range_right = Math.max(minW, Math.min(maxr, il)),
                    range_bottom = Math.max(minh, Math.min(maxt, it)),
                    range_left = Math.max(minW, Math.min((create_left + create_w), (create_w - il))),
                    range_top = Math.max(minh, Math.min((create_top + create_h), (create_h - it))),
                    create_l = Math.max(0, Math.min(create_left, create_left + il)),
                    create_t = Math.max(0, Math.min(create_top, create_top + it));

                if (isright) {
                    $(parent).css({
                        'left': create_left,
                        'width': range_right,
                    });
                }
                if (isbottom) {
                    $(parent).css({
                        'top': create_top,
                        'height': range_bottom,
                    })
                }
                if (isleft) {
                    $(parent).css({
                        'left': create_l,
                        'width': range_left,
                    })
                }
                if (istop) {
                    $(parent).css({
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
    clear() {
        this.create_box.find('.clear').on('click', function() {
            $(this).closest($('.create_box')).remove();
        });
    }
}
