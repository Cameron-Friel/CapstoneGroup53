(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

let Graph = (function() {
  let _graph = {};

  return {
    /**
      * Creates a new graph
      * @param {} reference - The reference to the html page
      * @param {} data - The graph data
    */

    createGraph: function(reference, data) {
      let tempData = JSON.parse(JSON.stringify(data));

      _graph = new Chart(reference, {
      type: 'line',
      data: {
        datasets: tempData.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        showLines: true,
        scales: {
          xAxes: tempData.xAxes,
          yAxes: tempData.yAxes,
        }
      }
    });
  },

  /**
    * Adds points to the graph
    * @param {} data - The graph data
  */

  addGraphData: function(data, dataset) {
    _graph.data.datasets[dataset].data.push(data);

    _graph.update();
  },

  /**
    * Resets the chart data back to an empty state
    * @param {} newData - The graph data
  */

  resetGraphData: function(data) {
    let tempData = JSON.parse(JSON.stringify(data));

    _graph.config.data = tempData;
    _graph.options.scales.xAxes[0].scaleLabel.labelString = tempData.xAxes[0].scaleLabel.labelString;
    _graph.options.scales.yAxes[0].scaleLabel.labelString = tempData.yAxes[0].scaleLabel.labelString;
    _graph.update();
  },
};
})();

module.exports = Graph;

},{}],2:[function(require,module,exports){
'use strict';

/**
  * @class Pendulum
 * The Pendulum module is in charge of keeping tack of the pendulum bodies and properties within the world.
*/
const DEG_TO_RAD = Math.PI / 180;

class Pendulum {


  constructor() {
    this._pendulumBody = null;
    this._pendulumAngle = null;
    this._pendulumHeight = null;
    this._pendulumString = null;
  }

  /**
    * Sets the body of the pendulum
  */

  set pendulumBody(body) {
    this._pendulumBody = body;
  }

  /**
    * Returns the body of the pendulum
    * @returns {Bodies} _pendulumBody
  */

  get pendulumBody() {
    return this._pendulumBody;
  }

  /**
    * Sets the body of the string
    * @returns {Bodies} _pendulumString
  */

  set pendulumString(string) {
    this._pendulumString = string;
  }

  /**
    * Returns the body of the string
    * @returns {Body} _pendulumString
  */

  get pendulumString() {
    return this._pendulumString;
  }

  /**
    * Calculates the arctangent of a line given two coordinates
    * @param {Int} firstPoint - the first coordinate given as (x, y) as its datamembers
    * @param {Int} secondPoint - the second coordinate given as (x, y) as its datamembers
    * @returns {Int} angle - the angle of the line
  */

  calculateAngle(firstPoint, secondPoint) {
    let angle = Math.round(Math.abs(Math.atan2(firstPoint.y - secondPoint.y, firstPoint.x - secondPoint.x) * 180 / Math.PI));

    return Math.abs(angle - 90);
  }

  /**
    * Calculates the length of the pendulum's string
    * @param {Vector} firstPoint - the first coordinate given as (x, y) as its datamembers
    * @param {Vector} secondPoint - the second coordinate given as (x, y) as its datamembers
    * @returns {Int} length
  */

  calculateStringLength(firstPoint, secondPoint) {
    return Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y);
  }

  /**
    * Calculates the height of the pendulum in meters
    * @param {Int} length - the length of the pendulum
    * @param {Int} angle - the angle of the pendulum
    * @returns {Int} height - the height of the pendulum
  */

  calculatePenulumHeight(length, angle) {
    return length * (1 - Math.cos(angle * DEG_TO_RAD));
  }

  /**
    * Updates the angle of the pendulum to the user
  */

  displayPendulumAngle() {
    document.getElementById('pendulum-angle').textContent = 'Angle: ' + this.pendulumAngle;
  }

  /**
   * Updates velocity of angle
   * @param {String} id
   */

   displayVelocity(id) {
      document.getElementById(id).textContent = this.pendulumBody.speed.toFixed(3) + 'm/s';
   }

  /**
    * Updates the height of the pendulum to the user
    * @param {String} id - a DOM id
  */

  displayPendulumHeight(id) {
    document.getElementById(id).textContent = this.pendulumHeight.toFixed(3) + 'm';
  }

  /**
    * Updates the value of _pendulumAngle
    * @param {Int} angle - the current angle of the pendulum
  */

  set pendulumAngle(angle) {
    this._pendulumAngle = angle;
  }

  /**
    * Returns the angle of the pendulum
    * @returns {Int} _pendulumAngle
  */

  get pendulumAngle() {
    return this._pendulumAngle;
  }

  /**
    * Updates the value of _pendulumHeight
    * @param {Int} height - the current height of the pendulum from the bottom of the canvas
  */

  set pendulumHeight(height) {
    this._pendulumHeight = height;
  }

  /**
    * Returns the height of the pendulum measured from the bottom of the canvas to the bottom of the pendulum
    * @returns {Int} _pendulumHeight
  */

  get pendulumHeight() {
    return this._pendulumHeight;
  }

  /**
    * Returns the velocity of the pendulum
    * @returns {Int}
  */

  get pendulumVelocity() {
    return this._pendulumBody.speed;
  }

  /**
    * Updates the value of the length of the string
    * @param {Int} length - the length of the string
  */

  set pendulumStringLength(length) {
    this.pendulumString.length = length;
  }

  /**
    * Returns the length of the pendulum's string
    * @returns {Int}
  */

  get pendulumStringLength() {
    return this.pendulumString.length;
  }

  get mass() {
    return this.pendulumBody.mass;
  }
}

module.exports = Pendulum;

},{}],3:[function(require,module,exports){
'use strict';

let State = (function() {
  let Render = Matter.Render;
  let _simulationRunning = false;
  let _isPausedFlag = true;

  return {
    /**
      * Updates the value of _isPausedFlag
      * @param {boolean} bool - the value to set the _isPausedFlag
    */

    setIsPausedFlag: function(bool) {
      _isPausedFlag = bool;
    },

    /**
      * Returns whether the world is paused or not
      * @returns {State} _isPausedFlag
    */

    getIsPausedFlag: function() {
      return _isPausedFlag;
    },

    /**
      * Updates the value of _simulationRunning
      * @param {boolean} bool - the value to set _simulationRunning to
    */

    setSimulationRunning: function(bool) {
      _simulationRunning = bool;
    },

    /**
      * Returns whether the simulation is running or not
      * @returns {bool} _simulationRunning
    */

    getSimulationRunning: function() {
      return _simulationRunning;
    },

    /**
      * Determines whether to continue rendering the world or not
      * @param {Render} render - displays the world
    */

    onPause: function(render) {
      if (_isPausedFlag) { // the world is paused
        Render.stop(render);
      }
      else {
        Render.run(render);
      }
    },

    /**
      * Displays to the user the current running time of the simulation
    */

    displayRunningTime: function(engine) {
      let currentTime = (engine.timing.timestamp / 1000).toFixed(3);

      if (currentTime > 60) { // more than a minute has gone by
        let quotient = Math.floor(currentTime / 60); // minutes
        let remainder = (currentTime % 60).toFixed(3); // seconds

        document.getElementById('running-time').textContent = quotient + 'm ' + remainder + 's';
      }
      else {
        document.getElementById('running-time').textContent = currentTime + 's';
      }
    },
  };
})();

module.exports = State;

},{}],4:[function(require,module,exports){
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
const P_RAD = 30; //pendulum radius
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

let leftPendulum = new Pendulum;
let rightPendulum = new Pendulum;

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
     label: 'Height a',
     borderColor: 'rgba(0, 0, 255, 0.1)',
     backgroundColor: 'rgba(0, 0, 255, 0.1)',
     data: [{
       x: 0,
       y: 0.068
     }]
  },
  {
    label: 'Height b',
    borderColor: 'rgba(255, 0, 0, 0.1)',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    data: [{
      x: 0,
      y: 0.068
    }]
  }],
  xAxes: [{
    type: 'linear',
    position: 'bottom',
    ticks: {
      min: 0,
      max: 1600,
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
      max: 0.10,
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
     Bodies.rectangle(400, 0, 800, 50, { isStatic: true, render: {fillStyle: 'grey'}}),
     Bodies.rectangle(400, 600, 800, 50, { isStatic: true, render: {fillStyle: 'grey'}}),
     Bodies.rectangle(800, 300, 50, 600, { isStatic: true, render: {fillStyle: 'grey'}}),
     Bodies.rectangle(0, 300, 50, 600, { isStatic: true, render: {fillStyle: 'grey'}})
  ]);

  let protractor1 = Bodies.circle(PROT_POS_1.x, PROT_POS_1.y, 10, {
    isStatic: true,
    render: {fillStyle: 'grey'}});

  let protractor2 = Bodies.circle(PROT_POS_2.x, PROT_POS_2.y, 10, {
    isStatic: true,
    render: {fillStyle: 'grey'}});

    // left pendulum
  var x1 = calcInitialX(30, 1);
  var y1 = calcInitialY(30);

  leftPendulum.pendulumBody = Bodies.circle(x1, y1, P_RAD, {
      mass: 0.04,
      frictionAir: 0,
      interia: Infinity,
      restitution: 0.7,
      render: {fillStyle: '#5669FC'} // Light blue
    });
  // 161.55 279.821

  leftPendulum.pendulumString = World.add(engine.world, Constraint.create({
    bodyA: protractor1,
    bodyB: leftPendulum.pendulumBody,
    length: 0,
    render: {
      strokeStyle: '#5669FC',
      lineWidth: 6
    }
  }));

  leftPendulum.pendulumStringLength = leftPendulum.calculateStringLength(protractor1.position, leftPendulum.pendulumBody.position);

  //right pendulum
  var x2 = calcInitialX(30, 2);
  var y2 = calcInitialY(30);

  rightPendulum.pendulumBody = Bodies.circle(x2, y2, P_RAD, {
    mass: 0.04,
    frictionAir: 0,
    interia: Infinity,
    render: {fillStyle: '#FC5658'} // Light red
  });

  rightPendulum.pendulumString = World.add(engine.world, Constraint.create({
      bodyA: protractor2,
      bodyB: rightPendulum.pendulumBody,
      length: 0,
      restitution: 0.7,
      render: {
        strokeStyle: '#FC5658',
        lineWidth: 6
      }
    }));

    World.add(engine.world, [leftPendulum.pendulumBody, rightPendulum.pendulumBody, protractor1, protractor2]);
}

