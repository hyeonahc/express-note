import crypto from 'crypto'

const SECRET = 'ANTONIO-REST-API'

// Q: random을 왜 만드나요?
export const random = () => crypto.randomBytes(128).toString('base64')

// Q: 문법이 이해가 가지 않습니다
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac('sha256', [salt, password].join('/'))
    .update(SECRET)
    .digest('hex')
}
