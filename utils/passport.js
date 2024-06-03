import session from 'express-session'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import createMemoryStore from 'memorystore'
const MemoryStore = createMemoryStore(session)

const passportUtil = (app) => {
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 14, //2 weeks
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            },
            store: new MemoryStore({
                checkPeriod: 86400000, // prune expired entries every 24h
            }),
        })
    )
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
                scope: ['profile', 'email'],
            },
            (accessToken, refreshToken, profile, callback) => {
                callback(null, profile)
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user)
    })
    passport.deserializeUser((user, done) => {
        done(null, user)
    })

    app.use(passport.initialize())
    app.use(passport.session())
}

export default passportUtil
