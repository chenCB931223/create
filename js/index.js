$(function() {
    var trends = new Trends();
})

class Trends {
    constructor() {
        this.box = $('.box');
        this.addEvent();

    }
    create() {
        let strDom = '<div class="create_box">' +
            '<header class="header">' +
            '<div class="header_box">' +
            '<span class="small">_</span>' +
            '<span class="big">口</span>' +
            '<span class="max">回</span>' +
            '<span class="clear">x</span>' +
            '</div>' +
            '</header>' +
            '<div class="content">' +
            '<p class="text"></p>' +
            '</div>' +
            '<footer class="footer"></footer>' +
            '<div class="left"></div>' +
            '<div class="right"></div>' +
            '<div class="top"></div>' +
            '<div class="bottom"></div>' +
            '<div class="u-l"></div>' +
            '<div class="u-r"></div>' +
            '<div class="b-l"></div>' +
            '<div class="b-r"></div>' +
            '</div>';
        this.box.append(strDom);
    }
    addEvent() {
        let _this = this;
        $('body').on('click', '#btn', function() {
            _this.create();
            _this.getSize();
            _this.move();

            //四边
            _this.drawing($('.top'), false, true, false, true);
            _this.drawing($('.left'), true, false, true, false);
            _this.drawing($('.bottom'), false, false, false, true);
            _this.drawing($('.right'), false, false, true, false);
            //四角
            _this.drawing($('.b-r'), false, false, true, true);
            _this.drawing($('.u-r'), false, true, true, true);
            _this.drawing($('.u-l'), true, true, true, true);
            _this.drawing($('.b-l'), true, false, true, true);
        });


    }
    getSize() {
        let width = $('#width').val(),
            height = $('#height').val();
        let _this = this;
        let gentle = $('.header').height() + $('.footer').height();
        $('.create_box').css({
            'width': width + 'px',
            'height': height + 'px'
        });
        $('.text').html($('#text').val());
        $('.content').css('height', $('.create_box').height() - gentle + 'px');

        $('.big').on('click', function() {
            $('.create_box').css({
                'width': _this.box.width() + 'px',
                'height': _this.box.height() + 'px',
                'top': '0',
                'left': '0'
            });
            $('.content').css('height', $('.create_box').height() - 60 + 'px');
            $('.max').show();
            $('.big').hide();
        });
        $('.max').on('click', function() {
            $('.max').hide();
            $('.big').show();
            $('.create_box').css({
                'width': width + 'px',
                'height': height + 'px',
                'top': '10px',
                'left': '10px'
            });
        })
        $('.small').on('click', function() {

            $('.content').slideToggle(200);



        });

        $('.clear').on('click', function() {
            $('.create_box').remove();
        });

    }
    move() {
        const active = function(e) {
            let $box_w = $('.box').width(),
                $box_h = $('.box').height(),
                create_box = $('.create_box');
            let create_box_w = create_box.width(),
                create_box_h = create_box.height();
                e.stopPropagation();
            let ox = e.clientX,
                oy = e.clientY;
            let create_box_left = create_box.position().left,
                create_box_top = create_box.position().top;

            const handle = function(e) {
                let left = e.clientX - ox,
                    top = e.clientY - oy;
                let to_l = create_box_left + left,
                    to_t = create_box_top + top;
                to_t = Math.min($box_h - create_box_h, Math.max(0, to_t));
                to_l = Math.min($box_w - create_box_w, Math.max(0, to_l));
                $('.create_box').css({
                    'left': to_l,
                    'top': to_t
                })

            }
            $(document).on('mousemove', handle);
            $(document).on('mouseup', function() {
                $(document).off('mousemove', handle);
            })
        }
        $('.header').on('mousedown', active);
    }
    drawing(handle, isleft, istop, lookx, looky) {
        let minW = $('#width').val(),
            minh = $('#height').val();
        let _this = this;
        let disX = 0,
            disY = 0;
        $(handle).on('mousedown', function(e) {
            let create_box = $('.create_box');
            let box_w = _this.box.width(),
                box_h = _this.box.height(),
                create_w = create_box.width(),
                create_h = create_box.height(),
                create_left = create_box.position().left,
                create_top = create_box.position().top;

            disX = e.clientX - $(this).position().left;
            disY = e.clientY - $(this).position().top;

            $(document).on('mousemove', function(e) {
                let it = e.clientY - disY,
                    il = e.clientX - disX;
                let maxw = box_w - create_box.position().left - 2,
                    maxh = box_h - create_box.position().top - 2;
                let iw = isleft ? create_w - il : $(handle).width() + il;
                let ih = istop ? create_h - it : $(handle).height() + it;

                if (isleft) {
                    create_box.css('left', create_left + il);
                }
                if (istop) {
                    create_box.css('top', it + create_top + 'px');
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
                if (lookx) {
                    create_box.css('width', iw + 'px');
                }
                if (looky) {
                    create_box.css('height', ih + 'px');
                }

                if ((isleft && iw == minW) || (istop && ih == minh)) {
                    $(document).off();
                };
            });
            $(document).on('mouseup', function() {
                $(document).off();
            });
        })

    }
}
