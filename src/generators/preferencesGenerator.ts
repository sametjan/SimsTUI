
import inquirer from 'inquirer';
import Table from 'cli-table3';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { capitalCase } from 'change-case';
import { mergePreferences } from '../utils/mergePreferences';

// Type Definitions
type Preference = {
  likes: string[];
  dislikes: string[];
};

type Preferences = Record<string, Preference>;
type Choice = string | { name: string; value: string };

// Step 1: Load preferences data
const preferencesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/preferences.json'), 'utf-8'));

// Step 2: Function to display age group selection menu
const selectAgeGroup = async (): Promise<string> => {
  const questions = [
    {
      type: 'list',
      name: 'ageGroup',
      message: 'Select Age Group',
      choices: ['Child', 'Teen', 'Young Adult and Older'],
    },
  ];
  const answers = await inquirer.prompt(questions);
  return answers.ageGroup;
};

// Step 3-5: Select appropriate data based on age group
const getSelectedPreferences = (userSelectedAgeGroup: string, preferencesData: any): Preferences => {
  let selectedPreferences: Preferences = {};

  const initCategory = (category: string, data: any) => {
    if (!selectedPreferences[category]) {
      selectedPreferences[category] = { likes: [], dislikes: [] };
    }
    selectedPreferences[category].likes = Array.from(new Set([...selectedPreferences[category].likes, ...data[category]]));
  };

  // Initialize based on the selected age group
  if (userSelectedAgeGroup === 'Child') {
    for (const category in preferencesData.child) {
      initCategory(category, preferencesData.child);
    }
  }
  if (userSelectedAgeGroup === 'Teen') {
    for (const category in preferencesData.child) {
      initCategory(category, preferencesData.child);
    }
    for (const category in preferencesData.teen) {
      initCategory(category, preferencesData.teen);
    }
  }
  if (userSelectedAgeGroup === 'Young Adult and Older') {
    for (const category in preferencesData.child) {
      initCategory(category, preferencesData.child);
    }
    for (const category in preferencesData.teen) {
      initCategory(category, preferencesData.teen);
    }
    for (const category in preferencesData.adult) {
      initCategory(category, preferencesData.adult);
    }
  }

  return selectedPreferences;
};

// Loop through each category and preference to assign a random pref value of 1, 0, or -1.
// Function to randomly assign preferences
const assignRandomPreferences = (selectedPreferences: Preferences): Preferences => {
  const randomPreferences: Preferences = {};

  for (const category in selectedPreferences) {
    randomPreferences[category] = {
      likes: [],
      dislikes: [],
    };

    const allPreferences = [...selectedPreferences[category].likes, ...selectedPreferences[category].dislikes];

    for (const pref of allPreferences) {
      const randomValue = Math.floor(Math.random() * 3) - 1; // Generates a random number between -1 and 1

      if (randomValue === 1) {
        randomPreferences[category].likes.push(pref);
      } else if (randomValue === -1) {
        randomPreferences[category].dislikes.push(pref);
      }
    }
  }

  return randomPreferences;
};

// Function to enforce constraints on likes and dislikes
const enforceConstraints = (randomPreferences: Preferences): Preferences => {
  const constrainedPreferences: Preferences = {};

  let allLikesAndDislikes: string[] = [];
  const maxTotalItems = 35;  // Maximum allowed total items across all categories

  // Enforce constraints for each category and collect all likes and dislikes
  for (const category in randomPreferences) {
    const categoryPreferences = randomPreferences[category].likes.length + randomPreferences[category].dislikes.length;
    const maxAllowedForCategory = Math.floor(categoryPreferences * 0.2);  // 20% of the category

    constrainedPreferences[category] = {
      likes: [],
      dislikes: [],
    };

    allLikesAndDislikes = allLikesAndDislikes.concat(randomPreferences[category].likes, randomPreferences[category].dislikes);
  }

  // Shuffle all likes and dislikes
  allLikesAndDislikes.sort(() => Math.random() - 0.5);

  // Take the first 50 items after shuffling
  const top50LikesAndDislikes = allLikesAndDislikes.slice(0, maxTotalItems);

  // Distribute the top 50 items back into their original categories
  distributeTop50Items(top50LikesAndDislikes, randomPreferences, constrainedPreferences);

  // Sort the likes and dislikes for each category
  for (const category in constrainedPreferences) {
    constrainedPreferences[category].likes.sort();
    constrainedPreferences[category].dislikes.sort();
  }

  return constrainedPreferences;
};

// Function to distribute top 50 items back to their original categories
const distributeTop50Items = (top50LikesAndDislikes: string[], originalPreferences: Preferences, constrainedPreferences: Preferences) => {
  for (const item of top50LikesAndDislikes) {
    for (const category in originalPreferences) {
      if (originalPreferences[category].likes.includes(item)) {
        constrainedPreferences[category].likes.push(item);
      } else if (originalPreferences[category].dislikes.includes(item)) {
        constrainedPreferences[category].dislikes.push(item);
      }
    }
  }
};

// TODO: Step 8: Create Menus and Submenus
// Use the TUI to create menus and submenus based on the categories and preferences.

