'use strict';

let State = (function() {
  let Render = Matter.Render;
  let _simulationRunning = false;
  let _isPausedFlag = true;
  let _simulationTime = 0;
  let _runningTime = 0;

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
        this.setSimulationTime(Date.now());
        Render.run(render);
      }
    },

    /**
      * Increments the amount of time the simulation has been running
    */

    sumRunningTime: function() {
      _runningTime += (Date.now() - this.getSimulationTime()) / 1000;
      this.setSimulationTime(Date.now());
    },

    /**
      * Updates the value of _runningTime
      * @param {float} time - the time the simulation has been running for
    */

    setRunningTime: function(time) {
      _runningTime = time;
    },

    /**
      * Returns the current time in seconds the simulation has been running
      * @returns {State} _runningTime
    */

    getRunningTime: function() {
      return Math.floor(_runningTime);
    },

    /**
      * Updates the value of _simulationTime
      * @param {Date} date - the current date of the simulation
    */

    setSimulationTime: function(date) {
      _simulationTime = date;
    },

    /**
      * Returns the previous simulation time
      * @returns {State} _simulationTime
    */

    getSimulationTime: function() {
      return _simulationTime;
    },

    /**
      * Displays to the user the current running time of the simulation
    */

    displayRunningTime: function() {
      this.sumRunningTime();

      let currentTime = this.getRunningTime();

      if (currentTime > 60) { // more than a minute has gone by
        let quotient = Math.floor(currentTime / 60); // minutes
        let remainder = currentTime % 60; // seconds

        document.getElementById('running-time').textContent = 'Time: ' + quotient + ' Minutes ' + remainder + ' Seconds';
      }
      else {
        document.getElementById('running-time').textContent = 'Time: ' + currentTime + ' Seconds';
      }
    },
  };
})();

module.exports = State;
