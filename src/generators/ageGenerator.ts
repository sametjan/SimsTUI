import randomChoice from "../utils/randomChoice";

export type Age = 'Infant' | 'Toddler' | 'Child' | 'Teen' | 'Young Adult' | 'Adult' | 'Elder';
export type AgeRecord = Record<string, Age>;

/**
 * Generate a random age for a Sim.
 */
async function generateRandomAge(): Promise<AgeRecord> {
  console.clear();
  const ageOptions: Age[] = ['Infant', 'Toddler', 'Child', 'Teen', 'Young Adult', 'Adult', 'Elder'];
  const selectedAge = randomChoice(ageOptions) as Age;
  return { "age": selectedAge } as AgeRecord;
}
export default generateRandomAge;
