import * as fs from 'fs';
import * as path from 'path';
import { checkbox, Separator } from '@inquirer/prompts';
import chalk from 'chalk';
import { readSettings } from '.';

// Type definition for Packs moved to index.ts
export type Pack = { name: string; value: string };
export type Packs = { packs: Array<Pack> };
export type PacksData = Record<string, Array<Pack>>;

async function selectPacks(): Promise<Packs> {
  const availablePacks = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/packs.json'), 'utf-8')) as PacksData;

  const currentSettings = readSettings();
  const installedPacks = currentSettings.packs.packs;

  // Add your checkbox prompt logic here
  // ...
  const selectedPacks: Packs = { packs: [] as Array<Pack> }; // Replace this with actual selected packs

  return selectedPacks;
}
export default selectPacks;
// Now you can use selectPacks in your main settingsMenu function
