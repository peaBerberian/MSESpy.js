import Logger from "./utils/logger.js";
import stubRegularMethods from "./utils/stubRegularMethods.js";
import stubReadOnlyProperties from "./utils/stubReadOnlyProperties.js";
import stubProperties from "./utils/stubProperties.js";
import {
  MSE_CALLS,
  NativeSourceBuffer,
} from "./constants.js";

const SOURCEBUFFER_SPY_OBJECT = {
  readOnlyProperties: [
    "updating",
    "buffered",
    // "audioTracks",
    // "videoTracks",
    // "textTracks",
  ],
  properties: [
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
  staticMethods: [],
  methods: [
    "addEventListener",
    "removeEventListener",
    "dispatchEvent",
    "appendBuffer",
    "abort",
    "remove",
  ],
};

const NativeSourceBufferProtoDescriptors =
  Object.getOwnPropertyDescriptors(NativeSourceBuffer.prototype);

const NativeSourceBufferStaticMethods = SOURCEBUFFER_SPY_OBJECT.staticMethods
  .reduce((acc, methodName) => {
    acc[methodName] = NativeSourceBuffer[methodName];
    return acc;
  }, {});
const NativeSourceBufferMethods = SOURCEBUFFER_SPY_OBJECT.methods
  .reduce((acc, methodName) => {
    acc[methodName] = NativeSourceBuffer.prototype[methodName];
    return acc;
  }, {});

function StubbedSourceBuffer(...args) {
  Logger.onObjectInstanciation("SourceBuffer", args);
  const now = Date.now();
  const spyObj = {
    date: now,
    args,
  };
  MSE_CALLS.SourceBuffer.new.push(spyObj);
  let nativeSourceBuffer;
  try {
    nativeSourceBuffer = new NativeSourceBuffer(...args);
  } catch (e) {
    Logger.onObjectInstanciationError("SourceBuffer", e);
    spyObj.error = e;
    spyObj.errorDate = Date.now();
    throw e;
  }
  Logger.onObjectInstanciationSuccess("SourceBuffer", nativeSourceBuffer);
  spyObj.response = nativeSourceBuffer;
  spyObj.responseDate = Date.now();
  return nativeSourceBuffer;
}

export default function spyOnSourceBuffer() {
  stubReadOnlyProperties(
    NativeSourceBuffer.prototype,
    NativeSourceBufferProtoDescriptors,
    SOURCEBUFFER_SPY_OBJECT.readOnlyProperties,
    "SourceBuffer.prototype",
    MSE_CALLS.SourceBuffer.properties,
  );
  stubProperties(
    NativeSourceBuffer.prototype,
    NativeSourceBufferProtoDescriptors,
    SOURCEBUFFER_SPY_OBJECT.properties,
    "SourceBuffer.prototype",
    MSE_CALLS.SourceBuffer.properties,
  );
  stubRegularMethods(
    NativeSourceBuffer.prototype,
    SOURCEBUFFER_SPY_OBJECT.methods,
    "SourceBuffer.prototype",
    MSE_CALLS.SourceBuffer.methods,
  );
  window.SourceBuffer = StubbedSourceBuffer;
}

export function stopSpyingOnSourceBuffer() {
  Object.defineProperties(NativeSourceBuffer.prototype,
    SOURCEBUFFER_SPY_OBJECT.properties
      .concat(SOURCEBUFFER_SPY_OBJECT.readOnlyProperties)
      .reduce((acc, propertyName) => {
        acc[propertyName] = NativeSourceBufferProtoDescriptors[propertyName];
      }, {})
  );
  SOURCEBUFFER_SPY_OBJECT.staticMethods.forEach((methodName) => {
    NativeSourceBuffer[methodName] = NativeSourceBufferStaticMethods[methodName];
  });
  SOURCEBUFFER_SPY_OBJECT.methods.forEach((methodName) => {
    NativeSourceBuffer.prototype[methodName] = NativeSourceBufferMethods[methodName];
  });
  window.SourceBuffer = NativeSourceBuffer;
}
