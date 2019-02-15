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

var mass2Slider = document.getElementById("mass-2-slider");
var angle2Slider = document.getElementById("angle-2-slider");
var corSlider = document.getElementById("cor-slider");

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

noUiSlider.create(mass2Slider, {
  start: [20],
  step: 5,
  connect: true,
  tooltips: true,
  range: {
    'min' : [1],
    'max' : [200]
  }
});

noUiSlider.create(angle2Slider, {
  start: [0],
  step: 5,
  connect: true,
  tooltips: true,
  range: {
    'min' : [0],
    'max' : [90]
  }
});

noUiSlider.create(corSlider, {
  start: [0.1],
  step: 0.1,
  connect: true,
  tooltips: true,
  range: {
    'min' : [0],
    'max' : [1]
  }
});

// on start - disable the second set of sliders
mass2Slider.setAttribute('disabled', true);
angle2Slider.setAttribute('disabled', true);
corSlider.setAttribute('disabled', true);

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

mass2Slider.noUiSlider.on('change', function() {
  if(State.getSimulationRunning() == false) {
    refreshSimulation();
  }
});

angle2Slider.noUiSlider.on('change', function () {
  if(State.getSimulationRunning() == false) {
    var angleVal = parseInt(angleSlider.noUiSlider.get(), 10);
    refreshSimulation();
    pendulum.pendulumAngle = angleVal;
  }
});

corSlider.noUiSlider.on('change', function () {
  if(State.getSimulationRunning() == false) {
    refreshSimulation();
  }
});

/*
 * Changes the number of pendulums
*/
var numWeightsDropdown = document.getElementById('num-weights');
numWeightsDropdown.onchange = function() {
  refreshSimulation();

  var numWeights = numWeightsDropdown.value;
  if (numWeights == "1") {
    // disable sliders
    mass2Slider.setAttribute('disabled', true);
    angle2Slider.setAttribute('disabled', true);
    corSlider.setAttribute('disabled', true);
  }
  else if(numWeights == "2") {
    // reenable sliders
    mass2Slider.removeAttribute('disabled');
    angle2Slider.removeAttribute('disabled');
    corSlider.removeAttribute('disabled');
  }
};




let Engine = Matter.Engine;
let Render = Matter.Render;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Constraint = Matter.Constraint;
let Events = Matter.Events;

let engine = Engine.create();

let pendulum = new Pendulum;
let pendulum2 = new Pendulum;

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
    label: 'Change in height a',
    borderColor: "rgba(97, 181, 255, 0.5)",
    backgroundColor: "rgba(97, 181, 255, 0.3)",
    data: [{
    }]
 },
 {
   label: 'Change in height b',
   borderColor: "rgba(64, 173, 111, 0.5)",
   backgroundColor: "rgba(64, 173, 111, 0.3)",
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

/**
 * Calculate coordinates based on pendulum length and angle
 */
function calcXCoord(length, angle) {
  return 400 - ((length * PTM) * Math.sin(angle * Math.PI / 180));
}

function calcYCoord(length, angle, yProc) {
  return (length * PTM) * Math.cos(angle * Math.PI / 180) + yProc;
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
  var xCoordProtractor = 400;
  var yCoordProtractor = 50;

  var lengthVal = parseFloat(lengthSlider.noUiSlider.get(), 10);

  // first pendulum
  var massVal = parseInt(massSlider.noUiSlider.get(), 10) / 1000; // convert to kg
  var angleVal = parseInt(angleSlider.noUiSlider.get(), 10);
  var xCoordBody = calcXCoord(lengthVal, angleVal);
  var yCoordBody = calcYCoord(lengthVal, angleVal, yCoordProtractor);

  pendulum.pendulumBody = Bodies.circle(xCoordBody, yCoordBody, 30, {
    mass: massVal,
    frictionAir: 0,
    interia: Infinity,
    render: {
      fillStyle: "rgb(97, 181, 255)"
    }});

  let protractor = Bodies.circle(xCoordProtractor, yCoordProtractor, 20, { isStatic: true});

  pendulum.pendulumString = World.add(engine.world, Constraint.create({
    bodyA: protractor,
    bodyB: pendulum.pendulumBody,
    length: 0
  }));

  pendulum.pendulumStringLength = pendulum.calculateStringLength(protractor.position, pendulum.pendulumBody.position);

  // second pendulum
  var massVal2 = parseInt(mass2Slider.noUiSlider.get(), 10) / 1000; // convert to kg
  var angleVal2 = parseInt(angle2Slider.noUiSlider.get(), 10);
  var xCoordBody2 = calcXCoord(lengthVal, angleVal2);
  var yCoordBody2 = calcYCoord(lengthVal, angleVal2, yCoordProtractor);
  var restVal = parseFloat(corSlider.noUiSlider.get());

  pendulum2.pendulumBody = Bodies.circle(xCoordBody2, yCoordBody2, 30, {
     mass: massVal2,
     frictionAir: 0,
     interia: Infinity,
     friction: 0,
     restitution: restVal,   // matter should take the max rest val of 2 objects
     render: {
      fillStyle: "rgb(64, 173, 111)"
    }
    });

  // add first pendulum and protractor
  World.add(engine.world, [pendulum.pendulumBody, protractor]);

  // add the second pendulum if selected in the dropdown
  if(numWeightsDropdown.value == "2") {
    World.add(engine.world, [pendulum2.pendulumBody]);
    pendulum2.pendulumString = World.add(engine.world, Constraint.create({
      bodyA: protractor,
      bodyB: pendulum2.pendulumBody,
      length: 0,
    }));
  }

}

/**
 * add a second pendulum to the world
 * TODO: implement this function to build on top of createWorld
 */
function addSecondPendulum() {
  console.log("in addSecondPendulum");
  /* do stuff here to add to world */
}

/**
 * remove a second pendulum to the world
 * TODO: implement this function to remove
 */
function addSecondPendulum() {
  console.log("in addSecondPendulum");
  /* do stuff here to add to world */
}

/**
  * Sends a request to plot a coordinate every 100ms
*/

function runPlotInterval() {
  plotInterval = setInterval(function() {
    Graph.addGraphData({ x: engine.timing.timestamp.toFixed(3), y: pendulum.pendulumHeight.toFixed(3) }, 0);
    if (document.getElementById('num-weights').value == 2) {
      Graph.addGraphData({ x: engine.timing.timestamp.toFixed(3), y: pendulum2.pendulumHeight.toFixed(3) }, 1);
    }
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

  if (document.getElementById('num-weights').value == 2) {
    pendulum2.pendulumAngle = pendulum2.calculateAngle(pendulum2.pendulumString.bodies[0].position, pendulum2.pendulumBody.position);
    pendulum2.pendulumHeight = pendulum2.calculatePenulumHeight(pendulum2.pendulumStringLength / PTM, pendulum2.pendulumAngle);
  }
  pendulum.displayPendulumHeight();
  State.displayRunningTime(engine);
});
