(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.MSESpy = {})));
}(this, (function (exports) { 'use strict';

  /**
   * Store information about every MSE Calls stubbed in this file.
   * @type {Object}
   */
  var MSE_CALLS = {};

  function getMSECalls() {
    return MSE_CALLS;
  }

  function resetMSECalls() {
    Object.key(MSE_CALLS).forEach(function (key) {
      delete MSE_CALLS[key];
    });
  }
  var NativeMediaSource = window.MediaSource;
  var NativeSourceBuffer = window.SourceBuffer;

  /**
   * Define the logger for the MSE-spy.
   * Allows to re-define a specific logger on runtime / before applying this
   * script.
   * @type {Object}
   */
  var Logger = window.MSESpyLogger || {
    /* eslint-disable no-console */

    /**
     * Triggered each time a property is accessed.
     * @param {string} pathString - human-readable path to the property.
     * @param {*} value - the value it currently has.
     */
    onPropertyAccess: function onPropertyAccess(pathString, value) {
      console.debug(">>> Getting " + pathString + ":", value);
    },


    /**
     * Triggered each time a property is set.
     * @param {string} pathString - human-readable path to the property.
     * @param {*} value - the value it is set to.
     */
    onSettingProperty: function onSettingProperty(pathString, value) {
      console.debug(">> Setting " + pathString + ":", value);
    },


    /**
     * Triggered when some object is instanciated (just before).
     * @param {string} objectName - human-readable name for the concerned object.
     * @param {Array.<*>} args - Arguments given to the constructor
     */
    onObjectInstanciation: function onObjectInstanciation(objectName, args) {
      if (args.length) {
        console.debug(">>> Creating " + objectName + " with arguments:", args);
      } else {
        console.debug(">>> Creating " + objectName);
      }
    },


    /**
     * Triggered when an Object instanciation failed.
     * @param {string} objectName - human-readable name for the concerned object.
     * @param {Error} error - Error thrown by the constructor
     */
    onObjectInstanciationError: function onObjectInstanciationError(objectName, error) {
      console.error(">> " + objectName + " creation failed:", error);
    },


    /**
     * Triggered when an Object instanciation succeeded.
     * @param {string} objectName - human-readable name for the concerned object.
     * @param {*} value - The corresponding object instanciated.
     */
    onObjectInstanciationSuccess: function onObjectInstanciationSuccess(objectName, value) {
      console.debug(">>> " + objectName + " created:", value);
    },


    /**
     * Triggered when some method/function is called.
     * @param {string} pathName - human-readable path for the concerned function.
     * @param {Array.<*>} args - Arguments given to this function.
     */
    onFunctionCall: function onFunctionCall(pathName, args) {
      if (args.length) {
        console.debug(">>> " + pathName + " called with arguments:", args);
      } else {
        console.debug(">>> " + pathName + " called");
      }
    },


    /**
     * Triggered when a function call fails.
     * @param {string} pathName - human-readable path for the concerned function.
     * @param {Error} error - Error thrown by the call
     */
    onFunctionCallError: function onFunctionCallError(pathName, error) {
      console.error(">> " + pathName + " failed:", error);
    },


    /**
     * Triggered when a function call succeeded.
     * @param {string} pathName - human-readable path for the concerned function.
     * @param {*} value - The result of the function
     */
    onFunctionCallSuccess: function onFunctionCallSuccess(pathName, value) {
      console.info(">>> " + pathName + " succeeded:", value);
    },


    /**
     * Triggered when a function returned a Promise and that promise resolved.
     * @param {string} pathName - human-readable path for the concerned function.
     * @param {*} value - The value when the function resolved.
     */
    onFunctionPromiseResolve: function onFunctionPromiseResolve(pathName, value) {
      console.info(">>> " + pathName + " resolved:", value);
    },


    /**
     * Triggered when a function returned a Promise and that promise rejected.
     * @param {string} pathName - human-readable path for the concerned function.
     * @param {*} value - The error when the function's promise rejected.
     */
    onFunctionPromiseReject: function onFunctionPromiseReject(pathName, value) {
      console.error(">>> " + pathName + " rejected:", value);
    }
  };

  var id = 0;

  /**
   * Generate a new number each time it is called.
   * /!\ Never check for an upper-bound. Please do not use if you can reach
   * `Number.MAX_VALUE`
   * @returns {number}
   */
  function generateId() {
    return id++;
  }

  /**
   * Log multiple method calls for an object.
   * Also populates an object with multiple data at the time of the call.
   *
   * @param {Object} baseObject - Object in which the method/function is.
   * For example to spy on the Date method `toLocaleDateString`, you will have to
   * set here `Date.prototype`.
   * @param {Array.<string>} methodNames - Every methods you want to spy on
   * @param {string} humanReadablePath - Path to the method. Used for logging
   * purposes.
   * For example `"Date.prototype"`, for spies of Date's methods.
   * @param {Object} logObject - Object where infos about the method calls will be
   * added.
   * The methods' name will be the key of the object.
   *
   * The values will be an array of object with the following properties:
   *
   *   - self {Object}: Reference to the baseObject argument.
   *
   *   - id {number}: a uniquely generated ascending ID for any stubbed
   *    property/methods with this library.
   *
   *   - date {number}: Timestamp at the time of the call.
   *
   *   - args {Array}: Array of arguments given to the function
   *
   *   - response {*}: Response of the function.
   *     The property is not defined if the function did not respond yet or was on
   *     error.
   *
   *   - responseDate {number}: Timestamp at the time of the response.
   *     The property is not defined if the function did not respond yet or was on
   *     error.
   *
   *   - error {*}: Error thrown by the function, if one.
   *     The property is not defined if the function did not throw.
   *
   *   - errorDate {number} Timestamp at the time of the error.
   *     The property is not defined if the function did not throw.
   *
   *   - responseResolved {*}: When the returned value (the response) is a promise
   *     and that promise resolved, this property contains the value emitted by
   *     the resolve. Else, that property is not set.
   *
   *   - responseResolvedDate {number}: When the returned value (the response) is
   *     a promise and that promise resolved, this property contains the date at
   *     which the promise resolved. Else, that property is not set.
   *
   *   - responseRejected {*}: When the returned value (the response) is a promise
   *     and that promise rejected, this property contains the error emitted by
   *     the reject. Else, that property is not set.
   *
   *   - responseRejectedDate {number}: When the returned value (the response) is
   *     a promise and that promise rejected, this property contains the date at
   *     which the promise rejected. Else, that property is not set.
   */
  function spyOnMethods(baseObject, methodNames, humanReadablePath, logObject) {
    var _loop = function _loop(i) {
      var methodName = methodNames[i];
      var completePath = humanReadablePath + "." + methodName;
      var oldMethod = baseObject[methodName];

      if (!oldMethod) {
        throw new Error("No method in " + completePath);
      }

      baseObject[methodName] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        Logger.onFunctionCall(completePath, args);
        var currentLogObject = {
          self: baseObject,
          id: generateId(),
          date: Date.now(),
          args: args
        };

        if (!logObject[methodName]) {
          logObject[methodName] = [];
        }
        logObject[methodName].push(currentLogObject);

        var res = void 0;
        try {
          res = oldMethod.apply(this, args);
        } catch (e) {
          Logger.onFunctionCallError(completePath, e);
          currentLogObject.error = e;
          currentLogObject.errorDate = Date.now();
          throw e;
        }
        Logger.onFunctionCallSuccess(completePath, res);
        currentLogObject.response = res;
        currentLogObject.responseDate = Date.now();

        if (res instanceof Promise) {
          res.then(
          // on success
          function (value) {
            Logger.onFunctionPromiseResolve(completePath, value);
            currentLogObject.responseResolved = value;
            currentLogObject.responseResolvedDate = Date.now();
          },

          // on error
          function (err) {
            Logger.onFunctionPromiseReject(completePath, err);
            currentLogObject.responseRejected = err;
            currentLogObject.responseRejectedDate = Date.now();
          });
        }
        return res;
      };
    };

    for (var i = 0; i < methodNames.length; i++) {
      _loop(i);
    }
  }

  /**
   * Spy access and updates of an Object's read-only properties:
   *   - log every access/updates
   *   - add entries in a logging object
   *
   * @param {Object} baseObject - Object in which the property is.
   * For example to spy on the HTMLMediaElement property `currentTime`, you will
   * have to set here `HTMLMediaElement.prototype`.
   * @param {Object} baseDescriptors - Descriptors for the spied properties.
   * The keys are the properties' names, the values are the properties'
   * descriptors.
   * @param {Array.<string>} propertyNames - Every properties you want to spy on.
   * @param {string} humanReadablePath - Path to the property. Used for logging
   * purposes.
   * For example `"HTMLMediaElement.prototype"`, for spies of HTMLMediaElement's
   * class properties.
   * @param {Object} logObject - Object where infos about the properties access
   * will be added.
   * The methods' name will be the key of the object.
   *
   * The values will be an object with a single key ``get``, corresponding to
   * property accesses
   *
   * This key will then have as value an array of object.
   *
   *  - self {Object}: Reference to the baseObject argument.
   *
   *  - id {number}: a uniquely generated ID for any stubbed property/methods with
   *    this library.
   *
   *  - date {number}: Timestamp at the time of the property access.
   *
   *  - value {*}: value of the property at the time of access.
   */
  function spyOnReadOnlyProperties(baseObject, baseDescriptors, propertyNames, humanReadablePath, logObject) {
    var _loop = function _loop(i) {
      var propertyName = propertyNames[i];
      var baseDescriptor = baseDescriptors[propertyName];
      var completePath = humanReadablePath + "." + propertyName;

      if (!baseDescriptor) {
        throw new Error("No descriptor for property " + completePath);
      }

      Object.defineProperty(baseObject, propertyName, {
        get: function get() {
          var value = baseDescriptor.get.bind(this)();
          Logger.onPropertyAccess(completePath, value);
          var currentLogObject = {
            self: this,
            id: generateId(),
            date: Date.now(),
            value: value
          };
          if (!logObject[propertyName]) {
            logObject[propertyName] = {
              get: []
            };
          }
          logObject[propertyName].get.push(currentLogObject);
          return value;
        }
      });
    };

    for (var i = 0; i < propertyNames.length; i++) {
      _loop(i);
    }
  }

  /**
   * Spy access and updates of an Object's read & write properties:
   *   - log every access/updates
   *   - add entries in a logging object
   *
   * @param {Object} baseObject - Object in which the property is.
   * For example to spy on the HTMLMediaElement property `currentTime`, you will
   * have to set here `HTMLMediaElement.prototype`.
   * @param {Object} baseDescriptors - Descriptors for the spied properties.
   * The keys are the properties' names, the values are the properties'
   * descriptors.
   * @param {Array.<string>} propertyNames - Every properties you want to spy on.
   * @param {string} humanReadablePath - Path to the property. Used for logging
   * purposes.
   * For example `"HTMLMediaElement.prototype"`, for spies of HTMLMediaElement's
   * class properties.
   * @param {Object} logObject - Object where infos about the properties access
   * will be added.
   * The methods' name will be the key of the object.
   *
   * The values will be an object with two keys ``get`` and ``set``, respectively
   * for property accesses and property updates.
   *
   * Each one of those properties will then have as values an array of object.
   * Those objects are under the following form:
   *
   *  1. for `get` (property access):
   *
   *   - self {Object}: Reference to the baseObject argument.
   *
   *  - id {number}: a uniquely generated ascending ID for any stubbed
   *    property/methods with this library.
   *
   *   - date {number}: Timestamp at the time of the property access.
   *
   *   - value {*}: value of the property at the time of access.
   *
   *
   *  2. for `set` (property updates):
   *
   *   - self {Object}: Reference to the baseObject argument.
   *
   *  - id {number}: a uniquely generated ascending ID for any stubbed
   *    property/methods with this library.
   *
   *   - date {number}: Timestamp at the time of the property update.
   *
   *   - value {*}: new value the property is set to
   */
  function spyOnProperties(baseObject, baseDescriptors, propertyNames, humanReadablePath, logObject) {
    var _loop = function _loop(i) {
      var propertyName = propertyNames[i];
      var baseDescriptor = baseDescriptors[propertyName];
      var completePath = humanReadablePath + "." + propertyName;

      if (!baseDescriptor) {
        throw new Error("No descriptor for property " + completePath);
      }

      Object.defineProperty(baseObject, propertyName, {
        get: function get() {
          var value = baseDescriptor.get.bind(this)();
          Logger.onPropertyAccess(completePath, value);
          var currentLogObject = {
            self: this,
            id: generateId(),
            date: Date.now(),
            value: value
          };

          if (!logObject[propertyName]) {
            logObject[propertyName] = {
              set: [],
              get: []
            };
          }
          logObject[propertyName].get.push(currentLogObject);

          return value;
        },
        set: function set(value) {
          Logger.onSettingProperty(completePath, value);
          var currentLogObject = {
            self: this,
            id: generateId(),
            date: Date.now(),
            value: value
          };

          if (!logObject[propertyName]) {
            logObject[propertyName] = {
              set: [],
              get: []
            };
          }
          logObject[propertyName].set.push(currentLogObject);
          baseDescriptor.set.bind(this)(value);
        }
      });
    };

    for (var i = 0; i < propertyNames.length; i++) {
      _loop(i);
    }
  }

  var stubbedObjects = [];
  function spyOnWholeObject(BaseObject, objectName, readOnlyPropertyNames, propertyNames, staticMethodNames, methodNames, loggingObject) {
    if (BaseObject == null || !BaseObject.prototype) {
      throw new Error("Invalid object");
    }
    if (stubbedObjects.includes(BaseObject)) {
      return;
    }

    var BaseObjectProtoDescriptors = Object.getOwnPropertyDescriptors(BaseObject.prototype);
    var BaseObjectStaticMethods = staticMethodNames.reduce(function (acc, methodName) {
      acc[methodName] = BaseObject[methodName];
      return acc;
    }, {});
    var BaseObjectMethods = methodNames.reduce(function (acc, methodName) {
      acc[methodName] = BaseObject.prototype[methodName];
      return acc;
    }, {});

    if (loggingObject[objectName] == null) {
      loggingObject[objectName] = {
        new: [],
        methods: {},
        staticMethods: {},
        properties: {},
        eventListeners: {} // TODO
      };
    }

    function StubbedObject() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      Logger.onObjectInstanciation(objectName, args);
      var now = Date.now();
      var spyObj = {
        date: now,
        args: args
      };
      loggingObject[objectName].new.push(spyObj);
      var baseObject = void 0;
      try {
        baseObject = new (Function.prototype.bind.apply(BaseObject, [null].concat(args)))();
      } catch (e) {
        Logger.onObjectInstanciationError(objectName, e);
        spyObj.error = e;
        spyObj.errorDate = Date.now();
        throw e;
      }
      Logger.onObjectInstanciationSuccess(objectName, baseObject);
      spyObj.response = baseObject;
      spyObj.responseDate = Date.now();
      return baseObject;
    }

    spyOnMethods(BaseObject, staticMethodNames, objectName, loggingObject[objectName].staticMethods);
    staticMethodNames.forEach(function (method) {
      StubbedObject[method] = BaseObject[method].bind(BaseObject);
    });
    spyOnReadOnlyProperties(BaseObject.prototype, BaseObjectProtoDescriptors, readOnlyPropertyNames, objectName + ".prototype", loggingObject[objectName].properties);
    spyOnProperties(BaseObject.prototype, BaseObjectProtoDescriptors, propertyNames, objectName + ".prototype", loggingObject[objectName].properties);
    spyOnMethods(BaseObject.prototype, methodNames, objectName + ".prototype", loggingObject[objectName].methods);
    window[objectName] = StubbedObject;
    stubbedObjects.push(BaseObject);

    return function stopSpying() {
      Object.defineProperties(BaseObject.prototype, propertyNames.concat(readOnlyPropertyNames).reduce(function (acc, propertyName) {
        acc[propertyName] = BaseObjectProtoDescriptors[propertyName];
        return acc;
      }, {}));
      staticMethodNames.forEach(function (methodName) {
        BaseObject[methodName] = BaseObjectStaticMethods[methodName];
      });
      methodNames.forEach(function (methodName) {
        BaseObject.prototype[methodName] = BaseObjectMethods[methodName];
      });
      window[objectName] = BaseObject;
    };
  }

  function spyOnMediaSource() {
    return spyOnWholeObject(
    // Object to spy on
    NativeMediaSource,

    // name in window
    "MediaSource",

    // read-only properties
    ["sourceBuffers", "activeSourceBuffers", "readyState"],

    // regular properties
    ["duration", "onsourceopen", "onsourceended", "onsourceclose"],

    // static methods
    ["isTypeSupported"],

    // methods
    ["addEventListener", "removeEventListener", "dispatchEvent", "addSourceBuffer", "removeSourceBuffer", "endOfStream", "setLiveSeekableRange", "clearLiveSeekableRange"],

    // global logging object
    MSE_CALLS);
  }

  function spyOnMediaSource$1() {
    return spyOnWholeObject(
    // Object to spy on
    NativeSourceBuffer,

    // name in window
    "SourceBuffer",

    // read-only properties
    ["updating", "buffered"],

    // regular properties
    ["mode", "timestampOffset", "appendWindowStart", "appendWindowEnd", "onupdate", "onupdatestart", "onupdateend", "onerror", "onabort"],

    // static methods
    [],

    // methods
    ["addEventListener", "removeEventListener", "dispatchEvent", "appendBuffer", "abort", "remove"],

    // global logging object
    MSE_CALLS);
  }

  var resetSpyFunctions = [];

  /**
   * Start spying on MSE API calls.
   */
  function start() {
    resetSpyFunctions.push(spyOnMediaSource());
    resetSpyFunctions.push(spyOnMediaSource$1());
  }

  function stop() {
    resetSpyFunctions.forEach(function (fn) {
      fn();
    });
    resetSpyFunctions.length = 0;
  }

  exports.getMSECalls = getMSECalls;
  exports.resetMSECalls = resetMSECalls;
  exports.Logger = Logger;
  exports.start = start;
  exports.stop = stop;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
