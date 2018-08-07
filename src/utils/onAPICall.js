import Logger from "./logger.js";

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

export default onAPICall;
