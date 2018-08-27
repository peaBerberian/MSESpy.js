/**
 * Store information about every MSE Calls stubbed in this file.
 * @type {Object}
 */
const MSE_CALLS = {};

function getMSECalls() {
  return MSE_CALLS;
}

function resetMSECalls() {
  Object.key(MSE_CALLS).forEach(key => {
    delete MSE_CALLS[key];
  });
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
