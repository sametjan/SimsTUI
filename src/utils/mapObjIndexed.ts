import { map } from 'remeda';

// Function to transform each [key, value] pair in the object using a given function
const _mapObjIndexed = <T, R>(
  fn: (value: T, key: string) => R,  // function to apply on each [key, value] pair
  obj: Record<string, T>             // object to transform
): Record<string, R> => {
  // Check for undefined or null object
  if (obj == null) {
    throw new Error("The object to transform cannot be undefined or null");
  }

  // Convert the object to an array of [key, value] pairs
  const entries = Object.entries(obj);

  // Use Remeda's map to iterate over each entry and apply the function
  const transformedEntries = map(entries, ([key, value]: [string, T]) => {
    // Apply the function on each [key, value] pair
    return [key, fn(value, key)] as [string, R];
  });

  // Convert the array of transformed [key, value] pairs back into an object
  return Object.fromEntries(transformedEntries);
};

// Curried version of _mapObjIndexed
const mapObjIndexed = <T, R>(fn: (value: T, key: string) => R) => {
  return (obj: Record<string, T>) => {
    return _mapObjIndexed(fn, obj);
  };
};

export default mapObjIndexed;
