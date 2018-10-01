import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import Clarifai from 'clarifai';

// initialize with your api key. This will also work in your browser via http://browserify.org/

const app = new Clarifai.App({
  apiKey: '58ed09afad2d4868aab4e192c20a3745'
});

const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchField: '',
      imageURL: '',
      box: {}
    };
  }

  calculateFaceLocation = data => {
    const clarifyFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifyFace.left_col * width,
      topRow: clarifyFace.top_row * height,
      rightCol: width - clarifyFace.right_col * width,
      bottomRow: height - clarifyFace.bottom_row * height
    };
  };

  displayFaceBox = box => {
    console.log('Box: ', box);
    this.setState({ box: box });
  };

  onInputChange = event => {
    console.log(event.target.value);
    this.setState({ searchField: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.searchField });
    console.log('Button Pressed');

    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.searchField)
      .then(response => {
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition box={this.state.box} imageURL={this.state.imageURL} />
      </div>
    );
  }
}

export default App;
