# MSESpy.js ####################################################################


## Overview ####################################################################

This is a tool to spy on most MSE-related browser API calls. It mainly has been
used for debugging and reverse-engineering purposes on media-oriented
web-applications.

It logs and registers when any of the following actions take place:

  1. A MediaSource object is instanciated

  2. the following MediaSource methods are called:
   - ``MediaSource.prototype.addSourceBuffer``
   - ``MediaSource.prototype.removeSourceBuffer``
   - ``MediaSource.prototype.endOfStream``
   - ``MediaSource.prototype.setLiveSeekableRange``
   - ``MediaSource.prototype.clearLiveSeekableRange``
   - ``MediaSource.isTypeSupported``
   - ``MediaSource.prototype.addEventListener``
   - ``MediaSource.prototype.removeEventListener``
   - ``MediaSource.prototype.dispatchEvent``

  3. Those MediaSource properties are get/set:
   - ``MediaSource.prototype.duration``
   - ``MediaSource.prototype.onsourceopen``
   - ``MediaSource.prototype.onsourceended``
   - ``MediaSource.prototype.onsourceclose``
   - ``MediaSource.prototype.sourceBuffers``
   - ``MediaSource.prototype.activeSourceBuffers``
   - ``MediaSource.prototype.readyState``

  4. Those SourceBuffer methods are called:
   - ``SourceBuffer.prototype.appendBuffer``
   - ``SourceBuffer.prototype.abort``
   - ``SourceBuffer.prototype.remove``
   - ``SourceBuffer.prototype.appendBuffer``
   - ``SourceBuffer.prototype.addEventListener``
   - ``SourceBuffer.prototype.removeEventListener``
   - ``SourceBuffer.prototype.dispatchEvent``

  5. Those SourceBuffer properties are get/set:
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
by any application.


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
MSESpy.start();

// Get the global MSECalls object registering every calls
// (More informations on it in the concerned chapter)
const MSECalls = MSESpy.getMSECalls();
```

This configuration can also be useful by including this script automatically in
multimedia pages. This can be done through userscript managers, such as
[Tampermonkey for Chrome
](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
or [Greasemonkey for Firefox
](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/).


### Adding as a dependency #####################################################

You can also add this module as a dependency through npm:
```sh
npm install mse-spy
```

Then use this module as you want.

```js
import MSESpy from "mse-spy";

MSESpy.start();
```



## API #########################################################################

The API is basically as follow:
```js
// Start spying on the MSE APIs:
//   - Will log when those APIs are called or properties are accessed
//   - will add entries to the global MSECalls object.
MSESpy.start();

// Get the global MSECalls object.
// This Object contains every details about all the API calls (date at
// which it has been called, context, arguments, response, date of the response,
// errors...) when the spy has been active.
// (More informations on it in the concerned chapter)
console.log(MSESpy.getMSECalls());

// Reset the global MSECalls object as if no API were called.
console.log(MSESpy.resetMSECalls());

// Stop spying on MSE APIs:
//   - stop logging when MSE API are called
//   - stop logging when MSE properties are set/accessed
//   - stop adding entries to the global MSECalls object.
//   - clean up the resources taken
MSESpy.stop();

// Spy again (after deactivating it)
MSESpy.start();

