import User from '../models/userModel.js'
import Token from '../models/tokenModel.js'
import { createTokens } from '../utils/createTokens.js'
import { v4 } from 'uuid'
import bcrypt from 'bcrypt'

export const signupUser = async (req, res) => {
    try {
        if (req.user) {
            throw Error('Error occured while signing up')
        }
        const { email, password } = req.body

        const user = await User.signup(email, password)

        const tokenPayload = {
            id: user._id,
            email: user.email,
            isActivated: user.isActivated,
        }
        const tokens = createTokens(tokenPayload)

        await Token.savetoken(user._id, tokens.refreshToken)

        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        })

        res.status(200).json({
            accessToken: tokens.accessToken,
            user: {
                ...tokenPayload,
                paragraphsread: user.paragraphsread,
                par3: '0',
                par4: '0',
                par5: '0',
                par6: '0',
                par7: '0',
                par8: '0',
                par9: '0',
                par11: '0',
            },
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const activate = async (req, res) => {
    try {
        const activationLink = req.params.link
        await User.activate(activationLink)
        res.redirect(process.env.CLIENT_URL)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const login = async (req, res) => {
    try {
        if (req.user) {
            throw Error('Error occured while logging in')
        }
        const { email, password } = req.body

        const user = await User.login(email, password)

        const tokenPayload = {
            id: user._id,
            email: user.email,
            isActivated: user.isActivated,
        }
        const tokens = createTokens(tokenPayload)

        await Token.savetoken(user._id, tokens.refreshToken)

        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        })

        res.status(200).json({
            accessToken: tokens.accessToken,
            user: {
                ...tokenPayload,
                paragraphsread: user.paragraphsread,
                par3: user.par3,
                par4: user.par4,
                par5: user.par5,
                par6: user.par6,
                par7: user.par7,
                par8: user.par8,
                par9: user.par9,
                par11: user.par11,
            },
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        if (req.user) {
            req.logout((err) => {
                if (err) {
                    throw Error('Error occured while logging out')
                }
                res.end()
            })
        } else {
            const { refreshToken } = req.cookies
            const token = await Token.removeToken(refreshToken)
            res.clearCookie('refreshToken')
            res.end()
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const refresh = async (req, res) => {
    try {
        if (req.user) {
            const findUser = await User.findOne({
                email: req.user._json.sub + '@gmail.com',
            })
            if (findUser) {
                res.status(200).json({
                    user: {
                        id: findUser._id,
                        isActivated: findUser.isActivated,
                        name: findUser.name,
                        paragraphsread: findUser.paragraphsread,
                        par3: findUser.par3,
                        par4: findUser.par4,
                        par5: findUser.par5,
                        par6: findUser.par6,
                        par7: findUser.par7,
                        par8: findUser.par8,
                        par9: findUser.par9,
                        par11: findUser.par11,
                    },
                })
            } else {
                const password = v4()
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(password, salt)

                const payload = {
                    email: req.user._json.sub + '@gmail.com',
                    password: hash,
                    isActivated: true,
                    name: req.user._json.name,
                }

                const user = await User.create(payload)

                res.status(200).json({
                    user: {
                        id: user._id,
                        isActivated: user.isActivated,
                        name: user.name,
                        paragraphsread: user.paragraphsread,
                        par3: user.par3,
                        par4: user.par4,
                        par5: user.par5,
                        par6: user.par6,
                        par7: user.par7,
                        par8: user.par8,
                        par9: user.par9,
                        par11: user.par11,
                    },
                })
            }
        } else {
            const { refreshToken } = req.cookies

            const user = await User.refresh(refreshToken)

            const tokenPayload = {
                id: user._id,
                email: user.email,
                isActivated: user.isActivated,
            }
            const tokens = createTokens(tokenPayload)

            await Token.savetoken(user._id, tokens.refreshToken)

            res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 14 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            })

            res.status(200).json({
                accessToken: tokens.accessToken,
                user: {
                    ...tokenPayload,
                    paragraphsread: user.paragraphsread,
                    par3: user.par3,
                    par4: user.par4,
                    par5: user.par5,
                    par6: user.par6,
                    par7: user.par7,
                    par8: user.par8,
                    par9: user.par9,
                    par11: user.par11,
                },
            })
        }
    } catch (error) {
        res.status(400).json({
            error: error?.message ? error.message : 'Error occured',
        })
    }
}

export const refreshParagraphs = async (req, res) => {
    try {
        const { paragraphNum, isRead } = req.body
        let userId
        if (req.user._json) {
            const user = await User.findOne({
                email: req.user._json.sub + '@gmail.com',
            })
            userId = user._id
        } else {
            userId = req.user.id
        }
        const user = await User.refreshParagraphs(userId, paragraphNum, isRead)
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// refreshDoneTasks
export const refreshDoneTasks = async (req, res) => {
    try {
        const { topicNum } = req.body
        let userId
        if (req.user._json) {
            const user = await User.findOne({
                email: req.user._json.sub + '@gmail.com',
            })
            userId = user._id
        } else {
            userId = req.user.id
        }
        const user = await User.refreshDoneTasks(userId, topicNum)
        res.status(200).json({
            user,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
