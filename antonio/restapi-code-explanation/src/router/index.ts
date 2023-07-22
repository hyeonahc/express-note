// This file exports a function that returns an Express router.
// The router is imported and initialized with the authentication routes.

// Import the 'express' module to create an Express router.
import express from 'express'

// Import the 'authentication' function from './authentication'.
import authentication from './authentication'
import users from './users'

// Create an instance of an Express router.
const router = express.Router()

// Export a default function that returns the router.
// The router instance is exported as a default function that can be used in other parts of the application to handle authentication-specific routes and middleware.
export default (): express.Router => {
  // Call the 'authentication' function and pass the 'router' as a parameter.
  authentication(router)
  users(router)

  // Return the router instance.
  return router
}
