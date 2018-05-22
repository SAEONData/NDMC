'use strict'

import React from 'react'
import { Card, CardBody, CardText, CardTitle, Button } from 'mdbreact'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../../../constants/action-types'

const mapStateToProps = (state, props) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScrollPos: payload => {
      dispatch({ type: ACTION_TYPES.SET_EVENT_SCROLL, payload })
    }
  }
}

class EventCard extends React.Component {
  constructor(props) {
    super(props)
  }

  onTouchTap() {
    this.props.setScrollPos(window.pageYOffset)
    location.hash = '/events/' + this.props.eid
  }

  render() {
    const { region: { RegionName }, startdate, enddate, hazardtype } = this.props
    return (
      <>
        <Card>
          <CardBody>
            <CardTitle>Disaster at {this.props.region.RegionName} </CardTitle>
            <CardText>
              {startdate ? `Date: ${startdate} until ${enddate}` : ''} <br />
              {hazardtype ? `Type: ${hazardtype}` : ' '}
            </CardText>
            <Button color='primary' className='btn-sm' onTouchTap={this.onTouchTap.bind(this)}>View</Button>
          </CardBody>
        </Card>
        <br />
      </>
    )
  }
}

//export default EventCard
export default connect(mapStateToProps, mapDispatchToProps)(EventCard)