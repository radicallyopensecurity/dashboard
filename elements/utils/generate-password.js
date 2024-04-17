const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = `!@#$%^&*()[]{};:'\`"<>,.?/\|-_+=~`;

const PASSWORD_CHARACTERS = [
  ALPHABET.toUpperCase(),
  ALPHABET.toLowerCase(),
  NUMBERS,
  SYMBOLS,
].join();

/**
 * Generate password
 * @param {number} length
 * @returns string
 */
export const generatePassword = (length = 20) => {
  let password = "";

  // Monte Carlo
  while (password.length < length) {
    const array = new Uint8Array(1);
    const [randomInt] = crypto.getRandomValues(array);
    const char = PASSWORD_CHARACTERS[randomInt];
    if (char) {
      password += char;
    }
  }

  return password;
};
