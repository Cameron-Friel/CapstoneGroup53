'use strict';

let State = require('../State.js');
let Pendulum = require('../Pendulum.js');
let Graph = require('../Graph.js');

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

let ctx = document.getElementById("chart").getContext('2d');

let plotInterval = null;

 let graphData = {
   datasets: [{
     label: 'Change in angle',
     data: [{
     }]
  }]
 };


/**
  * Create world
*/

createWorld(); // add bodies to canvas

Render.run(render); // allow for the rendering of frames of the world

renderLoop(); // renders frames to the canvas

Graph.createGraph(ctx, graphData); // add graph

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
    State.displayRunningTime(engine);
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

/**
  * Sends a request to plot a coordinate every 100ms
*/

function runPlotInterval() {
  plotInterval = setInterval(function() {
    Graph.addGraphData({ x: engine.timing.timestamp.toFixed(3), y: pendulum.pendulumAngle });
  }, 100);
}

/**
  * Stops the plot interval from running
*/

function stopPlotInterval() {
  clearInterval(plotInterval);
}

/*
  * Pauses or unpauses the world from rendering
*/
var pauseBtn = document.getElementById('pause-button');

pauseBtn.onclick = function() {
  if (pauseBtn.value == "pause") {
    pauseBtn.innerText = "cont.";
    pauseBtn.value = "continue";
    stopPlotInterval();
  }
  else {
    pauseBtn.value = "pause";
    pauseBtn.innerText = "Pause";
    runPlotInterval();
  }

  State.setIsPausedFlag(!State.getIsPausedFlag());
  State.onPause(render);
};

/*
  * Starts running the simulation
*/

document.getElementById('start-button').onclick = function() {
  if (State.getSimulationRunning() === false) { // make sure the simulation is not already running
    State.setIsPausedFlag(false);
    State.onPause(render);
    State.setSimulationRunning(true);
    runPlotInterval();
  }
};

/*
  * Resets the world to its starting state
*/

document.getElementById('reset-button').onclick = function() {
  if (State.getIsPausedFlag() === false) {
    State.setIsPausedFlag(true);
    State.onPause(render);
  }
  else {
    pauseBtn.value = "pause";
    pauseBtn.innerText = "Pause" ;
  }

  World.clear(engine.world);
  createWorld();
  engine.timing.timestamp = 0;
  Graph.resetGraphData(graphData);
  stopPlotInterval();
  State.displayRunningTime(engine);
  pendulum.displayPendulumAngle();
  State.setSimulationRunning(false);
};
