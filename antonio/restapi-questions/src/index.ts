import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import router from './router'

const app = express()

// Q: 아래의 코드는 어떤 url을 가진 클라이언트의 요청도 받아들이는 코드인것 같은데 만약 특정 클라이언트의 요청만 받고싶으면 어떻게 해야하나요?
// { credentials: true } allows requests from other domains to access resources on our server with credentials
app.use(
  cors({
    credentials: true,
  })
)

// Q: compression, cookieParser, bodyParser를 다 미들웨어라고 하는데 정확히 역할이 무엇인가요?
// middleware vs controller
// middleware: acts as a bridge between the incoming HTTP request and the outgoing HTTP response in a web application, processing and modifying data between the client's request and the server's response in a web application. => 이게 컨트롤러와 비슷하게 들려요
// middleware: handles request processing and can have global or route-specific effects
// controller: handle the business logic and processing of specific API endpoints

app.use(compression())
// Q: cookieParser 미들웨어가 왜 필요한가요?
// The cookieParser parses the incoming request cookies and makes them available in the req.cookies object.
app.use(cookieParser())
// Q: 처음에 클라이언트는 오브젝트 데이터를 백엔드에 보내주고 백엔드에서는 오브젝트를 JSON 데이터로 변환해주는 과정이라는 의미인가요?
// It parses incoming request bodies in JSON format and makes them available in the req.body object. This allows you to access data sent by the client in JSON format.
app.use(bodyParser.json())

const server = http.createServer(app)

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080')
})

const MONGO_URL = `mongodb+srv://hyeonah:JCAAWqW7RcYmnpCq@cluster0.d7mmwdj.mongodb.net/?retryWrites=true&w=majority`

mongoose.Promise = Promise
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', (error: Error) => console.log(error))

app.use('/', router())
