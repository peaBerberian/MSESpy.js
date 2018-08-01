# MSESpy.js ####################################################################


## Overview ####################################################################

This is a tool to spy on most MSE-related browser API calls.

Everytime any of the following API have been triggered, this tool logs the
arguments with which the call was done, and also logs the response when it has
succeeded or failed:
  - ``MediaSource.prototype.addSourceBuffer``
  - ``MediaSource.prototype.removeSourceBuffer``
  - ``MediaSource.prototype.endOfStream``
  - ``MediaSource.prototype.setLiveSeekableRange``
  - ``MediaSource.prototype.clearLiveSeekableRange``
  - ``MediaSource.prototype.isTypeSupported``
  - ``SourceBuffer.prototype.appendBuffer``
  - ``SourceBuffer.prototype.abort``
  - ``SourceBuffer.prototype.remove``



## How to install it ###########################################################

### Including the script directly ##############################################

Because this is mainly a debugging application, the most straightforward way of
using it is just to copy the code of the [compiled bundle
](https://raw.githubusercontent.com/peaBerberian/MSESpy.js/master/dist/bundle.js)
directly, and to copy-paste it into your console.

You will then have a global ``MSESpy`` object, through which you can call any
API defined here.

Example:
```js
MSESpy.startMSESpy();
```

This configuration can also be useful by including this script automatically in
multimedia pages. This can be done through userscript managers, such as
[Tampermonkey for Chrome
](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
or [Greasemonkey for Firefox
](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/).



## API #########################################################################

The API is basically as follow:
```js
// Start spying on MSE calls.
// Under default settings, every MSE calls will be logged through either
// console.debug, for API calls and responses/resolved promises or through
// console.error for errors/rejected promises.
// The `MSE_CALLS` object will also be filled when the spy is active (see
// below).
const spy = MSESpy.startMSESpy();

// Stop the created MSE spy:
//   - stop logging when MSE API are called
//   - stop adding entries to the MSE_CALLS
//   - clean up the resources taken
spy.restore();

// The MSE_CALLS Object contains every details about all the API calls (date at
// which it has been called, context, arguments, response, date of the response,
// errors...) when the spy has been active.
console.log(MSESpy.MSE_CALLS);

// You can also declare custom log functions

// For debug calls (when a MSE API is called and was resolved/returned
// sucessfully - depending on the type of API)
MSESpy.Logger.debug = function(...args) {
  myPersonalLogger.debug(...args);
}

// For errors and rejected promises from MSE APIs
MSESpy.Logger.error = function(...args) {
  myPersonalLogger.error(...args);
}
```
