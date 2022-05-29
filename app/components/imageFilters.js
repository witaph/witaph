import React from 'react'
import ReactDOM from 'react-dom'
import ReactTags from 'react-tag-autocomplete'
import moment from 'moment'

import { apiBaseUrl } from '../constants'
import hamburgerIcon from '../img/Hamburger_icon.png'
import infoIcon from '../img/info_icon.png'

const preferredTags = ['jade', 'ambulance', 'national park', 'wildlife']

const tagSuggestionsTransform = (query, suggestions) => {
	const escapedQuery = query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
	const matchPartial = new RegExp(`(?:^|\\s)${escapedQuery}`, 'i')

	const partialMatches = suggestions.filter(tag => matchPartial.test(tag.name))

	const preferredSuggestions = []
	const otherSuggestions = []

	partialMatches.map(tag => {
		if (preferredTags.includes(tag.name)) {
			preferredSuggestions.push(tag)
		} else {
			otherSuggestions.push(tag)
		}
	})

	return preferredSuggestions.concat(otherSuggestions)
}

export default class ImageFilters extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			capturedAfter: '',
			capturedBefore: '',
			captureState: '',
			tags: [],
			whichTags: 'all',
			existingTags: [],
			error: null,
			mostRecentAddtime: moment(),
			showInfo: false,
		}

		this.handleCapturedAfterChange = this.handleCapturedAfterChange.bind(this)
		this.handleCapturedBeforeChange = this.handleCapturedBeforeChange.bind(this)
		this.handleCaptureStateChange = this.handleCaptureStateChange.bind(this)
		this.handleTagDelete = this.handleTagDelete.bind(this)
		this.handleTagAdd = this.handleTagAdd.bind(this)
		this.handleWhichTagsChange = this.handleWhichTagsChange.bind(this)
		this.toggleInfo = this.toggleInfo.bind(this)
		this.submitFilters = this.submitFilters.bind(this)

		this.reactTags = React.createRef()
	}

	async componentDidMount() {
		const existingTags = JSON.parse(localStorage.getItem('existingTags'))

		if (!existingTags) {
            const tagsRes = await fetch(`${apiBaseUrl}/tags`)
            const tags = await tagsRes.json()

            const tagsMapped = tags.map(tagRecord => ({
                id: tagRecord.tagID,
                name: tagRecord.tagText
            }))

            localStorage.setItem('existingTags', JSON.stringify(tagsMapped))
            return this.setState({
            	existingTags: tagsMapped,
            })
        }

		this.setState({
			existingTags,
		})
	}

	handleCapturedAfterChange(event) {
		this.setState({
			capturedAfter: event.target.value,
		})
	}

	handleCapturedBeforeChange(event) {
		this.setState({
			capturedBefore: event.target.value,
		})
	}

	handleCaptureStateChange(event) {
		this.setState({
			captureState: event.target.value,
		})
	}

	handleTagAdd(tag) {
		const tags = [].concat(this.state.tags, tag)
		this.setState({
			tags,
			mostRecentAddTime: moment()
		})
	}

	handleTagDelete(index) {
		// prevent erroneous deletes triggered by the same click as an add
		if (moment().diff(this.state.mostRecentAddTime, 'seconds') > 1) {
			const tags = this.state.tags.slice(0)
			tags.splice(index, 1)

			this.setState({
				tags,
			})
		}
	}

	handleWhichTagsChange(event) {
		this.setState({
			whichTags: event.target.value,
		})
	}

	toggleInfo() {
		this.setState({
			showInfo: !this.state.showInfo,
		})
	}

	submitFilters(event) {
		event.preventDefault()

		if (this.state.capturedAfter && this.state.capturedAfter.length
			&& !moment(this.state.capturedAfter, 'YYYY-MM-DD').isValid()) {
			this.setState({ error: 'Dates must be provided in YYYY-MM-DD format' })
			return
		}

		if (this.state.capturedBefore && this.state.capturedBefore.length
			&& !moment(this.state.capturedBefore, 'YYYY-MM-DD').isValid()) {
			this.setState({ error: 'Dates must be provided in YYYY-MM-DD format' })
			return
		}

		this.setState({
			error: null
		})

		this.props.filterImages(this.state)
	}

	render() {
		return (
			<div className={this.props.isOpen ? 'sidebar open' : 'sidebar'}>
				<b>Filter images:</b>
				<br/>
				<br/>
				<form onSubmit={this.submitFilters}>
					<label>
						Captured after date:
						<input type="text" value={this.state.capturedAfter} onChange={this.handleCapturedAfterChange} />
					</label>
					<br/>
					<br/>
					<label>
						Captured before date:
						<input type="text" value={this.state.capturedBefore} onChange={this.handleCapturedBeforeChange} />
					</label>
					<br/>
					<br/>
					<label>
						State/Province:
						<input type="text" value={this.state.captureState} onChange={this.handleCaptureStateChange} />
					</label>
					<br/>
					<br/>
					<label>
						Tags:
						<br/>
						<ReactTags
							ref={this.reactTags}
							tags={this.state.tags}
							suggestions={this.state.existingTags}
							suggestionsTransform={tagSuggestionsTransform}
							onDelete={this.handleTagDelete}
							onAddition={this.handleTagAdd}
							allowNew={false}
							minQueryLength={0}
						/>
					</label>
					<label>
						Must have
						<select onChange={this.handleWhichTagsChange} value={this.state.whichTags}>
							<option value="all">all</option>
							<option value="any">any</option>
						</select>
						of these tags
					</label>
					<br/>
					<br/>
					<input type="submit" value="Apply Filters" onChange={this.submitFilters} />
					<br/>
					{this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
					<img src={infoIcon} onClick={this.toggleInfo} className={this.props.isOpen ? 'info-icon open' : 'info-icon'} />
					{this.state.showInfo && <p>All fields are optional. Dates expected in YYYY-MM-DD format, State/Province in shorthand format (CA, UT, AZ, etc) </p>}
				</form>

				<img src={hamburgerIcon} onClick={this.props.openSidebar} className={this.props.isOpen ? 'sidebar-toggle open' : 'sidebar-toggle'} />
			</div>
		)
	}
}