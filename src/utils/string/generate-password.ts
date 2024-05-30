const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
// not all special characters are supported in GL when masking
// https://git.staging.radical.sexy/help/ci/variables/index#mask-a-cicd-variable
const SYMBOLS = '@:.~-+/='

const PASSWORD_CHARACTERS = [
  ALPHABET.toUpperCase(),
  ALPHABET.toLowerCase(),
  NUMBERS,
  SYMBOLS,
].join('')

/**
 * Generate password
 * @param {number} length
 * @returns string
 */
export const generatePassword = (
  length = 20,
  characters = PASSWORD_CHARACTERS
) => {
  let password = ''

  // Monte Carlo
  while (password.length < length) {
    const array = new Uint8Array(1)
    const [randomInt] = crypto.getRandomValues(array)

    const char = characters[randomInt]

    if (!char) {
      continue
    }

    password += char
  }

  return password
}
