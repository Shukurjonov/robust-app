if(token) window.location = '/'

form.onsubmit = async (event) => {
	event.preventDefault()

	let response = await request('/login', 'POST', {
		username: usernameInput.value,
		password: passwordInput.value,
	})

	if(response.status == 200) {
		response = await response.json()
		window.localStorage.setItem('token', response.token)
		window.localStorage.setItem('userId', response.userId)
		title.textContent = response.message
		setTimeout( () => {
			window.location = '/'
		}, 2000)
	} else {
		response = await response.json()
		title.textContent = response.message
	}

}