import React from 'react'
import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom'
import ReactTags from 'react-tag-autocomplete'

import { apiBaseUrl } from '../constants'
import "./react-tags-styles.css"

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
		const res = await fetch(`${apiBaseUrl}/verifyLogin`, {
			headers: { 'x-access-token': localStorage.getItem('token') }
		})
		console.log('verifyLogin res: ', res)

		if (res.status != 200) {
			this.props.navigate('../')
		} else {
			const existingTags = JSON.parse(localStorage.getItem('existingTags'))
			console.log('localStorage.getItem(existingTags): ', existingTags)
			if (existingTags) {
				this.setState({
					existingTags,
				})
			} else {
				const tagsRes = await fetch(`${apiBaseUrl}/tags`)
				const tagsResJson = await tagsRes.json()
				const tagRecords = JSON.parse(tagsResJson.tags)
				console.log('fetched tagRecords: ', tagRecords)
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
		this.setState({ sourceURL: event.target.value })
	}

	handleSource2Change(event) {
		this.setState({ sourceURL2: event.target.value })
	}

	handleNameChange(event) {
		this.setState({ name: event.target.value })
	}

	handleDateChange(event) {
		this.setState({ dateCaptured: event.target.value })
	}

	handleCaptureStateChange(event) {
		this.setState({ captureState: event.target.value })
	}

	handleCountryChange(event) {
		this.setState({ country: event.target.value })
	}

	handleTagAdd(tag) {
		console.log('handleTagAdd, tag: ', tag)
		const tags = [].concat(this.state.tags, tag)
		console.log('current tags: ', tags)
		this.setState({ tags })
	}

	handleTagDelete(index) {
		console.log('handleTagDelete, index: ', index)
		const tags = this.state.tags.slice(0)
		tags.splice(index, 1)
		console.log('current tags: ', tags)
		this.setState({ tags })
	}

	handleSubmit(event) {
		event.preventDefault()
		console.log('handleSubmit event: ', event)
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
						<input type="text" value={this.state.country} onChange={this.handleCountryChange} />
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
					<input type="submit" value="Submit" onChange={this.handleSubmit} />
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