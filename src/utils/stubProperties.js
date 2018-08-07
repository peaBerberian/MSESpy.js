import Logger from "./logger.js";

export default function stubProperties(
  obj,
  oldDescriptors,
  properties,
  path,
  logObj
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
            set: [],
            get: [],
          };
        }
        logObj[propertyName].get.push(myObj);

        Logger.debug(`>> Getting ${completePath}:`, value);
        return value;
      },
      set(value) {
        Logger.debug(`>> Setting ${completePath}:`, value);

        const myObj = {
          self: this,
          date: Date.now(),
          value: value,
        };

        if (!logObj[propertyName]) {
          logObj[propertyName] = {
            set: [],
            get: [],
          };
        }
        logObj[propertyName].set.push(myObj);
        oldDescriptor.set.bind(this)(value);
      },
    });
  }
}
