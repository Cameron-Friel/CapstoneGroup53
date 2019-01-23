## CapstoneGroup53

To get started `clone` the repository and then run `npm start` to install all the dependencies in the project.

### `Browserify`

This project utilizes Browserify to bundle JavaScript files together.
Before opening a simulation, run ```browserify sketch.js -o bundle.js``` in order to bundle the JavaScript files together.

## Access to Modules

In Browserify, modules are aquired using `require`.

### `Modules`

There are two basic modules in the project named State and Pendulum.

## The State Module

The State module handles understanding the current state of the canvas, such as whether it is paused.

## The Pendulum Module

The Pendulum module is in charge of keeping tack of the pendulum bodies and properties within the world.
