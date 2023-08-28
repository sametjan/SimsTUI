import inquirer from 'inquirer';
import * as R from 'remeda';
import * as fs from 'fs';
import * as path from 'path';

import shuffleArray from '../utils/shuffleArray';
import mapObjIndexed from '../utils/mapObjIndexed';
import mergeDeepWith from '../utils/mergeDeepWith';

// Types
type Preference<T> = { likes: Array<T>, dislikes: Array<T> };
type Preferences<T> = Record<string, Preference<T>>;
type preferencesAgeGroup = 'Child' | 'Teen' | 'Young Adult and Older';

// Load the preferences data from preferences.json
const preferencesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/preferences.json'), 'utf-8'));

// Function to generate a random number and map it to -1, 0, or 1
const randomPreference = (): -1 | 0 | 1 => {
  const randomNumber = Math.floor(Math.random() * 3) - 1;
  return randomNumber as -1 | 0 | 1;
}

// Function to process each array and generate a preference object
const generatePreferences = (arr: Array<string>): { likes: Array<string>, dislikes: Array<string> } => {
  const length20Percent = Math.floor(arr.length * 0.2);

  // Map each item to include a random preference
  const mapped = arr.map((item: string) => ({ item, pref: randomPreference() }));

  // Use Remeda's reduce to accumulate likes and dislikes
  const { likes, dislikes } = R.reduce(
    mapped,
    (acc: { likes: Array<string>, dislikes: Array<string> }, { item, pref }) => {
      if (pref === 1) {
        acc.likes.push(item);
      } else if (pref === -1) {
        acc.dislikes.push(item);
      }
      return acc;
    },
    { likes: [], dislikes: [] }
  );

  return {
    likes: shuffleArray(likes).slice(0, length20Percent),
    dislikes: shuffleArray(dislikes).slice(0, length20Percent),
  };
};

// Function to merge new preferences with existing preferences
const mergePreferences = (
  existingPreferences: Preferences<string>,
  newPreferences: Preferences<string>
) => {
  // Custom merge logic to combine likes and dislikes, removing duplicates
  const customMerge = (a: Preference<string> | undefined, b: Preference<string> | undefined) => {
    // Initialize empty arrays if a or b are undefined
    const aLikes = a?.likes || [];
    const aDislikes = a?.dislikes || [];
    const bLikes = b?.likes || [];
    const bDislikes = b?.dislikes || [];

    return {
      likes: R.uniq(aLikes.concat(bLikes)),
      dislikes: R.uniq(aDislikes.concat(bDislikes)),
    };
  };

  return mergeDeepWith(customMerge, existingPreferences, newPreferences);
};

// Main pipeline function
const generatePrefObject = mapObjIndexed((value: Array<string>) => generatePreferences(value));

export default async function generateRandomPreferences(): Promise<void> {
  // Ask user for age group
  const { ageGroup } = await inquirer.prompt([
    {
      type: 'list',
      name: 'ageGroup',
      message: 'Pick an age group:',
      choices: ['Child', 'Teen', 'Young Adult and Older']
    }
  ]);
  let preferences: Preferences<string> = {};

  switch (ageGroup) {
    case 'Child':
      preferences = preferencesData.child;
      break;
    case 'Teen':
      preferences = mergeDeepWith(R.concat, preferencesData.child, preferencesData.teen);
      break;
    case 'Young Adult and Older':
      preferences = mergeDeepWith(
        R.concat,
        mergeDeepWith(
          R.concat,
          preferencesData.child,
          preferencesData.teen
        ),
        preferencesData.adult
      );
      break;
    default:
      console.log('Invalid age group selected.');
      return;
  }

  console.log(preferences);
}