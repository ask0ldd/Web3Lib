import _ from "lodash"

export default class ObjectUtils{
    static shallowEqual = (obj1 : object, obj2 : object) => {
        return _.isEqualWith(obj1, obj2, (value1 : unknown, value2 : unknown) => {
          // Use strict equality for shallow comparison
          if (typeof value1 !== 'object' && typeof value2 !== 'object') {
            return value1 === value2
          }
        })
      }
}