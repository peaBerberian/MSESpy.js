import Logger from "./utils/logger.js";
import stubRegularMethods from "./utils/stubRegularMethods.js";
import stubReadOnlyProperties from "./utils/stubReadOnlyProperties.js";
import stubProperties from "./utils/stubProperties.js";
import {
  MSE_CALLS,
  NativeMediaSource,
} from "./constants.js";

const MEDIASOURCE_SPY_OBJECT = {
  readOnlyProperties: [
    "sourceBuffers",
    "activeSourceBuffers",
    "readyState",
  ],
  properties: [
    "duration",
    "onsourceopen",
    "onsourceended",
    "onsourceclose",
  ],
  staticMethods: [
    "isTypeSupported",
  ],
  methods: [
    "addEventListener",
    "removeEventListener",
    "dispatchEvent",
    "addSourceBuffer",
    "removeSourceBuffer",
    "endOfStream",
    "setLiveSeekableRange",
    "clearLiveSeekableRange",
  ],
};

const NativeMediaSourceProtoDescriptors =
  Object.getOwnPropertyDescriptors(NativeMediaSource.prototype);

const NativeMediaSourceStaticMethods = MEDIASOURCE_SPY_OBJECT.staticMethods
  .reduce((acc, methodName) => {
    acc[methodName] = NativeMediaSource[methodName];
    return acc;
  }, {});
const NativeMediaSourceMethods = MEDIASOURCE_SPY_OBJECT.methods
  .reduce((acc, methodName) => {
    acc[methodName] = NativeMediaSource.prototype[methodName];
    return acc;
  }, {});

function StubbedMediaSource(...args) {
  Logger.onObjectInstanciation("MediaSource", args);
  const now = Date.now();
  const spyObj = {
    date: now,
    args,
  };
  MSE_CALLS.MediaSource.new.push(spyObj);
  let nativeMediaSource;
  try {
    nativeMediaSource = new NativeMediaSource(...args);
  } catch (e) {
    Logger.onObjectInstanciationError("MediaSource", e);
    spyObj.error = e;
    spyObj.errorDate = Date.now();
    throw e;
  }
  Logger.onObjectInstanciationSuccess("MediaSource", nativeMediaSource);
  spyObj.response = nativeMediaSource;
  spyObj.responseDate = Date.now();
  return nativeMediaSource;
}

export default function spyOnMediaSource() {
  stubReadOnlyProperties(
    NativeMediaSource.prototype,
    NativeMediaSourceProtoDescriptors,
    MEDIASOURCE_SPY_OBJECT.readOnlyProperties,
    "MediaSource.prototype",
    MSE_CALLS.MediaSource.properties,
  );
  stubRegularMethods(
    NativeMediaSource,
    MEDIASOURCE_SPY_OBJECT.staticMethods,
    "MediaSource",
    MSE_CALLS.MediaSource.methods,
  );
  stubProperties(
    NativeMediaSource.prototype,
    NativeMediaSourceProtoDescriptors,
    MEDIASOURCE_SPY_OBJECT.properties,
    "MediaSource.prototype",
    MSE_CALLS.MediaSource.properties,
  );
  stubRegularMethods(
    NativeMediaSource.prototype,
    MEDIASOURCE_SPY_OBJECT.methods,
    "MediaSource.prototype",
    MSE_CALLS.MediaSource.methods,
  );
  window.MediaSource = StubbedMediaSource;
}

export function stopSpyingOnMediaSource() {
  Object.defineProperties(NativeMediaSource.prototype,
    MEDIASOURCE_SPY_OBJECT.properties
      .concat(MEDIASOURCE_SPY_OBJECT.readOnlyProperties)
      .reduce((acc, propertyName) => {
        acc[propertyName] = NativeMediaSourceProtoDescriptors[propertyName];
      }, {})
  );
  MEDIASOURCE_SPY_OBJECT.staticMethods.forEach((methodName) => {
    NativeMediaSource[methodName] = NativeMediaSourceStaticMethods[methodName];
  });
  MEDIASOURCE_SPY_OBJECT.methods.forEach((methodName) => {
    NativeMediaSource.prototype[methodName] = NativeMediaSourceMethods[methodName];
  });
  window.MediaSource = NativeMediaSource;
}
