import * as fs from 'fs';
import * as path from 'path';
import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import selectPacks, { Pack, Packs } from './packs';

// Type definitions
export type Settings = { packs: Packs };

// Paths
const userDataDir = path.join(__dirname, '..', '..', 'userData');
const settingsFilePath = path.join(userDataDir, 'settings.json');

// Helper functions for file operations
export function readSettings(): Settings {
  if (fs.existsSync(settingsFilePath)) {
    const rawSettings = fs.readFileSync(settingsFilePath, 'utf-8');
    return JSON.parse(rawSettings) as Settings;
  }
  return { packs: { packs: [] as Array<Pack> } };
}

export function writeSettings(settings: Settings): void {
  fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
}

// Main settings menu
async function settingsMenu(): Promise<void> {
  const currentSettings = readSettings();
  const selectedPacks = await selectPacks();
  const newSettings: Settings = { packs: selectedPacks };
  writeSettings(newSettings);
}
export default settingsMenu;
