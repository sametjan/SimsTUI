import { select, Separator } from '@inquirer/prompts';
import chalk from 'chalk';

// Import the generators
import genderGenerator from './generators/genderGenerator';
import ageGenerator, { AgeRecord } from './generators/ageGenerator';
import nameGenerator from './generators/nameGenerator';
import { UserCancelledError } from './errors';

/**
 * Define function for the main menu.
 * Should have a variety of options for generating portions of a Sim, a whole
 * Sim, setting preferences, or exiting the program.
 */
async function mainMenu(init?: boolean): Promise<void> {
  if (init) console.clear(); // Clear the console
  const answer = await select({
    message: chalk.greenBright.bold('What would you like to do?'),
    pageSize: 20,
    choices: [
      {
        name: 'Generate Gender/Sexual Orientation',
        value: 'gender',
        description: chalk.yellow('Generate a random gender and sexual orientation for a Sim'),
      },
      {
        name: 'Generate Age',
        value: 'age',
        description: chalk.yellow('Generate a random age for a Sim'),
      },
      {
        name: 'Generate Name',
        value: 'name',
        description: chalk.yellow('Generate a random name for a Sim'),
      },
      {
        name: 'Generate Aspiration',
        value: 'aspiration',
        description: chalk.yellow('Generate a random aspiration for a Sim'),
        disabled: chalk.redBright('Not yet implemented'),
      },
      {
        name: 'Generate Traits',
        value: 'traits',
        description: chalk.yellow('Generate random traits for a Sim'),
        disabled: chalk.redBright('Not yet implemented'),
      },
      {
        name: 'Generate Preferences',
        value: 'preferences',
        description: chalk.yellow('Generate random preferences for a Sim'),
        disabled: chalk.redBright('Not yet implemented'),
      },
      new Separator(),
      {
        name: 'Create Whole Sim',
        value: 'wholeSim',
        description: chalk.yellow('Generate a whole Sim'),
      },
      new Separator(),
      {
        name: 'Settings',
        value: 'settings',
        description: chalk.yellow(
          [
            'Change the settings for the generator ',
            'including what packs you have installed, mods, or custom data',
          ].join(''),
        ), // join the array into a string
        disabled: chalk.redBright('Not yet implemented'),
      },
      {
        name: 'Quit',
        value: 'exit',
        description: chalk.yellow('Exit the program'),
      },
    ],
  });

  // Handle the user's selection
  switch (answer) {
    case 'gender': {
      const gender = await genderGenerator();
      console.log(gender);
      break;
    }
    case 'age': {
      const age: AgeRecord = await ageGenerator();
      console.log(age);
      break;
    }
    case 'name': {
      try {
        const name = await nameGenerator();
        console.log(name);
      } catch (e) {
        if (e instanceof UserCancelledError !== true) console.error(e);
      }
      break;
    }
    case 'wholeSim': {
      const gender = await genderGenerator();
      const age = await ageGenerator();
      const name = await nameGenerator(gender.gender, gender.customDetails || undefined);

      const sim = Object.assign({}, name, age, gender);
      console.log(sim);
      break;
    }
    case 'exit': {
      console.log('Exiting. Goodbye!');
      if (process.env.NODE_ENV === 'development') process.kill(process.pid, 'SIGTERM');
      process.exit(0);
      break;
    }
    default: {
      console.error(chalk.redBright('Not yet implemented'));
      break;
    }
  }

  await mainMenu();
}

// Run the main menu function
mainMenu(true);
