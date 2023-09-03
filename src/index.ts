import { select, Separator } from '@inquirer/prompts';
import chalk from 'chalk';

// Import the generators
import genderGenerator from './generators/genderGenerator';
import ageGenerator, { AgeRecord } from './generators/ageGenerator';
import nameGenerator from './generators/nameGenerator';
import aspirationGenerator from './generators/aspirationGenerator';

// Import Erros and utils
import { UserCancelledError } from './errors';
import generateChoice from './utils/generateChoice';

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
      generateChoice('Generate Gender/Sexual Orientation', 'gender', 'a random gender and sexual orientation'),
      generateChoice('Generate Age', 'age', 'a random age'),
      generateChoice('Generate Name', 'name', 'a random name'),
      generateChoice('Generate Aspiration', 'aspiration', 'a random aspiration'),
      generateChoice('Generate Traits', 'traits', 'random traits', 'Not yet implemented'),
      generateChoice('Generate Preferences', 'preferences', 'random preferences', 'Not yet implemented'),
      new Separator(),
      {
        ...generateChoice('Create Whole Sim', 'wholeSim'),
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
        ),
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
        else console.clear();
      }
      break;
    }
    case 'aspiration': {
      try {
        const { aspiration } = (await aspirationGenerator()) as { aspiration: { category: string; name: string } };
        console.log(chalk.blue(`${aspiration?.category} > ${aspiration?.name}`));
      } catch (e) {
        if (e instanceof UserCancelledError !== true) console.error(e);
        else console.clear();
      }
      break;
    }
    case 'wholeSim': {
      try {
        const gender = await genderGenerator();
        const age = await ageGenerator();
        const name = await nameGenerator(gender.gender, gender.customDetails || undefined);
        const aspiration = await aspirationGenerator(age.age);

        const sim = Object.assign({}, name, age, gender, aspiration);
        console.log(sim);
      } catch (e) {
        // if (e instanceof UserCancelledError !== true) console.error(e);
        if ([UserCancelledError].some((x) => e instanceof x) !== true) console.error(e);
        else console.clear();
      }
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
