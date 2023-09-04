import chalk from 'chalk';
import { select, Separator } from '@inquirer/prompts';
import * as fs from 'fs';
import * as path from 'path';

import { UserCancelledError } from '../errors';
import randomChoice from '../utils/randomChoice';
import generateChoice from '../utils/generateChoice';
import { readSettings, Settings } from '../settings';

import { AgeGroups, Age } from './ageGenerator';
const AspriationAgeGroups = ['Child', 'Teen', 'Adult'] as const;
type AspirationAges = Extract<Age, (typeof AspriationAgeGroups)[number]> | 'cancel';
type Aspiration = {
  name: string;
  value: string;
  category: string;
  ageGroups: Array<string>;
  pack: string;
};
type AspirationData = {
  aspirations: Aspiration[];
};

async function generateRandomAspirations(age?: string) {
  const settings: Settings = readSettings();
  const packs = settings?.packs;
  const { aspirations } = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/aspirations.json'), 'utf-8'),
  ) as AspirationData;
  let ageGroup: AspirationAges;

  if (!age) {
    ageGroup = (await select({
      message: chalk.greenBright('Select the age group for the aspiration:'),
      choices: [
        ...AspriationAgeGroups.map((x) => generateChoice(x, x)),
        new Separator(),
        generateChoice('Go Back', 'cancel'),
      ],
    })) as AspirationAges;
  } else {
    if (['Infant', 'Toddler'].includes(age)) {
      return { aspiration: {} }; // Return an empty object for Infant and Toddler age groups
    } else if (['Young Adult', 'Adult', 'Elder'].includes(age)) {
      ageGroup = 'Adult'; // Treat Young Adult, Adult, and Elder as Adult
    } else {
      ageGroup = age as AspirationAges;
    }
  }

  if (['cancel', null].includes(ageGroup)) {
    throw new UserCancelledError();
  }

  const aspiration = randomChoice(aspirations.filter((x) => x.ageGroups.includes(ageGroup) && x.pack === 'baseGame'));

  return {
    aspiration: Object.fromEntries(
      Object.entries(aspiration).filter(([key]) => ['name', 'category', 'value'].includes(key)),
    ) as Pick<Aspiration, 'name' | 'category' | 'value'>,
  };
}
export default generateRandomAspirations;
