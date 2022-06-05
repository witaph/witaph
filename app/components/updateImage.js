import React from 'react'
import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom'
import ReactTags from 'react-tag-autocomplete'
import moment from 'moment'

import { apiBaseUrl } from '../constants'
import "./react-tags-styles.css"

class UpdateImage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			imageID: null,
			sourceURL: '',
			sourceURL2: '',
			name: '',
			dateCaptured: '',
			captureState: '',
			captureCountry: '',
			tags: [],
			existingTags: [],
			error: null,
		}

		this.handleSourceChange = this.handleSourceChange.bind(this)
		this.handleSource2Change = this.handleSource2Change.bind(this)
		this.handleNameChange = this.handleNameChange.bind(this)
		this.handleDateChange = this.handleDateChange.bind(this)
		this.handleCaptureStateChange = this.handleCaptureStateChange.bind(this)
		this.handleCountryChange = this.handleCountryChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleTagDelete = this.handleTagDelete.bind(this)
		this.handleTagAdd = this.handleTagAdd.bind(this)

		this.reactTags = React.createRef()
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
				dateCaptured: moment(imageWithTagsJson.dateCaptured, 'YYYY-MM-DD').format('YYYY-MM-DD'),
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

	handleDateChange(event) {
		this.setState({
			dateCaptured: event.target.value,
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

	handleTagAdd(tag) {
		const tags = [].concat(this.state.tags, tag)
		
		this.setState({
			tags,
		})
	}

	handleTagDelete(index) {
		const tags = this.state.tags.slice(0)
		tags.splice(index, 1)

		this.setState({
			tags,
		})
	}

	handleSubmit(event) {
		event.preventDefault()

		// on bad input, display error message, leave input as is for correction
		if (!this.state.sourceURL || !this.state.sourceURL.length) {
			this.setState({ error: 'Image Source URL is required' })
			return
		}

		if (!this.state.dateCaptured || !this.state.dateCaptured.length) {
			this.setState({ error: 'Date Captured is required' })
			return
		}

		if (!moment(this.state.dateCaptured, 'YYYY-MM-DD').isValid()) {
			this.setState({ error: 'Date Captured must be provided in YYYY-MM-DD format' })
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
				dateCaptured: this.state.dateCaptured,
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
						<ReactTags
							ref={this.reactTags}
							tags={this.state.tags}
							suggestions={this.state.existingTags}
							onDelete={this.handleTagDelete}
							onAddition={this.handleTagAdd}
							allowNew={true}
							minQueryLength={0}
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