/**
 * Store information about every MSE Calls stubbed in this file.
 * @type {Object}
 */
const MSE_CALLS = {
  MediaSource: {
    new: [],
    methods: {},
    properties: {},
    eventListeners: {}, // TODO
  },
  SourceBuffer: {
    new: [],
    methods: {},
    properties: {},
    eventListeners: {}, // TODO
  },
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
const NativeMediaSource = window.MediaSource;
const NativeSourceBuffer = window.SourceBuffer;

export {
  MSE_CALLS,
  NativeMediaSource,
  NativeSourceBuffer,
  getMSECalls,
  resetMSECalls,
};
