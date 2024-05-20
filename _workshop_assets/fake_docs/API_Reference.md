# API Reference for FancyWidget.js

## FancyWidget Constructor

### Syntax

`new FancyWidget(selector, options)`

### Parameters

- `selector`: String - CSS selector for the target DOM element.
- `options`: Object - Configurable options for the widget.

## Properties

- `version`: Static property returning the library version.

## Methods

### render()

Renders the widget on the page.

### on(event, callback)

Attaches an event listener to the widget.

- `event`: String - The event type.
- `callback`: Function - The handler function.

### animate(animationName)

Applies an animation to the widget.

- `animationName`: String - Name of the animation.

### applyStyles(styleObject)

Applies custom CSS styles.

- `styleObject`: Object - CSS styles in JavaScript object notation.

## Events

List and description of all supported events.

- `click`: Emitted when the widget is clicked.
- `hover`: Emitted when a mouse hover occurs over the widget.
- `load`: Emitted when the widget is fully loaded.