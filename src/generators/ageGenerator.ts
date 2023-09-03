import randomChoice from '../utils/randomChoice';

export const AgeGroups = ['Infant', 'Toddler', 'Child', 'Teen', 'Young Adult', 'Adult', 'Elder'] as const;
export type Age = (typeof AgeGroups)[number];
export type AgeRecord = Record<string, Age>;

/**
 * Generate a random age for a Sim.
 */
async function generateRandomAge(): Promise<AgeRecord> {
  console.clear();
  const selectedAge = randomChoice([...AgeGroups]) as Age;
  return { age: selectedAge } as AgeRecord;
}
export default generateRandomAge;
