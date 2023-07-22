// helpers for auth
// help either to encrypt the password or to ceate a random token
// Overall, this code provides functions for generating random tokens and hashing passwords with the SHA-256 algorithm, offering essential tools for secure authentication and data protection in a Node.js application.

// This line imports the crypto module, which is a built-in Node.js module used for cryptographic operations, including hashing and encryption.
import crypto from 'crypto'

// This line defines a constant variable named SECRET and sets its value to the string 'ANTONIO-REST-API'. This constant will be used in the authentication process.
const SECRET = 'ANTONIO-REST-API'

// This code exports a function named random. The function generates a random sequence of bytes with a length of 128 using crypto.randomBytes(128). Then, it converts the random bytes into a base64-encoded string using .toString('base64') and returns the result. This function can be used to generate random tokens, which are useful in various security-related scenarios.
export const random = () => crypto.randomBytes(128).toString('base64')

// This code exports a function named authentication, which takes two parameters: salt (a string) and password (a string). This function is used for password authentication and hashing.
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac('sha256', [salt, password].join('/'))
    .update(SECRET)
    .digest('hex')
}
