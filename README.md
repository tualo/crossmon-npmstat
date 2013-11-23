Description
===========

Crossmon-npmstat is a statistic gattering module for [crossmon-collect](https://github.com/tualo/crossmon-collect).


Requirements
============

* [node.js](http://nodejs.org/) -- v0.8.0 or newer
* [crossmon-collect](https://github.com/tualo/crossmon-collect)

Installation
============
If you have installed crossmon-collect globally you can run:

    npm install crossmon-npmstat -g

If you have only a local installation of the gattering serivce run:

    npm install crossmon-npmstat

After that you can configure the module by:

    crossmon-collect enable crossmon-npmstat
    crossmon-collect setup crossmon-npmstat

If you have done so, let's check if it works:

    crossmon-collect test crossmon-npmstat

If no error messages occur and you see an JSON-Array of Items like:

    { program: 'npmstat',
        tag: 'crossmon-collect',
        time: 1384819200000,
        value: 6 
    }

All is done. You can restart the gattering serivce by:

    crossmon-collect restart

