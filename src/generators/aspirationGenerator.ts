import { capitalCase } from 'change-case';
import inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';

type AspirationAgeGroup = 'Child' | 'Teen' | 'Young Adult and Older';

// Function to randomly select an item from an array
function randomChoice<T>(options: T[]): T {
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

// Function to generate a random aspiration
export default async function generateRandomAspiration(): Promise<void> {
  // Read the aspirations data from the JSON file
  const aspirationsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/aspirations.json'), 'utf-8'));

  // Ask user for age group
  const { ageGroup } = await inquirer.prompt([
    {
      type: 'list',
      name: 'ageGroup',
      message: 'Select the age group for the aspiration:',
      choices: ['Child', 'Teen', 'Young Adult and Older'],
    },
  ]);

  let ageGroupAspirations: any;

  switch (ageGroup) {
    case 'Child':
      ageGroupAspirations = aspirationsData['child'];
      break;
    case 'Teen':
      // Merge adult and teen-specific aspirations
      ageGroupAspirations = {
        ...aspirationsData['adult'],
        ...aspirationsData['teen']
      };
      break;
    case 'Young Adult and Older':
      ageGroupAspirations = aspirationsData['adult'];
      break;
  }

  // Select a random main category and subcategory
  const mainCategories = Object.keys(ageGroupAspirations);
  const selectedMainCategory = randomChoice(mainCategories);
  const subCategories = ageGroupAspirations[selectedMainCategory];
  const selectedSubCategory = randomChoice(subCategories) as string;

  // Format the output
  const formattedMainCategory = capitalCase(selectedMainCategory);
  const formattedSubCategory = capitalCase(selectedSubCategory);

  // Output the generated aspiration
  console.log(`Aspiration: ${formattedMainCategory} > ${formattedSubCategory}`);
}
