import Logger from "./logger.js";

export default function stubRegularMethods(
  obj,
  methods,
  path,
  logObj,
) {
  for (let i = 0; i < methods.length; i++) {
    const methodName = methods[i];
    const completePath = path + "." + methodName;
    const oldMethod = obj[methodName];

    if (!oldMethod) {
      throw new Error("No method in " + completePath);
    }

    obj[methodName] = function (...args) {
      Logger.onFunctionCall(completePath, args);
      const myObj = {
        self: obj,
        date: Date.now(),
        args,
      };

      if (!logObj[methodName]) {
        logObj[methodName] = [];
      }
      logObj[methodName].push(myObj);

      let res;
      try {
        res = oldMethod.apply(this, args);
      } catch (e) {
        Logger.onFunctionCallError(completePath, e);
        myObj.error = e;
        myObj.errorDate = Date.now();
        throw e;
      }
      Logger.onFunctionCallSuccess(completePath, res);
      myObj.response = res;
      myObj.responseDate = Date.now();
      return res;
    };
  }
}
