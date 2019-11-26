import React, { Component } from 'react';
import './ImageLinkForm.css';

class ImageLinkForm extends Component {
    render() {
        const { onInputChange, onButtonSubmit } = this.props
        return (
            <div>
                <p className='f3'>
                    {'This Magic Brain will derect faces in your pictures. Git it a try.'}
                </p>
                <div className='center'>
                    <div className='form center pa4 br3 shadow-5'>
                        <input
                            className='f4 pa2 w-70 center'
                            type="text"
                            onChange={onInputChange}
                        />
                        <button
                            className='f4 w-30 grow link ph3 pv2 dib white bg-light-purple'
                            onClick={onButtonSubmit}
                        >
                            Detect
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ImageLinkForm;