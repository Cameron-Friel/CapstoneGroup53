'use strict';

let State = require('../State.js');
let Pendulum = require('../Pendulum.js');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

let Engine = Matter.Engine;
let Render = Matter.Render;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Constraint = Matter.Constraint;

let engine = Engine.create();

let render = Render.create({
    element: document.getElementById('canvas'),
    engine: engine,
    options: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        wireframes: false
    }
 });

createWorld(); // add bodies to canvas

Render.run(render); // allow for the rendering of frames of the world

renderLoop(); // renders frames to the canvas

/*
  * Renders frames to send to the canvas
*/

function renderLoop() {
  if (State.getIsPausedFlag()) { // the world is paused
    requestAnimationFrame(renderLoop); // render next frame
  }
  else {
    Engine.update(engine, 1000 / 60); // update at 60 FPS
    requestAnimationFrame(renderLoop); // render next frame

    Pendulum.setPendulumAngle(Pendulum.calculateAngle(Pendulum.string.bodies[0].position, Pendulum.pendulumWeight.position));
    Pendulum.displayPendulumAngle();
  }
}

/*
  * Determines whether to continue rendering the world or not
  * @param {boolean} isPaused - Flag to tell if the world is paused or not
*/

function determineRender(isPaused) {
  if (isPaused) { // the world is paused
    Render.stop(render);
  }
  else {
    Render.run(render);
  }
}

/*
  * Sets up initial bodies of the world
*/

function createWorld() {
  World.add(engine.world, [
     Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
     Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
     Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
     Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
  ]);

  Pendulum.pendulumWeight = Bodies.circle(100, 100, 40, { mass: 0.04, frictionAir: 0});

  let protractor = Bodies.circle(400, 50, 60, { isStatic: true});

  World.add(engine.world, [Pendulum.pendulumWeight, protractor]);

  Pendulum.string = World.add(engine.world, Constraint.create({
    bodyA: protractor,
    bodyB: Pendulum.pendulumWeight,
    length: 0,
  }));
}

/*
  * Pauses or unpauses the world from rendering
*/

document.getElementById('pause-button').onclick = function() {
  State.setIsPausedFlag(State.getIsPausedFlag());
  determineRender(State.getIsPausedFlag());
};

/*
  * Resets the world to its starting state
*/

document.getElementById('reset-button').onclick = function() {
  World.clear(engine.world);
  createWorld();

  if (State.isPausedFlag === true) {
    State.setIsPausedFlag(State.getIsPausedFlag());
    Render.start(render);
  }
};
