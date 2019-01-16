'use strict';

let EngineHandler = require('./EngineHandler.js');
let State = require('./State.js');
let Pendulum = require('./Pendulum.js');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

let RenderHandler = (function() {
  let Engine = Matter.Engine;
  let Render = Matter.Render;

  return {
    render: null,

    /*
      * Renders frames to send to the canvas
    */

    renderLoop: function() {
      if (State.getIsPausedFlag()) { // the world is paused
        requestAnimationFrame(RenderHandler.renderLoop); // render next frame
      }
      else {
        Engine.update(EngineHandler.getEngine(), 1000 / 60); // update at 60 FPS
        requestAnimationFrame(RenderHandler.renderLoop); // render next frame

        Pendulum.setPendulumAngle(Pendulum.calculateAngle(Pendulum.string.bodies[0].position, Pendulum.pendulumWeight.position));
        Pendulum.displayPendulumAngle();
      }
    },

    /*
      * Creates a reference to the canvas
    */

    setupCanvas: function() {
      this.render = Render.create({
          element: document.getElementById('canvas'),
          engine: EngineHandler.getEngine(),
          options: {
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              wireframes: false
          }
       });
    },

    /*
      * Determines whether to continue rendering the world or not
      * @param {boolean} isPaused - Flag to tell if the world is paused or not
    */

    determineRender: function(isPaused) {
      if (isPaused) { // the world is paused
        this.stopRender();
      }
      else {
        this.startRender();
      }
    },

    /*
      * Begins rendering the world
      * @param render - Renders the world view
    */

    startRender: function() {
      Render.run(this.render);
    },

    /*
      * Stops the world from rendering
      * @param render - Renders the world view
    */

    stopRender: function() {
      Render.stop(this.render);
    },
  };
})();

module.exports = RenderHandler;
