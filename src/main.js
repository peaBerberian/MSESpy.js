import {
  getMSECalls,
  resetMSECalls,
} from "./constants.js";
import Logger from "./utils/logger.js";
import spyOnMediaSource from "./spyOnMediaSource.js";
import spyOnSourceBuffer from "./spyOnSourceBuffer.js";

const resetSpyFunctions = [];

/**
 * Start spying on MSE API calls.
 */
function start() {
  resetSpyFunctions.push(spyOnMediaSource());
  resetSpyFunctions.push(spyOnSourceBuffer());
}

function stop() {
  resetSpyFunctions.forEach(fn => { fn(); });
  resetSpyFunctions.length = 0;
}

export {
  getMSECalls,
  resetMSECalls,
  Logger,
  start,
  stop,
};
