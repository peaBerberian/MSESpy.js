import {
  getMSECalls,
  resetMSECalls,
} from "./constants.js";
import Logger from "./utils/logger.js";
import spyOnMediaSource, {
  stopSpyingOnMediaSource,
} from "./spyOnMediaSource.js";
import spyOnSourceBuffer, {
  stopSpyingOnSourceBuffer,
} from "./spyOnSourceBuffer.js";

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

export {
  getMSECalls,
  resetMSECalls,
  Logger,
  start,
  stop,
};
