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
      properties: {},
      events: {} // TODO
    },
    SourceBuffer: {
      new: [], // TODO
      methods: {},
      properties: {},
      events: {} // TODO
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
   * Define the logger for startMSESpy.
   * Allows to re-define a specific logger on runtime / before applying this
   * script.
   * @type {Object}
   */
  var Logger = window.Logger || {
    /* eslint-disable no-console */
    log: function log() {
      var _console;

      (_console = console).log.apply(_console, arguments);
    },
    debug: function debug() {
      var _console2;

      (_console2 = console).debug.apply(_console2, arguments);
    },
    info: function info() {
      var _console3;

      (_console3 = console).info.apply(_console3, arguments);
    },
    error: function error() {
      var _console4;

      (_console4 = console).error.apply(_console4, arguments);
    },
    warning: function warning() {
      var _console5;

      (_console5 = console).warning.apply(_console5, arguments);
    }
    /* eslint-enable no-console */
  };

  /**
   * Log when a function is called with its arguments.
   * @param {string} fnName
   * @param {Array.<*>} args
   */
  function onAPICall(fnName, args) {
    if (args.length) {
      Logger.debug(">>> " + fnName + " called with arguments:", args);
    } else {
      Logger.debug(">>> " + fnName + " called");
    }
  }

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

        onAPICall(completePath, args);
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
          Logger.error(">> " + completePath + " failed:", e);
          myObj.error = e;
          myObj.errorDate = Date.now();
          throw e;
        }
        Logger.debug(">> " + completePath + " succeeded:", res);
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

          Logger.debug(">> Getting " + completePath + ":", value);
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

          Logger.debug(">> Getting " + completePath + ":", value);
          return value;
        },
        set: function set(value) {
          Logger.debug(">> Setting " + completePath + ":", value);

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

  var NativeMediaSourceProtoDescriptors = Object.getOwnPropertyDescriptors(NativeMediaSource.prototype);

  var NativeMediaSourceIsTypeSupported = NativeMediaSource.isTypeSupported;

  function StubbedMediaSource() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length) {
      Logger.debug(">>> Creating MediaSource with arguments:", args);
    } else {
      Logger.debug(">>> Creating MediaSource");
    }
    var nativeMediaSource = new (Function.prototype.bind.apply(NativeMediaSource, [null].concat(args)))();
    Logger.debug(">>> MediaSource created:", nativeMediaSource);
    stubReadOnlyProperties(nativeMediaSource, NativeMediaSourceProtoDescriptors, ["sourceBuffers", "activeSourceBuffers", "readyState"], "MediaSource.prototype", MSE_CALLS.MediaSource.properties);
    stubProperties(nativeMediaSource, NativeMediaSourceProtoDescriptors, ["duration", "onsourceopen", "onsourceended", "onsourceclose"], "MediaSource.prototype", MSE_CALLS.MediaSource.properties);
    stubRegularMethods(nativeMediaSource, ["addEventListener", "removeEventListener", "dispatchEvent", "addSourceBuffer", "removeSourceBuffer", "endOfStream", "setLiveSeekableRange", "clearLiveSeekableRange"], "MediaSource.prototype", MSE_CALLS.MediaSource.methods);

    return nativeMediaSource;
  }

  function spyOnMediaSource() {
    stubRegularMethods(NativeMediaSource, ["isTypeSupported"], "MediaSource.isTypeSupported", MSE_CALLS.MediaSource.methods);
    window.MediaSource = StubbedMediaSource;
  }

  function stopSpyingOnMediaSource() {
    window.MediaSource = NativeMediaSource;
    window.MediaSource.isTypeSupported = NativeMediaSourceIsTypeSupported;
  }

  var NativeSourceBufferProtoDescriptors = Object.getOwnPropertyDescriptors(NativeSourceBuffer.prototype);

  var NativeSourceBufferAddEventListener = NativeSourceBuffer.prototype.addEventListener;
  var NativeSourceBufferRemoveEventListener = NativeSourceBuffer.prototype.removeEventListener;
  var NativeSourceBufferDispatchEvent = NativeSourceBuffer.prototype.dispatchEvent;
  var NativeSourceBufferAppendBuffer = NativeSourceBuffer.prototype.appendBuffer;
  var NativeSourceBufferAbort = NativeSourceBuffer.prototype.abort;
  var NativeSourceBufferRemove = NativeSourceBuffer.prototype.remove;

  function spyOnSourceBuffer() {
    stubReadOnlyProperties(NativeSourceBuffer.prototype, NativeSourceBufferProtoDescriptors, ["updating", "buffered"], "SourceBuffer.prototype", MSE_CALLS.SourceBuffer.properties);
    stubProperties(NativeSourceBuffer.prototype, NativeSourceBufferProtoDescriptors, ["mode", "timestampOffset", "appendWindowStart", "appendWindowEnd", "onupdate", "onupdatestart", "onupdateend", "onerror", "onabort"], "SourceBuffer.prototype", MSE_CALLS.SourceBuffer.properties);
    stubRegularMethods(NativeSourceBuffer.prototype, ["addEventListener", "removeEventListener", "dispatchEvent", "appendBuffer", "abort", "remove"], "SourceBuffer.prototype", MSE_CALLS.SourceBuffer.methods);
  }

  function stopSpyingOnSourceBuffer() {
    Object.defineProperties(NativeSourceBuffer.prototype, {
      updating: NativeSourceBufferProtoDescriptors.updating,
      buffered: NativeSourceBufferProtoDescriptors.buffered,
      mode: NativeSourceBufferProtoDescriptors.mode,
      timestampOffset: NativeSourceBufferProtoDescriptors.timestampOffset,
      appendWindowStart: NativeSourceBufferProtoDescriptors.appendWindowStart,
      appendWindowEnd: NativeSourceBufferProtoDescriptors.appendWindowEnd,
      onupdate: NativeSourceBufferProtoDescriptors.onupdate,
      onupdatestart: NativeSourceBufferProtoDescriptors.onupdatestart,
      onupdateend: NativeSourceBufferProtoDescriptors.onupdateend,
      onerror: NativeSourceBufferProtoDescriptors.onerror,
      onabort: NativeSourceBufferProtoDescriptors.onabort
    });
    NativeSourceBuffer.prototype.addEventListener = NativeSourceBufferAddEventListener;
    NativeSourceBuffer.prototype.removeEventListener = NativeSourceBufferRemoveEventListener;
    NativeSourceBuffer.prototype.dispatchEvent = NativeSourceBufferDispatchEvent;
    NativeSourceBuffer.prototype.appendBuffer = NativeSourceBufferAppendBuffer;
    NativeSourceBuffer.prototype.abort = NativeSourceBufferAbort;
    NativeSourceBuffer.prototype.remove = NativeSourceBufferRemove;
  }

  /**
   * Start spying on MSE API calls.
   */
  function activateMSESpy() {
    spyOnMediaSource();
    spyOnSourceBuffer();
  }

  function deactivateMSESpy() {
    stopSpyingOnMediaSource();
    stopSpyingOnSourceBuffer();
  }

  exports.getMSECalls = getMSECalls;
  exports.resetMSECalls = resetMSECalls;
  exports.Logger = Logger;
  exports.activateMSESpy = activateMSESpy;
  exports.deactivateMSESpy = deactivateMSESpy;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