// You can also declare custom log functions
// (More informations on it in the concerned chapter)
MSESpy.Logger.debug = CustomLogger;
```


### MSECalls object ############################################################

The MSECalls object contains information about every call performed while the
spy was active.

It can be obtained by calling the ``MSESpy.getMSECalls()`` API.

Here is its basic structure:
```js
// MSE Calls object
{
  MediaSource: { // Data about the MediaSource native object

    new: [  // An entry is added each time a MediaSource is created.
            // Empty array by default.
      {
        id: 1, // {number} unique id, generated in ascending order for any
               // entry.
               // Generated here at the time of MediaSource creation.
        date: 1533722155401, // {number} timestamp at which the call was made
        args: [], // {Array} Eventual arguments the constructor has been called
                  // with

        // If the call succeeded:
        response: mediaSource, // {MediaSource|undefined} MediaSource created
        responseDate: 1533722155401, // {number|undefined} timestamp at which
                                     // the response was received

        // If the call has trown
        error: someError, // {Error|undefined} If an error was thrown while
                          // creating a new MediaSource.
                          // If this property is set, we won't have `response`
                          // nor `responseDate` set
        errorDate: 1533722155401 // {number|undefined} timestamp at which
                                 // the error was received
      }
    ],

    methods: {
      addSourceBuffer: [ // Name of the method concerned
        {
          self: mediaSource, // {Object} The value of `this` at the time of the
                             // call (usually the MediaSource)
          id: 4, // {number} unique id, generated in ascending order for any
                 // entry.
                 // Generated here at the time of the call.
          date: 1533722155401, // {number} timestamp at which the call was made
          args: [], // {Array} Eventual arguments this method has been called
                    // with


          // If the call succeeded:
          response: sourceBuffer, // {*} What has been returned by the call
          responseDate: 1533722155401, // {number|undefined} timestamp at which
                                       // the response was received

          // If the call has trown
          error: someError, // {Error|undefined} If an error was thrown while
                            // calling the method.
                            // If this property is set, we won't have `response`
                            // nor `responseDate` set
          errorDate: 1533722155401 // {number|undefined} timestamp at which
                                   // the error was received
        }
      ]
    },

    properties: {
      duration: { // name of the property
        get: [ // A new entry is added each time the property is accessed
          {
            self: mediaSource, // {MediaSource} The instance of the concerned
                               // mediaSource
            id: 3, // {number} unique id, generated in ascending order for any
                   // entry.
                   // Generated here at the time of the access.
            date: 1533722155401, // {number} timestamp at which the property
                                 // was accessed
            value: 10 // {*} Content of the property as it was accessed
          }
        ],
        set: [ // A new entry is added each time the property is set
          {
            self: mediaSource, // {MediaSource} The instance of the concerned
                               // mediaSource
            id: 2, // {number} unique id, generated in ascending order for any
                   // entry.
                   // Generated here at the time of the update.
            date: 1533722155401, // {number} timestamp at which the property
                                 // was set
            value: 15 // {*} Content the property was set to
          }
        ]
      }
    }
  },

  SourceBuffer: { // SourceBuffer follows the same structure

    new: [], // Note: SourceBuffer are usually created through
             // MediaSource.prototype.addSourceBuffer and not threw the `new`
             // keyword. As such, this array might always stay empty.

    methods: {},

    properties: {},
  },
}
```


### Custom Logger ##############################################################

If you don't like the default logging strategy or find it too verbose, a custom
Logger can be defined.

It is accessible through the ``MSESpy.Logger`` object. All it contains are
several functions automatically called at various key points:

```js
Logger = {
  /**
   * Triggered each time a property is accessed.
   * @param {string} pathString - human-readable path to the property.
   * @param {*} value - the value it currently has.
   */
  onPropertyAccess(pathString, value) {},

  /**
   * Triggered each time a property is set.
   * @param {string} pathString - human-readable path to the property.
   * @param {*} value - the value it is set to.
   */
  onSettingProperty(pathString, value) {},

  /**
   * Triggered when some object is instanciated (just before).
   * @param {string} objectName - human-readable name for the concerned object.
   * @param {Array.<*>} args - Arguments given to the constructor
   */
  onObjectInstanciation(objectName, args) {},

  /**
   * Triggered when an Object instanciation failed.
   * @param {string} objectName - human-readable name for the concerned object.
   * @param {Error} error - Error thrown by the constructor
   */
  onObjectInstanciationError(objectName, error) {},

  /**
   * Triggered when an Object instanciation succeeded.
   * @param {string} objectName - human-readable name for the concerned object.
   * @param {*} value - The corresponding object instanciated.
   */
  onObjectInstanciationSuccess(objectName, value) {},

  /**
   * Triggered when some method/function is called.
   * @param {string} pathName - human-readable path for the concerned function.
   * @param {Array.<*>} args - Arguments given to this function.
   */
  onFunctionCall(pathName, args) {},

  /**
   * Triggered when a function call fails.
   * @param {string} pathName - human-readable path for the concerned function.
   * @param {Error} error - Error thrown by the call
   */
  onFunctionCallError(pathName, error) {},

  /**
   * Triggered when a function call succeeded.
   * @param {string} pathName - human-readable path for the concerned function.
   * @param {*} value - The result of the function
   */
  onFunctionCallSuccess(pathName, value) {},
};
```

Note: if the code above were to be implemented, you wouldn't have any logs
displaying in the console, as all functions declared here are empty.
You can look at ``src/utils/logger.js`` for default implementations.



## Left to do ##################################################################

The next steps would be to:

  - register when event listeners are called and when they have finished their
    execution

  - simplify the MSECalls object exploitation
