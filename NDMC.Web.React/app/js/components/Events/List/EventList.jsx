'use strict'

import React from 'react'
import EventCard from './EventCard.jsx'
import { connect } from 'react-redux'
import * as ACTION_TYPES from "../../../constants/action-types"
import { apiBaseURL } from "../../../constants/apiBaseURL"

const mapStateToProps = (state, props) => {
  let { eventData: { events, start, end, listScrollPos } } = state
  let { filterData: { titleFilter, regionFilter } } = state
  return {
    events, titleFilter, regionFilter, start, end, listScrollPos
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScrollPos: payload => {
      dispatch({ type: ACTION_TYPES.SET_EVENT_SCROLL, payload })
    },
    loadProjects: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_EVENTS, payload })
    },
    setLoading: payload => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload })
    },
    loadMoreProjects: () => {
      dispatch({ type: ACTION_TYPES.LOAD_MORE_EVENTS })
    },
    resetEventCounts: () => {
      dispatch({ type: ACTION_TYPES.RESET_EVENT_COUNTS })
    }
  }
}

class EventList extends React.Component {

  constructor(props) {
    super(props);

    //Set initial state
    this.state = {
      titleFilter: "",
      regionFilter: 0,
      start: 0,
      end: 10
    }
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll() {

    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    const { loadMoreEvents } = this.props
    if (Math.ceil(windowBottom) >= docHeight && this.props.polygonFilter === "") {
      loadMoreEvents()
    }
  }

  getEventList(resetCounts) {

    let { loadProjects, setLoading, titleFilter, regionFilter, start, end, resetEventCounts } = this.props

    if (resetCounts === true) {
      start = 0
      end = 10
      resetEventCounts()
    }

    this.setState({
      titleFilter: titleFilter,
      regionFilter: regionFilter,
      start: start,
      end: end
    })

    setLoading(true)

    let fetchURL = apiBaseURL + 'api/Events/GetAll/List?titlePart=' + titleFilter +
      '&regionId=' + regionFilter + '&batchSize=' + 10 + '&batchCount=' + Math.floor(end / 10)


    //Get project list data
    fetch(fetchURL,
      {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(res => res.json())
      .then(res => {
        loadProjects(res)
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
    window.addEventListener("scroll", this.handleScroll);
    window.scrollTo(0, this.props.listScrollPos);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate() {

    let pTitleFilter = this.props.titleFilter
    let pRegionFilter = this.props.regionFilter
    let pStart = this.props.start
    let pEnd = this.props.end
    let { titleFilter, regionFilter, start, end } = this.state

    //If any filters changed...refetch projects
    let filtersChanged = false
    if (pTitleFilter !== titleFilter || pRegionFilter !== regionFilter) {

      filtersChanged = true
    }

    //If next batch needed
    let nextBatchNeeded = false
    if (pStart !== start || pEnd !== end) {
      nextBatchNeeded = true
    }

    if (filtersChanged === true || nextBatchNeeded === true) {
      this.getEventList(filtersChanged)
    }
  }

  buildList() {

    const { projects } = this.props
    let ar = []
    if (typeof projects !== 'undefined' && projects.length > 0) {
      for (let i of projects) {
        ar.push(<EventCard key={i.ProjectId} pid={i.ProjectId} ptitle={i.ProjectTitle} />)
      }
      return ar
    }
    return <div />
  }

  render() {
    const ar = this.buildList()
    let eventlist = []
    if (ar.length > 0) {
      eventlist = (
        ar.slice(this.props.start, this.props.end)
      )
    }

    return (
      <div>
        {eventlist}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList)