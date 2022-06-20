import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { version } from '../package.json'
import CacheBuster from 'react-cache-buster'

import ImageFeed from './components/imageFeed'
import Login from './components/login'
import NoPage from './components/noPage'
import AddImage from './components/addImage'
import UpdateImage from './components/updateImage'

class App extends React.Component {
    render () {
        return (
            <CacheBuster
                currentVersion={version}
                isEnabled={true}
                isVerboseMode={true}
            >
                <BrowserRouter>
                    <Routes>
                        <Route path="/">
                            <Route index element={<ImageFeed />} />
                            <Route path="login" element={<Login />} />
                            <Route path="addImage" element={<AddImage />} />
                            <Route path="images/:imageID" element={<UpdateImage />} />
                            <Route path="*" element={<NoPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CacheBuster>
        )
    }
}

export default App