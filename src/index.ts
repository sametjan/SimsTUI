import inquirer from 'inquirer';
import generateRandomGenderAndOrientation from './generators/genderGenerator';
import generateRandomAge from './generators/ageGenerator';
import generateRandomName from './generators/nameGenerator';
import generateRandomAspiration from './generators/aspirationGenerator';
import generateRandomTraits from './generators/traitsGenerator';
import generatePreferences from './generators/preferencesGenerator';

// Define the type for menu choices
type MenuChoices =
  | 'Generate Gender/Sexual Orientation'
  | 'Generate Age'
  | 'Generate Name'
  | 'Generate Aspiration'
  | 'Generate Traits'
  | 'Generate Preferences'
  | 'Create Whole Sim'
  | 'Exit';

// Main menu function
async function mainMenu(): Promise<void> {
  const choices: MenuChoices[] = [
    'Generate Gender/Sexual Orientation',
    'Generate Age',
    'Generate Name',
    'Generate Aspiration',
    'Generate Traits',
    'Generate Preferences',
    'Create Whole Sim',
    'Exit',
  ];

  const { menuOption } = await inquirer.prompt([
    {
      type: 'list',
      name: 'menuOption',
      message: 'What would you like to do?',
      choices,
    },
  ]);

  // Handle the user's selection
  switch (menuOption) {
    case 'Generate Gender/Sexual Orientation':
      await generateRandomGenderAndOrientation();
      break;
    case 'Generate Age':
      generateRandomAge();
      break;
    case 'Generate Name':
      await generateRandomName();
      break;
    case 'Generate Aspiration':
      await generateRandomAspiration();
      break;
    case 'Generate Traits':
      await generateRandomTraits();
      break;
    case 'Generate Preferences':
      await generatePreferences();
      break;
    // ... other cases will go here
    case 'Exit':
      console.log('Exiting. Goodbye!');
      process.exit(0);
      break;
    default:
      console.log('Invalid selection.');
      break;
  }

  // Loop back to the main menu
  await mainMenu();
}

// Start the main menu
mainMenu();
