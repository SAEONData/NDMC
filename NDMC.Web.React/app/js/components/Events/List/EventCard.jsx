'use strict'

import React from 'react'
import { Card, CardBody, CardText, CardTitle, Button } from 'mdbreact'
import { connect } from 'react-redux'

const mapStateToProps = (state, props) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

class EventCard extends React.Component {
  constructor(props) {
    super(props)
  }

  onTouchTap() {
    location.hash = '/events/' + this.props.eid
  }

  render() {
    const { region: { regionName }, startdate, enddate, hazardtype } = this.props
    return (
      <>
        <Card>
          <CardBody>
            <CardTitle>Disaster at {regionName} </CardTitle>
            <CardText>
              {startdate ? `Date: ${startdate} until ${enddate}` : ''} <br />
              {hazardtype ? `Type: ${hazardtype}` : ' '}
            </CardText>
            <Button color='primary' className='btn-sm' onClick={this.onTouchTap.bind(this)}>View</Button>
          </CardBody>
        </Card>
        <br />
      </>
    )
  }
}

//export default EventCard
export default connect(mapStateToProps, mapDispatchToProps)(EventCard)