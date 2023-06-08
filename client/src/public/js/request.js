let backendHost = 'http://localhost:4200'
let token = window.localStorage.getItem('token')
token = token ? JSON.parse(token) : ''
async function request (path, method, body) {
	let response = await fetch(backendHost + path, {
		method,
		headers: {
			'Content-Type': 'application/json',
			'token': token
		},
		body: body ? JSON.stringify(body) : null
	})
	return response
}