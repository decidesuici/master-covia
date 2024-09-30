import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export const signin = async (request, response) => {
    const { email, password } = request.body

    const configSignin = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.SIGNIN,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        data: {
            email: email,
            password: password,
            undefined: true
        }
    }

    const requestSignin = await axios.request(configSignin)

    const cokie = requestSignin.headers['set-cookie'][0].split(';')[0]

    return response.json({ ...requestSignin.data, cokie: cokie })
}