import React from 'react'
import ReactDOM from 'react-dom'

import '../index.css'
import Image from './image'
import { content } from '../content'
import { apiBaseUrl } from '../constants'

export default class ImageFeed extends React.Component {
    async componentDidMount() {
        const imagesRes = await fetch(`${apiBaseUrl}/images`)
        console.log('imagesRes: ', imagesRes)
        const images = await imagesRes.json()
        console.log('images: ', images)

        const initialState = {
            images,
        }

        const verifyRes = await fetch(`${apiBaseUrl}/verifyLogin`, {
            headers: { 'x-access-token': localStorage.getItem('token') }
        })
        console.log('verifyLogin response: ', verifyRes)
        if (verifyRes.status == 200) {
            initialState.isVerified = true
        }

        this.setState(initialState)

        if (!localStorage.getItem('existingTags')) {
            const tagsRes = await fetch(`${apiBaseUrl}/tags`)
            console.log('tagsRes: ', tagsRes)
            const tags = await tagsRes.json()
            console.log('tags: ', tags)

            const tagsMapped = tags.map(tagRecord => ({
                id: tagRecord.tagID,
                name: tagRecord.tagText
            }))

            localStorage.setItem('existingTags', JSON.stringify(tagsMapped))
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
                    isVerified={this.state.isVerified}
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