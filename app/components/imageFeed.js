import React from 'react'

import '../index.css'
import Image from './image'
import ImageFilters from './imageFilters'
import { apiBaseUrl } from '../constants'

const preloadBatchSize = 10
const preloadLeadCount = 5

const setIsLoaded = (imagesPreload, startIndex, loadBefore, loadAfter) => {
    const images = [...imagesPreload]
    if (!images.length) {
        return images
    }
    
    images[startIndex].isLoaded = true

    if (loadBefore) {
        let count = 0
        let index = startIndex - 1
        while (index >= 0 && count < preloadBatchSize) {
            images[index].isLoaded = true
            count++
            index--
        }
    }

    if (loadAfter) {
        let count = 0
        let index = startIndex + 1
        while (index < images.length && count < preloadBatchSize) {
            images[index].isLoaded = true
            count++
            index++
        }
    }

    return images
}

export default class ImageFeed extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            images: [],
            isVerified: false,
            sidebarOpen: false,
            scrollPosition: 0,
        }

        this.openSidebar = this.openSidebar.bind(this)
        this.closeSidebar = this.closeSidebar.bind(this)
        this.filterImages = this.filterImages.bind(this)
        this.updateScrollPosition = this.updateScrollPosition.bind(this)
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
        const images = await imagesRes.json()

        const initialState = {
            images: setIsLoaded(images, 0, false, true),
        }

        const verifyRes = await fetch(`${apiBaseUrl}/verifyLogin`, {
            headers: { 'x-access-token': localStorage.getItem('token') }
        })
        const verifyJson = await verifyRes.json()

        if (verifyJson.success) {
            initialState.isVerified = true
        }

        this.setState(initialState)
    }

    openSidebar() {
        this.setState({
            sidebarOpen: !this.state.sidebarOpen,
        })
    }

    closeSidebar() {
        this.setState({
            sidebarOpen: false,
        })
    }

    async filterImages(filters) {
        const { capturedAfter, capturedBefore, captureState, tags, whichTags } = filters

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                capturedAfter: capturedAfter ? capturedAfter.format('YYYY-MM-DD') : '',
                capturedBefore: capturedBefore ? capturedBefore.format('YYYY-MM-DD') : '',
                captureState,
                tags,
                whichTags,
            }),
        }

        const imagesRes = await fetch(`${apiBaseUrl}/images`, requestOptions)
        const images = await imagesRes.json()

        const scrollPosition = this.state.scrollPosition >= images.length
            ? Math.max(images.length - 1, 0)
            : this.state.scrollPosition

        this.setState({
            images: setIsLoaded(images, scrollPosition, true, true),
            scrollPosition,
        })
    }

    updateScrollPosition(imagesIndex) {
        // nothing to be done if index is out of bounds
        if (imagesIndex >= this.state.images.length) {
            return
        }

        // when scroll position increases by at least preloadLeadCount, load next images
        if (imagesIndex >= this.state.scrollPosition + preloadLeadCount) {
            this.setState({
                images: setIsLoaded(this.state.images, imagesIndex, false, true),
                scrollPosition: imagesIndex,
            })
        }

        // when scroll position decreases by at least preloadLeadCount, load previous images
        if (imagesIndex <= this.state.scrollPosition - preloadLeadCount) {
            this.setState({
                images: setIsLoaded(this.state.images, imagesIndex, true, false),
                scrollPosition: imagesIndex,
            })
        }
    }

    render() {
        return (
            <div>
                <ImageFilters
                    isOpen={this.state.sidebarOpen}
                    openSidebar={this.openSidebar}
                    filterImages={this.filterImages}
                />
                <div className={this.state.sidebarOpen ? 'content open' : 'content'} id='container' onClick={this.closeSidebar}>
                    {this.state && this.state.images && this.state.images.map((imageData, imagesIndex) => <Image
                        idx={imagesIndex}
                        isVerified={this.state.isVerified}
                        updateScrollPosition={this.updateScrollPosition}
                        key={imagesIndex}
                        { ...imageData }
                    />)}
                </div>
            </div>
        )
    }
}