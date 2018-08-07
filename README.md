# MSESpy.js ####################################################################


## Overview ####################################################################

This is a tool to spy on most MSE-related browser API calls.

It logs and registers when any of the following actions take place:

  1. the following MediaSource methods are called:
    - ``MediaSource.prototype.addSourceBuffer``
    - ``MediaSource.prototype.removeSourceBuffer``
    - ``MediaSource.prototype.endOfStream``
    - ``MediaSource.prototype.setLiveSeekableRange``
    - ``MediaSource.prototype.clearLiveSeekableRange``
    - ``MediaSource.isTypeSupported``
    - ``MediaSource.prototype.addEventListener``
    - ``MediaSource.prototype.removeEventListener``
    - ``MediaSource.prototype.dispatchEvent``

  2. Those MediaSource properties are get/set:
    - ``MediaSource.prototype.duration``
    - ``MediaSource.prototype.onsourceopen``
    - ``MediaSource.prototype.onsourceended``
    - ``MediaSource.prototype.onsourceclose``
    - ``MediaSource.prototype.sourceBuffers``
    - ``MediaSource.prototype.activeSourceBuffers``
    - ``MediaSource.prototype.readyState``

  3. Those SourceBuffer methods are called:
    - ``SourceBuffer.prototype.appendBuffer``
    - ``SourceBuffer.prototype.abort``
    - ``SourceBuffer.prototype.remove``
    - ``SourceBuffer.prototype.appendBuffer``
    - ``SourceBuffer.prototype.addEventListener``
    - ``SourceBuffer.prototype.removeEventListener``
    - ``SourceBuffer.prototype.dispatchEvent``

  4. Those SourceBuffer properties are get/set:
    - ``SourceBuffer.prototype.mode``
    - ``SourceBuffer.prototype.timestampOffset``
    - ``SourceBuffer.prototype.appendWindowStart``
    - ``SourceBuffer.prototype.appendWindowEnd``
    - ``SourceBuffer.prototype.onupdate``
    - ``SourceBuffer.prototype.onupdatestart``
    - ``SourceBuffer.prototype.onupdateend``
    - ``SourceBuffer.prototype.onerror``
    - ``SourceBuffer.prototype.onabort``
    - ``SourceBuffer.prototype.updating``
    - ``SourceBuffer.prototype.buffered``

The registered data is:

  - the date at which the API has been called or the property as been interacted
    with

  - the returned value for an API call or a property access

  - the argument(s) for API calls

  - the value set on properties

  - the context (``this``) at the time of the call

  - the error if the API call threw

It can then be used to produced useful reports on how those APIs are exploited
by the application.


## How to install it ###########################################################

### Including the script directly ##############################################

Because this is mainly a debugging application, the most straightforward way of
using it is just to copy the code of the [compiled bundle
](https://raw.githubusercontent.com/peaBerberian/MSESpy.js/master/dist/bundle.js)
directly, and to copy-paste it into your console.

You will also have a global ``MSESpy`` object, through which you can call any
API defined here.

Example:
```js
// Start the spy
MSESpy.activateMSESpy();

// Get the global MSECalls object registering every calls
const MSECalls = MSESpy.getMSECalls();
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
// Start spying on the MSE APIs:
//   - Will log when those APIs are called or properties are accessed
//   - will add entries to the global MSECalls object.
MSESpy.activateMSESpy();

// Get the global MSECalls object.
// This Object contains every details about all the API calls (date at
// which it has been called, context, arguments, response, date of the response,
// errors...) when the spy has been active.
console.log(MSESpy.getMSECalls());

// Reset the global MSECalls object as if no API were called.
console.log(MSESpy.resetMSECalls());

// Stop spying on MSE APIs:
//   - stop logging when MSE API are called
//   - stop logging when MSE properties are set/accessed
//   - stop adding entries to the global MSECalls object.
//   - clean up the resources taken
MSESpy.deactivateMSESpy();

// Spy again (after deactivating it)
MSESpy.activateMSESpy();

// You can also declare custom log functions

// For debug calls (when a MSE API is called and was resolved/returned
// sucessfully - depending on the type of API and when a property is accesed)
MSESpy.Logger.debug = function(...args) {
  myPersonalLogger.debug(...args);
}

// For errors and rejected promises from MSE APIs
MSESpy.Logger.error = function(...args) {
  myPersonalLogger.error(...args);
}
```
