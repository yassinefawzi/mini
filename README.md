# Mini JavaScript Framework Documentation

## Overview

This is a lightweight JavaScript framework for building single-page applications (SPAs) with a virtual DOM, state management, and routing capabilities.

## Core Concepts

- **Virtual DOM**: A lightweight representation of the actual DOM for efficient updates
- **State Management**: Global state with reactive updates
- **Routing**: Hash-based routing system
- **Components**: Functions that return virtual DOM nodes

## Installation

No installation required - just import the modules in your JavaScript files.

## API Reference

### DOM Module (`dom.js`)

#### `getCurrentVDOM()`
Returns the current virtual DOM tree.

**Returns**: `Object` - The current virtual DOM

#### `setCurrentVDOM(vdom)`
Sets the current virtual DOM.

**Parameters**:
- `vdom` (Object): The virtual DOM to set as current

#### `init(componentFunc, container)`
Initializes the application with a root component and container.

**Parameters**:
- `componentFunc` (Function): The root component function
- `container` (HTMLElement): The DOM element to mount the application to

**Example**:
```javascript
import { init } from './dom.js';
import { App } from './components/App.js';

init(App, document.getElementById('app'));
```

#### `render()`
Triggers a re-render of the application by comparing current and new virtual DOM.

#### `createElement(vnode)`
Creates a DOM element from a virtual node.

**Parameters**:
- `vnode` (Object|String): Virtual node or text node

**Returns**: `HTMLElement|Text` - The created DOM element

#### `updateElement(parent, newVNode, oldVNode, index)`
Updates the DOM by comparing new and old virtual nodes.

**Parameters**:
- `parent` (HTMLElement): The parent DOM element
- `newVNode` (Object): The new virtual node
- `oldVNode` (Object): The old virtual node
- `index` (Number, optional): Child index (default: 0)

### Route Module (`route.js`)

#### `defineRoutes(routeMap)`
Defines the application routes and their corresponding components.

**Parameters**:
- `routeMap` (Object): Key-value pairs where keys are routes and values are component functions

**Example**:
```javascript
import { defineRoutes } from './route.js';
import { Home, About, Contact } from './components/index.js';

defineRoutes({
  '/': Home,
  '/about': About,
  '/contact': Contact
});
```

#### `handleRoute()`
Handles route changes based on the current URL hash. Automatically called on hash changes.

#### `navigateTo(path)`
Navigates to a specific path by updating the URL hash.

**Parameters**:
- `path` (String): The path to navigate to

**Example**:
```javascript
import { navigateTo } from './route.js';

// Navigate to about page
navigateTo('/about');
```

### State Module (`state.js`)

#### `useState(key, initialValue)`
Creates or retrieves a state value with reactive updates.

**Parameters**:
- `key` (String): The unique key for the state
- `initialValue` (Any): The initial value for the state

**Returns**: `Array` - [getStateFunction, setStateFunction]

**Example**:
```javascript
import { useState } from './state.js';

const [getCount, setCount] = useState('count', 0);

// Get the current value
console.log(getCount()); // 0

// Update the value (triggers re-render)
setCount(5);
```

#### `setInitialized()`
Marks the application as initialized, enabling state-triggered re-renders. Called automatically by the framework.

## Virtual DOM Structure

Virtual DOM nodes have the following structure:

```javascript
{
  tag: 'div',           // HTML tag name
  attrs: {              // HTML attributes and event handlers
    class: 'container',
    onClick: () => console.log('clicked')
  },
  children: [           // Child nodes
    'Hello World',      // Text node
    {                   // Nested element
      tag: 'span',
      attrs: {},
      children: ['Nested content']
    }
  ]
}
```

## Usage Example

### Basic Application

```javascript
// main.js
import { init } from './dom.js';
import { defineRoutes } from './route.js';
import { useState } from './state.js';

// Define components
function Header() {
  return {
    tag: 'header',
    attrs: { class: 'header' },
    children: ['My App']
  };
}

function Home() {
  const [getCount, setCount] = useState('counter', 0);
  
  return {
    tag: 'div',
    children: [
      Header(),
      {
        tag: 'h1',
        children: ['Home Page']
      },
      {
        tag: 'p',
        children: [`Count: ${getCount()}`]
      },
      {
        tag: 'button',
        attrs: {
          onClick: () => setCount(getCount() + 1)
        },
        children: ['Increment']
      }
    ]
  };
}

function About() {
  return {
    tag: 'div',
    children: [
      Header(),
      {
        tag: 'h1',
        children: ['About Page']
      }
    ]
  };
}

// Define routes
defineRoutes({
  '/': Home,
  '/about': About
});

// Initialize app
init(Home, document.getElementById('app'));
```

### HTML File

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <div id="app"></div>
  <nav>
    <a href="#/">Home</a>
    <a href="#/about">About</a>
  </nav>
  <script type="module" src="main.js"></script>
</body>
</html>
```

## Event Handling

Event handlers are defined with `on` prefix in attributes:

```javascript
{
  tag: 'button',
  attrs: {
    onClick: () => console.log('Button clicked'),
    onMouseOver: () => console.log('Mouse over')
  },
  children: ['Click me']
}
```

## Special Attributes

- `value`: Sets the value of form elements
- `checked`: Sets the checked state of checkboxes/radio buttons
- Event handlers: `onClick`, `onChange`, etc.

## Best Practices

1. Use descriptive keys for state to avoid conflicts
2. Keep components focused and reusable
3. Use route parameters in the hash (e.g., `#/user/123`)
4. Handle missing routes with a fallback component
5. Clean up event listeners when components are unmounted

## Limitations

- Hash-based routing only
- No built-in component lifecycle methods
- Simple diffing algorithm (may not handle all edge cases)
- No server-side rendering support

This documentation provides a comprehensive guide to using the mini framework. For more complex applications, consider extending the framework with additional features like middleware, component lifecycle methods, or more advanced diffing algorithms.