// Recursive function to deeply merge two objects
const mergeDeepWith = <T>(
  mergeFn: (a: any, b: any) => any,
  obj1: T,
  obj2: T
): T => {
  const result: any = { ...obj1 };

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (
        typeof obj2[key] === 'object' &&
        obj2[key] !== null &&
        !Array.isArray(obj2[key]) &&
        Object.prototype.hasOwnProperty.call(obj1, key) &&
        typeof obj1[key] === 'object' &&
        obj1[key] !== null &&
        !Array.isArray(obj1[key])
      ) {
        // If both objects have the same key and the value is an object (not an array),
        // recursively merge them
        result[key] = mergeDeepWith(mergeFn, obj1[key], obj2[key]);
      } else {
        // If one of the keys has a non-object value or doesn't exist in one of the objects,
        // apply the merge function
        result[key] = mergeFn(obj1[key], obj2[key]);
      }
    }
  }

  return result;
};
export default mergeDeepWith;