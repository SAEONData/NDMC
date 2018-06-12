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
  let { eventData: { start, end, listScrollPos } } = state
  let { filterData: { hazardFilter, regionFilter, dateFilter, impactFilter } } = state
  return {
    hazardFilter, regionFilter, dateFilter, impactFilter, start, end, listScrollPos
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScrollPos: payload => {
      dispatch({ type: ACTION_TYPES.SET_EVENT_SCROLL, payload })
    },
    clearEventDetails: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_EVENTS, payload: [] })
    },
    setLoading: payload => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload })
    },
    loadMoreEvents: () => {
      dispatch({ type: ACTION_TYPES.LOAD_MORE_EVENTS })
    },
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
      start: 0,
      end: 10,
      filtersChanged: false
    }
    this.handleScroll = this.handleScroll.bind(this)
  }

  handleScroll() {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset
    const { loadMoreEvents } = this.props
    if (Math.ceil(windowBottom) >= docHeight && this.props.polygonFilter === '') {
      loadMoreEvents()
    }
  }

  updateEventList() {
    let { setLoading, hazardFilter, regionFilter, impactFilter, dateFilter, start, end, clearEventDetails } = this.props
    this.setState({
      hazardFilter,
      regionFilter,
      impactFilter,
      dateFilter,
      start,
      end
    })
    //Clear details data
    clearEventDetails()
    setLoading(false)
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
    let nextStart = this.props.start
    let nextEnd = this.props.end
    let { hazardFilter, regionFilter, impactFilter, dateFilter, start, end } = this.state

    if (nextHazardFilter !== hazardFilter || nextRegionFilter !== regionFilter || nextImpactFilter !== impactFilter || nextDateFilter !== dateFilter) {
      this.filtersChanged = true
    }

    if (this.filtersChanged === true /*|| nextBatchNeeded === true*/) {
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
              startdate = new Date(startDate).getTime()/1000
              enddate = new Date(endDate).getTime()/1000
            }
            if (this.filtersChanged) {
              this.filtersChanged = false
              return this.buildList(filteredData
                .filter(event => hazardFilter === 0 ? true : event.typeEvent.typeEventId === hazardFilter)
                .filter(event => impactFilter === 0 ? true : event.eventImpacts.map(x => x.typeImpact.typeImpactId).includes(impactFilter))
                .filter(event => regionFilter === 0 ? true : event.Regions[0] === regionFilter)
                .filter(event => startdate === 0 && enddate === 0 ? true : event.startDate >= startdate && event.endDate <= enddate)
              )
            }
            else {
              return this.buildList(filteredData)
            }
          }}
        </Query>
      </div >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList)