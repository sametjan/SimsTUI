// Function to randomly select an item from an array
function randomChoice<T>(options: T[]): T {
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

// Define types for gender and sexual orientation options
type Gender = 'Male' | 'Female' | 'Custom';
type PhysicalFrame = 'Masculine' | 'Feminine';
type Clothing = 'Masculine' | 'Feminine';
type PregnancyAbility = 'Become pregnant' | 'Get others pregnant' | 'Neither';
type MilkProduction = 'Yes' | 'No';
type ToiletUse = 'Yes' | 'No';
type RomanticAttraction = 'Men' | 'Women';
type RomanticExploration = 'Yes' | 'No';
type WooHooInterest = 'Men' | 'Women';
type GenderAndOrientation = Record<string, any>;

// Function to generate random gender and sexual orientation
async function generateRandomGenderAndOrientation(): Promise<GenderAndOrientation> {
  // Randomly generate gender
  const gender: Gender = randomChoice(['Male', 'Female', 'Custom']);
  console.log(`Gender: ${gender}`);

  // If gender is Custom, generate additional details
  let customDetails;
  if (gender === 'Custom') {
    const physicalFrame: PhysicalFrame = randomChoice(['Masculine', 'Feminine']);
    const clothing: Clothing = randomChoice(['Masculine', 'Feminine']);
    const pregnancyAbility: PregnancyAbility = randomChoice(['Become pregnant', 'Get others pregnant', 'Neither']);
    const milkProduction: MilkProduction = randomChoice(['Yes', 'No']);
    const toiletUse: ToiletUse = randomChoice(['Yes', 'No']);

    customDetails = {
      physicalFrame,
      clothing,
      pregnancyAbility,
      milkProduction,
      toiletUse,
    };

    console.log('Custom Details:', customDetails);
  }

  // Randomly generate sexual orientation
  const romanticAttraction = ['Men', 'Women'].filter(() => Math.random() < 0.5) as RomanticAttraction[];
  const romanticExploration: RomanticExploration = randomChoice(['Yes', 'No']);
  const wooHooInterest = ['Men', 'Women'].filter(() => Math.random() < 0.5) as WooHooInterest[];

  console.log('Sexual Orientation:');
  console.log(`  Romantic Attraction: ${romanticAttraction.join(', ')}`);
  console.log(`  Romantic Exploration: ${romanticExploration}`);
  console.log(`  WooHoo Interest: ${wooHooInterest.join(', ')}`);

  // Return gender and orientation details
  return {
    gender: gender,
    customDetails: customDetails || null,
    orientation: {
      romanticAttraction: romanticAttraction.join(', '),
      romanticExploration: romanticExploration,
      wooHooInterest: wooHooInterest.join(', '),
    }
  };
}

// Export the function to be used in the main menu
export default generateRandomGenderAndOrientation;
