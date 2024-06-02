import express from 'express'
import {
    refreshParagraphs,
    refreshDoneTasks,
} from '../controllers/userActivityController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = express.Router()

//require auth
router.use(requireAuth)

router.post('/refreshParagraphs', refreshParagraphs)

router.post('/refreshDoneTasks', refreshDoneTasks)

export default router
