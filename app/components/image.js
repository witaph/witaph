import React from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom'

class Image extends React.Component {
	constructor(props) {
		super(props)

		this.goToUpdatePage = this.goToUpdatePage.bind(this)
	}

	componentDidMount() {
		if (this.props.isLoaded) {
			this.element.src = this.props.src
		}

		this.observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				const { isIntersecting, intersectionRatio } = entry

				if (isIntersecting) {
					this.props.updateScrollPosition(this.props.idx)
					if (this.observer) {
						this.observer = this.observer.disconnect()
					}
				}
			})
		}, {
			root: null,
			threshold: 0.01,
		})

		this.observer.observe(document.querySelector("#imgWrapper" + this.props.imageID))
	}

	componentDidUpdate(prevProps) {
		if (this.props.isLoaded) {
			if (!this.element.src || this.props.src != prevProps.src) {
				this.element.src = this.props.src
			}
		}

		this.observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				const { isIntersecting, intersectionRatio } = entry

				if (isIntersecting) {
					this.props.updateScrollPosition(this.props.idx)
					if (this.observer) {
						this.observer = this.observer.disconnect()
					}
				}
			})
		}, {
			root: null,
			threshold: 0.01,
		})

		this.observer.observe(document.querySelector("#imgWrapper" + this.props.imageID))
	}

	goToUpdatePage() {
		this.props.navigate(`/images/${this.props.imageID}`)
	}

	render() {
		return (
			<div id={'imgWrapper' + this.props.imageID} style={{minHeight: '400px'}} key={this.props.key}>
				<img
					ref={el => this.element = el}
					style={{maxWidth: '100%', maxHeight:'700px', width: 'auto', height: 'auto'}}
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