const crypto = require('crypto');

export const RandomString = (length: number) => {
  return crypto.randomBytes(length / 2).toString('hex');
};
