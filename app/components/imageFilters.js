import React from 'react'
import Autocomplete from "@mui/material/Autocomplete"
import { TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
			capturedAfter: null,
			capturedBefore: null,
			captureState: '',
			tags: [],
			whichTags: 'all',
			existingTags: [],
			showInfo: false,
		}

		this.handleCaptureStateChange = this.handleCaptureStateChange.bind(this)
		this.handleTagsChange = this.handleTagsChange.bind(this)
		this.handleWhichTagsChange = this.handleWhichTagsChange.bind(this)
		this.toggleInfo = this.toggleInfo.bind(this)
		this.submitFilters = this.submitFilters.bind(this)
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

	handleCaptureStateChange(event) {
		this.setState({
			captureState: event.target.value,
		})
	}

	handleTagsChange(tags) {
		this.setState({ tags })
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

		const {
			capturedAfter,
			capturedBefore,
			captureState,
			tags,
		} = this.state

		this.props.filterImages({
			capturedAfter,
			capturedBefore,
			captureState,
			tags,
		})
	}

	render() {
		return (
			<div className={this.props.isOpen ? 'sidebar open' : 'sidebar'}>
				<b>Filter images:</b>
				<br/>
				<br/>
				<form onSubmit={this.submitFilters}>
					<LocalizationProvider dateAdapter={AdapterMoment}>
						<DatePicker
							label="Captured after date"
							value={this.state.capturedAfter}
							onChange={(newValue) => {
								this.setState({ capturedAfter: newValue })
							}}
						/>
						<br/>
						<br/>
						<DatePicker
							label="Captured before date"
							value={this.state.capturedBefore}
							onChange={(newValue) => {
								this.setState({ capturedBefore: newValue })
							}}
						/>
					</LocalizationProvider>
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
						<Autocomplete
							multiple
							id="tags"
							options={this.state.existingTags}
							getOptionLabel={(option) => option.name}
							renderInput={(params) => <TextField {...params} placeholder="Add tags" />}
							onChange={(event, value) => this.handleTagsChange(value)}
						/>	
					</label>
					<label>
						Must have&nbsp;
						<select onChange={this.handleWhichTagsChange} value={this.state.whichTags}>
							<option value="all">all</option>
							<option value="any">any</option>
						</select>
						&nbsp;of these tags
					</label>
					<br/>
					<br/>
					<input type="submit" value="Apply Filters" onChange={this.submitFilters} />
				</form>
				<br/>
				<img src={infoIcon} onClick={this.toggleInfo} className={this.props.isOpen ? 'info-icon open' : 'info-icon'} />
				{this.state.showInfo && <p>All fields are optional. State/Province in shorthand format (CA, UT, AZ, etc) </p>}

				<img src={hamburgerIcon} onClick={this.props.openSidebar} className={this.props.isOpen ? 'sidebar-toggle open' : 'sidebar-toggle'} />
			</div>
		)
	}
}