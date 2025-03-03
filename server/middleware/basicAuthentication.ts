import basicAuth from 'express-basic-auth'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'

interface Users {
  [key: string]: string
}

const htpasswdPath = path.join(__dirname, '../routes/etc/htpasswd')

const users: Users = fs.existsSync(htpasswdPath)
  ? fs
      .readFileSync(htpasswdPath, 'utf-8')
      .split('\n')
      .filter(line => line)
      .reduce((acc: Users, line) => {
        const [user, pass] = line.split(':')
        acc[user] = pass
        return acc
      }, {})
  : {}

if (Object.keys(users).length === 0) {
  const defaultUser = 'admin'
  const defaultPassword = 'Password123456'
  const hashedPassword = bcrypt.hashSync(defaultPassword, 10)
  fs.writeFileSync(htpasswdPath, `${defaultUser}:${hashedPassword}\n`)
  users[defaultUser] = hashedPassword
}

export default basicAuth({
  authorizer: (username: string, password: string) => {
    const userPassword = users[username]
    return userPassword && bcrypt.compareSync(password, userPassword)
  },
  challenge: true,
  unauthorizedResponse: 'Unauthorized',
})
