import model from './model.js'

const usersController = (req, res) => {
	try {
		return res.json(model.users())
	} catch (error) {
		console.log(error)
	}
}

const messagesGetController = (req, res) => {
	try {
		return res.json(model.messages(req.userId, req.query.receiverId))
	} catch (error) {
		console.log(error)
	}
}

const messagesPostController = (req, res) => {
	try {
		let message = model.addMessage(req.userId, req.body.receiverId, req.body.text, req.body.isSecret, req.body.time)
		if(message) {
			res.status(201).json({
				status: 201,
				message: 'The message sent!',
				data: message
			})
		} else res.status(401).json({status: 401, message: 'something went wrong'})
	} catch (error) {
		console.log(error)
	}
}

export {
	messagesPostController,
	messagesGetController,
	usersController
}