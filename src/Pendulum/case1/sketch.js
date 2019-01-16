'use strict';

let EngineHandler = require('./EngineHandler.js');
let RenderHandler = require('./RenderHandler.js');
let State = require('./State.js');

let Render = Matter.Render;
let World = Matter.World;

RenderHandler.setupCanvas();

EngineHandler.createWorld(); // add bodies to canvas

RenderHandler.startRender(); // allow for the rendering of frames of the world

RenderHandler.renderLoop(); // renders frames to the canvas

/*
  * Pauses or unpauses the world from rendering
*/

document.getElementById('pause-button').onclick = function() {
  State.setIsPausedFlag(State.getIsPausedFlag());
  RenderHandler.determineRender(State.getIsPausedFlag());
};

/*
  * Resets the world to its starting state
*/

document.getElementById('reset-button').onclick = function() {
  let engine = EngineHandler.getEngine(); // fetch a reference to the world engine

  World.clear(engine.world);
  EngineHandler.createWorld();

  if (State.isPausedFlag === true) {
    State.setIsPausedFlag(State.getIsPausedFlag());
    RenderHandler.startRender();
  }
};
