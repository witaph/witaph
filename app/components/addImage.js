import React from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { Autocomplete, createFilterOptions } from '@mui/material'
import { TextField } from '@mui/material'

import { apiBaseUrl } from '../constants'
import "./react-tags-styles.css"

const filter = createFilterOptions()

class AddImage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			sourceURL: '',
			sourceURL2: '',
			name: '',
			dateCaptured: '',
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
		this.handleDateChange = this.handleDateChange.bind(this)
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

	handleDateChange(event) {
		this.setState({
			dateCaptured: event.target.value,
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

		if (!this.state.dateCaptured || !this.state.dateCaptured.length) {
			this.setState({ error: 'Date Captured is required', success: null })
			return
		}

		if (!moment(this.state.dateCaptured, 'YYYY-MM-DD').isValid()) {
			this.setState({ error: 'Date Captured must be provided in YYYY-MM-DD format', success: null })
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
				dateCaptured: this.state.dateCaptured,
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
					<label>
						Image Source URL: 
						<input type="text" value={this.state.sourceURL} onChange={this.handleSourceChange} />
					</label>
					<br/>
					<label>
						Backup Source URL: 
						<input type="text" value={this.state.sourceURL2} onChange={this.handleSource2Change} />
					</label>
					<br/>
					<label>
						Name: 
						<input type="text" value={this.state.name} onChange={this.handleNameChange} />
					</label>
					<br/>
					<label>
						Date Captured: 
						<input type="text" value={this.state.dateCaptured} onChange={this.handleDateChange} />
					</label>
					<br/>
					<label>
						State/Province: 
						<input type="text" value={this.state.captureState} onChange={this.handleCaptureStateChange} />
					</label>
					<br/>
					<label>
						Country: 
						<input type="text" value={this.state.captureCountry} onChange={this.handleCountryChange} />
					</label>
					<br/>
					<label>
						Tags: 
						<Autocomplete
							multiple
							id="tags"
							options={this.state.existingTags}
							getOptionLabel={(option) => option.name}
							renderInput={(params) => <TextField {...params} placeholder="Add tags" />}
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
					</label>
					<br/>
					<input type="submit" value="Add Image" onChange={this.handleSubmit} />
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