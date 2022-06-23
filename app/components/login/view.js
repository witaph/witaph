import React from 'react'

export default ({
	handleNameChange,
	handlePassChange,
	handleSubmit,
	userName,
	password,
	error,
}) => {
	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label>
					User Name:
					<input type='text' value={userName} onChange={handleNameChange} />
				</label>
				<label>
					Password:
					<input type="password" value={password} onChange={handlePassChange} />
				</label>
				<input type="submit" value="Submit" />
			</form>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	)
}