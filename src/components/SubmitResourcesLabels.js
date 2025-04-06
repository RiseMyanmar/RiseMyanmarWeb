// Default English labels
export const defaultLabels = {
  title: "📝 Submit Resource Needs",
  welcome: "Welcome,",
  organization: "Organization (if applicable)",
  address: "Location Address",
  addressPlaceholder: "e.g., Kyauktada Township, Yangon",
  peopleInNeed: "Estimated People in Need",
  resourcesNeeded: "Resources Needed (select all that apply)",
  otherResources: "Other resources needed (please specify)",
  otherResourcesPlaceholder: "Any other specific needs...",
  submit: "Submit Report",
  logout: "Log Out",
  restrictedAccess: "🔒 Restricted Access",
  restrictedMessage: "Only verified organizations can submit resource updates.",
  login: "Log In to Continue",
  successMessage: "Your resource needs have been submitted successfully!",
  updateMessage: "Your resource needs have been updated successfully!",
  errorMessage: "Failed to submit survey",
  survivalItems: {
    food: "Food",
    water: "Water",
    clothes: "Clothes",
    medicalSupplies: "Medical Supplies",
    sleepingBags: "Sleeping Bags",
    hygieneProducts: "Hygiene Products",
    blankets: "Blankets",
    tents: "Tents",
    powerBanks: "Power Banks",
  },
};

// Array of English labels for translation
export const englishLabelsArray = [
  "📝 Submit Resource Needs",
  "Welcome,",
  "Organization (if applicable)",
  "Location Address",
  "e.g., Kyauktada Township, Yangon",
  "Estimated People in Need",
  "Resources Needed (select all that apply)",
  "Other resources needed (please specify)",
  "Any other specific needs...",
  "Submit Report",
  "Log Out",
  "🔒 Restricted Access",
  "Only verified organizations can submit resource updates.",
  "Log In to Continue",
  "Your resource needs have been submitted successfully!",
  "Your resource needs have been updated successfully!",
  "Failed to submit survey",
];

// Array of English survival items for translation
export const englishSurvivalItemsArray = [
  "Food",
  "Water",
  "Clothes",
  "Medical Supplies",
  "Sleeping Bags",
  "Hygiene Products",
  "Blankets",
  "Tents",
  "Power Banks",
];

// Helper function to convert translated arrays to labels object
export function createLabelsFromTranslatedArrays(
  translatedLabels,
  translatedSurvivalItems
) {
  return {
    title: translatedLabels[0],
    welcome: translatedLabels[1],
    organization: translatedLabels[2],
    address: translatedLabels[3],
    addressPlaceholder: translatedLabels[4],
    peopleInNeed: translatedLabels[5],
    resourcesNeeded: translatedLabels[6],
    otherResources: translatedLabels[7],
    otherResourcesPlaceholder: translatedLabels[8],
    submit: translatedLabels[9],
    logout: translatedLabels[10],
    restrictedAccess: translatedLabels[11],
    restrictedMessage: translatedLabels[12],
    login: translatedLabels[13],
    successMessage: translatedLabels[14],
    updateMessage: translatedLabels[15],
    errorMessage: translatedLabels[16],
    survivalItems: {
      food: translatedSurvivalItems[0],
      water: translatedSurvivalItems[1],
      clothes: translatedSurvivalItems[2],
      medicalSupplies: translatedSurvivalItems[3],
      sleepingBags: translatedSurvivalItems[4],
      hygieneProducts: translatedSurvivalItems[5],
      blankets: translatedSurvivalItems[6],
      tents: translatedSurvivalItems[7],
      powerBanks: translatedSurvivalItems[8],
    },
  };
}
