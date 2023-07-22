// middleware: acts as a bridge between the incoming HTTP request and the outgoing HTTP response in a web application, processing and modifying data between the client's request and the server's response in a web application.

// In summary, the isOwner and isAuthenticated middleware functions handle different aspects of user authentication and authorization in the web application. The isAuthenticated middleware checks if a user is authenticated by verifying their session token and attaches the user data to the req object for later use. The isOwner middleware is designed to check if the user making a request is the owner of a resource based on the provided id. These middleware functions contribute to enhancing the security and access control of the web application by ensuring that only authenticated users with proper authorization can perform certain actions.

import express from 'express'
// merge is imported from the 'lodash' library, which is used for merging objects.
// Lodash is a popular JavaScript utility library providing a wide range of efficient and functional programming tools to simplify data manipulation tasks and enhance JavaScript development.
import { get, merge } from 'lodash'
// getUserBySessionToken function is used for retrieving user data based on a session token.
import { getUserBySessionToken } from './../db/users'

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params
    const currentUserId = get(req, 'identity._id') as string | undefined

    if (!currentUserId) {
      return res.sendStatus(403)
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403)
    }

    next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

// the isAuthenticated middleware is designed to check if a user is authenticated by verifying their session token.
// The middleware function takes three parameters:
// 1) req (an object representing the HTTP request)
// 2) res (an object representing the HTTP response)
// 3) next (a function used to pass control to the next middleware or route handler).
export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // it extracts the ANTONIO-AUTH cookie value from the request using req.cookies['ANTONIO-AUTH'] and stores it in the variable sessionToken.
    const sessionToken = req.cookies['ANTONIO-AUTH']

    // It checks if the sessionToken exists. If it doesn't (i.e., the user is not authenticated), it sends an HTTP response with status code 403 (Forbidden) and returns from the middleware.
    if (!sessionToken) {
      return res.sendStatus(403)
    }

    // This block of code calls the getUserBySessionToken function with the sessionToken retrieved from the cookie. The function is querying the database to find the user with the provided session token.
    const existingUser = await getUserBySessionToken(sessionToken)

    // If the existingUser does not exist (i.e., the session token is invalid or not associated with any user), it sends an HTTP response with status code 403 (Forbidden) and returns from the middleware.
    if (!existingUser) {
      return res.sendStatus(403)
    }

    // The code is used to add information about the currently logged-in user(existingUser) to the data sent with the web page request (stored in the req object).
    // The existingUser object will be attached to the req (request) object using the merge function from Lodash.
    // It adds an identity property to the req object with the value of the existingUser object.
    // After the existingUser object is attached to the req object as the identity property, any other middleware functions or route handlers that are executed later in the request-response cycle can access the user information from the req.identity property.
    merge(req, { identity: existingUser })

    return next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
