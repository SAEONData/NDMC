'use strict'

import React from 'react'
//import EventGraphFilters from './EventGraphFilters.jsx'
import { connect } from 'react-redux'
import { BeatLoader } from 'react-spinners'
import { Button, Footer, Container } from 'mdbreact'
import * as ACTION_TYPES from '../../../constants/action-types'

const queryString = require('query-string')

const mapStateToProps = (state, props) => {
  return {  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

class EventGraph extends React.Component {
  render() {
    return (
      <>
        <div className='container-fluid'>
          <div className='row'>
          </div>
        </div>
        <div style={{ position: 'fixed', right: '14%', bottom: '10px', zIndex: '99' }}>
        </div>
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(EventGraph)