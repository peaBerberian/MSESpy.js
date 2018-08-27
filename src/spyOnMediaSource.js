import spyOnWholeObject from "./utils/spyOnWholeObject.js";
import {
  MSE_CALLS,
  NativeMediaSource,
} from "./constants.js";

export default function spyOnMediaSource() {
  return spyOnWholeObject(
    // Object to spy on
    NativeMediaSource,

    // name in window
    "MediaSource",

    // read-only properties
    ["sourceBuffers", "activeSourceBuffers", "readyState"],

    // regular properties
    ["duration", "onsourceopen", "onsourceended", "onsourceclose"],

    // static methods
    ["isTypeSupported"],
  
    // methods
    [
      "addEventListener",
      "removeEventListener",
      "dispatchEvent",
      "addSourceBuffer",
      "removeSourceBuffer",
      "endOfStream",
      "setLiveSeekableRange",
      "clearLiveSeekableRange",
    ],

    // global logging object
    MSE_CALLS
  );
}
