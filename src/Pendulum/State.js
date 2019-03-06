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
