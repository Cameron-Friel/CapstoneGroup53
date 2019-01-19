## CapstoneGroup53

### `Browserify`

This project utilizes Browserify to bundle JavaScript files together.
Before opening a simulation, run ```browserify sketch.js -o bundle.js``` in order to bundle the JavaScript files together.

## Access to Modules

In Browserify, modules are aquired using `require`.

### `Modules`

There are four basic modules in the project. These include the EngineHandler, RenderHandler, State, and Pendulum

## EngineHandler

The EngineHandler module handles simulating the 2D physics as well as building up the world.

## RenderHandler

The RenderHandler modules handles loading and sending frames to the canvas.

## State

The State module handles understanding the current state of the canvas, such as whether it is paused.

## Pendulum

The Pendulum module is in charge of keeping tack of the pendulum bodies and properties within the world.
