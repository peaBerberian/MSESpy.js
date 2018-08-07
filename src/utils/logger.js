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

export default Logger;
