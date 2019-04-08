'use strict';

let State = require('../State.js');
let Pendulum = require('../Pendulum.js');
let Graph = require('../Graph.js');
let noUiSlider = require('nouislider');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;

const PENDULUM_HEIGHT_ID = 'pendulum-height';
const SECOND_PENDULUM_HEIGHT_ID = 'second-pendulum-height';
const VELOCITY_A_ID = 'velocity-a';
const VELOCITY_B_ID = 'velocity-b';

const PTM = 634.773; // converts pixels to meters for calculations
const DEG_TO_RAD = Math.PI / 180;    // conversion factor from deg to rad


// Input slider set up
var lengthSlider = document.getElementById("length-slider");
var massSlider = document.getElementById("mass-slider");
var angleSlider = document.getElementById("angle-slider");

var mass2Slider = document.getElementById("mass-2-slider");
var angle2Slider = document.getElementById("angle-2-slider");
var corSlider = document.getElementById("cor-slider");

var numWeightsDropdown = document.getElementById('num-weights');


noUiSlider.create(lengthSlider, {
  start: [0.3],
  step: 0.01,
  connect: true,
  tooltips: true,
  range: {
    'min' : [0.1],
    'max' : [0.5]
  }
});

noUiSlider.create(massSlider, {
  start: [20],
  step: 1,
  connect: true,
  tooltips: true,
  range: {
    'min' : [1],
    'max' : [200]
  }
});

noUiSlider.create(angleSlider, {
  start: [60],
  step: 1,
  connect: true,
  tooltips: true,
  range: {
    'min' : [-90],
    'max' : [90]
  }
});

noUiSlider.create(mass2Slider, {
  start: [20],
  step: 1,
  connect: true,
  tooltips: true,
  range: {
    'min' : [1],
    'max' : [200]
  }
});

