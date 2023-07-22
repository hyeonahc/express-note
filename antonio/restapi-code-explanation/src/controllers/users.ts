import express from 'express'
import { deleteUserById, getUsers } from '../db/users'

// req and res objects are provided by Express.js when the function is called during an incoming HTTP request.
export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // the getUsers function retrieves user data from the database.
    // The await keyword ensures that the function waits for the getUsers function to complete and return the result first before continuing to the next line.
    const users = await getUsers()

    // If the database query is successful and the users data is retrieved, this line of code is executed.
    // The function returns an HTTP response with status code 200 (OK) using res.status(200).
    // The user data will be sent as a JSON array in the HTTP response body.
    return res.status(200).json(users)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params
    const deletedUser = await deleteUserById(id)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
