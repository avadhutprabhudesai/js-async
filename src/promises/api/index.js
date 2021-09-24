export const verifySecurityQuestions = (questions) => {
  // All security questions should be verified before giving permission to reset account password
  return Promise.all(questions);
};

export const findActivePhoneNumbers = (numbers) => {
  // Fetch the activity status of each mobile number
  return Promise.allSettled(numbers);
};

export const findTheWinner = (participants) => {
  // Find the first participant to finish the race
  return Promise.any(participants);
};

export const checkLatency = (requests) => {
  return Promise.race(requests);
};
