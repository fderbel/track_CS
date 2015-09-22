# track_CS : Track Client Side

Track Client Side is a web application. This application allows to collect basic actions of users at client side (mouse, key) and send them to a trace based management system (TBMS). Such a TBMS is currently available (kTBS) for installation on any server. Collected traces are stored through this TBMS on a specific server which has to be identified.
For more information about KTBS you may have a look on the official documentation :https://kernel-for-trace-based-systems.readthedocs.org/en/latest/

Track Client Sid is written in HTML and JavaScript. Track use [grunt](http://gruntjs.com/) as Task-Runner/build tool, [npm](https://docs.npmjs.com/|npm) and [bower](http://bower.io/|bower) for dependency management.These tools needs [Node.js](https://nodejs.org/en/|Node.js) runtime environment.

`node` and `npm` should be installed with your distribution package manager (apt-get, yum, pacman…) if possible and if the version packaged for your distribution is the actual stable Node.js version. At least you need a node version >= 0.12.7 and npm version >= 2.14.1. You can check theses version with `node –version` and `npm –version`.

## Import Track in your application web 
npm install -g bower 

bower install https://github.com/fderbel/track_CS.git

add the collecteur script in your page html 

    <script type="text/javascript" src="Path of CollecteurTrack in your app/collecteurTrack.js"></script>


Admin of application can configure the tracing by opening the html page `configTrack.html`
You can specify the elements you want to collect for a site:

1) Load the targeted website (the site will be loaded in an iframe);

2) Select an element that you want to collect in; the selector of the element is displayed;

3) Pressing the button adds this element as an element to be traced when interacted by the user;

4) copy the selector text in the field selector

5) you can give a type to this element (obsel-type = type of observed element).

6) save configuration in `configTrack.json` file

By default, if you do not specify what has to be traced in a web page, track collects only the URL of the visited web page.

## Install Track

npm install

bower install

grunt connect

Open localhost:8080

## Project Directory Structure

bower.json: A file describing client-side dependencies of the project.

bower_components/: Directory containing client-side dependencies.

node_modules/: Directory containing build dependencies (or server-side dependencies for Node.js based server applications).

package.json: A file describing build dependencies of the project. (usually this folder contains server-side dependencies for Node.js based server applications)

src/collecteurTrack.js

src/sharedWebWorker.js

src/configTrack.json

src/configTrack.html

src/configTrack.js
