import React from 'react'
import ReactDOM from 'react-dom'

import '../index.css'
import Image from './image'
import ImageFilters from './imageFilters'
import { apiBaseUrl } from '../constants'

export default class ImageFeed extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            images: [],
            isVerified: false,
            sidebarOpen: false,
        }

        this.handleToggleSidebar = this.handleToggleSidebar.bind(this)
        this.filterImages = this.filterImages.bind(this)
    }

    handleToggleSidebar () {
        this.setState({
            sidebarOpen: !this.state.sidebarOpen,
        })
    }

    async componentDidMount() {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: '{}',
        }

        const imagesRes = await fetch(`${apiBaseUrl}/images`, requestOptions)
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
    }

    async filterImages(filters) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filters),
        }

        console.log('filterImages, filters: ', filters)
        const imagesRes = await fetch(`${apiBaseUrl}/images`, requestOptions)
        console.log('imagesRes: ', imagesRes)
        const images = await imagesRes.json()
        console.log('images: ', images)

        this.setState({
            images,
        })
    }

    render() {
        return (
            <div>
                <ImageFilters
                    isOpen={this.state.sidebarOpen}
                    toggleSidebar={this.handleToggleSidebar}
                    filterImages={this.filterImages}
                />
                <div className={this.state.sidebarOpen ? 'content open' : 'content'} id='container'>
                    {this.state && this.state.images && this.state.images.map(imageData => <Image
                        src={imageData.sourceURL}
                        name={imageData.name}
                        tags={imageData.tags}
                        idx={imageData.imageID}
                        isVerified={this.state.isVerified}
                    />)}
                </div>
            </div>
        )
    }
}