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

let pendulum = new Pendulum;

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

State.setSimulationTime(Date.now()); // sets the timer for the simulation

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

    pendulum.pendulumAngle = pendulum.calculateAngle(pendulum.pendulumString.bodies[0].position, pendulum.pendulumBody.position);
    pendulum.displayPendulumAngle();
    State.displayRunningTime();
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

  pendulum.pendulumBody = Bodies.circle(100, 100, 40, { mass: 0.04, frictionAir: 0});

  let protractor = Bodies.circle(400, 50, 60, { isStatic: true});

  World.add(engine.world, [pendulum.pendulumBody, protractor]);

  pendulum.pendulumString = World.add(engine.world, Constraint.create({
    bodyA: protractor,
    bodyB: pendulum.pendulumBody,
    length: 0,
  }));
}

/*
  * Pauses or unpauses the world from rendering
*/
var pauseBtn = document.getElementById('pause-button');

pauseBtn.onclick = function() {
  if (pauseBtn.value == 'pause') {
    pauseBtn.innerText = "cont.";
    pauseBtn.value = "continue";
  }
  else {
    pauseBtn.value = "pause";
    pauseBtn.innerText = "Pause" ;
  }
  
  State.setIsPausedFlag(State.getIsPausedFlag());
  State.onPause(render);
};

/*
  * Resets the world to its starting state
*/

document.getElementById('reset-button').onclick = function() {
  World.clear(engine.world);
  createWorld();
  State.setRunningTime(0.0);

  if (State.getIsPausedFlag() === true) {
    State.setIsPausedFlag(State.getIsPausedFlag());
    Render.run(render);
  }
};

/**
  * Listens for whether the current browser tab is active or not
*/

document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    State.setSimulationTime(Date.now());
  }
});
