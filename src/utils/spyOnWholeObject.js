import Logger from "./logger.js";
import spyOnMethods from "./spyOnMethods.js";
import spyOnReadOnlyProperties from "./spyOnReadOnlyProperties.js";
import spyOnProperties from "./spyOnProperties.js";

const stubbedObjects = [];
export default function spyOnWholeObject(
  BaseObject,
  objectName,
  readOnlyPropertyNames,
  propertyNames,
  staticMethodNames,
  methodNames,
  loggingObject
) {
  if (BaseObject == null || !BaseObject.prototype) {
    throw new Error("Invalid object");
  }
  if (stubbedObjects.includes(BaseObject)) {
    return;
  }

  const BaseObjectProtoDescriptors =
    Object.getOwnPropertyDescriptors(BaseObject.prototype);
  const BaseObjectStaticMethods = staticMethodNames
    .reduce((acc, methodName) => {
      acc[methodName] = BaseObject[methodName];
      return acc;
    }, {});
  const BaseObjectMethods = methodNames
    .reduce((acc, methodName) => {
      acc[methodName] = BaseObject.prototype[methodName];
      return acc;
    }, {});

  if (loggingObject[objectName] == null) {
    loggingObject[objectName] = {
      new: [],
      methods: {},
      staticMethods: {},
      properties: {},
      eventListeners: {}, // TODO
    };
  }

  function StubbedObject(...args) {
    Logger.onObjectInstanciation(objectName, args);
    const now = Date.now();
    const spyObj = {
      date: now,
      args,
    };
    loggingObject[objectName].new.push(spyObj);
    let baseObject;
    try {
      baseObject = new BaseObject(...args);
    } catch (e) {
      Logger.onObjectInstanciationError(objectName, e);
      spyObj.error = e;
      spyObj.errorDate = Date.now();
      throw e;
    }
    Logger.onObjectInstanciationSuccess(objectName, baseObject);
    spyObj.response = baseObject;
    spyObj.responseDate = Date.now();
    return baseObject;
  }

  spyOnMethods(
    BaseObject,
    staticMethodNames,
    objectName,
    loggingObject[objectName].staticMethods,
  );
  staticMethodNames.forEach((method) => {
    StubbedObject[method] = BaseObject[method].bind(BaseObject);
  });
  spyOnReadOnlyProperties(
    BaseObject.prototype,
    BaseObjectProtoDescriptors,
    readOnlyPropertyNames,
    `${objectName}.prototype`,
    loggingObject[objectName].properties,
  );
  spyOnProperties(
    BaseObject.prototype,
    BaseObjectProtoDescriptors,
    propertyNames,
    `${objectName}.prototype`,
    loggingObject[objectName].properties,
  );
  spyOnMethods(
    BaseObject.prototype,
    methodNames,
    `${objectName}.prototype`,
    loggingObject[objectName].methods,
  );
  window[objectName] = StubbedObject;
  stubbedObjects.push(BaseObject);

  return function stopSpying() {
    Object.defineProperties(BaseObject.prototype,
      propertyNames
        .concat(readOnlyPropertyNames)
        .reduce((acc, propertyName) => {
          acc[propertyName] = BaseObjectProtoDescriptors[propertyName];
          return acc;
        }, {})
    );
    staticMethodNames.forEach((methodName) => {
      BaseObject[methodName] = BaseObjectStaticMethods[methodName];
    });
    methodNames.forEach((methodName) => {
      BaseObject.prototype[methodName] = BaseObjectMethods[methodName];
    });
    window[objectName] = BaseObject;
  };
}