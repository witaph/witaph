import React from 'react'
import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom'

const apiBaseUrl = 'http://localhost:8000/api'

class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = { userName: '', password: '' }

		this.handleNameChange = this.handleNameChange.bind(this)
		this.handlePassChange = this.handlePassChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleNameChange(event) {
		this.setState({ userName: event.target.value })
	}

	handlePassChange(event) {
		this.setState({ password: event.target.value })
	}

	handleSubmit(event) {
		event.preventDefault()

		// call login api
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userName: this.state.userName,
				password: this.state.password,
			})
		}

		fetch(`${apiBaseUrl}/login`, requestOptions)
			.then(response => response.json())
			.then(data => {
				console.log('POST /login response data: ', data)

				if(data.accessToken) {
					// save JWT and redirect to admin page
					localStorage.setItem('token', data.accessToken)
					this.props.navigate('../addImage', { replace: true })
				} else {
					// display error
					this.setState({
						error: 'Login failed'
					})
				}
			})
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
				{this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
			</div>
		)
	}
}

const WithNavigate = (props) => {
	let navigate = useNavigate()
	return <Login {...props} navigate={navigate} />
}

export default WithNavigate