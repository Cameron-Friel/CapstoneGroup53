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



 /*
 *  Create world
 */

createWorld(); // add bodies to canvas

Render.run(render); // allow for the rendering of frames of the world

renderLoop(); // renders frames to the canvas

/*
* Add chart
*/

var interval;
var seconds = 0.0;
var ctx = document.getElementById("chart").getContext('2d');

var myChart = new Chart(ctx, {
type: 'line',
data: {
    datasets: [{
        label: 'Change in angle',
        data: [{
        }]
    }]
},
options: {
    responsive: true,
    maintainAspectRatio: false,
    showLines: true,
    scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                      labelString: 'Time (ms)',
                      display: true
                    }
                }],

      }
    }
});


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

    addData(myChart, {x: engine.timing.timestamp, y: pendulum.pendulumAngle});
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
  if (pauseBtn.value == "pause") {
    pauseBtn.innerText = "cont.";
    pauseBtn.value = "continue";
  }
  else {
    pauseBtn.value = "pause";
    pauseBtn.innerText = "Pause" ;
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
  }
};

/*
  * Resets the world to its starting state
*/

document.getElementById('reset-button').onclick = function() {
  World.clear(engine.world);
  createWorld();
  engine.timing.timestamp = 0;
  State.setRunningTime(0.0);
  resetChartData(myChart);
  State.displayRunningTime();
  pendulum.displayPendulumAngle();
  State.setSimulationRunning(false);

  if (State.getIsPausedFlag() === false) {
    State.setIsPausedFlag(true);
    State.onPause(render);
  }
};

/*
* Adds data points to the chart.
*/

function addData(chart, data) {
  chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
  });
    chart.update();
}

/*
  * Resets the chart data back to an empty state
*/

function resetChartData(chart) {
  let data = {
      datasets: [{
          label: 'Change in angle',
          data: [{
          }]
      }]
  };

  chart.config.data = data;
  chart.update();
}
