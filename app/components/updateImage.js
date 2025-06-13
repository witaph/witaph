import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Autocomplete, createFilterOptions } from '@mui/material'
import { TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment'

import { apiBaseUrl } from '../constants'
import "./react-tags-styles.css"

const filter = createFilterOptions()

class UpdateImage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			imageID: null,
			sourceURL: '',
			sourceURL2: '',
			name: '',
			dateCaptured: null,
			captureState: '',
			captureCountry: '',
			tags: [],
			existingTags: [],
			error: null,
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
		// get imageID url param manually from the end of window.location as following
		// react-router's documentation has not yielded results
		const pathnameSplit = window.location.pathname.split('/')
		const imageID = parseInt(pathnameSplit.slice(-1), 10)

		const verifyRes = await fetch(`${apiBaseUrl}/verifyLogin`, {
			headers: { 'x-access-token': localStorage.getItem('token') }
		})
		const verifyJson = await verifyRes.json()

		if (!verifyJson.success) {
			this.props.navigate('../')
		} else {
			const imageWithTags = await fetch(`${apiBaseUrl}/images/${imageID}`)
			const imageWithTagsJson = await imageWithTags.json()

			const initialState = {
				imageID: imageWithTagsJson.imageID,
				sourceURL: imageWithTagsJson.sourceURL,
				sourceURL2: imageWithTagsJson.sourceURL2 || '',
				name: imageWithTagsJson.name || '',
				dateCaptured: moment(imageWithTagsJson.dateCaptured, 'YYYY-MM-DD'),
				captureState: imageWithTagsJson.state || '',
				captureCountry: imageWithTagsJson.country || '',
				tags: imageWithTagsJson.tags || [],
			}

			const existingTags = JSON.parse(localStorage.getItem('existingTags'))
			
			if (existingTags) {
				this.setState({
					...initialState,
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
					...initialState,
					existingTags: tags,
				})
			}
		}
	}

	handleSourceChange(event) {
		this.setState({
			sourceURL: event.target.value,
		})
	}

	handleSource2Change(event) {
		this.setState({
			sourceURL2: event.target.value,
		})
	}

	handleNameChange(event) {
		this.setState({
			name: event.target.value,
		})
	}

	handleCaptureStateChange(event) {
		this.setState({
			captureState: event.target.value,
		})
	}

	handleCountryChange(event) {
		this.setState({
			captureCountry: event.target.value,
		})
	}

	handleTagsChange(tags) {
		this.setState({ tags })
	}

	handleSubmit(event) {
		event.preventDefault()

		// on bad input, display error message, leave input as is for correction
		if (!this.state.sourceURL || !this.state.sourceURL.length) {
			this.setState({ error: 'Image Source URL is required' })
			return
		}

		if (!this.state.dateCaptured) {
			this.setState({ error: 'Date Captured is required' })
			return
		}

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token')
			},
			body: JSON.stringify({
				imageID: this.state.imageID,
				sourceURL: this.state.sourceURL,
				sourceURL2: this.state.sourceURL2,
				name: this.state.name,
				dateCaptured: this.state.dateCaptured.format('YYYY-MM-DD'),
				captureState: this.state.captureState,
				captureCountry: this.state.captureCountry,
				tags: this.state.tags,
			})
		}

		fetch(`${apiBaseUrl}/updateImage`, requestOptions)
			.then(response => response.json())
			.then(allTagRecords => {
				const allTags = allTagRecords.map((tag) => ({
					id: tag.tagID,
					name: tag.tagText,
				}))

				localStorage.setItem('existingTags', JSON.stringify(allTags))

				// redirect to image feed on success, ideally scrolled to this image
				this.props.navigate('../')
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
					<br/>
					<LocalizationProvider dateAdapter={AdapterMoment}>
						<DatePicker
							label="Captured after date"
							value={this.state.dateCaptured}
							onChange={(newValue) => {
								this.setState({ dateCaptured: newValue })
							}}
						/>
					</LocalizationProvider>
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
					<input type="submit" value="Update Image" onChange={this.handleSubmit} />
					{this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
				</form>
			</div>
		)
	}
}

const WithNavigate = (props) => {
	let navigate = useNavigate()
	return <UpdateImage {...props} navigate={navigate} />
}

export default WithNavigate