'use strict'

//React
import React from 'react'
import { Button, Input } from 'mdbreact'
import { connect } from 'react-redux'

//Local
import TextComponent from '../../Shared/TextComponent.jsx'
import TextAreaComponent from '../../Shared/TextAreaComponent.jsx'
import RangeComponent from '../../Shared/RangeComponent.jsx'
import SelectComponent from '../../Shared/SelectComponent.jsx'
import * as ACTION_TYPES from '../../../constants/action-types'

//GraphQl
import { Query, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'


const mapStateToProps = (state, props) => {
  return {}
}

class EventDetailsTab extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { eventId } = this.props
    const GET_EVENT = gql`
    {
      Events(eventId: ${eventId}) {
        eventId
        typeEvent {
          typeEventName
        }
        startDate
        endDate
        declaredEvents
        eventImpacts{
            typeImpact{
              typeImpactName
              unitOfMeasure
            }
            measure
          }
          eventRegions {
            region {
              regionName
              regionType {
                regionTypeName
              }
            }
          }
      }
    }`
    return (
      <>
        <Query query={GET_EVENT} variables={{ eventId }}>
          {({ data, loading, error }) => {
            if (error) return <p>Error Loading Data From Server</p>
            if (loading) return <p>Loading...</p>
            const event = data.Events[0]
            const { startDate, endDate, declaredDate, eventImpacts, eventImpacts: { typeImpactName, unitOfMeasure }, typeEvent, typeEvent: { typeEventName }, eventRegions, declaredEvents } = event
            let startdate = new Date(event.startDate * 1000)
            let enddate = new Date(event.endDate * 1000)
            let declareddate = new Date(declaredEvents * 1000)
            let impactString = eventImpacts ? eventImpacts.reduce((prev, next) => prev += `${next.typeImpact.typeImpactName}: ${next.measure}\n`, '') : ''
            return (<>
              <br />
              <div className='row'>
                <TextComponent
                  col='col-md-4'
                  label='Hazard Type:'
                  id='txtHazardType'
                  value={typeEventName || ''}
                  allowEdit={false}
                />
                <TextComponent
                  col='col-md-4'
                  label='Region:'
                  id='txtEventRegion'
                  value={eventRegions[0] ? eventRegions[0].region.regionName : ''}
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
                  value={declareddate ? 'No declared date available' : declareddate.toDateString()}
                  allowEdit={false}
                />
              </div>
              {/* <br /> */}
              <div className='row'>
                <TextAreaComponent
                  col='col-md-6'
                  label='Impact Types'
                  id='txtImpactType'
                  value={impactString}
                  allowEdit={false}
                />
              </div>
              <br />
            </>)
          }}
        </Query>
      </>
    )
  }
}

export default connect(mapStateToProps)(EventDetailsTab)