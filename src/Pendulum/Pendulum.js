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
    return( 90 - Math.abs(Math.round(Math.atan2(firstPoint.y - secondPoint.y, firstPoint.x - secondPoint.y) * 180 / Math.PI)));
  }

  /**
    * Updates the angle of the pendulum to the user
  */

  displayPendulumAngle() {
    document.getElementById('pendulum-angle').textContent = 'Angle: ' + this.pendulumAngle;
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
}

module.exports = Pendulum;
