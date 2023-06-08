import { read, write } from '../../lib/orm.js'

const users = () => {
	let users = read('users')
	return users.filter( user => {
		delete user.password
		return user
	} )
}

const messages = (senderId, receiverId) => {
	let messages = read('messages')
	return messages.filter( message => {
		return (message.sender_id == senderId && message.receiver_id == receiverId) ||
			   (message.sender_id == receiverId && message.receiver_id == senderId)
	})
}

const addMessage = (senderId, receiverId, text, isSecret, time) => {
	let messages = read('messages')
	let message_id = messages.length ? messages[ messages.length - 1 ].message_id + 1 : 1
	let newMessage = {
		message_id,
		message_text: text,
		sender_id: +senderId,
		receiver_id: +receiverId,
		is_secret: isSecret,
		time
	}

	messages.push(newMessage)
	
	if( write('messages', messages) ) {
		return newMessage
	}

}

export default {
	addMessage,
	messages,
	users,
}