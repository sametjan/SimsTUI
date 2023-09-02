import chalk from 'chalk';
import { select, Separator } from '@inquirer/prompts';
import { faker } from '@faker-js/faker';

import { SimpleGender as Gender, CustomDetails } from './genderGenerator';
import { UserCancelledError } from '../errors';

const NameGenders = ['Masculine', 'Feminine'] as const;
type NameGenderBase = (typeof NameGenders)[number];
type NameGender = NameGenderBase | 'cancel';

async function generateRandomName(
  gender?: Gender | undefined,
  hint?: Pick<CustomDetails, 'physicalFrame' | 'clothingPreference'>,
) {
  let genderForm: NameGender;
  const message = [
    chalk.greenBright('Would you like a masculine or feminine name?'),
    chalk.magenta(`Physical Frame: ${hint?.physicalFrame}, Clothing Preference: ${hint?.clothingPreference}`),
  ];
  if (['Custom', undefined].includes(gender)) {
    genderForm = (await select({
      message: hint ? message.join('\n') : message[0],
      choices: [
        ...NameGenders.map((x) => ({ name: x, value: x })),
        new Separator(),
        { name: 'Go Back', value: 'cancel' },
      ],
    })) as NameGender;
  } else {
    genderForm = gender === 'Male' ? NameGenders[0] : NameGenders[1];
  }

  if (genderForm === 'cancel') {
    throw new UserCancelledError();
  }

  const firstName = faker.person.firstName(genderForm === NameGenders[0] ? 'male' : 'female');
  const lastName = faker.person.lastName();
  return { firstName, lastName };
}
export default generateRandomName;
