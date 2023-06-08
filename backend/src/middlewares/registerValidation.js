import validation from '../lib/validation.js'
import { read } from '../lib/orm.js'

export default function (req, res, next) {
	try {
		let { username, password, contact } = req.body
		if(!username || !validation.username(username)) throw 'The username is required!'
		if(!password || !validation.password(password)) throw 'The password is required!'
		if(!contact  || !validation.contact(contact))   throw 'The contact is required!'

		let users = read('users')
		let user = users.find( user => user.username == username )
		if(user) throw 'The user already exists!'
			
		next()
	} catch(error) {
		res.status(401).json({ status: 401, message: error })
	}
}