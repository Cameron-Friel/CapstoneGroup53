'use strict';

let State = require('../State.js');
let Pendulum = require('../Pendulum.js');
let Graph = require('../Graph.js');
let noUiSlider = require('nouislider');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const PTM = 634.773; // converts pixels to meters for calculations

// Input slider set up
var lengthSlider = document.getElementById("length-slider");
var massSlider = document.getElementById("mass-slider");
var angleSlider = document.getElementById("angle-slider");

noUiSlider.create(lengthSlider, {
  start: [0.3],
  step: 0.05,
  connect: true,
  tooltips: true,
  range: {
    'min' : [0.1],
    'max' : [0.5]
  }
});

noUiSlider.create(massSlider, {
  start: [20],
  step: 5,
  connect: true,
  tooltips: true,
  range: {
    'min' : [1],
    'max' : [200]
  }
});

noUiSlider.create(angleSlider, {
  start: [60],
  step: 5,
  connect: true,
  tooltips: true,
  range: {
    'min' : [0],
    'max' : [90]
  }
});

// reset
function refreshSimulation() {
  World.clear(engine.world);
  createWorld();
  engine.timing.timestamp = 0;
  Graph.resetGraphData(graphData);
  stopPlotInterval();
  State.displayRunningTime(engine);
  State.setSimulationRunning(false);
  pendulum.pendulumAngle = pendulum.calculateAngle(pendulum.pendulumString.bodies[0].position, pendulum.pendulumBody.position);
  pendulum.pendulumHeight = pendulum.calculatePenulumHeight(pendulum.pendulumStringLength / PTM, pendulum.pendulumAngle);
  pendulum.displayPendulumHeight();

  if (State.getIsPausedFlag() === false) {
    State.setIsPausedFlag(true);
    State.onPause(render);
  }
  else {
    pauseBtn.value = "pause";
    pauseBtn.innerText = "Pause" ;
  }
}

// whenever length slider changed handler
lengthSlider.noUiSlider.on('change', function () {
  if(State.getSimulationRunning() == false) {
    refreshSimulation();
  }
});

massSlider.noUiSlider.on('change', function() {
  if(State.getSimulationRunning() == false) {
    refreshSimulation();
  }
});

angleSlider.noUiSlider.on('change', function () {
  if(State.getSimulationRunning() == false) {
    var angleVal = parseInt(angleSlider.noUiSlider.get(), 10);
    refreshSimulation();
    pendulum.pendulumAngle = angleVal;
  }
});




let Engine = Matter.Engine;
let Render = Matter.Render;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Constraint = Matter.Constraint;
let Events = Matter.Events;

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

  var massVal = parseInt(massSlider.noUiSlider.get(), 10) / 1000;
  var angleVal = parseInt(angleSlider.noUiSlider.get(), 10);
  var lengthVal = parseFloat(lengthSlider.noUiSlider.get(), 10);

  var xCoordProtractor = 400;
  var yCoordProtractor = 50;

  var xCoordBody = 400 - ((lengthVal * PTM) * Math.sin(angleVal * Math.PI / 180));
  var yCoordBody = (lengthVal * PTM) * Math.cos(angleVal * Math.PI / 180) + yCoordProtractor;

  pendulum.pendulumBody = Bodies.circle(xCoordBody, yCoordBody, 30, {
    mass: massVal,
    frictionAir: 0,
    interia: Infinity });

  // set the angle
  let protractor = Bodies.circle(xCoordProtractor, yCoordProtractor, 20, { isStatic: true});

  World.add(engine.world, [pendulum.pendulumBody, protractor]);

  pendulum.pendulumString = World.add(engine.world, Constraint.create({
    bodyA: protractor,
    bodyB: pendulum.pendulumBody,
    length: 0
  }));

  pendulum.pendulumStringLength = pendulum.calculateStringLength(protractor.position, pendulum.pendulumBody.position);
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
    //Body.applyForce(pendulum.pendulumBody, {x: pendulum.pendulumBody.position.x, y: pendulum.pendulumBody.position.y}, {x: 0.0017, y: 0});
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
  pendulum.displayPendulumHeight();

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
  pendulum.displayPendulumHeight();
  State.displayRunningTime(engine);
});
