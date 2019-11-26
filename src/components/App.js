import React, { Component } from 'react';
import Clarifai from 'clarifai'
import Particles from 'react-particles-js';
import Navigation from './Navigation/Navigation';
import Logo from './Logo/Logo';
import Rank from './Rank/Rank';
import ImageLinkForm from './ImageLinkForm/ImageLinkForm';
import FaceRecognition from './FaceRecognition/FaceRecognition';
import SignIn from './SignIn/SignIn'
import Register from './Register/Register'
import './App.css';

const particlesOptions = {
    particles: {
        number: {
            value: 300,
            density: {
                enable: true,
                value_area: 800
            }
        },
    },
}

const app = new Clarifai.App({
    apiKey: '1cb617479d8b457b92e624d7f77818c4'
})

class App extends Component {
    constructor() {
        super()
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn: false,
        }
    }

    calculateFaceLocation = (data) => {
        console.log(data.outputs[0].data.regions[0].region_info.bounding_box)
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
        const image = document.getElementById("inputimage")
        const width = Number(image.width)
        const height = Number(image.height)
        return {
            bottomRow: height - (clarifaiFace.bottom_row * height),
            leftCol: clarifaiFace.left_col * width,
            rightCol: width - (clarifaiFace.right_col * width),
            topRow: clarifaiFace.top_row * height
        }
    }

    displayFaceBox = (box) => {
        console.log(box)
        this.setState({ box: box })
    }

    onInputChange = (event) => {
        console.log(event.target.value);
        this.setState({ input: event.target.value })
    }

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input })
        app.models.predict(
            Clarifai.FACE_DETECT_MODEL,
            this.state.input)
            .then((response) => this.displayFaceBox(this.calculateFaceLocation(response)))
            .catch(err => console.log(err));
        // console.log(response.outputs[0].data.regions[0].region_info.bounding_box)
        // do something with response
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState({ isSignedIn: false })
        } else if (route === 'home') {
            this.setState({ isSignedIn: true })
        }
        this.setState({ route: route })
    }

    render() {
        const { isSignedIn, imageUrl, route, box } = this.state
        return (
            <div className="App">
                <Particles
                    className='particles'
                    params={particlesOptions}
                />
                <Navigation
                    isSignedIn={isSignedIn}
                    onRouteChange={this.onRouteChange}
                />
                {route === 'home'
                    ? <div>
                        <Logo />
                        <Rank />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}
                        />
                        <FaceRecognition
                            box={box}
                            imageUrl={imageUrl}
                        />
                    </div>
                    : (
                        route === 'signin'
                            ? < SignIn onRouteChange={this.onRouteChange} />
                            : < Register onRouteChange={this.onRouteChange} />
                    )
                }
            </div>
        )
    }
}

export default App;

// https://i2-prod.mirror.co.uk/incoming/article14334083.ece/ALTERNATES/s615/3_Beautiful-girl-with-a-gentle-smile.jpg