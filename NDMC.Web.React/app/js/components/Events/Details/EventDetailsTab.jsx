'use strict'

import React from 'react'
import { Button, Input } from 'mdbreact'
import { connect } from 'react-redux'
import TextComponent from '../../Shared/TextComponent.jsx'
import TextAreaComponent from '../../Shared/TextAreaComponent.jsx'
import RangeComponent from '../../Shared/RangeComponent.jsx'
import SelectComponent from '../../Shared/SelectComponent.jsx'
import { apiBaseURL } from '../../../constants/apiBaseURL'
import * as ACTION_TYPES from '../../../constants/action-types'

const mapStateToProps = (state, props) => {
  let { eventData: { events, eventDetails } } = state
  let { lookupData: { region, hazard, impacts } } = state
  return { events, eventDetails, region, hazard, impacts }
}

class EventDetailsTab extends React.Component {
  constructor(props) {
    super(props)
  }

  // buildImpactList(e){
  //     const { events } = this.props
  //     let impactstring = ''
  //     for(let i in events){
  //         impactstring += i.ImpactType + i.measure? `: ${i.Measure}\n`: `\n` +
  //     }
  // }

  render() {
    const { eventDetails, eventDetails: { Regions, EventType, StartDate, EndDate, DeclaredDate, EventsImpacts } } = this.props

    let startdate = new Date(StartDate)
    let enddate = new Date(EndDate)
    let declareddate = new Date(DeclaredDate)
    let impactString = EventsImpacts ? EventsImpacts.reduce((prev, next) => prev += `${next.ImpactType}: ${next.Measure}\n`, '') : ''
    return (
      <>
        <br />
        <div className='row'>
          <TextComponent
            col='col-md-4'
            label='Hazard Type:'
            id='txtHazardType'
            value={EventType ? EventType : ''}
            allowEdit={false}
          />
          <TextComponent
            col='col-md-4'
            label='Region:'
            id='txtEventRegion'
            value={Regions ? Regions[0].RegionName : ''}
            allowEdit={false}
          />
        </div>
        <br />
        <div className='row'>
          <RangeComponent
            col='col-md-8'
            label='Date'
            id='txtEventDate'
            inputWidth='100px'
            valueFrom={`${startdate.getFullYear()}\/${startdate.getMonth() + 1}\/${startdate.getDate()}`}
            valueTo={`${enddate.getFullYear()}\/${enddate.getMonth()}\/${enddate.getDay()}`}
            allowEdit={false}
          />
        </div>
        <br />
        <div className='row'>
          <TextComponent
            col='col-md-4'
            label='Declared Date'
            id='txtDeclaredDate'
            value={declareddate.getFullYear() === 1900 ? 'Na' : declareddate.toDateString()}
            allowEdit={false}
          />
        </div>
        <br />
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
      </>
    )
  }
}

export default connect(mapStateToProps)(EventDetailsTab)