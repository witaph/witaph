import React from 'react'
import ReactDOM from 'react-dom'

import '../index.css'
import Image from './image'
import { content } from '../content'
import { apiBaseUrl } from '../constants'

export default class ImageFeed extends React.Component {
    async componentDidMount() {
        const imagesRes = await fetch(`${apiBaseUrl}/images`)
        const images = await imagesRes.json()
        console.log('images: ', images)

        this.setState({
            images,
        })

        if (!localStorage.getItem('existingTags')) {
            const tagsRes = await fetch(`${apiBaseUrl}/tags`)
            const tagsResJson = await tagsRes.json()
            const tags = tagsResJson.tags
            console.log('tags: ', tags)

            localStorage.setItem('existingTags', tags)
        }
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