import React from 'react'
import ReactDOM from 'react-dom'
import ReactTags from 'react-tag-autocomplete'
import moment from 'moment'

import { apiBaseUrl } from '../constants'
import hamburgerIcon from '../img/Hamburger_icon.png'

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
			mostRecentAddtime: moment()
		}

		this.handleCapturedAfterChange = this.handleCapturedAfterChange.bind(this)
		this.handleCapturedBeforeChange = this.handleCapturedBeforeChange.bind(this)
		this.handleCaptureStateChange = this.handleCaptureStateChange.bind(this)
		this.handleTagDelete = this.handleTagDelete.bind(this)
		this.handleTagAdd = this.handleTagAdd.bind(this)
		this.handleWhichTagsChange = this.handleWhichTagsChange.bind(this)
		this.submitFilters = this.submitFilters.bind(this)

		this.reactTags = React.createRef()
	}

	async componentDidMount() {
		const existingTags = JSON.parse(localStorage.getItem('existingTags'))
		console.log('ImageFilters localStorage.getItem(existingTags): ', existingTags)

		if (!existingTags) {
            const tagsRes = await fetch(`${apiBaseUrl}/tags`)
            console.log('tagsRes: ', tagsRes)
            const tags = await tagsRes.json()
            console.log('tags: ', tags)

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
		console.log('handleTagAdd, tag: ', tag)
		const tags = [].concat(this.state.tags, tag)
		console.log('current tags: ', tags)
		this.setState({
			tags,
			mostRecentAddTime: moment()
		})
	}

	handleTagDelete(index) {
		console.log('handleTagDelete, index: ', index)
		console.log('this.state.mostRecentAddTime: ', moment(this.state.mostRecentAddTime).format())
		if (moment().diff(this.state.mostRecentAddTime, 'seconds') > 1) {
			const tags = this.state.tags.slice(0)
			tags.splice(index, 1)
			console.log('current tags: ', tags)
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

	submitFilters(event) {
		event.preventDefault()
		console.log('submitFilters, this.state: ', this.state)

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
				</form>

				<img src={hamburgerIcon} onClick={this.props.openSidebar} className={this.props.isOpen ? 'sidebar-toggle open' : 'sidebar-toggle'} />
			</div>
		)
	}
}