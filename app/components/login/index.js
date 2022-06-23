import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { apiBaseUrl } from '../../constants'
import { setUserName, setPassword, submitLogin } from './slice'
import LoginView from './view'

export default () => {
	const {
		userName,
		password,
		error,
		accessToken,
	} = useSelector(state => state.login)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		if (accessToken) {
			localStorage.setItem('token', accessToken)
			navigate('../addImage', { replace: true })
		}
	})

	const handleNameChange = (event) => { dispatch(setUserName(event.target.value)) }
	const handlePassChange = (event) => { dispatch(setPassword(event.target.value)) }
	const handleSubmit = (event) => {
		event.preventDefault()
		dispatch(submitLogin({ userName, password }))
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