/**
  * Sends a request to plot a coordinate every 100ms
*/

function runPlotInterval() {
  plotInterval = setInterval(function() {
    Graph.addGraphData({ x: engine.timing.timestamp.toFixed(3), y: leftPendulum.pendulumHeight.toFixed(3) }, 0);
    Graph.addGraphData({ x: engine.timing.timestamp.toFixed(3), y: rightPendulum.pendulumHeight.toFixed(3) }, 1);
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
    Body.applyForce(leftPendulum.pendulumBody, {x: leftPendulum.pendulumBody.position.x, y: leftPendulum.pendulumBody.position.y}, {x: 0.0003, y: 0});
    Body.applyForce(rightPendulum.pendulumBody, {x: rightPendulum.pendulumBody.position.x, y: rightPendulum.pendulumBody.position.y}, {x: -0.0003, y: 0});
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
  leftPendulum.pendulumAngle = leftPendulum.calculateAngle(PROT_POS_1, leftPendulum.pendulumBody.position);
  leftPendulum.pendulumHeight = leftPendulum.calculatePenulumHeight(leftPendulum.pendulumStringLength / PTM, leftPendulum.pendulumAngle);
  rightPendulum.pendulumAngle = leftPendulum.calculateAngle(PROT_POS_2, rightPendulum.pendulumBody.position);
  rightPendulum.pendulumHeight = leftPendulum.calculatePenulumHeight(rightPendulum.pendulumStringLength / PTM, rightPendulum.pendulumAngle);
  leftPendulum.displayPendulumHeight(PENDUMDULUM_HEIGHT_ID);
  rightPendulum.displayPendulumHeight(RESTING_PENDUMDULUM_HEIGHT_ID);

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
  leftPendulum.pendulumAngle = leftPendulum.calculateAngle(PROT_POS_1, leftPendulum.pendulumBody.position);
  leftPendulum.pendulumHeight = leftPendulum.calculatePenulumHeight(leftPendulum.pendulumStringLength / PTM, leftPendulum.pendulumAngle);
  rightPendulum.pendulumAngle = leftPendulum.calculateAngle(PROT_POS_2, rightPendulum.pendulumBody.position);
  rightPendulum.pendulumHeight = leftPendulum.calculatePenulumHeight(rightPendulum.pendulumStringLength / PTM, rightPendulum.pendulumAngle);
  leftPendulum.displayPendulumHeight(PENDUMDULUM_HEIGHT_ID);
  rightPendulum.displayPendulumHeight(RESTING_PENDUMDULUM_HEIGHT_ID);
  State.displayRunningTime(engine);

  // Stop when speed is below 0.2
  if (leftPendulum.pendulumBody.speed <= 0.4 && leftPendulum.pendulumBody.speed !== 0.0){
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

},{"../Graph.js":1,"../Pendulum.js":2,"../State.js":3}]},{},[4]);
