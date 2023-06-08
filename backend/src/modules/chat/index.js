// configuring router
import express from 'express'
const router = express.Router()

//loading controllers
import { usersController } from './controller.js'
import { messagesGetController } from './controller.js'
import { messagesPostController } from './controller.js'


// handling routes
router.route('/users')
	.get( usersController )

router.route('/messages')
	.get( messagesGetController )
	.post( messagesPostController )


export default router