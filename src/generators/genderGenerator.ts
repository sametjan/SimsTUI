import randomChoice from '../utils/randomChoice';

// Define the types for the gender choices and sexual orientation
export type SimpleGender = 'Male' | 'Female' | 'Custom';
type PhysicalDescription = 'Masculine' | 'Feminine';
type AttractionInterest = 'Men' | 'Women';
type PregnancyAbility = 'Become pregnant' | 'Get others pregnant' | 'Neither';
type YesNo = 'Yes' | 'No';

// Define the type for customDetails and sexualOrientation
export interface CustomDetails {
  physicalFrame: PhysicalDescription;
  clothingPreference: PhysicalDescription;
  pregnancyAbility: PregnancyAbility;
  milkProduction: YesNo;
  toiletUsage: YesNo;
}

export interface SexualOrientation {
  romanticAttraction: AttractionInterest[];
  romanticExploration: YesNo;
  wooHooInterest: AttractionInterest[];
}

// Choices object for generating options
const choices = {
  physicalGender: ['Male', 'Female', 'Custom'] as SimpleGender[],
  physicalDescription: ['Masculine', 'Feminine'] as PhysicalDescription[],
  attractionInterest: ['Men', 'Women'] as AttractionInterest[],
  pregnancyAbility: ['Become pregnant', 'Get others pregnant', 'Neither'] as PregnancyAbility[],
  yesNo: ['Yes', 'No'] as YesNo[],
};

/**
 * Generate a random gender and sexual orientation for a Sim.
 */
async function generateRandomGenderAndOrientation(): Promise<{
  gender: SimpleGender;
  customDetails?: CustomDetails;
  sexualOrientation: SexualOrientation;
}> {
  console.clear();
  const simpleGender = randomChoice(choices.physicalGender);
  const customDetails: CustomDetails = {
    physicalFrame: randomChoice(choices.physicalDescription),
    clothingPreference: randomChoice(choices.physicalDescription),
    pregnancyAbility: randomChoice(choices.pregnancyAbility),
    milkProduction: randomChoice(choices.yesNo),
    toiletUsage: randomChoice(choices.yesNo),
  };
  const sexualOrientation: SexualOrientation = {
    romanticAttraction: choices.attractionInterest.filter(() => Math.random() > 0.5),
    romanticExploration: randomChoice(choices.yesNo),
    wooHooInterest: choices.attractionInterest.filter(() => Math.random() > 0.5),
  };

  if (simpleGender !== 'Custom') {
    return {
      gender: simpleGender,
      sexualOrientation,
    };
  } else {
    return {
      gender: simpleGender,
      customDetails,
      sexualOrientation,
    };
  }
}
export default generateRandomGenderAndOrientation;
