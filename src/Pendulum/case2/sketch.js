'use strict';

let State = require('../State.js');
let Pendulum = require('../Pendulum.js');
let Graph = require('../Graph.js');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const PENDUMDULUM_HEIGHT_ID = 'pendulum-height';
const RESTING_PENDUMDULUM_HEIGHT_ID = 'resting-pendulum-height';

const PTM = 634.773; // converts pixels to meters for calculations
const DEG_TO_RAD = Math.PI / 180; //conversion factor

const P_RAD = 30;
const PROT_POS_1 = {x: CANVAS_WIDTH / 2 - P_RAD, y: 50};
const PROT_POS_2 = {x: CANVAS_WIDTH / 2 + P_RAD, y: 50};


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
   datasets:  [{
     label: 'Height a',
     borderColor: 'rgba(0, 0, 255, 0.1)',
     backgroundColor: 'rgba(0, 0, 255, 0.1)',
     data: [{
       x: 0,
       y: 0.255
     }]
  },
  {
    label: 'Height b',
    borderColor: 'rgba(255, 0, 0, 0.1)',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    data: [{
      x: 0,
      y: 0
    }]
  }],
  xAxes: [{
    type: 'linear',
    position: 'bottom',
    ticks: {
      min: 0,
      max: 2000,
    },
    scaleLabel: {
      labelString: 'Time (ms)',
      display: true
    }
  }],
  yAxes: [{
    type: 'linear',
    position: 'left',
    ticks: {
      min: 0,
      max: 0.30,
    },
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
 * Returns the initial X coordinate
 * @param {Int} angle           // angle to calculate in degrees
 * @param {Int} protractorNum   // ((1/2) Which protractor? )
 */
function calcInitialX(angle, protractorNum) {
  const ARM_LENGTH = 0.509 * PTM; // arm length in pixels
  if(protractorNum == 1) {
    var xL = PROT_POS_1.x - (ARM_LENGTH * Math.sin(angle * DEG_TO_RAD));
    return xL;
  }
  else if(protractorNum == 2) {
    var xR = PROT_POS_2.x + (ARM_LENGTH * Math.sin(angle * DEG_TO_RAD));
    return xR;
  }
  else {
    console.log("Error calculating initial X");
  }
}

/**
 * Returns initial Y coordinate
 * @param {Int} angle
 */
function calcInitialY(angle) {
  const ARM_LENGTH = 0.509 * PTM; // arm length in pixels
  var protractorY = PROT_POS_1.y; // both have the same y
  var yCoord = protractorY + (ARM_LENGTH * Math.cos(angle* DEG_TO_RAD));
  return yCoord;
}



/*
  * Sets up initial bodies of the world
*/

function createWorld() {
  World.add(engine.world, [
     Bodies.rectangle(400, 0, 800, 50, { isStatic: true, render: {fillStyle: 'grey'} }),
     Bodies.rectangle(400, 600, 800, 50, { isStatic: true, render: {fillStyle: 'grey'} }),
     Bodies.rectangle(800, 300, 50, 600, { isStatic: true, render: {fillStyle: 'grey'} }),
     Bodies.rectangle(0, 300, 50, 600, { isStatic: true, render: {fillStyle: 'grey'} })
  ]);

  var weightRadius = 30;

  let protractor1 = Bodies.circle(PROT_POS_1.x, PROT_POS_1.y, 10, {
    isStatic: true,
    render: {fillStyle: 'grey'}});

  let protractor2 = Bodies.circle(PROT_POS_2.x, PROT_POS_2.y, 10, {
    isStatic: true,
    render: {fillStyle: 'grey'}});

  // left pendulum
  var x1 = calcInitialX(60, 1);
  var y1 = calcInitialY(60);

  pendulum.pendulumBody = Bodies.circle(x1, y1, weightRadius, {
    mass: 0.04,
    frictionAir: 0,
    interia: Infinity,
    render: {fillStyle: 'blue'}
  });
  pendulum.pendulumString = World.add(engine.world, Constraint.create({
    bodyA: protractor1,
    bodyB: pendulum.pendulumBody,
    length: 0,
    render: {
      strokeStyle: 'blue',
      lineWidth: 6
    }
  }));

  pendulum.pendulumStringLength = pendulum.calculateStringLength(
    protractor1.position,
    pendulum.pendulumBody.position);

  // resting pendulum
  restingPendulum.pendulumBody = Bodies.circle(PROT_POS_2.x, pendulum.pendulumStringLength + 50, weightRadius, {
    mass: 0.04,
    frictionAir: 0,
    interia: Infinity,
     render: {fillStyle: 'red'}
    });

  restingPendulum.pendulumString = World.add(engine.world, Constraint.create({
      bodyA: protractor2,
      bodyB: restingPendulum.pendulumBody,
      length: 0,
      render: {
        strokeStyle: 'red',
        lineWidth: 6
      }
    }));

  World.add(engine.world, [pendulum.pendulumBody, restingPendulum.pendulumBody, protractor1, protractor2]);
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
  if (engine.timing.timestamp === 0) {
    State.setIsPausedFlag(false);
    State.onPause(render);
    State.setSimulationRunning(true);
    Body.applyForce(pendulum.pendulumBody, {x: pendulum.pendulumBody.position.x, y: pendulum.pendulumBody.position.y}, {x: 0.0017, y: 0});
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
  pendulum.pendulumAngle = pendulum.calculateAngle(PROT_POS_1, pendulum.pendulumBody.position);
  pendulum.pendulumHeight = pendulum.calculatePenulumHeight(pendulum.pendulumStringLength / PTM, pendulum.pendulumAngle);
  restingPendulum.pendulumAngle = pendulum.calculateAngle(PROT_POS_2, restingPendulum.pendulumBody.position);
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
  restingPendulum.pendulumAngle = pendulum.calculateAngle(PROT_POS_2, restingPendulum.pendulumBody.position);
  restingPendulum.pendulumHeight = pendulum.calculatePenulumHeight(restingPendulum.pendulumStringLength / PTM, restingPendulum.pendulumAngle);

  if (restingPendulum.pendulumHeight < 0.068){
    pendulum.pendulumAngle = pendulum.calculateAngle(PROT_POS_1, pendulum.pendulumBody.position);
    pendulum.pendulumHeight = pendulum.calculatePenulumHeight(pendulum.pendulumStringLength / PTM, pendulum.pendulumAngle);

    pendulum.displayPendulumHeight(PENDUMDULUM_HEIGHT_ID);
    restingPendulum.displayPendulumHeight(RESTING_PENDUMDULUM_HEIGHT_ID);
    State.displayRunningTime(engine);
  }
});

//update UI after each update
Events.on(engine, 'afterUpdate', function(event) {
  // Stop when speed is below 0.2
  if (restingPendulum.pendulumHeight > 0.068){
    State.setIsPausedFlag(true);
    State.onPause(render);
    stopPlotInterval();
    State.setSimulationRunning(false);
  }
});

/**
  * Listens for whether the current browser tab is active or not
*/

// document.addEventListener('visibilitychange', function() {
//   if (!document.hidden) {
//     if (State.getIsPausedFlag() === false) {
//       runPlotInterval();
//     }
//   }
//   else {
//     stopPlotInterval();
//   }
// });
