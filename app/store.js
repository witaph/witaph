import { configureStore } from '@reduxjs/toolkit'

import loginReducer from './components/login/slice'

export default configureStore({
	reducer: {
		login: loginReducer,
	},
})