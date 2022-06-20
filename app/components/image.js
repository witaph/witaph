import React from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom'

class Image extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loadedSource: null,
			isHovered: false,
		}

		this.goToUpdatePage = this.goToUpdatePage.bind(this)
		this.mouseEnter = this.mouseEnter.bind(this)
		this.mouseLeave = this.mouseLeave.bind(this)
	}

	componentDidMount() {
		if (this.props.isLoaded) {
			this.element.src = this.props.sourceURL
			this.setState({ loadedSource: this.props.sourceURL })
		}

		this.observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				const { isIntersecting, intersectionRatio } = entry

				if (isIntersecting) {
					this.props.updateScrollPosition(this.props.idx)
				}
			})
		}, {
			root: null,
			threshold: 0.01,
		})

		this.observer.observe(document.querySelector("#imgWrapper" + this.props.imageID))
	}

	componentDidUpdate() {
		if (this.props.isLoaded) {
			if (!this.element.src || this.props.sourceURL != this.state.loadedSource) {
				this.element.src = this.props.sourceURL
				this.setState({ loadedSource: this.props.sourceURL })
			}
		}
	}

	mouseEnter() {
		this.setState({ isHovered: true })
	}

	mouseLeave() {
		this.setState({ isHovered: false })
	}

	goToUpdatePage() {
		this.props.navigate(`/images/${this.props.imageID}`)
	}

	render() {
		return (
			<div className="wrapper-wrapper">
				<div className="img-wrapper" id={'imgWrapper' + this.props.imageID} key={this.props.key}>
					<img
						className="feed-image"
						ref={el => this.element = el}
						onClick={this.props.isVerified ? this.goToUpdatePage : undefined}
						key={this.props.key}
						onMouseEnter={this.mouseEnter}
						onMouseLeave={this.mouseLeave}
					/>
					<div className="image-text">
						{this.state.isHovered && <p>{this.props.state}, {this.props.country}</p>}
						{this.state.isHovered && <p>Tags: {this.props.tags && this.props.tags.map((tag, tagIndex) =>
							tagIndex === 0 ? `${tag}` : `, ${tag}`
						)
						}</p>}
					</div>
				</div>
			</div>
		)
	}
}

const WithNavigate = (props) => {
	let navigate = useNavigate()
	return <Image {...props} navigate={navigate} />
}

export default WithNavigate