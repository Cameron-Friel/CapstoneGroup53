## Interactive 2D Simulations for Inquiry-Based Learning Capstone Team 53

### `Beta build`
The simulations for the beta build can be found at ``web.engr.oregonstate.edu/~wilsosam``.

## Build Instructions

To get started `clone` the repository and then run `npm install` to install all the dependencies in the project. 
Make sure you have node installed by entering in `node --version`.

### `Building with Gulp`

This project utilizes Gulp to help automate build tasks. In order to install gulp enter 
```
npm install -g gulp-cli
```
Once installed, to generate a build folder in the root of the project enter into the command line
```
gulp
``` 
This should generate folders case1-case5 and exploratory in the generated build folder. 
You can then navigate to one of the case folders in the generated build folder (i.e. /build/case1) and enter `start index.html` into the command line to view a specific case in the browser. 

Alternatively, in order to build a single case into the build folder located in the root of the project, use the command:
```
gulp build --case [folder name]
``` 
For example: `gulp build --case case2`. 

### `Browserify`
Alternatively, use browserify to manually generate the needed JavaScript file. Navigate to a specific case folder at /src/Pendulum/<case_folder_name> and use `browserify sketch.js -o bundle.js`. After bundle.js is generated, use `start index.html`.

## Access to Modules

### `Modules`

There are two basic modules in the project named State and Pendulum.

## The State Module

The State module handles understanding the current state of the canvas, such as whether it is paused.

## The Pendulum Module

The Pendulum module is in charge of keeping tack of the pendulum bodies and properties within the world.

## The Graph Module

The Graph module handles the state of every graph generated in the project.
