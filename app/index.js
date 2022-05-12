import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Image from './components/image'
import { content } from './content'

				// <Image
				// 	src=''
				// 	name=''
				// 	tags={['']}
                //  idx={0}
				// />

class App extends React.Component {
    componentDidMount() {
        // fetch
    }

    render() { 
        return (
            <div id='container'>
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

ReactDOM.render(<App />, document.getElementById('app'))