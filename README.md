Description
===========

Crossmon-npmstat is a statistic gattering module for crossmon-collect.


Requirements
============

* [node.js](http://nodejs.org/) -- v0.8.0 or newer
* crossmon-collect

Installation
============
If you have installed crossmon-collect globaly you can run:

    npm install crossmon-npmstat -g

If you have only a local installation of the gattering serivce run:

    npm install crossmon-npmstat

After that you can configure the module by:

    crossmon-collect -c enable crossmon-npmstat
    crossmon-collect -c setup crossmon-npmstat add <your-package>

If you have done so, let's check if it works:

    crossmon-collect -t crossmon-npmstat

If no error messages occur and you see an JSON-Array of Items like:

    { program: 'npmstat',
        tag: 'crossmon-collect',
        time: 1384819200000,
        value: 6 
    }

All is done. You can restart the gattering serivce by:

    crossmon-collect restart

