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
    MediaSource_addSourceBuffer: [],
    MediaSource_removeSourceBuffer: [],
    MediaSource_endOfStream: [],
    MediaSource_setLiveSeekableRange: [],
    MediaSource_clearLiveSeekableRange: [],
    MediaSource_isTypeSupported: [],
    SourceBuffer_appendBuffer: [],
    SourceBuffer_abort: [],
    SourceBuffer_remove: []
  };

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
   * Start spying on MSE API calls.
   * @returns {Object} - Object with a "restore" function, restoring all stubs
   * done here.
   */
  function startMSESpy() {
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

    var saveAddSourceBuffer = MediaSource.prototype.addSourceBuffer;
    MediaSource.prototype.addSourceBuffer = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      onAPICall("MediaSource.addSourceBuffer", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      MSE_CALLS.MediaSource_addSourceBuffer.push(myObj);

      var sourceBuffer = void 0;
      try {
        sourceBuffer = saveAddSourceBuffer.apply(this, args);
      } catch (e) {
        Logger.error(">> MediaSource.prototype.addSourceBuffer failed:", e);
        myObj.error = e;
        myObj.errorDate = Date.now();
        throw e;
      }
      Logger.debug(">> MediaSource.prototype.addSourceBuffer succeeded:", sourceBuffer);
      myObj.response = sourceBuffer;
      myObj.responseDate = Date.now();
      return sourceBuffer;
    };

    var saveRemoveSourceBuffer = MediaSource.prototype.removeSourceBuffer;
    MediaSource.prototype.removeSourceBuffer = function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      onAPICall("MediaSource.removeSourceBuffer", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      MSE_CALLS.MediaSource_removeSourceBuffer.push(myObj);

      var res = void 0;
      try {
        res = saveRemoveSourceBuffer.apply(this, args);
      } catch (e) {
        Logger.error(">> MediaSource.prototype.removeSourceBuffer failed:", e);
        myObj.error = e;
        myObj.errorDate = Date.now();
        throw e;
      }
      Logger.debug(">> MediaSource.prototype.removeSourceBuffer succeeded:", res);
      myObj.response = res;
      myObj.responseDate = Date.now();
      return res;
    };

    var saveEndOfStream = MediaSource.prototype.endOfStream;
    MediaSource.prototype.endOfStream = function () {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      onAPICall("MediaSource.endOfStream", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      MSE_CALLS.MediaSource_endOfStream.push(myObj);

      var res = void 0;
      try {
        res = saveEndOfStream.apply(this, args);
      } catch (e) {
        Logger.error(">> MediaSource.prototype.endOfStream failed:", e);
        myObj.error = e;
        myObj.errorDate = Date.now();
        throw e;
      }
      Logger.debug(">> MediaSource.prototype.endOfStream succeeded:", res);
      myObj.response = res;
      myObj.responseDate = Date.now();
      return res;
    };

    var saveSetLiveSeekableRange = MediaSource.prototype.setLiveSeekableRange;
    MediaSource.prototype.setLiveSeekableRange = function () {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      onAPICall("MediaSource.setLiveSeekableRange", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      MSE_CALLS.MediaSource_setLiveSeebleRange.push(myObj);

      var res = void 0;
      try {
        res = saveSetLiveSeekableRange.apply(this, args);
      } catch (e) {
        Logger.error(">> MediaSource.prototype.setLiveSeekableRange failed:", e);
        myObj.error = e;
        myObj.errorDate = Date.now();
        throw e;
      }
      Logger.debug(">> MediaSource.prototype.setLiveSeekableRange succeeded:", res);
      myObj.response = res;
      myObj.responseDate = Date.now();
      return res;
    };

    var saveClearLiveSeekableRange = MediaSource.prototype.clearLiveSeekableRange;
    MediaSource.prototype.clearLiveSeekableRange = function () {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      onAPICall("MediaSource.clearLiveSeekableRange", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      MSE_CALLS.MediaSource_clearLiveSeebleRange.push(myObj);

      var res = void 0;
      try {
        res = saveClearLiveSeekableRange.apply(this, args);
      } catch (e) {
        Logger.error(">> MediaSource.prototype.clearLiveSeekableRange failed:", e);
        myObj.error = e;
        myObj.errorDate = Date.now();
        throw e;
      }
      Logger.debug(">> MediaSource.prototype.clearLiveSeekableRange succeeded:", res);
      myObj.response = res;
      myObj.responseDate = Date.now();
      return res;
    };

    var saveIsTypeSupported = MediaSource.prototype.isTypeSupported;
    MediaSource.prototype.isTypeSupported = function () {
      for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      onAPICall("MediaSource.isTypeSupported", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      MSE_CALLS.MediaSource_clearLiveSeebleRange.push(myObj);

      var res = void 0;
      try {
        res = saveIsTypeSupported.apply(this, args);
      } catch (e) {
        Logger.error(">> MediaSource.prototype.isTypeSupported failed:", e);
        myObj.error = e;
        myObj.errorDate = Date.now();
        throw e;
      }
      Logger.debug(">> MediaSource.prototype.isTypeSupported succeeded:", res);
      myObj.response = res;
      myObj.responseDate = Date.now();
      return res;
    };

    var saveAppendBuffer = SourceBuffer.prototype.appendBuffer;
    SourceBuffer.prototype.appendBuffer = function () {
      for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      onAPICall("SourceBuffer.appendBuffer", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      MSE_CALLS.SourceBuffer_appendBuffer.push(myObj);

      var res = void 0;
      try {
        res = saveAppendBuffer.apply(this, args);
      } catch (e) {
        Logger.error(">> SourceBuffer.prototype.appendBuffer failed:", e);
        myObj.error = e;
        myObj.errorDate = Date.now();
        throw e;
      }
      Logger.debug(">> SourceBuffer.prototype.appendBuffer succeeded:", res);
      myObj.response = res;
      myObj.responseDate = Date.now();
      return res;
    };

    var saveAbort = SourceBuffer.prototype.abort;
    SourceBuffer.prototype.abort = function () {
      for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      onAPICall("SourceBuffer.abort", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      MSE_CALLS.SourceBuffer_abort.push(myObj);

      var res = void 0;
      try {
        res = saveAbort.apply(this, args);
      } catch (e) {
        Logger.error(">> SourceBuffer.prototype.abort failed:", e);
        myObj.error = e;
        myObj.errorDate = Date.now();
        throw e;
      }
      Logger.debug(">> SourceBuffer.prototype.abort succeeded:", res);
      myObj.response = res;
      myObj.responseDate = Date.now();
      return res;
    };

    var saveRemove = SourceBuffer.prototype.remove;
    SourceBuffer.prototype.remove = function () {
      for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      onAPICall("SourceBuffer.remove", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      MSE_CALLS.SourceBuffer_remove.push(myObj);

      var res = void 0;
      try {
        res = saveRemove.apply(this, args);
      } catch (e) {
        Logger.error(">> SourceBuffer.prototype.remove failed:", e);
        myObj.error = e;
        myObj.errorDate = Date.now();
        throw e;
      }
      Logger.debug(">> SourceBuffer.prototype.remove succeeded:", res);
      myObj.response = res;
      myObj.responseDate = Date.now();
      return res;
    };

    return {
      restore: function restore() {
        MediaSource.prototype.addSourceBuffer = saveAddSourceBuffer;
        MediaSource.prototype.removeSourceBuffer = saveRemoveSourceBuffer;
        MediaSource.prototype.endOfStream = saveSetLiveSeekableRange;
        MediaSource.prototype.setLiveSeekableRange = saveSetLiveSeekableRange;
        MediaSource.prototype.clearLiveSeekableRange = saveClearLiveSeekableRange;
        MediaSource.prototype.isTypeSupported = saveIsTypeSupported;

        SourceBuffer.prototype.appendBuffer = saveAppendBuffer;
        SourceBuffer.prototype.abort = saveAbort;
        SourceBuffer.prototype.remove = saveRemove;
      }
    };
  }

  exports.MSE_CALLS = MSE_CALLS;
  exports.Logger = Logger;
  exports.startMSESpy = startMSESpy;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
