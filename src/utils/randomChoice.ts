// Function to randomly select an item from an array
function randomChoice<T>(options: Array<T>): T {
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

export default randomChoice;
