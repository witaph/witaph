import React from 'react'
import ReactDOM from 'react-dom'

const apiBaseUrl = 'http://localhost:8000/api'

export default class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = { userName: '', password: '' }

		this.handleNameChange = this.handleNameChange.bind(this)
		this.handlePassChange = this.handlePassChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleNameChange(event) {
		console.log('handleNameChange, event.target: ', event.target)
		this.setState({ userName: event.target.value })
	}

	handlePassChange(event) {
		console.log('handlePassChange, event.target: ', event.target)
		this.setState({ password: event.target.value })
	}

	handleSubmit(event) {
		event.preventDefault()
		console.log('handleSubmit event: ', event)

		// call login api
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userName: this.state.userName,
				password: this.state.password,
			})
		}

		console.log('requestOptions: ', requestOptions)
		fetch(`${apiBaseUrl}/login`, requestOptions)
			.then(response => response.json())
			.then(data => {
				console.log('POST /login response data: ', data)
			})

		// save JWT and redirect to admin page on success
		// display error on failure
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>
						User Name:
						<input type='text' value={this.state.userName} onChange={this.handleNameChange} />
					</label>
					<label>
						Password:
						<input type="password" value={this.state.password} onChange={this.handlePassChange} />
					</label>
					<input type="submit" value="Submit" />
				</form>
			</div>
		)
	}
}