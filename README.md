## Interactive 2D Simulations for Inquiry-Based Learning Capstone Team 53

### `Alpha build`
The simulations for the alpha build can be found at ``web.engr.oregonstate.edu/~wilsosam``.

## Build Instructions

To get started `clone` the repository and then run `npm install` to install all the dependencies in the project. Make sure you have node installed by entering in `node --version`.

### `Building with Gulp`

This project utilizes Gulp to help automate build tasks. In order to install gulp enter `npm install -g gulp-cli`. Once installed, you can enter in `gulp` to create a build folder in the root of the project. Alternatively, you can enter `gulp build --case [folder name]` into the command line in order to build a single case into the build folder located in the root of the project. You can then navigate to the generated build folder and enter `start index.html` into the command line in one of the case folders to view a specific case in the browser. 

## Access to Modules

### `Modules`

There are two basic modules in the project named State and Pendulum.

## The State Module

The State module handles understanding the current state of the canvas, such as whether it is paused.

## The Pendulum Module

The Pendulum module is in charge of keeping tack of the pendulum bodies and properties within the world.

## The Graph Module

The Graph module handles the state of every graph generated in the project.