// TODO: Step 9: Store User Preferences
// As the user navigates through the TUI and marks preferences, store this information in a new object.
// Function to generate a menu from a list of options
const generateMenu = async (message: string, choices: Array<Choice>, defaultChoice?: number): Promise<string> => {
  const { selection } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selection',
      message,
      choices,
      default: defaultChoice,
    },
  ]);
  return typeof selection === 'string' ? selection : selection.value;
};
// Function to navigate through categories and preferences
// Function to navigate through categories and preferences and update user preferences
const navigatePreferences = async (preferences: Preferences, userPreferences: Preferences, allAvailablePreferences: Preferences) => {
  while (true) {
    // Note the change in case here to match keys in allAvailablePreferences
    const categoryChoices = Object.keys(allAvailablePreferences).map(category => ({ name: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value: category }));
    const category = await generateMenu(
      'Choose a category:',
      [
        ...categoryChoices,
        { name: "Go Back", value: "Go Back" },
        { name: "Finished", value: "Finished" }
      ]
    );

    if (category === 'Go Back') {
      return 'Go Back';  // Return 'Go Back' to indicate going back to age selection
    }
    if (category === 'Finished') {
      return 'Exit';  // Return 'Exit' to indicate going back to the main menu
    }

    while (true) {
      const preference = await generateMenu('Choose a preference:', [...allAvailablePreferences[category].likes.sort(), "Go Back"]);

      if (preference === 'Go Back') {
        break;  // Go back to the category menu
      }

      const action = await generateMenu('What would you like to do?', ['Like', 'Neutral', 'Dislike'], 1);

      // Initialize the category in userPreferences if not already present
      if (!userPreferences[category]) {
        userPreferences[category] = { likes: [], dislikes: [] };
      }

      // Update the user preference based on the action
      userPreferences[category].likes = userPreferences[category].likes.filter((item) => item !== preference);
      userPreferences[category].dislikes = userPreferences[category].dislikes.filter((item) => item !== preference);
      if (action === 'Like') {
        userPreferences[category].likes.push(preference);
      } else if (action === 'Dislike') {
        userPreferences[category].dislikes.push(preference);
      }
    }
    // const proceed = await generateMenu('Would you like to continue?', ['Yes', 'No']);
    // if (proceed === 'No') {
    //   return 'Exit';
    // }
  }
  return 'Exit';  // Return 'Exit' to indicate going back to the main menu (or you could omit this if you don't need it)
};

// TODO: Step 10: Merge Preferences
// Merge the user-defined preferences with the initially generated preferences, considering the constraints.
// Function to merge user preferences with generated preferences
const mergeUserAndGeneratedPreferences = (userPreferences: Preferences, generatedPreferences: Preferences): Preferences => {
  let mergedPreferences: Preferences = {};

  // Loop through each category in generated preferences
  for (const category in generatedPreferences) {
    // Initialize the category in mergedPreferences
    mergedPreferences[category] = { likes: [], dislikes: [] };

    // Convert arrays to Sets for easier manipulation
    const generatedLikes = new Set(generatedPreferences[category].likes);
    const generatedDislikes = new Set(generatedPreferences[category].dislikes);

    const userLikes = new Set(userPreferences[category]?.likes || []);
    const userDislikes = new Set(userPreferences[category]?.dislikes || []);

    // Merge likes, filtering out any that are in the user's dislikes
    mergedPreferences[category].likes = Array.from(new Set([...generatedLikes, ...userLikes])).filter((item) => !userDislikes.has(item));

    // Merge dislikes, filtering out any that are in the user's likes
    mergedPreferences[category].dislikes = Array.from(new Set([...generatedDislikes, ...userDislikes])).filter((item) => !userLikes.has(item));
  }

  // Enforce the constraints again on the merged data
  mergedPreferences = enforceConstraints(mergedPreferences);

  return mergedPreferences;
};

// TODO: Step 11: Output Final Preferences
// Output the final preferences in the specified format.

// Integrate these steps into the main function
const main = async () => {
  while (true) {
    const userSelectedAgeGroup = await selectAgeGroup();
    const selectedPreferences = getSelectedPreferences(userSelectedAgeGroup, preferencesData);

    // Step 6: Randomly assign preferences
    const randomPreferences = assignRandomPreferences(selectedPreferences);

    // Step 7: Enforce constraints
    const constrainedPreferences = enforceConstraints(randomPreferences);

    // Initialize user preferences
    const userPreferences: Preferences = {};

    // Step 8-9: Navigate through preferences and update user preferences
    const nextAction = await navigatePreferences(constrainedPreferences, userPreferences, selectedPreferences);
    if (nextAction === 'Exit') {
      const finalPreferences = mergeUserAndGeneratedPreferences(userPreferences, constrainedPreferences);
      console.log(convertToTable(finalPreferences));  // Display the user preferences
      break;  // Exit to the main menu
    }
  }
};
export default main;

const convertToTable = (jsonData: Preferences): string => {
  // Initialize headers with an empty string as the first header
  const headers = [''];

  // Create an array to hold the 'Likes' row
  const likesRow = ['Likes'];

  // Create an array to hold the 'Dislikes' row
  const dislikesRow = ['Dislikes'];

  // Populate the headers and rows
  for (const [category, data] of Object.entries(jsonData)) {
    // Convert category names to display-friendly format
    const displayCategory = capitalCase(category);

    // Add to headers
    headers.push(displayCategory);

    // Add to 'Likes' and 'Dislikes' rows
    likesRow.push(data.likes.join(', '));
    dislikesRow.push(data.dislikes.join(', '));
  }

  // Get terminal width
  const terminalWidth = Math.floor((process.stdout.columns - 10) / 10) * 10 ?? 80;

  // Calculate the width for each column
  const columnWidth = Math.floor(terminalWidth / headers.length);

  // Initialize table with headers
  const table = new Table({
    head: headers,
    colWidths: Array(headers.length).fill(columnWidth),
    wordWrap: true,
  });

  // Add 'Likes' and 'Dislikes' rows to the table
  table.push(likesRow, dislikesRow);

  // Return the table as a string
  return table.toString();
};