'use strict'

import React from 'react'
import EventCard from './EventCard.jsx'
import { connect } from 'react-redux'
import * as ACTION_TYPES from "../../../constants/action-types"
import { apiBaseURL } from "../../../constants/apiBaseURL"

const mapStateToProps = (state, props) => {
  let { eventData: { events, start, end, listScrollPos } } = state
  let { filterData: { hazardFilter, regionFilter, startDateFilter, endDateFilter, impactTypeFilter } } = state
  return {
    events, hazardFilter, regionFilter,startDateFilter, endDateFilter, impactTypeFilter, start, end, listScrollPos
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScrollPos: payload => {
      dispatch({ type: ACTION_TYPES.SET_EVENT_SCROLL, payload })
    },
    loadEvents: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_EVENTS, payload })
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
    resetEventCounts: () => {
      dispatch({ type: ACTION_TYPES.RESET_EVENT_COUNTS })
    }
  }
}

class EventList extends React.Component {
  constructor(props) {
    super(props)

    //Set initial state
    this.state = {
      hazardFilter: 0,
      regionFilter: 0,
      impactTypeFilter: 0,
      startDateFilter: 0,
      endDateFilter:0,
      start: 0,
      end: 10
    }
    this.handleScroll = this.handleScroll.bind(this)
  }

  handleScroll() {

    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset
    const { loadMoreEvents } = this.props
    if (Math.ceil(windowBottom) >= docHeight && this.props.polygonFilter === "") {
      loadMoreEvents()
    }
  }

  getEventList(resetCounts) {

    let { loadEvents, setLoading, hazardFilter, regionFilter, impactTypeFilter, startDateFilter, endDateFilter, start, end, resetEventCounts, clearEventDetails } = this.props

    if (resetCounts === true) {
      start = 0
      end = 10
      resetEventCounts()
    }

    this.setState({
      hazardFilter: hazardFilter,
      regionFilter: regionFilter,
      impactTypeFilter: impactTypeFilter,
      startDateFilter: startDateFilter,
      endDateFilter: endDateFilter,
      start: start,
      end: end
    })

    setLoading(true)

    //Clear details data
    clearEventDetails()

    let fetchURL = apiBaseURL + 'api/events/list?startDate=' + startDateFilter +"&endDate=" + endDateFilter + "&eventType=" + hazardFilter +
      '&impactType=' + impactTypeFilter +'&region=' + regionFilter


    //Get event list data
    return fetch(fetchURL,
      {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(res => res.json())
      .then(res => {
        loadEvents(res)
        setLoading(false)
      })
      .catch(res => {
        setLoading(false)
        console.log("Error details:", res)
        alert("An error occurred while trying to fetch data from the server. Please try again later. (See log for error details)")
      })
  }

  componentDidMount() {
    this.getEventList()
    window.addEventListener("scroll", this.handleScroll)
    window.scrollTo(0, this.props.listScrollPos)
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  }

  componentDidUpdate() {

    let eHazardFilter = this.props.hazardFilter
    let eRegionFilter = this.props.regionFilter
    let eImpactTypeFilter = this.props.impactTypeFilter
    let eStartDateFilter = this.props.startDateFilter
    let eEndDateFilter = this.props.endDateFilter
    let eStart = this.props.start
    let eEnd = this.props.end
    let { hazardFilter, regionFilter, impactTypeFilter, startDateFilter, endDateFilter, start, end } = this.state

    //If any filters changed...refetch events
    let filtersChanged = false
    if (eHazardFilter !== hazardFilter || eRegionFilter !== regionFilter || eImpactTypeFilter !== impactTypeFilter
      || eStartDateFilter !== startDateFilter
      || eEndDateFilter !== endDateFilter) {

     // filtersChanged = true
    }

    //If next batch needed
    // let nextBatchNeeded = false
    // if (eStart !== start || eEnd !== end) {
    //   nextBatchNeeded = true
    // }

    if (filtersChanged === true /*|| nextBatchNeeded === true*/) {
      this.getEventList(filtersChanged)
    }
  }

  buildList() {

    const { events } = this.props
    let ar = []
    if (typeof events !== 'undefined' && events.length > 0) {
      for (let i of events) {
        let startdate = new Date(i.StartDate)
        let enddate = new Date(i.EndDate)
        if(startdate.getFullYear() === 1900 ||startdate.getFullYear() === 1970) {
          startdate = false
        } else {
          startdate = startdate.toDateString()
        }
        if(i.EventType !== ' ' && startdate){
          ar.push(<EventCard key={i.EventId} eid={i.EventId} region={i.Regions[0]} startdate={startdate} enddate={enddate.toDateString()} hazardtype={i.EventType} />)
        }
      }
      return ar
    }
    return <div />
  }

  render() {
    const ar = this.buildList()
    let eventlist = ar
    // if (ar.length > 0) {
    //   eventlist = (
    //     ar.slice(this.props.start, this.props.end)
    //   )
    // }

    return (
      <div>
        {eventlist}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList)