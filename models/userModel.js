import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { v4 } from 'uuid'
import { sendActivationMail } from '../utils/mailUtil.js'
import Token from './tokenModel.js'

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isActivated: {
        type: Boolean,
        default: false,
    },
    activationLink: {
        type: String,
    },
    name: {
        type: String,
    },
    paragraphsread: {
        type: Array,
        default: [],
    },
    par4: { type: String, default: '0' },
    par5: { type: String, default: '0' },
    par3: { type: String, default: '0' },
    par6: { type: String, default: '0' },
    par7: { type: String, default: '0' },
    par8: { type: String, default: '0' },
    par9: { type: String, default: '0' },
    par11: { type: String, default: '0' },
})

userSchema.statics.signup = async function (email, password) {
    if (!email || !password) {
        throw Error('Барлық ұяшықтарды толтыру қажет!')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email-дың форматы қате!')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Құпиясөз әлсіз!')
    }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Бұндай Email-мен аккаунт бар ')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const activationLink = v4()

    const user = await this.create({ email, password: hash, activationLink })

    await sendActivationMail(email, activationLink)

    return user
}

userSchema.statics.activate = async function (activationLink) {
    const user = await this.findOne({ activationLink })
    if (!user) {
        throw Error('Қате сілтеме')
    }
    user.isActivated = true
    await user.save()
}

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('Барлық ұяшықтарды толтыру қажет!')
    }

    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Бұндай Emai-мен аккаунт табылған жоқ!')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Құпиясөз дұрыс емес!')
    }

    return user
}

userSchema.statics.refresh = async function (refreshToken) {
    if (!refreshToken) {
        throw Error('User is not authorized')
    }
    const userData = Token.validateRefreshToken(refreshToken)
    const tokenFromDb = await Token.findToken(refreshToken)

    if (!userData || !tokenFromDb) {
        throw Error('User is not authorized')
    }

    const user = await this.findById(userData.id)

    return user
}

userSchema.statics.refreshParagraphs = async function (
    userId,
    paragraphNum,
    isRead
) {
    const user = await this.findOne({ _id: userId })
    console.log(user)
    if (user) {
        const idx = user.paragraphsread.indexOf(paragraphNum)
        console.log(idx)
        if (isRead && idx === -1) {
            user.paragraphsread.push(paragraphNum)
        } else if (!isRead && idx !== -1) {
            user.paragraphsread.splice(idx, 1)
        }

        return user.save()
    } else {
        throw Error('Қателік. Аккаунт жоқ')
    }
}

userSchema.statics.refreshDoneTasks = async function (userId, topicNum) {
    const user = await this.findOne({ _id: userId })
    if (user) {
        user[topicNum] = Number(user[topicNum]) + 1 + ''

        return user.save()
    } else {
        throw Error('Қателік. Аккаунт жоқ')
    }
}

export default mongoose.model('User', userSchema)
