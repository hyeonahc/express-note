// Registration Controller
// Controller: The controller acts as an intermediary between the model and the view.
// 1) It receives user input from the view and handles the requests.
// 2) It updates the model based on user actions and updates the view to reflect any changes in the data.
// 3) The controller also contains the application logic that determines how the model and view interact.

// In summary, this code handles the registration process for a new user. It checks if the required fields are provided, verifies if the email is already taken, generates a random salt for password hashing, and then creates a new user with the hashed password and salt in the database.

import express from 'express'

// createUser and getUserByEmail functions are used for interacting with the user database to create and retrieve user data.
import { createUser, getUserByEmail } from '../db/users'

// The authentication function is used to hash passwords securely
// The random function is used to generate random tokens.
import { authentication, random } from '../helpers'

// login function handles the login process for users.
// this login function handles the login process by verifying the provided email and password, checking them against the database, generating and storing a new session token for the user, and setting a cookie with the session token before sending a response to the client.
// It takes two parameters: req (an object representing the HTTP request) and res (an object representing the HTTP response).
export const login = async (req: express.Request, res: express.Response) => {
  try {
    // it extracts the email and password from the request body using destructuring.
    const { email, password } = req.body

    // It checks if both email and password are present in the request body. If either of them is missing, it sends an HTTP response with status code 400 (Bad Request) and returns from the function.
    if (!email || !password) {
      return res.sendStatus(400)
    }

    // This line retrieves the user data from the database based on the provided email address.
    // The getUserByEmail function is for querying the database to find the user with the specified email.
    // .select('+authentication.salt +authentication.password') indicates that the salt and password fields from the authentication object should also be retrieved from the database along with other user data.
    const user = await getUserByEmail(email).select(
      '+authentication.salt +authentication.password'
    )

    // This block of code checks if a user was found in the database based on the provided email.
    // If no user is found (i.e., user is null or undefined), it sends an HTTP response with status code 400 (Bad Request) and returns from the function.
    if (!user) {
      return res.sendStatus(400)
    }

    // This block of code calculates the expected hash of the provided password using the authentication function with the user's stored salt value.
    const expectedHash = authentication(user.authentication?.salt, password)

    // It then checks if the calculated hash matches the stored password hash from the database.
    // If the password hashes do not match, it means the provided password is incorrect, and it sends an HTTP response with status code 403 (Forbidden) and returns from the function.
    if (user.authentication?.password !== expectedHash) {
      return res.sendStatus(403)
    }

    // This block of code generates a new random salt using the random function and assigns it to the variable salt.
    const salt = random()

    // It then generates a session token by calling the authentication function with the new salt and the user's _id (converted to a string).
    // The session token is stored in the sessionToken property of the user's authentication object.
    user.authentication.sessionToken = authentication(salt, user._id.toString())

    // the updated user data (with the new session token) is saved back to the database using await user.save().
    await user.save()

    // This block of code sets a cookie named 'ANTONIO-AUTH' with the session token as its value.
    // The cookie is set to be valid for the 'localhost' domain and accessible from all paths ('/').
    res.cookie('ANTONIO-AUTH', user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
    })

    // it sends an HTTP response with status code 200 (OK) and the user data (in JSON format) in the response body.
    return res.status(200).json(user).end()

    // If an error occurs during the execution of the try block, it will be caught in the catch block.
  } catch (error) {
    // If there is an error, it logs the error to the console and sends an HTTP response with status code 400 (Bad Request) to the client.
    console.log(error)
    return res.sendStatus(400)
  }
}

// Register is responsible for handling the registration process of a new user.
export const register = async (req: express.Request, res: express.Response) => {
  try {
    // These properties are expected to be sent in the request body when a user attempts to register.
    const { email, password, username } = req.body

    // This checks if any of the required fields (email, password, and username) are missing from the request. If any of them is missing, it sends a 400 (Bad Request) response, indicating that the request is incomplete.
    if (!email || !password || !username) {
      return res.sendStatus(400)
    }

    // This line calls the getUserByEmail function to check if a user with the same email already exists in the database.
    const existingUser = await getUserByEmail(email)

    // If the existingUser variable is not null (meaning a user with the same email exists), it sends a 400 (Bad Request) response, indicating that the email is already taken.
    if (existingUser) {
      return res.sendStatus(400)
    }

    // This line generates a random token (salt) using the random function. The salt will be used to enhance the security of password hashing.
    const salt = random()

    // This line calls the createUser function with an object containing the email, username, and a sub-object authentication containing the salt and the hashed password (calculated using the authentication function).
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    })

    // If the registration process is successful, it sends a 200 (OK) response along with the created user object in JSON format.
    return res.status(200).json(user).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
