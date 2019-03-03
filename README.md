## Interactive 2D Simulations for Inquiry-Based Learning Capstone Team 53

### `Alpha build`
The simulations for the alpha build can be found at ``web.engr.oregonstate.edu/~wilsosam``.

To get started `clone` the repository and then run `npm install` to install all the dependencies in the project.

### `Building with Gulp`

This project utilizes Gulp to help automate build tasks. In order to package a case, you need to enter `gulp build --case [folder name]` into the command line in order to build a case into the build folder located in the root of the project. You can then navigate to the generated build folder and enter `start index.html` into the command line to view the specific case in the browser. 

## Access to Modules

### `Modules`

There are two basic modules in the project named State and Pendulum.

## The State Module

The State module handles understanding the current state of the canvas, such as whether it is paused.

## The Pendulum Module

The Pendulum module is in charge of keeping tack of the pendulum bodies and properties within the world.
