import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const Schema = mongoose.Schema

const tokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    refreshToken: {
        type: String,
        required: true,
    },
})

tokenSchema.statics.savetoken = async function (userId, refreshToken) {
    const tokenData = await this.findOne({ user: userId })
    if (tokenData) {
        tokenData.refreshToken = refreshToken
        return tokenData.save()
    }
    const token = await this.create({ user: userId, refreshToken })

    return token
}

tokenSchema.statics.removeToken = async function (refreshToken) {
    const tokenData = await this.findOneAndDelete({ refreshToken })

    return tokenData
}

tokenSchema.statics.validateAccessToken = function (token) {
    try {
        const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        return userData
    } catch (error) {
        return null
    }
}

tokenSchema.statics.validateRefreshToken = function (token) {
    try {
        const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        return userData
    } catch (error) {
        return null
    }
}

tokenSchema.statics.findToken = async function (refreshToken) {
    const tokenData = await this.findOne({ refreshToken })

    return tokenData
}

export default mongoose.model('Token', tokenSchema)
