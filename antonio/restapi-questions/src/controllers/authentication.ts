import express from 'express'
// Q: 컨트롤러는 아래와 같은 역할을 한다고하는데 이 코드에서 찾아볼 수 있나요?
// Controller: The controller also contains the application logic that determines how the model and view interact.
// 1) It receives user input from the view and handles the requests. -> 여기는 이해완료
// 2) It updates the model based on user actions and updates the view to reflect any changes in the data. -> 모델을 업데이트하는 부분이 있나요?
import { createUser, getUserByEmail } from '../db/users'
import { authentication, random } from '../helpers'

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.sendStatus(400)
    }

    // Q: 유저의 이메일주소를 사용해서 사용자가 입력한 패스워드와 데이터베이스에 있는 패스워드가 같은지 확인해주는 작업을 하기 위해 +authentication.salt +authentication.password 두가지를 가져온건가요? + 기호는 왜 붙나요?
    // .select('+authentication.salt +authentication.password') indicates that the salt and password fields from the authentication object should also be retrieved from the database along with other user data.
    const user = await getUserByEmail(email).select(
      '+authentication.salt +authentication.password'
    )

    if (!user) {
      return res.sendStatus(400)
    }

    const expectedHash = authentication(user.authentication?.salt, password)

    // Q: expectedHash는 사용자가 입력한 패스워드를 의미하고 user.authentication?.password는 데이터베이스에 저장된 패스워드를 의미하는것이 맞나요?
    if (user.authentication?.password !== expectedHash) {
      return res.sendStatus(403)
    }

    const salt = random()
    user.authentication.sessionToken = authentication(salt, user._id.toString())

    await user.save()

    // Q: 아래 코드가 이해되지 않습니다. 쿠키가 왜 필요한가요?
    // setting a cookie with the session token before sending a response to the client.
    res.cookie('ANTONIO-AUTH', user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
    })

    return res.status(200).json(user).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body

    if (!email || !password || !username) {
      return res.sendStatus(400)
    }

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return res.sendStatus(400)
    }

    const salt = random()

    /*
    Q: authentication에 오브젝트로 password, salt, sessionToken이 들어갔는데 createUser때는 왜 salt와 password만 전달해주나요
    const UserSchema = new mongoose.Schema({
      username: { type: String, required: true },
      email: { type: String, required: true },
      authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
      },
    })
    */
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    })

    return res.status(200).json(user).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
