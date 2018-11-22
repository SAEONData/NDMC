'use strict'

import React from 'react'
import { Card, CardBody, CardText, CardTitle, Button, Fa } from 'mdbreact'
import { connect } from 'react-redux'
import { DEAGreen, DEAGreenDark } from '../../../config/colours.cfg'

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
    const { region: { RegionName }, startdate, enddate, hazardtype } = this.props
    return (
      <>
        <CardBody>

          <CardTitle>Disaster at {RegionName} </CardTitle>

          <CardText>
            {startdate ? `Date: ${startdate} until ${enddate}` : ''} <br />
            {hazardtype ? `Type: ${hazardtype}` : ' '}
          </CardText>

          {/* <Button
            color='primary'
            className='btn-sm'
            onClick={this.onTouchTap.bind(this)}
            style={{ marginLeft: "0px" }}
          >
            View
          </Button> */}

                    <Button
            size="sm"
            color="white"
            onClick={this.onTouchTap.bind(this)}
            style={{
              backgroundColor: "white",
              marginLeft: "0px",
              boxShadow: "none",
              border: "1px solid silver",
              borderRadius: "5px",
              padding: "3px 15px 3px 15px"
            }}
          >
            <table>
              <tbody>
                <tr>
                  <td valign="middle">
                    <Fa icon="eye" size="lg" style={{ color: DEAGreen, marginRight: "5px" }} />
                  </td>
                  <td valign="middle">
                    <div style={{ fontSize: "14px", marginTop: "2px" }} >
                      View
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Button>

        </CardBody>
        
        <hr style={{ margin: "0px 0px 15px 0px" }} />
      </>
    )
  }
}

//export default EventCard
export default connect(mapStateToProps, mapDispatchToProps)(EventCard)