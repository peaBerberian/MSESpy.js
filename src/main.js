/**
 * Store information about every MSE Calls stubbed in this file.
 * @type {Object}
 */
const MSE_CALLS = {
  MediaSource_addSourceBuffer: [],
  MediaSource_removeSourceBuffer: [],
  MediaSource_endOfStream: [],
  MediaSource_setLiveSeekableRange: [],
  MediaSource_clearLiveSeekableRange: [],
  MediaSource_isTypeSupported: [],
  SourceBuffer_appendBuffer: [],
  SourceBuffer_abort: [],
  SourceBuffer_remove: [],
};

/**
 * Define the logger for startMSESpy.
 * Allows to re-define a specific logger on runtime / before applying this
 * script.
 * @type {Object}
 */
const Logger = window.Logger || {
  /* eslint-disable no-console */
  log: function(...args) {
    console.log(...args);
  },
  debug: function(...args) {
    console.debug(...args);
  },
  info: function(...args) {
    console.info(...args);
  },
  error: function(...args) {
    console.error(...args);
  },
  warning: function(...args) {
    console.warning(...args);
  },
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
      Logger.debug(`>>> ${fnName} called with arguments:`, args);
    } else {
      Logger.debug(`>>> ${fnName} called`);
    }
  }

  const saveAddSourceBuffer = MediaSource.prototype.addSourceBuffer;
  MediaSource.prototype.addSourceBuffer = function(...args) {
    onAPICall("MediaSource.addSourceBuffer", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    MSE_CALLS.MediaSource_addSourceBuffer.push(myObj);

    let sourceBuffer;
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

  const saveRemoveSourceBuffer = MediaSource.prototype.removeSourceBuffer;
  MediaSource.prototype.removeSourceBuffer = function(...args) {
    onAPICall("MediaSource.removeSourceBuffer", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    MSE_CALLS.MediaSource_removeSourceBuffer.push(myObj);

    let res;
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

  const saveEndOfStream = MediaSource.prototype.endOfStream;
  MediaSource.prototype.endOfStream = function(...args) {
    onAPICall("MediaSource.endOfStream", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    MSE_CALLS.MediaSource_endOfStream.push(myObj);

    let res;
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

  const saveSetLiveSeekableRange = MediaSource.prototype.setLiveSeekableRange;
  MediaSource.prototype.setLiveSeekableRange = function(...args) {
    onAPICall("MediaSource.setLiveSeekableRange", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    MSE_CALLS.MediaSource_setLiveSeebleRange.push(myObj);

    let res;
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

  const saveClearLiveSeekableRange = MediaSource.prototype.clearLiveSeekableRange;
  MediaSource.prototype.clearLiveSeekableRange = function(...args) {
    onAPICall("MediaSource.clearLiveSeekableRange", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    MSE_CALLS.MediaSource_clearLiveSeebleRange.push(myObj);

    let res;
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

  const saveIsTypeSupported = MediaSource.prototype.isTypeSupported;
  MediaSource.prototype.isTypeSupported = function(...args) {
    onAPICall("MediaSource.isTypeSupported", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    MSE_CALLS.MediaSource_clearLiveSeebleRange.push(myObj);

    let res;
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

  const saveAppendBuffer = SourceBuffer.prototype.appendBuffer;
  SourceBuffer.prototype.appendBuffer = function(...args) {
    onAPICall("SourceBuffer.appendBuffer", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    MSE_CALLS.SourceBuffer_appendBuffer.push(myObj);

    let res;
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

  const saveAbort = SourceBuffer.prototype.abort;
  SourceBuffer.prototype.abort = function(...args) {
    onAPICall("SourceBuffer.abort", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    MSE_CALLS.SourceBuffer_abort.push(myObj);

    let res;
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

  const saveRemove = SourceBuffer.prototype.remove;
  SourceBuffer.prototype.remove = function(...args) {
    onAPICall("SourceBuffer.remove", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    MSE_CALLS.SourceBuffer_remove.push(myObj);

    let res;
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
    restore: function () {
      MediaSource.prototype.addSourceBuffer = saveAddSourceBuffer;
      MediaSource.prototype.removeSourceBuffer = saveRemoveSourceBuffer;
      MediaSource.prototype.endOfStream = saveSetLiveSeekableRange;
      MediaSource.prototype.setLiveSeekableRange = saveSetLiveSeekableRange;
      MediaSource.prototype.clearLiveSeekableRange = saveClearLiveSeekableRange;
      MediaSource.prototype.isTypeSupported = saveIsTypeSupported;

      SourceBuffer.prototype.appendBuffer = saveAppendBuffer;
      SourceBuffer.prototype.abort = saveAbort;
      SourceBuffer.prototype.remove = saveRemove;
    },
  };
}

export {
  MSE_CALLS,
  Logger,
  startMSESpy,
};
