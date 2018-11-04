$(function() {
    var trends = new Trends($('.box'));
})

class Trends {
    constructor(parent) {
        this.box = $(parent);
        this.grounp = [];
        this.index = 0;
        this.addEvent()
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
    }
    addEvent() {
        const _this = this;
        $('body').on('click', '#btn', function() {
            _this.create();

            _this.getGrounp();
            _this.getSize();

        });
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
            _this.drawing(this, $(this).find('.top'), false, true, false, true);
            _this.drawing(this, $(this).find('.left'), true, false, true, false);
            _this.drawing(this, $(this).find('.bottom'), false, false, false, true);
            _this.drawing(this, $(this).find('.right'), false, false, true, false);
            //四角
            _this.drawing(this, $(this).find('.b-r'), false, false, true, true);
            _this.drawing(this, $(this).find('.u-r'), false, true, true, true);
            _this.drawing(this, $(this).find('.u-l'), true, true, true, true);
            _this.drawing(this, $(this).find('.b-l'), true, false, true, true);

        });
    }
    getTheIndex(box) {
        let _this = this;
        $(box).on('click', function() {
            _this.index++;
            $(box).attr('z-index', _this.index);
        });
    }
    getSize() {
        const _this = this;
        let len = this.grounp.length;
        const width = $('#width').val(),
            height = $('#height').val(),
            create_box = $('.create_box');
        const casket = $(this.grounp[len - 1]);

        casket.css({
            'width': width + 'px',
            'height': height + 'px'
        });

        casket.find('.text').html($('#text').val());
        this.create_box.find('.big').on('click', function() {

            $(this).closest(create_box).css({
                'width': _this.box.width() + 'px',
                'height': _this.box.height() + 'px',
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

        this.create_box.find('.clear').on('click', function() {
            $(this).closest(create_box).remove();
        });

    }
    move(parent) {
        const active = function(e) {
            e.stopPropagation();
            const $box_w = $('.box').width(),
                $box_h = $('.box').height();
            let create_box_w = $(parent).width(),
                create_box_h = $(parent).height();

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
                    'left': to_l,
                    'top': to_t
                })

            }
            $(document).on('mousemove', handle);
            $(document).on('mouseup', function() {
                $(document).off('mousemove', handle);
            })
        }
        $(parent).find('.header').on('mousedown', active);
    }
    drawing(parent, name, isleft, istop, isright, isbottom) {

        const minW = 200,
            minh = 200;
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
                let maxw = box_w - $(parent).position().left - 2,
                    maxh = box_h - $(parent).position().top - 2;
                let iw = isleft ? create_w - il : $(name).width() + il;
                let ih = istop ? create_h - it : $(name).height() + it;

                if (isleft) {
                    $(parent).css('left', create_left + il);
                }
                if (istop) {
                    $(parent).css('top', it + create_top + 'px');
                }

                if (iw < minW) {
                    iw = minW;
                } else if (iw > maxw) {
                    iw = maxw
                }
                if (ih < minh) {
                    ih = minh;
                } else if (ih > maxh) {
                    ih = maxh;
                }
                if (isright) {
                    $(parent).css('width', iw + 'px');
                }
                if (isbottom) {
                    $(parent).css('height', ih + 'px');
                }
                if ((isleft && iw == minW) || (istop && ih == minh)) {
                    $(document).off('mousemove', handle);
                    $(document).off('mousedown', active);

                };
            };

            $(document).on('mousemove', handle);
            $(document).on('mouseup', function() {
                $(document).off('mousemove', handle);
            });
        };
        $(name).on('mousedown', active);

    }
}
