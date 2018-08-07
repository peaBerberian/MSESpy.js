import Logger from "./logger.js";

export default function stubReadOnlyProperties(
  obj,
  oldDescriptors,
  properties,
  path,
  logObj,
) {
  for (let i = 0; i < properties.length; i++) {
    const propertyName = properties[i];
    const oldDescriptor = oldDescriptors[propertyName];
    const completePath = path + "." + propertyName;

    if (!oldDescriptor) {
      throw new Error("No descriptor for property " +
        completePath);
    }

    Object.defineProperty(obj, propertyName, {
      get() {
        const value = oldDescriptor.get.bind(this)();

        const myObj = {
          self: this,
          date: Date.now(),
          value: value,
        };

        if (!logObj[propertyName]) {
          logObj[propertyName] = {
            get: [],
          };
        }
        logObj[propertyName].get.push(myObj);

        Logger.debug(`>> Getting ${completePath}:`, value);
        return value;
      },
    });
  }
}
