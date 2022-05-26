import React from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom'

class Image extends React.Component {
	constructor(props) {
		super(props)

		this.goToUpdatePage = this.goToUpdatePage.bind(this)
	}

	componentDidMount() {
		this.observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				const { isIntersecting, intersectionRatio } = entry

				if (isIntersecting) {
					this.element.src = this.props.src
					if (this.observer) {
						this.observer = this.observer.disconnect()
					}
				}
			})
		}, {
			root: null,
			threshold: 0.1,
		})

		this.observer.observe(document.querySelector("#imgWrapper" + this.props.idx))
	}

	componentDidUpdate() {
		this.observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				const { isIntersecting, intersectionRatio } = entry

				if (isIntersecting) {
					this.element.src = this.props.src
					if (this.observer) {
						this.observer = this.observer.disconnect()
					}
				}
			})
		}, {
			root: null,
			threshold: 0.1,
		})

		this.observer.observe(document.querySelector("#imgWrapper" + this.props.idx))
	}

	goToUpdatePage() {
		this.props.navigate(`/images/${this.props.idx}`)
	}

	render() {
		return (
			<div id={'imgWrapper' + this.props.idx} style={{minHeight: '400px'}}>
				<img ref={el => this.element = el} style={{maxWidth: '100%', maxHeight:'700px', width: 'auto', height: 'auto'}} onClick={this.props.isVerified ? this.goToUpdatePage : undefined}/>
			</div>
		)
	}
}

const WithNavigate = (props) => {
	let navigate = useNavigate()
	return <Image {...props} navigate={navigate} />
}

export default WithNavigate