noUiSlider.create(angle2Slider, {
  start: [0],
  step: 1,
  connect: true,
  tooltips: true,
  range: {
    'min' : [-90],
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
if(document.getElementById('num-weights').value == 1) {
  mass2Slider.setAttribute('disabled', true);
  angle2Slider.setAttribute('disabled', true);
  corSlider.setAttribute('disabled', true);
}




/**
 * Creating pendulum world
 */

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
    label: 'Height a',
    borderColor: "rgba(97, 181, 255, 0.5)",
    backgroundColor: "rgba(97, 181, 255, 0.3)",
    data: [{
    }]
 },
 {
   label: 'Height b',
   borderColor: "rgba(64, 173, 111, 0.5)",
   backgroundColor: "rgba(64, 173, 111, 0.3)",
   data: [{
   }]
 }],
 xAxes: [{
   type: 'linear',
   position: 'bottom',
   scaleLabel: {
     labelString: 'Time (ms)',
     display: true
   }
 }],
 yAxes: [{
   type: 'linear',
   position: 'left',
   scaleLabel: {
     labelString: 'Height (m)',
     display: true
   }
 }],
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
// function calcXCoord(length, angle) {
//   return 400 - ((length * PTM) * Math.sin(angle * Math.PI / 180));
// }

function calcXCoord(length, angle, xProc) {
  if (Math.sign(angle) == -1) {
    var posAngle = Math.abs(angle);
    return xProc - ((length * PTM) * Math.sin(posAngle * DEG_TO_RAD));
  }
  else {
    return xProc + ((length * PTM) * Math.sin(angle * DEG_TO_RAD));
  }
}

function calcYCoord(length, angle, yProc) {
  return (length * PTM) * Math.cos(angle * DEG_TO_RAD) + yProc;
}



/*
  * Sets up initial bodies of the world
*/

function createWorld() {
  World.add(engine.world, [  // x y w h
     Bodies.rectangle(400, 0, 800, 50, { isStatic: true, render: {fillStyle: 'grey'}}) ,   //top
     Bodies.rectangle(400, CANVAS_HEIGHT, 800, 50, { isStatic: true, render: {fillStyle: 'grey'}}) , // bottom
     Bodies.rectangle(800, 400, 50, 800, { isStatic: true, render: {fillStyle: 'grey'}}),
     Bodies.rectangle(0, 400, 50, 800, { isStatic: true, render: {fillStyle: 'grey'}})
  ]);
  // both pendulums
  var lengthVal = parseFloat(lengthSlider.noUiSlider.get(), 10);
  var weightRadius = 30;

  //protractors
  var xCoordProtractor1 = CANVAS_WIDTH / 2 + weightRadius;
  var xCoordProtractor2 = CANVAS_WIDTH / 2 - weightRadius;
  var yCoordProtractor = 50;

  // first pendulum
  var massVal = parseInt(massSlider.noUiSlider.get(), 10) / 1000; // convert to kg
  var angleVal = parseInt(angleSlider.noUiSlider.get(), 10);
  var xCoordBody = calcXCoord(lengthVal, angleVal, xCoordProtractor1);
  var yCoordBody = calcYCoord(lengthVal, angleVal, yCoordProtractor);

  pendulum.pendulumBody = Bodies.circle(xCoordBody, yCoordBody, weightRadius, {
    mass: massVal,
    frictionAir: 0.00000,
    friction: 0,
    interia: Infinity,
    frictionStatic: 0.0,
    render: {
      fillStyle: "rgb(97, 181, 255)",
      strokeStyle: "rgb(97, 181, 255)"
    }});

  let protractor1 = Bodies.circle(xCoordProtractor1, yCoordProtractor, 10, {
    isStatic: true,
    render: {fillStyle: 'grey'}});
  let protractor2 = Bodies.circle(xCoordProtractor2, yCoordProtractor, 10, {
    isStatic: true,
    render: {fillStyle: 'grey'}});

  pendulum.pendulumString = World.add(engine.world, Constraint.create({
    bodyA: protractor1,
    bodyB: pendulum.pendulumBody,
    length: 0,
    stiffness: 1,
    damping: 0.0,
    render: {
      strokeStyle: 'rgb(97, 181, 255)',
      lineWidth: 6
    }
  }));

  // TODO: this should be constant but yeah error here
  // This is messing up the height
  pendulum.pendulumStringLength = lengthVal * PTM;

  // add first pendulum and protractor1
  World.add(engine.world, [pendulum.pendulumBody, protractor1]);

  // second pendulum
  var massVal2 = parseInt(mass2Slider.noUiSlider.get(), 10) / 1000; // convert to kg
  var angleVal2 = parseInt(angle2Slider.noUiSlider.get(), 10);
  var xCoordBody2 = calcXCoord(lengthVal, angleVal2, xCoordProtractor2);
  var yCoordBody2 = calcYCoord(lengthVal, angleVal2, yCoordProtractor);
  var restVal = parseFloat(corSlider.noUiSlider.get());

  pendulum2.pendulumBody = Bodies.circle(xCoordBody2, yCoordBody2, weightRadius, {
     mass: massVal2,
     frictionAir: 0,
     interia: Infinity,
     friction: 0,
     restitution: restVal,   // matter should take the max rest val of 2 objects
     render: {
      fillStyle: "rgb(64, 173, 111)",
      strokeStyle: "rgb(64, 173, 111)"
    }
    });


  // add the second pendulum if selected in the dropdown
  if(numWeightsDropdown.value == "2") {
    World.add(engine.world, [pendulum2.pendulumBody, protractor2]);
    pendulum2.pendulumString = World.add(engine.world, Constraint.create({
      bodyA: protractor2,
      bodyB: pendulum2.pendulumBody,
      length: 0,
      render: {
        strokeStyle: 'rgb(64, 173, 111)',
        lineWidth: 6
      }
    }));
    pendulum2.pendulumStringLength = lengthVal * PTM;

  }

}

function updateInitialValuesTable() {
  var lengthVal = parseFloat(lengthSlider.noUiSlider.get(), 10);
  var massVal1 = parseInt(massSlider.noUiSlider.get(), 10); // convert to kg
  var angleVal1 = parseInt(angleSlider.noUiSlider.get(), 10);

  // for two pendulums
  var massVal2 = parseInt(mass2Slider.noUiSlider.get(), 10); // convert to kg
  var angleVal2 = parseInt(angle2Slider.noUiSlider.get(), 10);
  var restVal = parseFloat(corSlider.noUiSlider.get());

  document.getElementById("length-initial-1").textContent = lengthVal;
  document.getElementById("mass-initial-1").textContent = massVal1;
  document.getElementById("angle-initial-1").textContent = angleVal1;
  
  document.getElementById("mass-initial-2").textContent = massVal2;
  document.getElementById("angle-initial-2").textContent = angleVal2;
  document.getElementById("coef-init").textContent = restVal;

}

/**
 * add a second pendulum to the world
 * TODO: implement this function to build on top of createWorld
 */
function rmSecondPendulum() {
  /* do stuff here to rm from  world */
}

/**
 * remove a second pendulum to the world
 * TODO: implement this function to remove
 */
function addSecondPendulum() {
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
  if (engine.timing.timestamp === 0) {
    State.setIsPausedFlag(false);
    State.onPause(render);
    State.setSimulationRunning(true);
    //Body.applyForce(pendulum.pendulumBody, {x: pendulum.pendulumBody.position.x, y: pendulum.pendulumBody.position.y}, {x: 0.0017, y: 0});
    runPlotInterval();

    var sliders = document.getElementById("input-table");
    sliders.classList.add('hide-container');

    var graph = document.getElementById("chart-container");
    graph.classList.remove('hide-container');

    var initialVals = document.getElementById("initial-values");
    initialVals.classList.remove("hide-container");

    var secondPendulum = document.getElementsByClassName("pendulum-2-init");
    if (document.getElementById('num-weights').value == 2) {
      for(var i=0; i< secondPendulum.length; i++) {
        secondPendulum[i].classList.remove("hide-container");
      }
    }
    else {
      for(var i=0; i< secondPendulum.length; i++) {
        secondPendulum[i].classList.add("hide-container");
      }
    }

    updateInitialValuesTable();
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
  pendulum.pendulumHeight = pendulum.calculatePenulumHeight(pendulum.pendulumStringLength / PTM, pendulum.pendulumAngle); // angle?
  pendulum.displayPendulumHeight(PENDULUM_HEIGHT_ID);
  pendulum.displayVelocity(VELOCITY_A_ID);

  // replace graph with sliders
  var sliders = document.getElementById("input-table");
  sliders.classList.remove('hide-container');

  var graph = document.getElementById("chart-container");
  graph.classList.add('hide-container');

  var initialVals = document.getElementById("initial-values");
  initialVals.classList.add('hide-container');

  if (document.getElementById('num-weights').value == 2) {
    pendulum2.pendulumAngle = pendulum2.calculateAngle(pendulum2.pendulumString.bodies[0].position, pendulum2.pendulumBody.position);
    pendulum2.pendulumHeight = pendulum2.calculatePenulumHeight(pendulum2.pendulumStringLength / PTM, pendulum2.pendulumAngle);
    pendulum2.displayPendulumHeight(SECOND_PENDULUM_HEIGHT_ID);
    pendulum2.displayVelocity(VELOCITY_B_ID);

  }

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
  var protPos1 = { x: 430, y: 50 };

  pendulum.pendulumAngle = pendulum.calculateAngle(protPos1, pendulum.pendulumBody.position);
  pendulum.pendulumHeight = pendulum.calculatePenulumHeight(pendulum.pendulumStringLength / PTM, pendulum.pendulumAngle);

  if (document.getElementById('num-weights').value == 2) {
    var protPos2 = { x: 370, y: 50 };
    pendulum2.pendulumAngle = pendulum2.calculateAngle(protPos2, pendulum2.pendulumBody.position);
    pendulum2.pendulumHeight = pendulum2.calculatePenulumHeight(pendulum2.pendulumStringLength / PTM, pendulum2.pendulumAngle);
    pendulum2.displayPendulumHeight(SECOND_PENDULUM_HEIGHT_ID);
    pendulum2.displayVelocity(VELOCITY_B_ID);
  }
  pendulum.displayPendulumHeight(PENDULUM_HEIGHT_ID);
  pendulum.displayVelocity(VELOCITY_A_ID);
  State.displayRunningTime(engine);

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


/**
 * Slider listeners
 */


/**
 * Called whenever slider value is changed
 */
function refreshSimulation() {
  World.clear(engine.world);
  createWorld();
  engine.timing.timestamp = 0;
  Graph.resetGraphData(graphData);
  stopPlotInterval();
  State.displayRunningTime(engine);
  State.setSimulationRunning(false);

  var protPos1 = { x: 430, y: 50 };
  var protPos2 = { x: 370, y: 50 };

  pendulum.pendulumAngle = pendulum.calculateAngle(
    protPos1, pendulum.pendulumBody.position);

  pendulum.pendulumHeight = pendulum.calculatePenulumHeight(
    pendulum.pendulumStringLength / PTM, pendulum.pendulumAngle);
  pendulum.displayPendulumHeight(PENDULUM_HEIGHT_ID);


  if (document.getElementById('num-weights').value == 2) {
    pendulum2.pendulumAngle = pendulum2.calculateAngle(
      protPos2, pendulum2.pendulumBody.position);
    pendulum2.pendulumHeight = pendulum2.calculatePenulumHeight(
      pendulum2.pendulumStringLength / PTM, pendulum2.pendulumAngle);
    pendulum2.displayPendulumHeight(SECOND_PENDULUM_HEIGHT_ID);
  }

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
lengthSlider.noUiSlider.on('update', function () {
  if(State.getSimulationRunning() == false) {
    refreshSimulation();
  }
});

massSlider.noUiSlider.on('update', function() {
  if(State.getSimulationRunning() == false) {
    refreshSimulation();
  }
});

angleSlider.noUiSlider.on('update', function () {
  if(State.getSimulationRunning() == false) {
    var angleVal = parseInt(angleSlider.noUiSlider.get(), 10);
    refreshSimulation();
    pendulum.pendulumAngle = angleVal;
  }
});

mass2Slider.noUiSlider.on('update', function() {
  if(State.getSimulationRunning() == false) {
    refreshSimulation();
  }
});

angle2Slider.noUiSlider.on('update', function () {
  if(State.getSimulationRunning() == false) {
    var angleVal = parseInt(angleSlider.noUiSlider.get(), 10);
    refreshSimulation();
    pendulum.pendulumAngle = angleVal;
  }
});

corSlider.noUiSlider.on('update', function () {
  if(State.getSimulationRunning() == false) {
    refreshSimulation();
  }
});

/*
 * Changes the number of pendulums
*/
numWeightsDropdown.onchange = function() {
  refreshSimulation();

  var numWeights = numWeightsDropdown.value;
  let height2Info = document.getElementById('height-2-container');
  let velocity2Info = document.getElementById('velocity-2-container');

  if (numWeights == "1") {
    // disable sliders
    mass2Slider.setAttribute('disabled', true);
    angle2Slider.setAttribute('disabled', true);
    corSlider.setAttribute('disabled', true);

    //remove second weight info
    height2Info.classList.add('hide-container');
    velocity2Info.classList.add('hide-container');
  }
  else if(numWeights == "2") {
    // reenable sliders
    mass2Slider.removeAttribute('disabled');
    angle2Slider.removeAttribute('disabled');
    corSlider.removeAttribute('disabled');

    //add second weight info
    height2Info.classList.remove('hide-container');
    velocity2Info.classList.remove('hide-container');

  }
};
