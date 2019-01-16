'use strict';

let Pendulum = require('./Pendulum.js');

let EngineHandler = (function() {
  let Engine = Matter.Engine;
  let World = Matter.World;
  let Bodies = Matter.Bodies;
  let Constraint = Matter.Constraint;

  return {
    engine: Engine.create(),
    
    /*
      * Returns the world engine
      * @returns {Matter.Engine}
    */

    getEngine: function() {
      return this.engine;
    },

    /*
      * Sets up initial bodies of the world
    */

    createWorld: function() {
      // walls of the canvas
      World.add(this.engine.world, [
         Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
         Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
         Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
         Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
      ]);

      Pendulum.pendulumWeight = Bodies.circle(100, 100, 40, { mass: 0.04, frictionAir: 0});

      let protractor = Bodies.circle(400, 50, 60, { isStatic: true});

      World.add(this.engine.world, [Pendulum.pendulumWeight, protractor]);

      Pendulum.string = World.add(this.engine.world, Constraint.create({
        bodyA: protractor,
        bodyB: Pendulum.pendulumWeight,
        length: 0,
      }));
    }
  }
})();

module.exports = EngineHandler;
