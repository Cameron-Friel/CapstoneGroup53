'use strict';

/**
  * @class Pendulum
 * The Pendulum module is in charge of keeping tack of the pendulum bodies and properties within the world.
*/

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
    return length * (1 - Math.cos(angle * Math.PI / 180));
  }

  /**
    * Updates the angle of the pendulum to the user
  */

  displayPendulumAngle() {
    document.getElementById('pendulum-angle').textContent = 'Angle: ' + this.pendulumAngle;
  }

  /**
    * Updates the height of the pendulum to the user
  */

  displayPendulumHeight() {
    document.getElementById('pendulum-height').textContent = 'Height: ' + this.pendulumHeight.toFixed(3) + 'm';
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
}

module.exports = Pendulum;
