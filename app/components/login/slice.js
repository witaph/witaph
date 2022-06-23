import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiBaseUrl } from '../../constants'

export const submitLogin = createAsyncThunk('login/submitLogin', async login => {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(login),
	}

	const response = await fetch(`${apiBaseUrl}/login`, requestOptions)
	const loginRes = await response.json()
	
	return loginRes
})

export const loginSlice = createSlice({
	name: 'login',
	initialState: {
		userName: '',
		password: '',
		error: null,
		accessToken: false,
	},
	reducers: {
		setUserName: (state, action) => {
			state.userName = action.payload
		},
		setPassword: (state, action) => {
			state.password = action.payload
		},
	},
	extraReducers(builder) {
		builder.addCase(submitLogin.fulfilled, (state, action) => {
			if (action.payload.accessToken) {
				state.accessToken = action.payload.accessToken
			} else {
				state.error = 'Login failed'
			}
		})
	}
})

export const { setUserName, setPassword } = loginSlice.actions


export default loginSlice.reducer