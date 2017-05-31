# jQuery JumboSlider Plugin

Yet another responsive slider for any kind of content.

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.svg)](http://gruntjs.com/) [![GitHub license](https://img.shields.io/badge/license-MIT-yellow.svg)](https://raw.githubusercontent.com/martinmethod/jumboslider/prod/LICENSE-MIT) [![Travis](https://img.shields.io/travis/martinmethod/jumboslider.svg)](https://travis-ci.org/martinmethod/jumboslider) [![David](https://img.shields.io/david/dev/martinmethod/jumboslider.svg)](https://david-dm.org/martinmethod/jumboslider?type=dev) [![GitHub release](https://img.shields.io/github/release/martinmethod/jumboslider.svg)](https://github.com/martinmethod/jumboslider/releases/latest) [![npm](https://img.shields.io/npm/v/jumboslider.svg)](https://www.npmjs.com/package/jumboslider) [![Bower](https://img.shields.io/bower/v/jumboslider.svg)](https://github.com/martinmethod/jumboslider)

## Description

JumboSlider is a light and responsive jQuery plugin that provides a simple way to transform any kind of content on any web page into a compact and beautiful slideshow. It's easy to setup with the given options and it's also a great module to interact with due to its methods and callback events.

## Demo

<a href="http://jumboslider.martinmetodiev.com" target="_blank">jumboslider.martinmetodiev.com</a>

## Getting Started

You can [download the plugin as an archive][zip].

[zip]: https://github.com/martinmethod/jumboslider/zipball/prod

Or you can grab it by using **npm**:

```javascript
npm install jumboslider
```

Or you can grab it by using **Bower**:

```javascript
bower install jumboslider
```

## Installation

Include the script after the jQuery library (unless you package scripts otherwise):

```html
<script src="/path/to/jumboslider.min.js"></script>
```

Also include the stylesheet for the plugin:

```html
<link type="text/css" rel="stylesheet" href="/path/to/jumboslider.min.css">
```

## Usage

### Initialization

Firstable, you need to have a proper markup:

```html
<div class="jumboslider">
    <div class="jumboslider-viewport">
        <div class="jumboslider-overview">
            <div class="jumboslider-item">
                <!-- content of your choice -->
            </div>
            <div class="jumboslider-item">
                <!-- content of your choice -->
            </div>
            <div class="jumboslider-item">
                <!-- content of your choice -->
            </div>
            <div class="jumboslider-item">
                <!-- content of your choice -->
            </div>
        </div>
    </div>
</div>
```

Now, there are two ways of initializing JumboSlider.

#### I. jQuery function

The first way is as follows:

```javascript
$.jumboslider(); // returns the target
```

This is the most basic initialization. By calling it so, the plugin will look for any element that has a "**jumboslider**" class. If no such elements, nothing will happen.

Of course, you can also provide specific target/s with a custom selector by doing so:

```javascript
$.jumboslider({
    target: $('selector')
});
```

#### II. Method function

The second way is as an object method. So, we can also use the plugin this way:

```javascript
$('selector').jumboslider(); // returns the target
```

### Options

#### target

Defines a custom target selector.

*The target property is only available when initialize JumboSlider as a jQuery function like the example below.*

```javascript
$.jumboslider({
    target: $('selector')
});
```

Default value: **$('.jumboslider')**

#### startPosition

Defines which item will be the first one to be shown.

```javascript
$.jumboslider({
    startPosition: 1
});
```

Type: **number**
Default value: **1**

#### arrows

Defines whether or not graphic arrows should be shown

```javascript
$.jumboslider({
    arrows: true
});
```

Type: **boolean**
Default value: **true**

#### pagination

Defines whether or not a pagination should be shown

```javascript
$.jumboslider({
    pagination: true
});
```

Type: **boolean**
Default value: **true**

#### transition

Defines the speed of the transition between slides (in milliseconds).

```javascript
$.jumboslider({
    transition: 200
});
```

Type: **number**
Default value: **500**

#### loop

Defines whether or not the JumboSlider should be able to start over from the first item after it reaches to the last one and also to jump back to the last item right from the first one.

```javascript
$.jumboslider({
    loop: false
});
```

Type: **boolean**
Default value: **false**

#### autoplay

Defines whether or not the JumboSlider should runs automatically by providing a lifetime duration for the slides (in milliseconds). The default duration is `0` which means the autoplay is off.

```javascript
$.jumboslider({
    autoplay: 3000
});
```

Type: **number**
Default value: **0**

### Events

There are two ways of binding JumboSlider events.

**1.** As option properties:

```javascript
$('selector').jumboslider({
    onSlide: function(e, target) {
        // do something
    }
});
```

**2.** As jQuery events:

```javascript
$('selector').jumboslider().bind('onSlide', function(e, target) {
    // do something
});
```

And here are all available events:

#### onSlide

Triggers when a slide transition is being fired.

```javascript
var slider = $('selector').jumboslider();

slider.bind('onSlide', function(e, target) {
    // do something
});
```

#### onArrowClick

Triggers when a graphic arrow controller is being used.

```javascript
var slider = $('selector').jumboslider();

slider.bind('onArrowClick', function(e, target) {
    // do something
});
```

#### onPaginationClick

Triggers when a pagination controller is being used.

```javascript
var slider = $('selector').jumboslider();

slider.bind('onPaginationClick', function(e, target) {
    // do something
});
```

### Methods

#### slideNext()

Slides to the next item (if any).

```javascript
var slider = $('selector').jumboslider();

slider.slideNext();
```

#### slidePrev()

Slides to the previous item (if any).

```javascript
var slider = $('selector').jumboslider();

slider.slidePrev();
```

#### slideTo(position)

Slides to a specific item.

```javascript
var slider = $('selector').jumboslider();

slider.slideTo(5); // will slide to the fifth item
```

## Browsers compatibility

- Apple Safari
- Google Chrome
- Microsoft Internet Explorer 9+
- Mozilla Firefox
- Opera

## Dependencies

- [jQuery][jq]

[jq]: https://github.com/jquery/jquery.git

## License

Copyright © 2017 Martin Metodiev. Licensed under the MIT license. [See here for more details.][licence]

[licence]: https://raw.github.com/martinmethod/jumboslider/prod/LICENSE-MIT