(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.MSESpy = {})));
}(this, (function (exports) { 'use strict';

  /**
   * Store information about every MSE Calls stubbed in this file.
   * @type {Object}
   */
  var MSE_CALLS = {
    MediaSource: {
      new: [], // TODO
      methods: {},
      properties: {}
    },
    SourceBuffer: {
      new: [], // TODO
      methods: {},
      properties: {}
    }
  };

  function getMSECalls() {
    return MSE_CALLS;
  }

  function resetMSECalls() {
    MSE_CALLS.MediaSource.new = [];
    MSE_CALLS.MediaSource.methods = [];
    MSE_CALLS.MediaSource.properties = [];
    MSE_CALLS.MediaSource.events = [];

    MSE_CALLS.SourceBuffer.new = [];
    MSE_CALLS.SourceBuffer.methods = [];
    MSE_CALLS.SourceBuffer.properties = [];
    MSE_CALLS.SourceBuffer.events = [];
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
      console.debug(">>> Getting ${pathString}:", value);
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
        console.debug(">>> Creating ${objectName} with arguments:", args);
      } else {
        console.debug(">>> Creating ${objectName}");
      }
    },


    /**
     * Triggered when an Object instanciation failed.
     * @param {string} objectName - human-readable name for the concerned object.
     * @param {Error} error - Error thrown by the constructor
     */
    onObjectInstanciationError: function onObjectInstanciationError(objectName, error) {
      console.error(">> ${objectName} creation failed:", error);
    },


    /**
     * Triggered when an Object instanciation succeeded.
     * @param {string} objectName - human-readable name for the concerned object.
     * @param {*} value - The corresponding object instanciated.
     */
    onObjectInstanciationSuccess: function onObjectInstanciationSuccess(objectName, value) {
      console.debug(">>> ${objectName} created:", value);
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
      console.info(">>> ${pathName} succeeded:", value);
    }
  };

  function stubRegularMethods(obj, methods, path, logObj) {
    var _loop = function _loop(i) {
      var methodName = methods[i];
      var completePath = path + "." + methodName;
      var oldMethod = obj[methodName];

      if (!oldMethod) {
        throw new Error("No method in " + completePath);
      }

      obj[methodName] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        Logger.onFunctionCall(completePath, args);
        var myObj = {
          self: obj,
          date: Date.now(),
          args: args
        };

        if (!logObj[methodName]) {
          logObj[methodName] = [];
        }
        logObj[methodName].push(myObj);

        var res = void 0;
        try {
          res = oldMethod.apply(this, args);
        } catch (e) {
          Logger.onFunctionCallError(completePath, e);
          myObj.error = e;
          myObj.errorDate = Date.now();
          throw e;
        }
        Logger.onFunctionCallSuccess(completePath, res);
        myObj.response = res;
        myObj.responseDate = Date.now();
        return res;
      };
    };

    for (var i = 0; i < methods.length; i++) {
      _loop(i);
    }
  }

  function stubReadOnlyProperties(obj, oldDescriptors, properties, path, logObj) {
    var _loop = function _loop(i) {
      var propertyName = properties[i];
      var oldDescriptor = oldDescriptors[propertyName];
      var completePath = path + "." + propertyName;

      if (!oldDescriptor) {
        throw new Error("No descriptor for property " + completePath);
      }

      Object.defineProperty(obj, propertyName, {
        get: function get() {
          Logger.onPropertyAccess(completePath, value);
          var value = oldDescriptor.get.bind(this)();
          var myObj = {
            self: this,
            date: Date.now(),
            value: value
          };
          if (!logObj[propertyName]) {
            logObj[propertyName] = {
              get: []
            };
          }
          logObj[propertyName].get.push(myObj);
          return value;
        }
      });
    };

    for (var i = 0; i < properties.length; i++) {
      _loop(i);
    }
  }

  function stubProperties(obj, oldDescriptors, properties, path, logObj) {
    var _loop = function _loop(i) {
      var propertyName = properties[i];
      var oldDescriptor = oldDescriptors[propertyName];
      var completePath = path + "." + propertyName;

      if (!oldDescriptor) {
        throw new Error("No descriptor for property " + completePath);
      }

      Object.defineProperty(obj, propertyName, {
        get: function get() {
          Logger.onPropertyAccess(completePath, value);
          var value = oldDescriptor.get.bind(this)();
          var myObj = {
            self: this,
            date: Date.now(),
            value: value
          };

          if (!logObj[propertyName]) {
            logObj[propertyName] = {
              set: [],
              get: []
            };
          }
          logObj[propertyName].get.push(myObj);

          return value;
        },
        set: function set(value) {
          Logger.onSettingProperty(completePath, value);
          var myObj = {
            self: this,
            date: Date.now(),
            value: value
          };

          if (!logObj[propertyName]) {
            logObj[propertyName] = {
              set: [],
              get: []
            };
          }
          logObj[propertyName].set.push(myObj);
          oldDescriptor.set.bind(this)(value);
        }
      });
    };

    for (var i = 0; i < properties.length; i++) {
      _loop(i);
    }
  }

  var MEDIASOURCE_SPY_OBJECT = {
    readOnlyProperties: ["sourceBuffers", "activeSourceBuffers", "readyState"],
    properties: ["duration", "onsourceopen", "onsourceended", "onsourceclose"],
    staticMethods: ["isTypeSupported"],
    methods: ["addEventListener", "removeEventListener", "dispatchEvent", "addSourceBuffer", "removeSourceBuffer", "endOfStream", "setLiveSeekableRange", "clearLiveSeekableRange"]
  };

  var NativeMediaSourceProtoDescriptors = Object.getOwnPropertyDescriptors(NativeMediaSource.prototype);

  var NativeMediaSourceStaticMethods = MEDIASOURCE_SPY_OBJECT.staticMethods.reduce(function (acc, methodName) {
    acc[methodName] = NativeMediaSource[methodName];
    return acc;
  }, {});
  var NativeMediaSourceMethods = MEDIASOURCE_SPY_OBJECT.methods.reduce(function (acc, methodName) {
    acc[methodName] = NativeMediaSource.prototype[methodName];
    return acc;
  }, {});

  function StubbedMediaSource() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    Logger.onObjectInstanciation("MediaSource", args);
    var now = Date.now();
    var spyObj = {
      date: now,
      args: args
    };
    MSE_CALLS.MediaSource.new.push(spyObj);
    var nativeMediaSource = void 0;
    try {
      nativeMediaSource = new (Function.prototype.bind.apply(NativeMediaSource, [null].concat(args)))();
    } catch (e) {
      Logger.onObjectInstanciationError("MediaSource", e);
      spyObj.error = e;
      spyObj.errorDate = Date.now();
      throw e;
    }
    Logger.onObjectInstanciationSuccess("MediaSource", nativeMediaSource);
    spyObj.response = nativeMediaSource;
    spyObj.responseDate = Date.now();
    return nativeMediaSource;
  }

  function spyOnMediaSource() {
    stubReadOnlyProperties(NativeMediaSource.prototype, NativeMediaSourceProtoDescriptors, MEDIASOURCE_SPY_OBJECT.readOnlyProperties, "MediaSource.prototype", MSE_CALLS.MediaSource.properties);
    stubRegularMethods(NativeMediaSource, MEDIASOURCE_SPY_OBJECT.staticMethods, "MediaSource", MSE_CALLS.MediaSource.methods);
    stubProperties(NativeMediaSource.prototype, NativeMediaSourceProtoDescriptors, MEDIASOURCE_SPY_OBJECT.properties, "MediaSource.prototype", MSE_CALLS.MediaSource.properties);
    stubRegularMethods(NativeMediaSource.prototype, MEDIASOURCE_SPY_OBJECT.methods, "MediaSource.prototype", MSE_CALLS.MediaSource.methods);
    window.MediaSource = StubbedMediaSource;
  }

  function stopSpyingOnMediaSource() {
    Object.defineProperties(NativeMediaSource.prototype, MEDIASOURCE_SPY_OBJECT.properties.concat(MEDIASOURCE_SPY_OBJECT.readOnlyProperties).reduce(function (acc, propertyName) {
      acc[propertyName] = NativeMediaSourceProtoDescriptors[propertyName];
    }, {}));
    MEDIASOURCE_SPY_OBJECT.staticMethods.forEach(function (methodName) {
      NativeMediaSource[methodName] = NativeMediaSourceStaticMethods[methodName];
    });
    MEDIASOURCE_SPY_OBJECT.methods.forEach(function (methodName) {
      NativeMediaSource.prototype[methodName] = NativeMediaSourceMethods[methodName];
    });
    window.MediaSource = NativeMediaSource;
  }

  var SOURCEBUFFER_SPY_OBJECT = {
    readOnlyProperties: ["updating", "buffered"],
    properties: ["mode", "timestampOffset", "appendWindowStart", "appendWindowEnd", "onupdate", "onupdatestart", "onupdateend", "onerror", "onabort"],
    staticMethods: [],
    methods: ["addEventListener", "removeEventListener", "dispatchEvent", "appendBuffer", "abort", "remove"]
  };

  var NativeSourceBufferProtoDescriptors = Object.getOwnPropertyDescriptors(NativeSourceBuffer.prototype);

  var NativeSourceBufferStaticMethods = SOURCEBUFFER_SPY_OBJECT.staticMethods.reduce(function (acc, methodName) {
    acc[methodName] = NativeSourceBuffer[methodName];
    return acc;
  }, {});
  var NativeSourceBufferMethods = SOURCEBUFFER_SPY_OBJECT.methods.reduce(function (acc, methodName) {
    acc[methodName] = NativeSourceBuffer.prototype[methodName];
    return acc;
  }, {});

  function StubbedSourceBuffer() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    Logger.onObjectInstanciation("SourceBuffer", args);
    var now = Date.now();
    var spyObj = {
      date: now,
      args: args
    };
    MSE_CALLS.SourceBuffer.new.push(spyObj);
    var nativeSourceBuffer = void 0;
    try {
      nativeSourceBuffer = new (Function.prototype.bind.apply(NativeSourceBuffer, [null].concat(args)))();
    } catch (e) {
      Logger.onObjectInstanciationError("SourceBuffer", e);
      spyObj.error = e;
      spyObj.errorDate = Date.now();
      throw e;
    }
    Logger.onObjectInstanciationSuccess("SourceBuffer", nativeSourceBuffer);
    spyObj.response = nativeSourceBuffer;
    spyObj.responseDate = Date.now();
    return nativeSourceBuffer;
  }

  function spyOnSourceBuffer() {
    stubReadOnlyProperties(NativeSourceBuffer.prototype, NativeSourceBufferProtoDescriptors, SOURCEBUFFER_SPY_OBJECT.readOnlyProperties, "SourceBuffer.prototype", MSE_CALLS.SourceBuffer.properties);
    stubProperties(NativeSourceBuffer.prototype, NativeSourceBufferProtoDescriptors, SOURCEBUFFER_SPY_OBJECT.properties, "SourceBuffer.prototype", MSE_CALLS.SourceBuffer.properties);
    stubRegularMethods(NativeSourceBuffer.prototype, SOURCEBUFFER_SPY_OBJECT.methods, "SourceBuffer.prototype", MSE_CALLS.SourceBuffer.methods);
    window.SourceBuffer = StubbedSourceBuffer;
  }

  function stopSpyingOnSourceBuffer() {
    Object.defineProperties(NativeSourceBuffer.prototype, SOURCEBUFFER_SPY_OBJECT.properties.concat(SOURCEBUFFER_SPY_OBJECT.readOnlyProperties).reduce(function (acc, propertyName) {
      acc[propertyName] = NativeSourceBufferProtoDescriptors[propertyName];
    }, {}));
    SOURCEBUFFER_SPY_OBJECT.staticMethods.forEach(function (methodName) {
      NativeSourceBuffer[methodName] = NativeSourceBufferStaticMethods[methodName];
    });
    SOURCEBUFFER_SPY_OBJECT.methods.forEach(function (methodName) {
      NativeSourceBuffer.prototype[methodName] = NativeSourceBufferMethods[methodName];
    });
    window.SourceBuffer = NativeSourceBuffer;
  }

  /**
   * Start spying on MSE API calls.
   */
  function start() {
    spyOnMediaSource();
    spyOnSourceBuffer();
  }

  function stop() {
    stopSpyingOnMediaSource();
    stopSpyingOnSourceBuffer();
  }

  exports.getMSECalls = getMSECalls;
  exports.resetMSECalls = resetMSECalls;
  exports.Logger = Logger;
  exports.start = start;
  exports.stop = stop;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
