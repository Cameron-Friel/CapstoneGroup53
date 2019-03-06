'use strict';

let State = require('../State.js');
let Pendulum = require('../Pendulum.js');
let Graph = require('../Graph.js');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const PENDUMDULUM_HEIGHT_ID = 'pendulum-height';
const RESTING_PENDUMDULUM_HEIGHT_ID = 'resting-pendulum-height';

const PTM = 634.773; // converts pixels to meters for calculations

let Engine = Matter.Engine;
let Render = Matter.Render;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Constraint = Matter.Constraint;
let Events = Matter.Events;

let engine = Engine.create();

let pendulum = new Pendulum;
let restingPendulum = new Pendulum;

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
let plotInterval2 = null;

 let graphData = {
   datasets: [{
     label: 'Change in height a',
     borderColor: 'rgba(0, 0, 255, 0.1)',
     backgroundColor: 'rgba(0, 0, 255, 0.1)',
     data: [{
       x: 0,
       y: 0.052
     }]
  },
  {
    label: 'Change in height b',
    borderColor: 'rgba(255, 0, 0, 0.1)',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    data: [{
      x: 0,
      y: 0.052
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
  }
}

/*
  * Sets up initial bodies of the world
*/

function createWorld() {
  World.add(engine.world, [
     Bodies.rectangle(400, 0, 800, 50, { isStatic: true, render: {fillStyle: 'grey'}}),
     Bodies.rectangle(400, 600, 800, 50, { isStatic: true, render: {fillStyle: 'grey'}}),
     Bodies.rectangle(800, 300, 50, 600, { isStatic: true, render: {fillStyle: 'grey'}}),
     Bodies.rectangle(0, 300, 50, 600, { isStatic: true, render: {fillStyle: 'grey'}})
  ]);

  pendulum.pendulumBody = Bodies.circle(238.45, 329.821, 30, { mass: 0.04, frictionAir: 0, interia: Infinity, render: {fillStyle: 'blue'} });
  // 161.55 279.821
  let protractor = Bodies.circle(400, 50, 10, { isStatic: true, render: {fillStyle: 'grey'}});

  pendulum.pendulumString = World.add(engine.world, Constraint.create({
    bodyA: protractor,
    bodyB: pendulum.pendulumBody,
    length: 0,
    render: {
      strokeStyle: 'blue',
      lineWidth: 6
    }
  }));

  pendulum.pendulumStringLength = pendulum.calculateStringLength(protractor.position, pendulum.pendulumBody.position);

  restingPendulum.pendulumBody = Bodies.circle(561.55, 329.821, 30, { mass: 0.04, frictionAir: 0, interia: Infinity, render: {fillStyle: 'red'}  });

  restingPendulum.pendulumString = World.add(engine.world, Constraint.create({
      bodyA: protractor,
      bodyB: restingPendulum.pendulumBody,
      length: 0,
      render: {
        strokeStyle: 'red',
        lineWidth: 6
      }
    }));

    World.add(engine.world, [pendulum.pendulumBody, restingPendulum.pendulumBody, protractor]);
}

/**
  * Sends a request to plot a coordinate every 100ms
*/

function runPlotInterval() {
  plotInterval = setInterval(function() {
    Graph.addGraphData({ x: engine.timing.timestamp.toFixed(3), y: pendulum.pendulumHeight.toFixed(3) }, 0);
    Graph.addGraphData({ x: engine.timing.timestamp.toFixed(3), y: restingPendulum.pendulumHeight.toFixed(3) }, 1);
  }, 100);
}

/**
  * Stops the plot interval from running
*/

function stopPlotInterval() {
  clearInterval(plotInterval);
  clearInterval(plotInterval2);
}

/*
  * Pauses or unpauses the world from rendering
*/
var pauseBtn = document.getElementById('pause-button');

pauseBtn.onclick = function() {
  if (State.getSimulationRunning() === true) { // only allow pause and continue when the simulation is running
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
  }
};

/*
  * Starts running the simulation
*/

document.getElementById('start-button').onclick = function() {
  if (State.getSimulationRunning() === false) { // make sure the simulation is not already running
    State.setIsPausedFlag(false);
    State.onPause(render);
    State.setSimulationRunning(true);
    Body.applyForce(pendulum.pendulumBody, {x: pendulum.pendulumBody.position.x, y: pendulum.pendulumBody.position.y}, {x: 0.0003, y: 0});
    Body.applyForce(restingPendulum.pendulumBody, {x: restingPendulum.pendulumBody.position.x, y: restingPendulum.pendulumBody.position.y}, {x: -0.0003, y: 0});
    runPlotInterval();
  }
};

/*
  * Resets the world to its starting state
*/

document.getElementById('reset-button').onclick = function() {
  World.clear(engine.world);
  createWorld();
  engine.timing.timestamp = 0;
  Graph.resetGraphData(graphData);
  stopPlotInterval();
  State.displayRunningTime(engine);
  State.setSimulationRunning(false);
  pendulum.pendulumAngle = pendulum.calculateAngle(pendulum.pendulumString.bodies[0].position, pendulum.pendulumBody.position);
  pendulum.pendulumHeight = pendulum.calculatePenulumHeight(pendulum.pendulumStringLength / PTM, pendulum.pendulumAngle);
  restingPendulum.pendulumAngle = pendulum.calculateAngle(restingPendulum.pendulumString.bodies[0].position, restingPendulum.pendulumBody.position);
  restingPendulum.pendulumHeight = pendulum.calculatePenulumHeight(restingPendulum.pendulumStringLength / PTM, restingPendulum.pendulumAngle);
  pendulum.displayPendulumHeight(PENDUMDULUM_HEIGHT_ID);
  restingPendulum.displayPendulumHeight(RESTING_PENDUMDULUM_HEIGHT_ID);

  if (State.getIsPausedFlag() === false) {
    State.setIsPausedFlag(true);
    State.onPause(render);
  }
  else {
    pauseBtn.value = "pause";
    pauseBtn.innerText = "Pause" ;
  }
};

// Updates UI before each update of the simulation
Events.on(engine, 'beforeUpdate', function(event) {
  pendulum.pendulumAngle = pendulum.calculateAngle(pendulum.pendulumString.bodies[0].position, pendulum.pendulumBody.position);
  pendulum.pendulumHeight = pendulum.calculatePenulumHeight(pendulum.pendulumStringLength / PTM, pendulum.pendulumAngle);
  restingPendulum.pendulumAngle = pendulum.calculateAngle(restingPendulum.pendulumString.bodies[0].position, restingPendulum.pendulumBody.position);
  restingPendulum.pendulumHeight = pendulum.calculatePenulumHeight(restingPendulum.pendulumStringLength / PTM, restingPendulum.pendulumAngle);
  pendulum.displayPendulumHeight(PENDUMDULUM_HEIGHT_ID);
  restingPendulum.displayPendulumHeight(RESTING_PENDUMDULUM_HEIGHT_ID);
  State.displayRunningTime(engine);

  // Stop when speed is below 0.2
  if (pendulum.pendulumBody.speed <= 0.2 && pendulum.pendulumBody.speed !== 0){
    State.setIsPausedFlag(true);
    State.onPause(render);
    stopPlotInterval();
    State.setSimulationRunning(false);
  }
});

/**
  * Listens for whether the current browser tab is active or not
*/

document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    if (State.getIsPausedFlag() === false) {
      runPlotInterval();
    }
  }
  else {
    stopPlotInterval();
  }
});
