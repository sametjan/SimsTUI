import chalk from 'chalk';

const generateChoice = (name: string, value: string, description?: string, disabled?: boolean | string) => ({
  name,
  value,
  description: description ? chalk.yellow(`Generate ${description} for a Sim`) : undefined,
  disabled: disabled ? chalk.redBright(disabled) : undefined,
});
export default generateChoice;
