'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import MapViewCore from './MapViewCore.jsx'

const mapStateToProps = (state, props) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

/**
 * MapView Class for rendering the map view
 * @class
 */
class MapView extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    window.scroll({
      top: 175,
      left: 0,
      behavior: 'smooth'
    })
  }

  render () {
    return (
      <>
        <MapViewCore fullView height="550px" />
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView)
