//React
import React from 'react'
import { connect } from 'react-redux'
import { BeatLoader } from 'react-spinners'

//Local
import EventList from './EventList.jsx'
import EventFilters from '../Filters/EventFilters.jsx'
import * as ACTION_TYPES from '../../../constants/action-types'

//MDBReact
import { Button, Footer, Container } from 'mdbreact'


const queryString = require('query-string')

const mapStateToProps = (state, props) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

class Events extends React.Component {

  constructor(props) {
    super(props)
    this.backToTop = this.backToTop.bind(this)
  }

  backToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  componentWillMount() {
  }

  render() {
    return (
      <>
        <div style={{ position: 'fixed', right: '14%', bottom: '10px', zIndex: '99' }}>
          <Button color='secondary' className='btn-sm' onClick={this.backToTop} >
            <i className='fa fa-arrow-circle-up' aria-hidden='true' />
            &nbsp;&nbsp;
            Back to top
          </Button>
        </div>
        <EventFilters />
        <EventList />
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Events)