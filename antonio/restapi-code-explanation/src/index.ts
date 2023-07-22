import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
// This line imports the default exported function from the ./router file. This function returns an Express router that is configured with authentication routes and middleware.
import router from './router'

// 1. Initiate the app
// Create an instance(created from the class) of Express.js application by calling the express() function and store it in the variable 'app'
// Now variable 'app' can have express's properties and methods
const app = express()

// 2. Enables CORS (Cross-Origin Resource Sharing ) for the Express.js application
// CORS is a security feature that allows controlled access to resources from other domains
// { credentials: true } allows requests from other domains to access resources on our server with credentials
app.use(
  cors({
    credentials: true,
  })
)

// 3. Use middleware
// middleware: acts as a bridge between the incoming HTTP request and the outgoing HTTP response in a web application, processing and modifying data between the client's request and the server's response in a web application.
// controller: The controller acts as an intermediary between the model and the view.

// middleware vs controller
// middleware: handles request processing and can have global or route-specific effects
// controller: handle the business logic and processing of specific API endpoints

// 3.1 Add the compression middleware to the Express.js application
// The compression middleware is used here to compress the response data (e.g., JSON responses) before sending them to the client. Compression reduces the size of data, which helps to improve the performance and reduce the bandwidth consumption.
app.use(compression())

// 3.2 Add the cookieParser middleware to the Express.js application
// The cookieParser parses the incoming request cookies and makes them available in the req.cookies object.
app.use(cookieParser())

// 3.3 Add the bodyParser middleware to the Express.js application
// It parses incoming request bodies in JSON format and makes them available in the req.body object. This allows you to access data sent by the client in JSON format.
app.use(bodyParser.json())

// 4. Run the server
// The http module is used to create an HTTP server, and the Express.js application (app) is passed as a request listener to the server. The server variable will be used to start the server and listen for incoming requests.
const server = http.createServer(app)

// Start the HTTP server and makes it listen on port 8080. When the server is successfully started, it logs a message to the console indicating that the server is running.
server.listen(8080, () => {
  console.log('Server running on http://localhost:8080')
})

// 5. Connect MongoDB to the app
const MONGO_URL = `mongodb+srv://hyeonah:JCAAWqW7RcYmnpCq@cluster0.d7mmwdj.mongodb.net/?retryWrites=true&w=majority`

// This line sets the default Promise library for Mongoose. Here, it sets it to the built-in global Promise object.
mongoose.Promise = Promise
// This line defines the connection URL for MongoDB. It specifies the address of the MongoDB database that the application will connect to.
mongoose.connect(MONGO_URL)
// This sets up an event listener for the database connection. If there is an error during the connection process, it will be logged to the console.
mongoose.connection.on('error', (error: Error) => console.log(error))

// This line mounts the router returned from the router() function on the Express application (app). The router handles all routes related to authentication. The app.use() method registers the router middleware on the root path ('/') of the application, meaning it will handle any incoming request to the root path.
app.use('/', router())
