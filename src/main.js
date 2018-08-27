import {
  getMSECalls,
  resetMSECalls,
} from "./constants.js";
import Logger from "./utils/logger.js";
import spyOnMediaSource from "./spyOnMediaSource.js";
import spyOnSourceBuffer from "./spyOnSourceBuffer.js";

let resetSpies = null;

/**
 * Start/restart spying on MSE API calls.
 */
function start() {
  if (resetSpies) {
    resetSpies();
  }

  const resetSpyFunctions = [];
  const resetMediaSource = spyOnMediaSource();
  if (resetMediaSource) {
    resetSpyFunctions.push(resetMediaSource);
  }

  const resetSourceBuffer = spyOnSourceBuffer();
  if (resetSourceBuffer) {
    resetSpyFunctions.push(resetSourceBuffer);
  }

  resetSpies = function resetEverySpies() {
    resetSpyFunctions.forEach(fn => { fn && fn(); });
    resetSpyFunctions.length = 0;
    resetSpies = null;
  };
}

/**
 * Stop spying on MSE API calls.
 */
function stop() {
  if (resetSpies) {
    resetSpies();
  }
}

export {
  getMSECalls,
  resetMSECalls,
  Logger,
  start,
  stop,
};
