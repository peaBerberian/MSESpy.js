import Logger from "./utils/logger.js";
import stubRegularMethods from "./utils/stubRegularMethods.js";
import stubReadOnlyProperties from "./utils/stubReadOnlyProperties.js";
import stubProperties from "./utils/stubProperties.js";
import {
  MSE_CALLS,
  NativeMediaSource,
} from "./constants.js";

const NativeMediaSourceProtoDescriptors =
  Object.getOwnPropertyDescriptors(NativeMediaSource.prototype);

const NativeMediaSourceIsTypeSupported = NativeMediaSource.isTypeSupported;

function StubbedMediaSource(...args) {
  if (args.length) {
    Logger.debug(">>> Creating MediaSource with arguments:", args);
  } else {
    Logger.debug(">>> Creating MediaSource");
  }
  const nativeMediaSource = new NativeMediaSource(...args);
  Logger.debug(">>> MediaSource created:", nativeMediaSource);
  stubReadOnlyProperties(
    nativeMediaSource,
    NativeMediaSourceProtoDescriptors,
    [
      "sourceBuffers",
      "activeSourceBuffers",
      "readyState",
    ],
    "MediaSource.prototype",
    MSE_CALLS.MediaSource.properties,
  );
  stubProperties(
    nativeMediaSource,
    NativeMediaSourceProtoDescriptors,
    [
      "duration",
      "onsourceopen",
      "onsourceended",
      "onsourceclose",
    ],
    "MediaSource.prototype",
    MSE_CALLS.MediaSource.properties,
  );
  stubRegularMethods(
    nativeMediaSource,
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
    "MediaSource.prototype",
    MSE_CALLS.MediaSource.methods,
  );

  return nativeMediaSource;
}

export default function spyOnMediaSource() {
  stubRegularMethods(
    NativeMediaSource,
    ["isTypeSupported"],
    "MediaSource.isTypeSupported",
    MSE_CALLS.MediaSource.methods,
  );
  window.MediaSource = StubbedMediaSource;
}

export function stopSpyingOnMediaSource() {
  window.MediaSource = NativeMediaSource;
  window.MediaSource.isTypeSupported = NativeMediaSourceIsTypeSupported;
}
