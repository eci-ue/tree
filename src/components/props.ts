
const create = function<T>(type: any,required?: boolean, defaultValue?: T, validate?: (value: T) => T) {
  return {
    type,
    required,
    validate,
    default: function() {
      return typeof defaultValue === "function" ? defaultValue() : defaultValue;
    }
  }
}

export const toString = function<T = string>(required: boolean = false, defaultValue?: T, validate?: (value: T) => T) {
  return create<T>(String, required, defaultValue, validate);
}

export const toNumber = function<T = number>(required: boolean = false, defaultValue?: T, validate?: (value: T) => T) {
  return create<T>(Number, required, defaultValue, validate);
}

export const toBoolean = function<T = boolean>(required: boolean = false, defaultValue?: T, validate?: (value: T) => T) {
  return create<T>(Boolean, required, defaultValue, validate);
}

export const toArray = function<T>(required: boolean = false, defaultValue?: Array<T>, validate?: (value: Array<T>) => Array<T>) {
  return create<Array<T>>(String, required, defaultValue, validate);
}

export const toObject = function(required: boolean = false, defaultValue?: object, validate?: (value: object) => object) {
  return create<object>(String, required, defaultValue || {}, validate);
}