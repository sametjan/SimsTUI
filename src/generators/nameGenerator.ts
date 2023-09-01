import chalk from 'chalk';
import { select, Separator } from '@inquirer/prompts';
import { faker } from '@faker-js/faker';
import { log } from 'console';

import {
  SimpleGender as Gender,
  CustomDetails
} from './genderGenerator';

const NameGenders = ['Masculine', 'Feminine'] as const;
type NameGender = typeof NameGenders[number];

async function generateRandomName(
  gender?: Gender | undefined,
  hint?: Pick<CustomDetails, 'physicalFrame' | 'clothingPreference'>
) {
  let genderForm: NameGender;
  const message = [
    chalk.greenBright('Would you like a masculine or feminine name?'),
    chalk.magenta(`Physical Frame: ${hint?.physicalFrame}, Clothing Preference: ${hint?.clothingPreference}`)
  ];
  if (gender === 'Custom' || gender === undefined) {
    genderForm = await select({
      message: hint ? message.join('\n') : message[0],
      choices: NameGenders.map(x => ({ name: x, value: x })),
    }) as NameGender;
  } else {
    genderForm = gender === 'Male' ? NameGenders[0] : NameGenders[1];
  }

  console.log(genderForm, NameGenders[0], genderForm === NameGenders[0]);

  const firstName = faker.person.firstName(genderForm === NameGenders[0] ? 'male' : 'female');
  const lastName = faker.person.lastName();
  return { firstName, lastName };
}
export default generateRandomName;
