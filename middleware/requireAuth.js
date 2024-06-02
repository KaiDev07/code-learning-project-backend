import Token from '../models/tokenModel.js'

const requireAuth = (req, res, next) => {
    try {
        if (req.user) {
            next()
        } else {
            const { authorization } = req.headers
            if (!authorization) {
                return res
                    .status(401)
                    .json({ error: 'Request is not authorized' })
            }

            const accessToken = authorization.split(' ')[1]
            if (!accessToken) {
                return res
                    .status(401)
                    .json({ error: 'Request is not authorized' })
            }

            const userData = Token.validateAccessToken(accessToken)
            if (!userData) {
                return res
                    .status(401)
                    .json({ error: 'Request is not authorized' })
            }

            req.user = userData
            next()
        }
    } catch (error) {
        res.status(401).json({
            error: error?.message ? error.message : 'Request is not authorized',
        })
    }
}

export default requireAuth
