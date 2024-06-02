import 'dotenv/config.js'
import express from 'express'
import mongoose from 'mongoose'
import userRoutes from './routes/user.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passportUtil from './utils/passport.js'
import checkDoubleAuth from './middleware/checkDoubleAuth.js'

// express app
const app = express()

// connect to db
mongoose
    .connect(process.env.MONG_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening to port', process.env.PORT)
        })
    })
    .catch((err) => console.log(err))

// middleware
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
app.set('trust proxy', true)
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
)
passportUtil(app)

// routes
app.use(checkDoubleAuth)
app.use('/user', userRoutes)
