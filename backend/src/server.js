import { Server as SocketServer } from 'socket.io'
import express from 'express'
import cors from 'cors'
import http, { IncomingMessage } from 'http'
import * as config from './config.js'
import model from './modules/chat/model.js'

const app = express()
const httpServer = http.createServer(app)
const io = new SocketServer(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		allowedHeaders: ["my-custom-header"]
	}
})

// loading middlewares and modules
import modules from './modules/index.js'
import checkToken from './middlewares/checkToken.js'

// global middlewares
app.use( cors() )
app.use( express.urlencoded({ extended: true }) )
app.use( express.json() )
app.use( checkToken )

// loading modules
app.use( modules )

// import connectionHandler from './socketHandlers/connection.js'
const users = {}
const onConnect = (socket) => {
	users[socket.handshake.query.userId] = socket.id
	socket.emit('online users', users)
	socket.on('disconnet', () => {
		for (let user in users) {
			if (users[user] == socket.id) {
				users[user] = null
			}
		}
		io.emit('online users', users)
	})

	socket.on('create message', (receiverId) => {
		console.log('socket.id', socket.id, socket.handshake.query.userId, ' to ', users[receiverId]);
		//var receiverId = model.messages(socket.id).sort((a, b) => a.id - b.id);
		var userobj = {
			senderId: socket.handshake.query.userId,
			receiverId: receiverId
		}
		console.log('shu userga habar jo\'natishdi', userobj)
		socket.to(users[receiverId]).emit('new message', userobj)
	});

	socket.on('invite secret chat', (inviteChatDto) => {
		console.log(inviteChatDto)
		console.log('socket.id', socket.id, socket.handshake.query.userId, ' to ', users[inviteChatDto.receiverId]);
		var info = {
			senderId: socket.handshake.query.userId,
			receiverId: inviteChatDto.receiverId,
			status: inviteChatDto.status,
			encryptionInfo: inviteChatDto.encryptionInfo
		}

		if (!inviteChatDto.status) {
			console.log('Maxfiy chat o\'chirildi')
			socket.to(users[inviteChatDto.receiverId]).emit('disconnect secret chat', info)
		} else {
			if (users[inviteChatDto.receiverId] == undefined) {
				console.log('User online emas!')
				socket.to(users[inviteChatDto.senderId]).emit('wait secret chat partner', info)
			} else {
				console.log('shu userga maxfiy chat uchun so\'rov jo\'natishdi', info)
				socket.to(users[inviteChatDto.receiverId]).emit('invite secret chat', info)
			}
		}
	})

	socket.on('confirm secret chat', (confirmChatDto) => {
		console.log('socket.id', socket.id, socket.handshake.query.userId, ' to ', users[confirmChatDto.receiverId]);
		var info = {
			senderId: socket.handshake.query.userId,
			receiverId: confirmChatDto.receiverId,
			status: confirmChatDto.status,
			encryptionInfo: confirmChatDto.encryptionInfo
		}

		if (confirmChatDto.status) {
			console.log('Maxfiy chat boshlandi')
			if (users[confirmChatDto.receiverId] == undefined) {
				console.log('User online emas!')
				socket.to(users[confirmChatDto.senderId]).emit('wait secret chat partner', info)
			} else {
				console.log('maxfiy chat uchun so\'rov tasqidlandi', info)
				socket.to(users[confirmChatDto.receiverId]).emit('start secret chat', info)
			}
		}
	})
}

io.on('connection', onConnect)

httpServer.listen( config.PORT,  () => {
	console.log('Backend server is running on http://' + config.host + ':' + config.PORT)
})
