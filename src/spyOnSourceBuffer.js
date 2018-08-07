import stubRegularMethods from "./utils/stubRegularMethods.js";
import stubReadOnlyProperties from "./utils/stubReadOnlyProperties.js";
import stubProperties from "./utils/stubProperties.js";
import {
  MSE_CALLS,
  NativeSourceBuffer,
} from "./constants.js";

const NativeSourceBufferProtoDescriptors =
  Object.getOwnPropertyDescriptors(NativeSourceBuffer.prototype);

const NativeSourceBufferAddEventListener =
  NativeSourceBuffer.prototype.addEventListener;
const NativeSourceBufferRemoveEventListener =
  NativeSourceBuffer.prototype.removeEventListener;
const NativeSourceBufferDispatchEvent =
  NativeSourceBuffer.prototype.dispatchEvent;
const NativeSourceBufferAppendBuffer =
  NativeSourceBuffer.prototype.appendBuffer;
const NativeSourceBufferAbort =
  NativeSourceBuffer.prototype.abort;
const NativeSourceBufferRemove =
  NativeSourceBuffer.prototype.remove;

export default function spyOnSourceBuffer() {
  stubReadOnlyProperties(
    NativeSourceBuffer.prototype,
    NativeSourceBufferProtoDescriptors,
    [
      "updating",
      "buffered",
      // "audioTracks",
      // "videoTracks",
      // "textTracks",
    ],
    "SourceBuffer.prototype",
    MSE_CALLS.SourceBuffer.properties,
  );
  stubProperties(
    NativeSourceBuffer.prototype,
    NativeSourceBufferProtoDescriptors,
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
    "SourceBuffer.prototype",
    MSE_CALLS.SourceBuffer.properties,
  );
  stubRegularMethods(
    NativeSourceBuffer.prototype,
    [
      "addEventListener",
      "removeEventListener",
      "dispatchEvent",
      "appendBuffer",
      "abort",
      "remove",
    ],
    "SourceBuffer.prototype",
    MSE_CALLS.SourceBuffer.methods,
  );
}

export function stopSpyingOnSourceBuffer() {
  Object.defineProperties(NativeSourceBuffer.prototype, {
    updating: NativeSourceBufferProtoDescriptors.updating,
    buffered: NativeSourceBufferProtoDescriptors.buffered,
    mode: NativeSourceBufferProtoDescriptors.mode,
    timestampOffset: NativeSourceBufferProtoDescriptors.timestampOffset,
    appendWindowStart: NativeSourceBufferProtoDescriptors.appendWindowStart,
    appendWindowEnd: NativeSourceBufferProtoDescriptors.appendWindowEnd,
    onupdate: NativeSourceBufferProtoDescriptors.onupdate,
    onupdatestart: NativeSourceBufferProtoDescriptors.onupdatestart,
    onupdateend: NativeSourceBufferProtoDescriptors.onupdateend,
    onerror: NativeSourceBufferProtoDescriptors.onerror,
    onabort: NativeSourceBufferProtoDescriptors.onabort,
  });
  NativeSourceBuffer.prototype.addEventListener =
    NativeSourceBufferAddEventListener;
  NativeSourceBuffer.prototype.removeEventListener =
    NativeSourceBufferRemoveEventListener;
  NativeSourceBuffer.prototype.dispatchEvent =
    NativeSourceBufferDispatchEvent;
  NativeSourceBuffer.prototype.appendBuffer =
    NativeSourceBufferAppendBuffer;
  NativeSourceBuffer.prototype.abort =
    NativeSourceBufferAbort;
  NativeSourceBuffer.prototype.remove =
    NativeSourceBufferRemove;
}
