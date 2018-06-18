# Computer_Graphics_FruitCollector

Fruit Collector
————————————

The 2D scene looks like a garden and in the middle there is a manipulator robot on the ground. The sun is modeled as a fixed light source. Main objective of the robot is to pick up every fruit and place it inside the basket that stands next to robot. There is a button that when one clicks it a fruit appears at random in the scene. Each fruit has its own texture based on the fruit also the basket. The manipulator will have hierarchical model. Once the button is clicked and the fruit appears, the animation starts with the manipulator grabbing the fuit and placing it in the basket. 
_____________

To run, please download the following dependency to the library math.js

First clone the project from github:

    git clone git://github.com/josdejong/mathjs.git
    cd mathjs

Install the project dependencies:

    npm install

Then, the project can be build by executing the build script via npm:

    npm run build

This will build the library math.js and math.min.js from the source files and
put them in the folder dist.
