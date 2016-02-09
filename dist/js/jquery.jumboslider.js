/*!
 jQuery JumboSlider Plugin v1.1.4
 http://jumboslider.martinmetodiev.com

 Copyright (c) 2015 Martin Metodiev
 Licensed under the MIT license.
 */


;(function($) {

    'use strict';

// Define all plugin components
    var plugin = {
        // Base plugin data
        base: {
            // Default target selector if no such provided
            target: $('.jumboslider'),

            // List of all supported options with their default values
            options: {
                startPosition: 1,
                arrows: true,
                pagination: true,
                loop: false,
                keyboard: true,
                keyboardFocus: false // requires "keyboard" property to be true
                // auto: false,
                // autoDuration: 3000
            }
        },

        events: [
            'onSlide',          // e, data
            'onArrowClick',     // e, data
            'onPaginationClick' // e, data
        ],

        dom: {
            arrows: $('\
                <div class="jumboslider-arrows">\
                    <a href="javascript:;" class="jumboslider-prev-arrow"></a>\
                    <a href="javascript:;" class="jumboslider-next-arrow"></a>\
                </div>\
            '),
            pagination: {
                block: $('<div class="jumboslider-pagination"><div class="holder"></div>'),
                dot: $('\
                    <a href="javascript:;">\
                        <svg version="1.1" class="jumboslider-pagination-mask" \
                        xmlns="http://www.w3.org/2000/svg" \
                        xmlns:xlink="http://www.w3.org/1999/xlink" \
                        x="0px" y="0px" viewBox="0 0 88 64" \
                        style="enable-background:new 0 0 88 64;" xml:space="preserve">\
                            <path fill="white" d="M0,0v64h88V0H0z M44,58c-14.3, \
                            0-26-11.6-26-26S29.7,6,44,6s26,11.6,26,26S58.3,58,44,58z"/>\
                        </svg>\
                    </a>\
                '),
                current: $('<span class="jumboslider-pagination-current">')
            }
        },

        setup: {
            target: function(params) {
                var target = params && params.hasOwnProperty('target') ?
                    params.target : plugin.base.target;

                if (!target.is('.jumboslider')) { target.addClass('jumboslider'); }

                return target;
            },

            options: function(params) {
                var options = {},
                    events = {};

                (function() {
                    for (var option in plugin.base.options) {
                        if (plugin.base.options.hasOwnProperty(option)) {
                            options[option] = params && params.hasOwnProperty(option) ?
                                params[option] : plugin.base.options[option];
                        }
                    }
                }());

                (function() {
                    for (var event = 0; event < plugin.events.length; event++) {
                        if (params && params.hasOwnProperty(plugin.events[event])) {
                            events[plugin.events[event]] = params[plugin.events[event]];
                        }
                    }
                }());

                $.extend(options, {events: events});

                return options;
            }
        },

        methods: {
            init: function(params) {
                var obj = this;

                // Attach options
                obj.options = plugin.setup.options(params);

                // Define objects
                obj.viewport = obj.find('.jumboslider-viewport');
                obj.overview = obj.find('.jumboslider-overview');
                obj.items = obj.find('.jumboslider-item');

                // Define states
                obj.sliding = false;
                obj.currentPosition = obj.options.startPosition;
                obj.currentItem = $(obj.items[obj.currentPosition-1]);

                // Setup controllers
                obj.setControllers();

                // Set initial width and position
                obj.setWidth()
                    .setPosition(obj.options.startPosition, 'force');

                // Focus the object when the cursor enters or clicks its area
                obj.items.bind('mouseenter click', function() { obj.setKeyboard(); });

                // Bind provided events
                for (var event in obj.options.events) {
                    if (obj.options.events.hasOwnProperty(event)) {
                        obj.bind(event, obj.options.events[event]);
                    }
                }

                // Bind window resize event to update jumboslides position & fluid width
                $(window).bind('resize', function() {
                    obj.setWidth()
                        .setPosition(obj.currentPosition, 'force');
                });

                obj.overview.bind(
                    'webkitTransitionEnd ' +
                    'otransitionend ' +
                    'oTransitionEnd ' +
                    'msTransitionEnd ' +
                    'transitionend',

                    function() {
                        obj.onSlideEnd();
                    }
                );

                return obj.addClass('jumboslider-ready');
            },

            onSlideEnd: function() {
                var obj = this;

                obj.sliding = false;

                if (obj.options.keyboard && obj.items.length > 1) {
                    obj.setKeyboard();
                }

                return obj;
            },

            setControllers: function() {
                var obj = this;

                // Keyboard arrows (if active)
                if (obj.options.keyboard) {
                    // Set forced focus (if required)
                    if (obj.options.keyboardFocus) { obj.setKeyboard(); }
                }

                // Arrows (if active)
                if (obj.options.arrows && obj.items.length > 1) {
                    obj.createArrows().init();
                }

                // Pagination (if active)
                if (obj.options.pagination && obj.items.length > 1) {
                    obj.createPagination().init();
                }

                return obj;
            },

            calculatePosition: function(direction) {
                var obj = this, pos, elseValue;

                function getElse(direction) {
                    return obj.options.loop ? direction :
                        obj.currentPosition;
                }

                switch(direction) {
                    case 'prev':
                        elseValue = getElse(obj.items.length);
                        pos = obj.currentPosition - 1 >= 1 ?
                        obj.currentPosition - 1 : elseValue;
                        break;

                    case 'next':
                        elseValue = getElse(1);
                        pos = obj.currentPosition + 1 <= obj.items.length ?
                        obj.currentPosition + 1 : elseValue;
                        break;
                }

                return pos;
            },

            setKeyboard: function() {
                var obj = this,
                    item = obj.currentItem ? obj.currentItem : $(obj.items[0]);

                function action(e) {
                    var direction;

                    switch(e.keyCode) {
                        case 37: direction = 'prev'; break;
                        case 39: direction = 'next'; break;
                    }

                    obj.setPosition( obj.calculatePosition(direction) );
                }

                if (!item.is('.jumboslider-focused')) {
                    item.attr('tabindex', '1')
                        .focus()
                        .addClass('jumboslider-focused');

                    item.bind('keyup', action);

                    item.bind('blur', function() {
                        item.unbind('keyup', action)
                            .removeAttr('tabindex')
                            .removeClass('jumboslider-focused');
                    });
                }

                return obj;
            },

            setWidth: function() {
                this.overview.width(((this.items.length + 1) * this.width()) - 1);
                this.items.width(this.width());

                return this;
            },

            setPosition: function(pos, force) {
                var obj = this,
                    validPos = !isNaN(pos) && pos > 0 && pos <= obj.items.length,
                    left = 0,

                    position = {
                        update: function() {
                            obj.previousPosition = obj.currentPosition || null;
                            obj.currentPosition = validPos ? pos : obj.previousPosition;

                            obj.currentItem = $(obj.items[obj.currentPosition-1]);

                            left = obj.currentItem.position().left;
                            left = left === 0 ? 0 : '-' + left + 'px';

                            return this;
                        },

                        checkForce: function() {
                            if (force) { obj.addClass('force'); }
                            else { obj.removeClass('force'); }

                            return this;
                        },

                        transit: function(target, pos, force) {
                            obj.transit(target, pos, force);

                            return this;
                        },

                        controllers: function() {
                            if (obj.options.pagination && obj.items.length > 1) {
                                obj.pagination.update();
                            }
                            if (obj.options.arrows && obj.items.length > 1) {
                                obj.arrows.update();
                            }

                            return this;
                        }
                    };

                if (!obj.sliding) {
                    position.update()
                        .checkForce()
                        .transit(obj.overview, left, force)
                        .controllers();

                    if (obj.previousPosition !== obj.currentPosition) {
                        obj.trigger('onSlide', [obj]);
                    }
                }

                return obj;
            },

            createArrows: function() {
                var obj = this,
                    arrows = obj.arrows = plugin.dom.arrows.clone();

                $.extend(arrows, {
                    init: function() {
                        var arrows = this;
                        arrows.arrow = arrows.find('a');
                        arrows.arrowPrev = arrows.find('.jumboslider-prev-arrow');
                        arrows.arrowNext = arrows.find('.jumboslider-next-arrow');

                        arrows.appendTo(obj);
                        arrows.update();
                        arrows.css({opacity: 1});

                        arrows.arrow.bind('click', function(/*e*/) {
                            var newPos;

                            if ($(this).is('.jumboslider-next-arrow')) {
                                newPos = obj.calculatePosition('next');
                            }
                            else if ($(this).is('.jumboslider-prev-arrow')) {
                                newPos = obj.calculatePosition('prev');
                            }

                            obj.trigger('onArrowClick', [obj]);

                            obj.setPosition(newPos);
                        });

                        obj.addClass('jumboslider-arrowed');

                        return arrows;
                    },

                    update: function() {
                        var pos = obj.currentPosition;

                        obj.arrows.arrow.removeClass('hidden-arrow');

                        if (!obj.options.loop) {
                            if (pos === 1) {
                                this.arrowPrev.addClass('hidden-arrow');
                            }
                            else if (pos === obj.items.length) {
                                this.arrowNext.addClass('hidden-arrow');
                            }
                        }

                        return this;
                    }
                });

                return arrows;
            },

            createPagination: function() {
                var obj = this,
                    pagination = obj.pagination = plugin.dom.pagination.block.clone();

                $.extend(pagination, {
                    init: function() {
                        var pagination = this,
                            current = plugin.dom.pagination.current.clone();

                        for (var i = 0; i < obj.items.length; i++) {
                            var dot = plugin.dom.pagination.dot.clone();
                            dot.attr('rel', i+1);
                            pagination.find('.holder').append(dot);
                        }
                        pagination.find('.holder').append(current);

                        pagination.dots = pagination.find('a');
                        pagination.current = current;

                        pagination.appendTo(obj);
                        pagination.update();
                        pagination.css({opacity: 1});

                        pagination.dots.bind('click', function(/*e*/) {
                            if (!$(this).is('.current')) {
                                var newPos = parseInt($(this).attr('rel'));

                                obj.trigger('onPaginationClick', [obj]);

                                obj.setPosition(newPos);
                            }
                        });

                        obj.addClass('jumboslider-paginated');

                        return pagination;
                    },

                    update: function() {
                        obj.pagination.dots.removeClass('current');
                        obj.currentPosition = obj.currentPosition || 1;
                        var currentDot = $(obj.pagination.dots[obj.currentPosition - 1]);

                        obj.transit(pagination.current, currentDot.position().left - 1);
                        currentDot.addClass('current');
                        return this;
                    }
                });

                return pagination;
            },

            transit: function(target, pos, force) {
                var obj = this;

                if (navigator.appVersion.indexOf('MSIE 9.') !== -1) {
                    target.animate({ left: pos }, 500, function() {
                        target.onSlideEnd();
                    });
                }
                else {
                    target.css({left: pos});
                }

                if (target.is('.jumboslider-overview')) {
                    obj.sliding = true;

                    if (force) {
                        obj.sliding = false;
                    }
                }

                return obj;
            }
        },

        output: {
            extended: true,

            slideNext: function() {
                this.each(function() {
                    var obj = this.jumboslider;

                    obj.setPosition( obj.calculatePosition('next') );
                });

                return this;
            },

            slidePrev: function() {
                this.each(function() {
                    var obj = this.jumboslider;

                    obj.setPosition( obj.calculatePosition('prev') );
                });

                return this;
            },

            slideTo: function(pos, force) {
                this.each(function() {
                    var obj = this.jumboslider;

                    if (pos !== obj.currentPosition && pos <= obj.items.length) {
                        obj.setPosition(pos, force);
                    }
                });

                return this;
            },

            destroy: function() {
                this.each(function() {
                    var obj = this.jumboslider;

                    (function() {
                        if (obj.options.arrows) {
                            obj.removeClass('jumboslider-arrowed');
                            obj.arrows.remove();
                        }

                        if (obj.options.pagination) {
                            obj.removeClass('jumboslider-paginated');
                            obj.pagination.remove();
                        }

                        obj.overview.removeAttr('style');
                        obj.items.removeAttr('style');

                        obj.removeClass('jumboslider-ready force');

                        obj.unbind('keyup');
                        obj.unbind('blur');
                    })();

                    // Unbind provided events
                    for (var event in obj.options) {
                        obj.unbind(event, obj.options[event]);
                    }

                    // Delete object from the targets' list
                    for (var i = 0; i < $.jumboslider.targets.length; i++) {
                        if (this === $.jumboslider.targets[i][0]) {
                            $.jumboslider.targets.splice(i, 1);
                            break;
                        }
                    }

                    // Delete jumboslider object
                    delete this.jumboslider;
                });

                // Delete output properties
                for (var property in plugin.output) {
                    if (this.hasOwnProperty[plugin.output[property]]) {
                        delete this[plugin.output[property]];
                    }
                }

                return this;
            }
        }
    };

// Define plugin as a jQuery function
    $.jumboslider = function(params) {
        // Setup target
        var target = plugin.setup.target(params);

        // Create a jQuery Object Instance (extended with jumboslider) inside the DOM object
        target.each(function() {
            if (!this.jumboslider) {
                $.extend(this, {
                    jumboslider: $.extend($(this), plugin.methods)
                });

                var jumboslider = this.jumboslider;

                $.jumboslider.targets.push(jumboslider.init(params));
            }
        });

        // Extend target with public methods (if not yet)
        if (!target.extended) { $.extend(target, plugin.output); }

        return target;
    };

// Define plugin as a method function
    $.fn.jumboslider = function(params) {
        params = $.extend({}, params, {target: $(this)});

        return $.jumboslider(params);
    };

// Create public storage array with all DOM elements that are active targets of the plugin
    $.jumboslider.targets = [];

}(jQuery));