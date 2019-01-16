'use strict';

let Pendulum = (function() {
  return {
    pendulumAngle: null,
    pendulumHeight: null,
    pendulumWeight: null,
    pendulumString: null,

    /*
      * Returns the angle of the pendulum
      * @returns {Int} pendulumAngle
    */

    getPendulumAngle: function() {
      return this.pendulumAngle;
    },

    /*
      * Updates the value of pendulumAngle
      * @param {Int} angle - the current angle of the pendulum
    */

    setPendulumAngle: function(angle) {
      this.pendulumAngle = angle;
    },

    /*
      * Calculates the arctangent of a line given two coordinates
      * @param {Int} firstPoint - the first coordinate given as (x, y) as its datamembers
      * @param {Int} secondPoint - the second coordinate given as (x, y) as its datamembers
      * @returns {Int} angle - the angle of the line
    */

    calculateAngle: function(firstPoint, secondPoint) {
      return Math.abs(Math.round(Math.atan2(firstPoint.y - secondPoint.y, firstPoint.x - secondPoint.y) * 180 / Math.PI));
    },

    /*
      * Updates the angle of the pendulum to the user
    */

    displayPendulumAngle: function() {
      document.getElementById('pendulum-angle').textContent = 'Angle: ' + this.pendulumAngle;
    },

    /*
      * Returns the height of the pendulum measured from the bottom of the canvas to the bottom of the pendulum
      * @returns {Int} pendulumHeight
    */

    getPendulumHeight: function() {
      return this.pendulumHeight;
    },

    /*
      * Updates the value of pendulumHeight
      * @param {Int} height - the current height of the pendulum from the bottom of the canvas
    */

    setPendulumHeight: function(height) {
      this.pendulumHeight = height
    },
  };
})();

module.exports = Pendulum;
