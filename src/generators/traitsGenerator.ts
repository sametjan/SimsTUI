
import inquirer from 'inquirer';
import * as R from 'remeda';
import * as fs from 'fs';
import * as path from 'path';

type TraitsAgeGroup = 'Infant' | 'Toddler' | 'Child' | 'Teen' | 'Young Adult and Older';

// Load the traits data from traits.json
const traitsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/traits.json'), 'utf-8'));

// Function to generate random traits
export default async function generateRandomTraits(age?: string): Promise<Array<string> | void> {
  let ageGroup: TraitsAgeGroup;

  if (!age) {
    const response = await inquirer.prompt([
      {
        type: 'list',
        name: 'ageGroup',
        message: 'Pick an age group:',
        choices: ['Infant', 'Toddler', 'Child', 'Teen', 'Young Adult and Older'],
      },
    ]);
    ageGroup = response.ageGroup;
  } else {
    switch (age) {
      case 'Young Adult':
      case 'Adult':
      case 'Elder':
        ageGroup = 'Young Adult and Older';
        break;
      default:
        ageGroup = age as TraitsAgeGroup;
    }
  }

  let traitsToChooseFrom: string[] = [];
  let numberOfTraits: number = 0;

  // Decide the number of traits and what traits to choose from based on age group
  switch (ageGroup) {
    case 'Infant':
      traitsToChooseFrom = traitsData.infant.infant;
      numberOfTraits = 1;
      break;
    case 'Toddler':
      traitsToChooseFrom = traitsData.toddler.toddler;
      numberOfTraits = 1;
      break;
    case 'Child':
      traitsToChooseFrom = R.flatten(R.values(traitsData.child));
      numberOfTraits = 1;
      break;
    case 'Teen':
      traitsToChooseFrom = R.flatten([...R.values(traitsData.child), ...R.values(traitsData.teen)]) as string[];
      numberOfTraits = 2;
      break;
    case 'Young Adult and Older':
      traitsToChooseFrom = R.flatten([...R.values(traitsData.child), ...R.values(traitsData.teen), ...R.values(traitsData.adult)]) as string[];
      numberOfTraits = 3;
      break;
    default:
      console.log('Invalid age group selected.');
      return;
  }

  // Randomly select traits
  const selectedTraits = R.sample(traitsToChooseFrom, numberOfTraits);

  // Display the selected traits
  console.log(`Generated Traits for ${ageGroup}: ${selectedTraits.join(', ')}`);
  return selectedTraits
}
