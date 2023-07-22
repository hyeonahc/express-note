import express from 'express'
import { merge } from 'lodash'
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

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies['ANTONIO-AUTH']

    if (!sessionToken) {
      return res.sendStatus(403)
    }

    const existingUser = await getUserBySessionToken(sessionToken)

    if (!existingUser) {
      return res.sendStatus(403)
    }

    // Q: 이 코드는 req 오브젝트에 existingUser(로그인한 유저)에 대한 정보를 붙여준 후에 서버에 request를 보내는 게 맞나요?
    // Q: 미들웨어는 요청, 응답 전후에 데이터를 바꿔주는 역할을 한다는데 맞나요?
    merge(req, { identity: existingUser })

    return next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
