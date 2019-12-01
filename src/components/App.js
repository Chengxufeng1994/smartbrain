import React, { Component } from 'react';
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

const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}
class App extends Component {
    constructor() {
        super()
        this.state = initialState
    }
    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
            }
        })
    }

    componentDidMount() {
        fetch('http://localhost:3000')
            .then(res => res.json())
            .then(console.log)
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
        this.setState({ imageUrl: this.state.input });
        fetch('https://intense-waters-66144.herokuapp.com/imagesurl', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: this.state.input
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res) {
                    fetch('https://intense-waters-66144.herokuapp.com/images', {
                        method: 'put',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    })
                        .then(res => res.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user, { entries: count }))
                        })
                        .catch(console.log)
                }
                this.displayFaceBox(this.calculateFaceLocation(res))
            })
            .catch(err => console.log(err));
        // console.log(response.outputs[0].data.regions[0].region_info.bounding_box)
        // do something with response
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState(initialState)
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
                        <Rank
                            name={this.state.user.name}
                            entries={this.state.user.entries} />
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
                            ? < SignIn
                                loadUser={this.loadUser}
                                onRouteChange={this.onRouteChange} />
                            : < Register
                                onRouteChange={this.onRouteChange}
                                loadUser={this.loadUser} />
                    )
                }
            </div>
        )
    }
}

export default App;

// https://i2-prod.mirror.co.uk/incoming/article14334083.ece/ALTERNATES/s615/3_Beautiful-girl-with-a-gentle-smile.jpg