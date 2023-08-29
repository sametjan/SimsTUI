// Utility to merge preferences
type Preference = {
    likes: string[];
    dislikes: string[];
  };
  
  type Preferences = Record<string, Preference>;
  
  // Function to merge two Preference objects
  const mergePreferenceObjects = (pref1: Preference, pref2: Preference): Preference => {
    return {
      likes: Array.from(new Set([...(pref1.likes || []), ...(pref2.likes || [])])),
      dislikes: Array.from(new Set([...(pref1.dislikes || []), ...(pref2.dislikes || [])]))
    };
  };
  
  // Main function to merge Preferences
  export const mergePreferences = (prefs1: Preferences, prefs2: Preferences): Preferences => {
    const merged: Preferences = { ...prefs1 };
  
    for (const key in prefs2) {
      if (Object.prototype.hasOwnProperty.call(prefs2, key)) {
        if (prefs1[key]) {
          merged[key] = mergePreferenceObjects(prefs1[key], prefs2[key]);
        } else {
          merged[key] = prefs2[key];
        }
      }
    }
    return merged;
  };