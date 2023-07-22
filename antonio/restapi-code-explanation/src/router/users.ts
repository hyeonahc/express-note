import express from 'express'

import { isAuthenticated } from './../middlewares/index'

// getAllUsers is a controller function responsible for handling an HTTP request to retrieve all users from the database.
import { deleteUser, getAllUsers } from '../controllers/users'

export default (router: express.Router) => {
  // When a GET request is made to the /users route, the getAllUsers controller function will be executed to handle the request.
  // In other words, this route specifies that when the server receives a GET request at the /users endpoint, it should call the getAllUsers function from the controller module to process the request.
  // before calling the getAllUsers function, it includes the isAuthenticated middleware function to check if the user making the request is authenticated.
  // The isAuthenticated middleware checks if the user making the request is authenticated. If the user is authenticated, the middleware allows the request to proceed to the next handler in the route (getAllUsers). If the user is not authenticated, the middleware may respond with an appropriate HTTP status code (e.g., 403 Forbidden) to deny access.
  router.get('/users', isAuthenticated, getAllUsers)
  router.delete('/users/:id', deleteUser)
}
