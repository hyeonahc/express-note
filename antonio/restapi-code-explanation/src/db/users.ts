// Anything under db folder is database schema
// user schema and user model

// Schema: a schema is a blueprint or structure that defines the organization, structure, and constraints of a database or a specific set of data. It describes the logical view of how the data is organized and how the data elements relate to each other.
// Model: A model represents the data and the business logic of the application. It encapsulates the data and provides methods to manipulate and access that data. In simple terms, the model represents the application's data structure and functionality.

// This line imports the mongoose module, which is a popular Object Data Modeling (ODM) library for MongoDB in Node.js. It allows us to define and work with schemas and models to interact with the MongoDB database.
import mongoose from 'mongoose'

// 1. Create schema (define how the data looks like)
// This code defines a MongoDB schema(data blueprint) for the "User" data entity(object or data structure that represents a real-world concept or business object). The schema specifies the structure of the "User" data, including the fields "username," "email," and "authentication." It also defines the data types and requirements for each field, such as "String" type and "required: true" for "username" and "email."
// mongoose.Schema is a constructor function to create a new schema for MongoDB documents.
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  // Why you need a separate object for password, salt, and sessionToken in authentication:
  // Security: storing sensitive information like passwords separately allows you to implement additional security measures specific to each piece of information. For example, you can apply specific encryption or hashing techniques to the password to protect it from unauthorized access.
  authentication: {
    // The select: false option
    // The select: false option is used here, meaning that the "password" field will not be included in the default query results when fetching user data from the database. This provides an extra layer of security for sensitive information like passwords.
    password: { type: String, required: true, select: false },
    // The field "salt" is often used in the context of password *hashing and security. It is a random value that is combined with a user's password before hashing it. This process, known as "salting," adds an extra layer of security to the hashed password
    // *Hashing: Hashing is the process of converting any data (like a password or message) into a fixed-size, unique string of characters, making it difficult to reverse and revealing the original data.
    salt: { type: String, select: false },
    // The sessionToken is a unique identifier generated when a user logs in and is used to track the user's authenticated session. It allows the server to associate a specific user with their actions during their active session without requiring them to log in repeatedly for every interaction. Session tokens are essential for maintaining user sessions and implementing features like "remember me" functionality.
    sessionToken: { type: String, select: false },
  },
})

// 2. Turn schema into a model (perform various database operations on the "User" collection)
// This code creates a special tool (a model) that helps the program talk to a specific part of the database. It's like having a translator between the program and the database, so the program can easily find, add, or change information about users without having to worry about the details of how the database works. This makes it much easier for the program to handle user data effectively.
// This line turns the "UserSchema" into a Mongoose model named "UserModel." The model represents a collection in the MongoDB database and provides methods to interact with the "User" collection, such as creating, reading, updating, and deleting user data.
// The first argument 'User' is the name of the collection in the MongoDB database that this model represents. The second argument UserSchema is the schema that defines the structure of the data to be stored in the "User" collection.
// After executing this code, the UserModel will be a Mongoose model that allows you to perform various database operations on the "User" collection. For example, you can use methods like .find(), .findOne(), .create(), .updateOne(), and .deleteOne() on the UserModel to interact with the users' data stored in the MongoDB "User" collection.
export const UserModel = mongoose.model('User', UserSchema)

// 3. Create actions to update model (controller will use these actions and update the model)
// getUsers function returns all users by using the find() method on the "UserModel."
export const getUsers = () => UserModel.find()

// getUserByEmail function takes an "email" as input and uses the findOne() method on the "UserModel" to find a user with the specified email in the database.
export const getUserByEmail = (email: string) => UserModel.findOne({ email })

// getUserBySessionToken is a logic to find out either user is logged in or not
// getUserBySessionToken function finds a user by their "sessionToken" value. It uses the findOne() method with a query object to search for a user with a matching "sessionToken" in the "authentication" field.
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    'authentication.sessionToken': sessionToken,
  })

// getUserById function finds a user by their unique "id" (MongoDB ObjectID). It uses the findById() method on the "UserModel" to search for a user with the given ID.
export const getUserById = (id: string) => UserModel.findById(id)

// createUser function creates a new user with the provided data. It takes the "values" as input, which is a generic object representing the user data. It creates a new instance of the "UserModel" using the "values" and saves it to the database using the save() method. The .then() block converts the saved user object to a plain JavaScript object using toObject() and returns it.
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then(user => user.toObject())

// deleteUserById function deletes a user from the database based on their unique "id" (MongoDB ObjectID). It uses the findOneAndDelete() method with a query object to find and delete the user with the given ID.
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id })

// updateUserById function updates a user's data in the database. It takes the user's "id" and "values" as input. The findByIdAndUpdate() method on the "UserModel" is used to find the user by the ID and update their data with the provided "values."
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values)
