import React from 'react'
import ReactDOM from 'react-dom'

import '../index.css'
import Image from './image'
import { content } from '../content'
import { apiBaseUrl } from '../constants'

export default class ImageFeed extends React.Component {
    componentDidMount() {
        fetch(`${apiBaseUrl}/images`)
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