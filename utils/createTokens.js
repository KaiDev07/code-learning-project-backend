import jwt from 'jsonwebtoken'

export const createTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '1h',
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '14d',
    })

    return {
        accessToken,
        refreshToken,
    }
}
