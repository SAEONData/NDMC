'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import TextComponent from '../../Shared/TextComponent.jsx'
import RangeComponent from '../../Shared/RangeComponent.jsx'
import OData from 'react-odata'
import { apiBaseURL } from '../../../config/serviceURLs.js'
import { vmsBaseURL } from '../../../config/serviceURLs.js'
import { CustomFetch } from '../../../globalFunctions.js';


const mapStateToProps = (state, props) => {
  return {}
}

/**
 * EventDetailsTab Class for details tab of individual events
 * @class
 */
class EventDetailsTab extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      eventData: {},
      regionId: '',
      regionName: '',
      hazardId: '',
      hazardName: ''
    }

    this.getRegion = this.getRegion.bind(this)
    this.getHazard = this.getHazard.bind(this)
  }

  /**
   * Get's the details of a single region for display purposes
   *
   * @async
   * @function
   */
  async getRegion () {
    let fetchURL = `${vmsBaseURL}/regions/${this.state.regionId}`
    CustomFetch(fetchURL)
      .then(res => {
        return res.json()
      })
      .then(json => {
        this.setState({
          regionName: json.value
        })
      })
  }

  /**
   * Get's the details of a single hazard for display purposes
   *
   * @async
   * @function
   */
  async getHazard () {
    let fetchURL = `${vmsBaseURL}/hazards/${this.state.hazardId}`
    CustomFetch(fetchURL)
      .then(res => {
        return res.json()
      })
      .then(json => {
        this.setState({
          hazardName: json.value
        })
      })
  }

  render () {
    const { eventId } = this.props
    let eventQuery = {
      select: ['StartDate', 'EndDate', 'TypeEventId'],
      filter: {
        EventId: parseInt(eventId),
      },
      expand: ['EventRegions/EventImpacts/TypeImpact',
        'DeclaredEvents']
    }

    if (!this.state.regionName) {
      this.getRegion()
    }

    if (!this.state.hazardName) {
      this.getHazard()
    }

    return (
      <>
        <div style={{
          backgroundColor: "white",
          borderBottom: "1px solid silver",
          borderLeft: "1px solid silver",
          borderRight: "1px solid silver",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          padding: "10px",
          marginTop: "-10px"
        }}>
          <OData baseUrl={apiBaseURL + 'Events'} query={eventQuery}>
            {({ loading, error, data }) => {
              if (loading) { return <div>Loading...</div> }
              if (error) { { console.log(error) } return <div>Error Loading Data From Server</div> }
              if (data && data.value) {
                let regionId = data.value[0].EventRegions[0].RegionId
                this.state.regionId = regionId

                let hazardId = data.value[0].TypeEventId
                this.state.hazardId = hazardId

                const event = data.value[0]
                let startdate = event.StartDate > 0 ? new Date(event.StartDate * 1000) : 'N/A'
                let enddate = event.EndDate > 0 ? new Date(event.EndDate * 1000) : 'N/A'

                let declareddate = event.DeclaredEvents[0].DeclaredDate !== null ?
                  new Date(event.DeclaredEvents[0].DeclaredDate * 1000) : null

                return (<>
                  <br />
                  <div className='row'>
                    <TextComponent
                      labelStyle={{ fontSize: "24px", fontWeight: '300', }}
                      col='col-md-6'
                      label='Hazard Type'
                      id='txtHazardType'
                      value={this.state.hazardName}
                      allowEdit={false}
                    />
                  </div>
                  <div className='row'>
                    <TextComponent
                      labelStyle={{ fontSize: "24px", fontWeight: '300', }}
                      col='col-md-6'
                      label='Region'
                      id='txtEventRegion'
                      value={this.state.regionName ? this.state.regionName : 'N/A'}
                      allowEdit={false}
                    />
                  </div>
                  <div className='row'>
                    <RangeComponent
                      labelStyle={{ fontSize: "24px", fontWeight: '300', }}
                      col='col-md-8'
                      label='Date'
                      id='txtEventDate'
                      inputWidth='100px'
                      valueFrom={startdate !== 'N/A' ? `${startdate.getFullYear()}\/${startdate.getMonth() + 1}\/${startdate.getDate()}` : startdate}
                      valueTo={enddate !== 'N/A' ? `${enddate.getFullYear()}\/${enddate.getMonth() + 1}\/${enddate.getDate()}` : enddate}
                      allowEdit={false}
                    />
                  </div>
                  <div className='row' style={{ marginTop: "8px" }}>
                    <TextComponent
                      labelStyle={{ fontSize: "24px", fontWeight: '300', }}
                      col='col-md-4'
                      label='Declared Date'
                      id='txtDeclaredDate'
                      value={declareddate ? declareddate.toDateString() : 'No declared date available'}
                      allowEdit={false}
                    />
                  </div>
                  <br />
                </>)
              }
            }}
          </OData>
        </div>
      </>
    )
  }
}

export default connect(mapStateToProps)(EventDetailsTab)
