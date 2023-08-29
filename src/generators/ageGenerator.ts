// Define the type for age options
type Age = 'Infant' | 'Toddler' | 'Child' | 'Teen' | 'Young Adult' | 'Adult' | 'Elder';

// Function to randomly select an item from an array
function randomChoice<T>(options: T[]): T {
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

// Function to generate random age
export default function generateRandomAge(): Age {
  // List of available age options
  const ageOptions: Age[] = ['Infant', 'Toddler', 'Child', 'Teen', 'Young Adult', 'Adult', 'Elder'];

  // Randomly select an age
  const selectedAge: Age = randomChoice(ageOptions);

  // Output the selected age
  console.log(`Age: ${selectedAge}`);
  return selectedAge;
}
