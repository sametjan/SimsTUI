import { log } from 'console'
import ageGenerator from './ageGenerator'
import aspirationGenerator from './aspirationGenerator'
import genderGenerator from './genderGenerator'
import nameGenerator from './nameGenerator'
import preferencesGenerator from './preferencesGenerator'
import traitsGenerator from './traitsGenerator'

export default async function wholeSimGenerator(): Promise<void> {
  // Object to hold the complete Sim details
  const wholeSim: any = {};

  // Generate gender and orientation
  const genderInfo = await genderGenerator();
  wholeSim.genderInfo = genderInfo;
  
  // Generate age
  const ageInfo = await ageGenerator();
  wholeSim.age = ageInfo;
  
  // Generate name based on gender
  const nameInfo = await nameGenerator(genderInfo.gender);  // Assuming genderInfo has a "gender" field
  wholeSim.name = nameInfo;
  
  // Generate aspiration based on age
  const aspirationInfo = await aspirationGenerator(ageInfo);  // Assuming ageInfo has an "age" field
  wholeSim.aspiration = aspirationInfo;
  
  // Generate preferences
  const preferencesInfo = await preferencesGenerator(ageInfo);  // Assuming ageInfo has an "age" field
  wholeSim.preferences = preferencesInfo;
  
  // Generate traits
  const traitsInfo = await traitsGenerator(ageInfo);
  wholeSim.traits = traitsInfo;

  // Output the complete Sim details
  console.log("Whole Sim:", wholeSim);

  return wholeSim;
}
