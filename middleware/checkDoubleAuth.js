import Token from '../models/tokenModel.js'

const checkDoubleAuth = async (req, res, next) => {
    const { refreshToken } = req.cookies
    const tokenFromDb = await Token.findToken(refreshToken)
    if (req.user && tokenFromDb) {
        return res.status(400).json({ error: 'Error (2 login sessions)' })
    }
    next()
}

export default checkDoubleAuth
