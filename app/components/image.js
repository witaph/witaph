import React from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom'

class Image extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loadedSource: null,
		}

		this.goToUpdatePage = this.goToUpdatePage.bind(this)
	}

	componentDidMount() {
		if (this.props.isLoaded) {
			this.element.src = this.props.src
			this.setState({ loadedSource: this.props.src })
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
			if (!this.element.src || this.props.src != this.state.loadedSource) {
				this.element.src = this.props.src
				this.setState({ loadedSource: this.props.src })
			}
		}
	}

	goToUpdatePage() {
		this.props.navigate(`/images/${this.props.imageID}`)
	}

	render() {
		return (
			<div className="img-wrapper" id={'imgWrapper' + this.props.imageID} key={this.props.key}>
				<img
					className="feed-image"
					ref={el => this.element = el}
					onClick={this.props.isVerified ? this.goToUpdatePage : undefined}
					key={this.props.key}
				/>
			</div>
		)
	}
}

const WithNavigate = (props) => {
	let navigate = useNavigate()
	return <Image {...props} navigate={navigate} />
}

export default WithNavigate