import express from 'express'

import { login, register } from '../controllers/authentication'

// This code defines an authentication route for user registration in an Express.js web server. When a POST request is made to /auth/register, the register function from the ../controllers/authentication file will handle the request, typically processing user registration logic and storing user information in the database.
export default (router: express.Router) => {
  router.post('/auth/register', register)
  router.post('/auth/login', login)
}
