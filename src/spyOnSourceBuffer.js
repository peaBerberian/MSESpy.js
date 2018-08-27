import spyOnWholeObject from "./utils/spyOnWholeObject.js";
import {
  MSE_CALLS,
  NativeSourceBuffer,
} from "./constants.js";

export default function spyOnMediaSource() {
  return spyOnWholeObject(
    // Object to spy on
    NativeSourceBuffer,

    // name in window
    "SourceBuffer",

    // read-only properties
    ["updating", "buffered"],

    // regular properties
    [
      "mode",
      "timestampOffset",
      "appendWindowStart",
      "appendWindowEnd",
      "onupdate",
      "onupdatestart",
      "onupdateend",
      "onerror",
      "onabort",
    ],

    // static methods
    [],
  
    // methods
    [
      "addEventListener",
      "removeEventListener",
      "dispatchEvent",
      "appendBuffer",
      "abort",
      "remove",
    ],

    // global logging object
    MSE_CALLS
  );
}
