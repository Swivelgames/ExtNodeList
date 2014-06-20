ExtNodeList
===========
*NOTICE: For non-minified, development version, checkout the `develop` branch. Those looking to simply drop this in their implementations can simply grab the `master` branch instead.*

A simple prototype for creating referenced lists of nodes. This utility is meant to emulate, as best as possible, standard JavaScript methods that are available on DOM elements, but not NodeLists. Most notably, this utility emulates the querySelectorAll method, allowing a developer to search within the NodeList for specific nodes, which is currently unavialable on NodeLists.

This utility effectively allows a developer to create, maintain, combine, add to, and remove from a NodeList (ExtNodeList, rather) for easy management of a list of DOM _reference_, as opposed to removing elements from their current position in the DOM.

The ExtNodeList prototype is created using the Array.prototype as a starting point. Because of this, ExtNodeLists act like Arrays with extra methods. The benefit of this is having the ability to continue to use methods like `length` to automagically populate based on the number of nodes or elements the ExtNodeList contains on its initial dimension.

```javascript
var $document = new ExtNodeList(document.documentElement.childNodes);

$document.length; // Usually produces "2", for <head> and <body> elements
```

ExtNodeList is created using `Object.create`, and utilizes the `configurable`, `enumerable`, and `writable` flags as it should. However, this does not mean that it is incompatable with legacy browsers, like IE8. See **Compatibility**

## Getting Started

The ExtNodeList utility is very simple to use. It is designed to stay out of the way of other native and third party utilities and prototype objects, so that it can easily slip in to any project.

To get started, simply include the `extnodelist(.min).js` file using a `<script>` tag.

```html
<script src="extnodelist.js"></script>
```

There are no special settings needed to configure ExtNodeList to get it running.

## Usage

Using ExtNodeList is incredibly easy as well. Simply instantiating a new ExtNodeList, optionally providing an existing NodeList that you would like to enhance, will allow you to start utilizing the methods available to you.

```javascript
var myNodeList = new ExtNodeList(
    document.querySelectorAll("mySelectorQuery")
);
```

## Methods

You can use this section to reference the methods provided by this utility.

For context, the markup below will serve as the overall markup used in the examples provided

```html
<html>
    <head>
        <script src="extnodelist.js"></script>
    </head>
    <body>
        <ul class="foo">
            <li class="foo bar">Hello World</li>
        </ul>
        <ul class="lonely">
            
        </ul>
    </body>
</html>
```

### Array-like Methods

Because `ExtNodeList` employs `Array.prototype` as its starting point, all Array methods and properties can be used and accessed by a `ExtNodeList`. This includes, but is not limited to:

* ExtNodeList.prototype.**indexOf**()
* ExtNodeList.prototype.**pop**()
* ExtNodeList.prototype.**push**()
* ExtNodeList.prototype.**splice**()
* ExtNodeList.prototype.**sort**()

### Searching Elements: querySelectorAll( *selector* )

The `querySelectorAll` method searches the ExtNodeList's nodes and elements and their children using the selector provided.

```javascript
var body = document.querySelectorAll("body"),
    $body = new ExtNodeList(body),
    
    $foos = $body.querySelectorAll(".foo"),
    $bars = $foos.querySelectorAll(".bar");

console.log($foos);
console.log($bars);
```

#### Console Output
```css
[ ul.foo, li.foo.bar ]

[ li.foo.bar ]
```

### Cloning Elements: clone( )
The `clone` method returns a ExtNodeList containing a clone of all contained nodes in the current list.

The example below piggy backs on the example for `ExtNodeList.querySelectorAll()` above.

```javascript
var $newLis = $bars.clone();

console.log($newLis);
```

#### Console Output
```css
[ li.foo.bar ]
```

### Appending All Elements: appendTo( *node* )
A decent portion of the time, when we get a list of nodes we want to move them; the rest of the times we're probably access properties or contents, or searching them further. The `appendTo()` method allows you to append each node contained within the ExtNodeList to the specified node.

In the example below, we're continuing the context of the `ExtNodeList.clone()` example above, but this works with any ExtNodeList, not just ones that contain cloned nodes.

#### Previous HTML
```html
<ul class="foo">
    <li class="foo bar">Hello World</li>
</ul>
<ul class="lonely">

</ul>
```

#### Executed JavaScript
```javascript
var lonely = $body.querySelectorAll(".lonely")[0];

$newLis.appendTo(lonely);
```

#### Resulting HTML
```html
<ul class="foo">
    <li class="foo bar">Hello World</li>
</ul>
<ul class="lonely">
    <li class="foo bar">Hello World</li>
</ul>
```

### Combining ExtNodeLists: concat( ExtNodeList1 *[, ..., ExtNodeListN]* )
Combining ExtNodeLists is quite simple, actually. Much like `Array.prototype.concat`, this method returns the resulting ExtNodeList, rather than affecting the ExtNodeList for which the method is called.

The example below uses the **Resulting HTML** from the example for `appendTo()` above.

```javascript
var $foofoo = $body.querySelectorAll(".foo .foo.bar"),
    $lonelyfoo = $body.querySelectorAll(".lonely .foo.bar"),
    $combined = $foofoo.concat($lonelyfoo);

console.log($foofoo);
console.log($lonelyfoo);
console.log($combined);
```

#### Console Output
```css
[ ul.foo > li.foo.bar ]
[ ul.lonely > li.foo.bar ]
[ ul.foo > li.foo.bar, ul.lonely > li.foo.bar ]
```

## Extra Goodies
To maintain a "parent" or "master" ExtNodeList for speedy and convenience, you can use the small piece of code below:
#### Code
```html
        <script>
            (function(window){
            	var docNodes = new ExtNodeList(document.documentElement.childNodes);
            
            	window['$'] = function(){
            		return docNodes.querySelectorAll.apply(docNodes,arguments);
            	};
            })(window);
        </script>
    </body>
</html>
```
#### Usage
```javascript
var $fooULs = $('ul.foo'),
    $fooLIs = $fooULs.querySelectorAll('li'),
    $barInFoo = $('.foo').querySelectorAll('.bar'),
    $lonelyLIs = $('ul.lonely li.foo.bar');
```
Please note the contextual location this example illustrates, however. This script must be included after all `Renderable Elements` toward the end of the `<body>` tag, to ensure the proper elements are captured by the initial querySelectorAll call.

## Compatibility
The ES5 Polyfill library maintained on Github by Swivelgames can easily be employed to allow for comptability with some older browsers (like IE8), in the event the browser supported does not implement Object.create.

However, please understand the small readme provided with the ES5 Polyfill by Swivelgames. If you're writing code that requires IE8 compatibility, you must remember to heavily use `hasOwnProperty` when using `for...in` loops, to prevent the loop from grabbing one of the methods and treating it as an enumerable element.
