'use strict'

import React from 'react'
import { Card, CardBody, CardText, CardTitle, Button } from 'mdbreact'
import { connect } from 'react-redux'
import * as ACTION_TYPES from "../../../constants/action-types"

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
    super(props);
  }

  onTouchTap() {
    this.props.setScrollPos(window.pageYOffset)
    location.hash = "/events/" + this.props.eid
  }

  render() {
    return (
      <>
        <Card>
          <CardBody>
            <CardTitle>{this.props.hazardtype} : {this.props.region} : {this.props.startdate}-{this.props.enddate}</CardTitle>
            <CardText></CardText>
            <Button color="primary" className="btn-sm" onTouchTap={this.onTouchTap.bind(this)}>View</Button>
          </CardBody>
        </Card>
        <br />
      </>
    )
  }
}

//export default ProjectCard
export default connect(mapStateToProps, mapDispatchToProps)(EventCard)