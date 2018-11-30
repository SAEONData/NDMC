'use strict'

//React
import React from 'react'
import { Button, Input } from 'mdbreact'
import { connect } from 'react-redux'

//Local
import TextComponent from '../../Shared/TextComponent.jsx'
import TextAreaComponent from '../../Shared/TextAreaComponent.jsx'
import RangeComponent from '../../Shared/RangeComponent.jsx'

//Odata
import OData from 'react-odata'
import { apiBaseURL } from '../../../config/serviceURLs.cfg'

const mapStateToProps = (state, props) => {
  return {}
}

class EventDetailsTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      eventData: {}
    }
  }

  render() {
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
                let startdate = new Date(event.StartDate * 1000)
                let enddate = new Date(event.EndDate * 1000)
                let declareddate = new Date(event.DeclaredEvents[0].DeclaredDate * 1000)
                return (<>
                  <br />
                  <div className='row'>
                    <TextComponent
                      col='col-md-4'
                      label='Hazard Type:'
                      id='txtHazardType'
                      value={event.TypeEvent.TypeEventName || ''}
                      allowEdit={false}
                    />
                    <TextComponent
                      col='col-md-4'
                      label='Region:'
                      id='txtEventRegion'
                      value={event.EventRegions[0] ? event.EventRegions[0].Region.RegionName : ''}
                      allowEdit={false}
                    />
                  </div>
                  <div className='row'>
                    <RangeComponent
                      col='col-md-8'
                      label='Date'
                      id='txtEventDate'
                      inputWidth='100px'
                      valueFrom={`${startdate.getFullYear()}\/${startdate.getMonth() + 1}\/${startdate.getDate()}`}
                      valueTo={`${enddate.getFullYear()}\/${enddate.getMonth() + 1}\/${enddate.getDay()}`}
                      allowEdit={false}
                    />
                  </div>
                  <div className='row' style={{ marginTop: "8px" }}>
                    <TextComponent
                      col='col-md-4'
                      label='Declared Date'
                      id='txtDeclaredDate'
                      value={declareddate ? declareddate.toDateString() : 'No declared date available' }
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