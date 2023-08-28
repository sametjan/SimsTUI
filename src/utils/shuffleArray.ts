import { swapIndices } from 'remeda';

/**
 * Shuffles an array in-place using the Fisher-Yates Shuffle algorithm.
 * 
 * @param arr - The array to be shuffled.
 * @returns The shuffled array.
 */
const shuffleArray = <T>(arr: T[]): T[] => {
  // Loop from the last element to the first one
  for (let i = arr.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));
    
    // Swap arr[i] and arr[j] using Remeda's swapIndices function
    swapIndices(arr, i, j);
  }

  return arr;
};
export default shuffleArray;