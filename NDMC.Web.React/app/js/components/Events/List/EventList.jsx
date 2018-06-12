'use strict'

//React
import React from 'react'
import { connect } from 'react-redux'

//Local
import EventCard from './EventCard.jsx'
import * as ACTION_TYPES from '../../../constants/action-types'
import { apiBaseURL } from '../../../constants/apiBaseURL'

//GraphQL
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const mapStateToProps = (state, props) => {
  let { filterData: { hazardFilter, regionFilter, dateFilter, impactFilter } } = state
  return {
    hazardFilter, regionFilter, dateFilter, impactFilter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

class EventList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hazardFilter: 0,
      regionFilter: 0,
      impactFilter: 0,
      dateFilter: {
        startDate: 0,
        endDate: 0
      },
      eventListSize: 10,
      filtersChanged: false,
      bottomReached: false,
      filtersEnabled: false
    }
    this.handleScroll = this.handleScroll.bind(this)
  }

  handleScroll() {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset
    if (Math.ceil(windowBottom) >= docHeight) {
      this.setState({
        bottomReached: true,
        eventListSize: this.state.eventListSize + 10
      })
      console.log('BottomReached\n' + this.state.eventListSize + '\n' + this.state.bottomReached)
    }
  }

  updateEventList() {
    let { hazardFilter, regionFilter, impactFilter, dateFilter } = this.props
    this.setState({
      hazardFilter,
      regionFilter,
      impactFilter,
      dateFilter
    })
  }

  componentDidMount() {
    this.updateEventList()
    window.addEventListener('scroll', this.handleScroll)
    window.scrollTo(0, this.props.listScrollPos)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate() {
    let nextHazardFilter = this.props.hazardFilter
    let nextRegionFilter = this.props.regionFilter
    let nextImpactFilter = this.props.impactFilter
    let nextDateFilter = this.props.dateFilter
    let { hazardFilter, regionFilter, impactFilter, dateFilter, filtersEnabled, eventListSize } = this.state

    if (nextHazardFilter !== hazardFilter || nextRegionFilter !== regionFilter || nextImpactFilter !== impactFilter || nextDateFilter !== dateFilter) {
      console.log('filters are enabled')
      filtersEnabled = true
      eventListSize = 10
    }
    if(nextHazardFilter === 0 && nextRegionFilter === 0 && nextImpactFilter === 0 && nextDateFilter === 0) {
      console.log('filters are disabled')
      filtersEnabled = false
    }

    if (this.state.filtersEnabled === true /*|| nextBatchNeeded === true*/) {
      console.log('updating list')
      this.updateEventList()
    }
  }

  buildList(events) {
    let ar = []
    for (let i of events) {
      let startdate = new Date(i.startDate * 1000)
      let enddate = new Date(i.endDate * 1000)
      if (i.typeEvent !== null && i.startDate && i.eventRegions[0] !== undefined) {
        ar.push(<EventCard key={i.eventId} eid={i.eventId} region={i.eventRegions[0].region} startdate={startdate.toDateString()} enddate={enddate.toDateString()} hazardtype={i.typeEvent.typeEventName} />)
      }
    }
    return ar
  }

  render() {
    let { hazardFilter, regionFilter, impactFilter, dateFilter: { startDate, endDate } } = this.state
    const GET_ALL_EVENTS = gql`
      {
        Events {
          eventId
          startDate
          endDate
          declaredEvents {
            declaredDate
          }
          typeEvent {
            typeEventName
            typeEventId
          }
          eventImpacts{
            typeImpact{
              typeImpactName
              typeImpactId
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
      }
    `
    return (
      <div>
        <Query query={GET_ALL_EVENTS}>
          {({ loading, error, data }) => {
            if (loading) return <p> Loading Event List... </p>
            if (error) return <p> Error Loading Data From Server </p>
            const filteredData = data.Events.filter(event =>
              event.typeEvent &&
              event.startDate &&
              event.eventRegions[0]
            )
            let startdate = 0
            let enddate = 0
            if (startDate !== 0 && endDate !== 0) {
              startdate = new Date(startDate).getTime() / 1000
              enddate = new Date(endDate).getTime() / 1000
            }
            if (this.state.filtersEnabled) {
              console.log('listing filtered events')
              this.state.bottomReached = false
              return this.buildList(filteredData
                .filter(event => hazardFilter === 0 ? true : event.typeEvent.typeEventId === hazardFilter)
                .filter(event => impactFilter === 0 ? true : event.eventImpacts.map(x => x.typeImpact.typeImpactId).includes(impactFilter))
                .filter(event => regionFilter === 0 ? true : event.Regions[0] === regionFilter)
                .filter(event => startdate === 0 && enddate === 0 ? true : event.startDate >= startdate && event.endDate <= enddate)
                .slice(0, this.state.eventListSize)
              )
            }
            if (this.state.filtersEnabled === false) {
              console.log('listing unfiltered events' + this.state.filtersEnabled)
              this.state.bottomReached = false
              console.log(this.state.eventListSize)
              return this.buildList(filteredData.slice(0, this.state.eventListSize))
            }
            else {
              return
            }
          }}
        </Query>
      </div >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList)