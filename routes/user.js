import express from 'express'
import passport from 'passport'
import {
    signupUser,
    activate,
    login,
    logout,
    refresh,
    refreshParagraphs,
    refreshDoneTasks,
} from '../controllers/userController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = express.Router()

router.post('/registration', signupUser)
router.post('/login', login)
router.post('/logout', logout)
router.get('/activate/:link', activate)
router.get('/refresh', refresh)
router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)
router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: process.env.CLIENT_URL,
    })
)

router.use(requireAuth)
router.post('/refreshParagraphs', refreshParagraphs)
router.post('/refreshDoneTasks', refreshDoneTasks)

export default router
