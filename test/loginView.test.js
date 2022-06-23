import React from 'react'
import { render, screen } from '@testing-library/react'

import LoginView from '../app/components/login/view'

it('renders name and password inputs', () => {
	const props = {
		handleNameChange: () => {},
		handlePassChange: () => {},
		handleSubmit: () => {},
		userName: '',
		password: '',
		error: null,
	}
	render(<LoginView {...props} />)

	const userInput = screen.getByLabelText('User Name:')
	expect(userInput.value).toBe('')

	const passwordInput = screen.getByLabelText('Password:')
	expect(passwordInput.value).toBe('')
})