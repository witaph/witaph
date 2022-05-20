import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ImageFeed from './components/imageFeed'
import Login from './components/login'
import NoPage from './components/noPage'
import AddImage from './components/addImage'

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route index element={<ImageFeed />} />
                <Route path="login" element={<Login />} />
                <Route path="addImage" element={<AddImage />} />
                <Route path="*" element={<NoPage />} />
            </Route>
        </Routes>
    </BrowserRouter>,
    document.getElementById('app')
)