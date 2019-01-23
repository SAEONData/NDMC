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
import { apiBaseURL } from '../../../config/serviceURLs.cfg'

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
      eventData: {}
    }
  }

  render () {
    const { eventId } = this.props
    let impactQuery = {
      select: ['StartDate', 'EndDate'],
      filter: {
        EventId: parseInt(eventId),
      },
      expand: ['EventRegions/EventImpacts/TypeImpact',
        {
          EventRegions:
          {
            filter: { Region: { RegionTypeId: { ne: 5 } } },
            expand: ['Region']
          }
        },
        'DeclaredEvents',
        'TypeEvent']
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
          <OData baseUrl={apiBaseURL + 'Events'} query={impactQuery}>
            {({ loading, error, data }) => {
              if (loading) { return <div>Loading...</div> }
              if (error) { return <div>Error Loading Data From Server</div> }
              if (data && data.value) {
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
                      value={event.TypeEvent.TypeEventName || ''}
                      allowEdit={false}
                    />
                  </div>
                  <div className='row'>
                    <TextComponent
                      labelStyle={{ fontSize: "24px", fontWeight: '300', }}
                      col='col-md-6'
                      label='Region'
                      id='txtEventRegion'
                      value={event.EventRegions[0] ? event.EventRegions[0].Region.RegionName : ''}
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
                      valueFrom={ startdate !== 'N/A' ?`${startdate.getFullYear()}\/${startdate.getMonth() + 1}\/${startdate.getDate()}` : startdate}
                      valueTo={ enddate !== 'N/A' ? `${enddate.getFullYear()}\/${enddate.getMonth() + 1}\/${enddate.getDate()}` : enddate}
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
