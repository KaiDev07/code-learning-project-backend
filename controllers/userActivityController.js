import UserActivity from '../models/userActivityModel.js'
import User from '../models/userModel.js'
import mongoose from 'mongoose'

// refresh DoneTasks
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
        const userActivity = await UserActivity.refreshParagraphs(
            userId,
            paragraphNum,
            isRead
        )
        res.status(200).json({
            tasksdone: userActivity.tasksdone,
            paragraphsread: userActivity.paragraphsread,
        })
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
        const userActivity = await UserActivity.refreshDoneTasks(
            userId,
            topicNum
        )
        res.status(200).json({
            tasksdone: userActivity.tasksdone,
            paragraphsread: userActivity.paragraphsread,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
