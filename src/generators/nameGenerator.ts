import inquirer from 'inquirer';
import {faker} from '@faker-js/faker';

// Define type for name gender options
type NameGender = 'Masculine' | 'Feminine';

// Function to generate random name
export default async function generateRandomName(): Promise<void> {
  // Ask user for name gender preference if in standalone mode
  const { nameGender } = await inquirer.prompt([
    {
      type: 'list',
      name: 'nameGender',
      message: 'Would you like a masculine or feminine name?',
      choices: ['Masculine', 'Feminine'],
    },
  ]);

  // Generate a random first and last name based on gender preference
  const firstName = faker.person.firstName(nameGender === 'Masculine' ? 'male' : 'female');
  const lastName = faker.person.lastName();

  // Output the generated name
  console.log(`Name: ${firstName} ${lastName}`);
}
