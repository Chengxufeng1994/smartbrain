import React, { Component } from 'react';
import './FaceRecognition.css'

class FaceRecognition extends Component {
    render() {
        const { box, imageUrl } = this.props
        return (
            <div className="center ma">
                <div className="absolute mt2">
                    <img
                        id='inputimage'
                        alt="FaceRecognition"
                        src={imageUrl}
                        width="500px"
                        height="auto"
                    />
                    <div
                        className="bounding-box"
                        style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}></div>
                </div>
            </div >
        )
    }
}

export default FaceRecognition;