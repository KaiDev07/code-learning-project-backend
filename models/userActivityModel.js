import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userActivitySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    paragraphsread: {
        type: Array,
        default: [],
    },
    tasksdone: {
        type: Object,
        default: {},
    },
})

userActivitySchema.statics.refreshParagraphs = async function (
    userId,
    paragraphNum,
    isRead
) {
    const userActivityData = await this.findOne({ user: userId })
    if (userActivityData) {
        const idx = userActivityData.paragraphsread.indexOf(paragraphNum)
        if (isRead && idx === -1) {
            userActivityData.paragraphsread.push(paragraphNum)
        } else if (!isRead && idx !== -1) {
            userActivityData.paragraphsread.splice(idx, 1)
        }

        return userActivityData.save()
    } else if (!userActivityData && isRead) {
        const userActivity = await this.create({
            user: userId,
            paragraphsread: [paragraphNum],
        })

        return userActivity
    }

    return { paragraphsread: [], tasksdone: {} }
}

userActivitySchema.statics.refreshDoneTasks = async function (
    userId,
    topicNum
) {
    const userActivityData = await this.findOne({ user: userId })
    if (userActivityData) {
        userActivityData.tasksdone[topicNum] += 1
        return userActivityData.save()
    }
    const sample = {}
    sample[topicNum] = 1
    const userActivity = await this.create({
        user: userId,
        tasksdone: sample,
    })

    return userActivity
}

export default mongoose.model('Useractivitie', userActivitySchema)
