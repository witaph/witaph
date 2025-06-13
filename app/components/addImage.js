import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Autocomplete, createFilterOptions } from '@mui/material'
import { TextField, Button } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { apiBaseUrl } from '../constants'

const filter = createFilterOptions()

class AddImage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			sourceURL: '',
			sourceURL2: '',
			name: '',
			dateCaptured: null,
			captureState: '',
			captureCountry: '',
			tags: [],
			existingTags: [],
			error: null,
			success: null,
		}

		this.handleSourceChange = this.handleSourceChange.bind(this)
		this.handleSource2Change = this.handleSource2Change.bind(this)
		this.handleNameChange = this.handleNameChange.bind(this)
		this.handleCaptureStateChange = this.handleCaptureStateChange.bind(this)
		this.handleCountryChange = this.handleCountryChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleTagsChange = this.handleTagsChange.bind(this)
	}

	async componentDidMount() {
		const verifyRes = await fetch(`${apiBaseUrl}/verifyLogin`, {
			headers: { 'x-access-token': localStorage.getItem('token') }
		})
		const verifyJson = await verifyRes.json()

		if (!verifyJson.success) {
			this.props.navigate('../')
		} else {
			const existingTags = JSON.parse(localStorage.getItem('existingTags'))

			if (existingTags) {
				this.setState({
					existingTags,
				})
			} else {
				const tagsRes = await fetch(`${apiBaseUrl}/tags`)
				const tagRecords = await tagsRes.json()
				
				const tags = tagRecords.map(tagRecord => ({
					id: tagRecord.tagID,
					name: tagRecord.tagText,
				}))
				localStorage.setItem('existingTags', JSON.stringify(tags))
				this.setState({
					existingTags: tags,
				})
			}
		}
	}

	handleSourceChange(event) {
		this.setState({
			sourceURL: event.target.value,
			success: null,
		})
	}

	handleSource2Change(event) {
		this.setState({
			sourceURL2: event.target.value,
			success: null,
		})
	}

	handleNameChange(event) {
		this.setState({
			name: event.target.value,
			success: null,
		})
	}

	handleCaptureStateChange(event) {
		this.setState({
			captureState: event.target.value,
			success: null,
		})
	}

	handleCountryChange(event) {
		this.setState({
			captureCountry: event.target.value,
			success: null,
		})
	}

	handleTagsChange(tags) {
		this.setState({
			tags,
			success: null,
		})
	}

	handleSubmit(event) {
		event.preventDefault()

		// on bad input, display error message, leave input as is for correction
		if (!this.state.sourceURL || !this.state.sourceURL.length) {
			this.setState({ error: 'Image Source URL is required', success: null })
			return
		}

		if (!this.state.dateCaptured) {
			this.setState({ error: 'Date Captured is required', success: null })
			return
		}

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token')
			},
			body: JSON.stringify({
				sourceURL: this.state.sourceURL,
				sourceURL2: this.state.sourceURL2,
				name: this.state.name,
				dateCaptured: this.state.dateCaptured.format('YYYY-MM-DD'),
				captureState: this.state.captureState,
				captureCountry: this.state.captureCountry,
				tags: this.state.tags,
			})
		}

		fetch(`${apiBaseUrl}/addImage`, requestOptions)
			.then(response => response.json())
			.then(allTagRecords => {
				const allTags = allTagRecords.map((tag) => ({
					id: tag.tagID,
					name: tag.tagText,
				}))

				localStorage.setItem('existingTags', JSON.stringify(allTags))

				// show success message, clear all inputs except those that are likely
				// to remain the same for consecutive images (captureState/captureCountry/dateCaptured)
				this.setState({
					success: true,
					error: null,
					existingTags: allTags,
					sourceURL: '',
					sourceURL2: '',
					name: '',
					tags: [],
				})
			})
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<TextField
						label="Image Source URL"
						value={this.state.sourceURL}
						onChange={this.handleSourceChange}
						fullWidth
					/>
					<br/>
					<TextField
						label="Backup Source URL"
						value={this.state.sourceURL2}
						onChange={this.handleSource2Change}
						fullWidth
					/>
					<br/>
					<TextField
						label="Name"
						value={this.state.name}
						onChange={this.handleNameChange}
					/>
					<LocalizationProvider dateAdapter={AdapterMoment}>
						<DatePicker
							label="Date Captured"
							value={this.state.dateCaptured}
							onChange={(newValue) => {
								this.setState({ dateCaptured: newValue })
							}}
						/>
					</LocalizationProvider>
					<br/>
					<TextField
						label="State/Province"
						value={this.state.captureState}
						onChange={this.handleCaptureStateChange}
					/>
					<TextField
						label="Country"
						value={this.state.captureCountry}
						onChange={this.handleCountryChange}
					/>
					<br/>
					<Autocomplete
						multiple
						id="tags"
						options={this.state.existingTags}
						getOptionLabel={(option) => option.name}
						renderInput={(params) => <TextField {...params} label="Tags" />}
						onChange={(event, value) => this.handleTagsChange(value)}
						value={this.state.tags}
						filterOptions={(options, params) => {
							const filtered = filter(options, params);
					
							const { inputValue } = params;
							// Suggest the creation of a new value
							const isExisting = options.some((option) => inputValue === option.name);
							if (inputValue !== '' && !isExisting) {
								filtered.push({
									name: inputValue
								});
							}
					
							return filtered;
						}}
					/>
					<br/>
					<Button variant="contained" onClick={this.handleSubmit}>Add Image</Button>
					{this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
					{this.state.success && <p>Success!</p>}
				</form>
			</div>
		)
	}
}

const WithNavigate = (props) => {
	let navigate = useNavigate()
	return <AddImage {...props} navigate={navigate} />
}

export default WithNavigate