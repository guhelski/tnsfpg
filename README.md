The Not So Fancy Photo Gallery
======
[![Build Status](https://travis-ci.org/guhelski/tnsfpg.png?branch=master)](https://travis-ci.org/guhelski/tnsfpg)

Super simple don't-try-this-at-home file system based photo gallery built with [Node.js](http://nodejs.org/) and [Express](http://expressjs.com/).

How to use
----------
You'll need [Node.js](http://nodejs.org/), if you don't have it already, [download](http://nodejs.org/download/) and install it first.

All dependencies are already installed so to get up and running you just need to clone the repository:
```
git clone git@github.com:guhelski/tnsfpg.git
```
And in the project directory run:
```
make run
```

If everything goes well, now you can point your browser to `http://localhost:3000/` and you should see a photo of Valentino Rossi on his former red Ducati.

How to test
--------------
Tests use [Zombie.js](http://zombie.labnotes.org/) and [Mocha](http://visionmedia.github.io/mocha/), you can run them all with:
```
make test
```
*Keep in mind that running the tests will reset the gallery to it's original state, removing any uploaded photo.*

===

If you ever need to update or rebuild all the dependencies, you can do so with:
```
make update
```
