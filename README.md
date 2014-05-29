Quarky 0.4.1
============

Quarky is a DOM utility designed to work with [ender](http://ender.jit.su). It aims to be small and only handle common node tasks.

```javascript
$('#foo').html("<p>I'm a new paragraph!</p>").css('color','red').addClass('bar');
```

Here's the complete API:

- css(name) : get a CSS property
- css(name,value) : set a CSS property
- css(object) : set a CSS property list
- html() : get HTML contents
- html(string) : set HTML contents
- text() : get text contents
- text(string) : set text contents
- attr(name) : get an attribute
- attr(name,value) : set an attribute
- data() : get the node's data attribute list
- data(name) : get a data attribute
- data(name,value) : set a data attribute
- data(object) : set a data attribute list
- val() : get the value
- val(string) : set the value
- append(node) : append a node to the container
- prepend(node) : prepend a node to the container
- before(node) : add a node before it
- after(node) : add a node after it
- remove() : remove the node
- parent() : get the parent node
- previous() : get the previous node
- next() : get the next node
- children() : get node's children (return a node list via `$$`)
- addClass(string) : add a class
- removeClass(string) : remove a class
- hasClass(string) : verify if the class exist for that node
- width() : get the width
- height() : get the height
- top() : get the top offset
- left() : get the left offset
- scrollTop() : get the scrollTop property
- scrollTop(value) : set the scrollTop property
- scrollLeft() : get the scrollLeft property
- scrollLeft(value) : set the scrollLeft property
- clone() : clone the node
- on(event,callback) : add one or a list of events (like `change mouseout click`); return true to propagate the event

License
-------

Quarky is published under the [MIT license](http://dreamysource.mit-license.org).
