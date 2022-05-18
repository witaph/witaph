import React from 'react'
import ReactDOM from 'react-dom'
import '../index.css'
import Image from './image'
import { content } from '../content'

				// <Image
				// 	src=''
				// 	name=''
				// 	tags={['']}
                //  idx={0}
				// />

export default class ImageFeed extends React.Component {
    componentDidMount() {
        // console.log('ImageFeed.componentDidMount')
        fetch("http://witaph.com/api/images")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log('/images result: ', result)
                    this.setState({
                        images: result,
                    })
                },
                (error) => {
                    console.log('/images error: ', error)
                }
            )
    }

    render() {
        // console.log('render, this.state: ', this.state)
        return (
            <div id='container'>
                {this.state && this.state.images && this.state.images.map(imageData => <Image
                    src={imageData.sourceURL}
                    name={imageData.name}
                    tags={imageData.tags}
                    idx={imageData.imageID}
                />)}
                {content.map(imageData => <Image
                    src={imageData.src}
                    name={imageData.name}
                    tags={imageData.tags}
                    idx={imageData.idx}
                />)}
            </div>
        )
    }
}