// React
import React from 'react'
import { connect } from 'react-redux'
import { BeatLoader } from 'react-spinners'

// MDBReact
import { Button, Footer, Container } from 'mdbreact'

// CesiumJs
import Cesium from 'cesium/Cesium'
import Viewer from "cesium/Widgets/Viewer/Viewer";
require('cesium/Widgets/widgets.css')

class Map extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.viewer = new Viewer(this.cesiumContainer);
  }

  render() {
    return (
      <>
        <div>
          <div id="cesiumContainer" ref={element => this.cesiumContainer = element} />
        </div>
      </>
    )
  }
}

export default Map