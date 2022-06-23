import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiBaseUrl } from '../../constants'
import LoginView from './view'

export default () => {
	const [userName, setUserName] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)
	const navigate = useNavigate()

	const handleNameChange = (event) => { setUserName(event.target.value) }
	const handlePassChange = (event) => { setPassword(event.target.value) }
	const handleSubmit = (event) => {
		event.preventDefault()

		// call login api
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userName,
				password,
			})
		}

		fetch(`${apiBaseUrl}/login`, requestOptions)
			.then(response => response.json())
			.then(data => {
				if(data.accessToken) {
					// save JWT and redirect to admin page
					localStorage.setItem('token', data.accessToken)
					navigate('../addImage', { replace: true })
				} else {
					// display error
					setError('Login failed')
				}
			})
	} 

	return (
		<LoginView
			handleNameChange={handleNameChange}
			handlePassChange={handlePassChange}
			handleSubmit={handleSubmit}
			userName={userName}
			password={password}
			error={error}
		/>
	)
}