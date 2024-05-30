# Usage Guide for FancyWidget.js

## Creating Your First Widget

Initialize FancyWidget.js in your JavaScript file:

```jsx
import { FancyWidget } from 'fancywidget.js';

const options = {
    color: 'red',
    size: 'large'
};

const myWidget = new FancyWidget('#myElement', options);
myWidget.render();
```

## **Configuring Widgets**

### **Color Options**

- **`red`**
- **`blue`**
- **`green`**
- **`yellow`**

### **Size Options**

- **`small`**: 100x100 pixels
- **`medium`**: 200x200 pixels
- **`large`**: 300x300 pixels

## **Event Handling**

FancyWidget.js supports several events:

- **`click`**: Triggered when the widget is clicked.
- **`hover`**: Triggered when the mouse hovers over the widget.
- **`load`**: Triggered when the widget is fully loaded.

Example of an event listener:

```jsx
myWidget.on('click', () => {
    alert('Widget Clicked!');
});
```

## **Advanced Features**

### **Animation**

Apply animations to your widgets:

```jsx
myWidget.animate('bounce');
```

Supported animations: **`bounce`**, **`spin`**, **`fade`**.

### **Custom Styles**

Apply custom CSS styles:

```jsx
myWidget.applyStyles({
    border: '1px solid black',
    borderRadius: '5px'
});
```