'use strict'

//React
import React from 'react'
import { connect } from 'react-redux'

//Local
import EventCard from './EventCard.jsx'

//Odata
import OData from 'react-odata'
const baseUrl = 'https://localhost:44334/odata/' //'http://app01.saeon.ac.za/ndmcapi/odata/'

//MDBReact
import { ToastContainer, toast } from 'react-toastify'
import { Chip } from 'mdbreact'

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
      hazardFilter: { id: 0, name: '' },
      regionFilter: { id: 0, name: '' },
      impactFilter: { id: 0, name: '' },
      dateFilter: {
        startDate: 0,
        endDate: 0
      },
      data: {},
      eventListSize: 10,
      bottomReached: false,
      loadedEvents: 0,
      eventsLoading: false
    }
    this.handleScroll = this.handleScroll.bind(this)
    this.handleTags = this.handleTags.bind(this)
  }


  /*
  Checks for if the user scrolls to the bottom of the page and if they do change state
  to reflect this and increase the amount of events that can be displayed on the page
  */
  handleScroll() {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset
    if (Math.ceil(windowBottom) >= docHeight && !this.state.eventsLoading) {
      if (this.state.loadedEvents > 9) {
        this.setState({
          bottomReached: true,
          eventListSize: this.state.eventListSize + 10 //increase the amount of events that should be displayed by 10
        })
      }
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    window.scrollTo(0, this.props.listScrollPos)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  /*
  Create a list of event cards to be used to populate the events page and parse in the relevant information for each event
  */
  buildList(events) {

    let ar = []
    events.forEach(i => {
      let startdate = new Date(i.StartDate * 1000)
      let enddate = new Date(i.EndDate * 1000)
      if (i.TypeEvent !== null && /*i.StartDate &&*/ i.EventRegions[0] !== undefined) {
        ar.push(<EventCard key={i.EeventId} eid={i.EventId} region={i.EventRegions[0].Region} startdate={startdate.toDateString()} enddate={enddate.toDateString()} hazardtype={i.TypeEvent.TypeEventName} />)
      }
    })
    this.state.loadedEvents = ar.length
    return ar
  }

  handleTags() {
    let { hazardFilter, regionFilter, impactFilter, dateFilter } = this.props
    let taglist = []
    if (hazardFilter.name) {
      taglist.push(<Chip waves close> {hazardFilter.name} </Chip>)
    }
    if (regionFilter.name) {
      taglist.push(<Chip waves close> {regionFilter.name} </Chip>)
    }
    if (impactFilter.name) {
      taglist.push(<Chip waves close> {impactFilter.name} </Chip>)
    }
    if (dateFilter.startDate) {
      let start = new Date(dateFilter.startDate * 1000)
      let end = new Date(dateFilter.endDate * 1000)
      let startdate = `${start.getDate()}\/${start.getMonth()}\/${start.getFullYear()}`
      let endDate = `${end.getDate()}\/${end.getMonth()}\/${end.getFullYear()}`
      taglist.push(<Chip waves close> {`${startdate}-${endDate}`} </Chip>)
    }
    return taglist
  }

  getEvents() {
    let { hazardFilter, regionFilter, impactFilter, dateFilter } = this.props
    return fetch('https://localhost:44334/odata/Events/Extensions.Filter?$expand=eventRegions($expand=Region),TypeEvent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // 'Authorization': 'Bearer' + (user === null ? '': '')
        },
        body: JSON.stringify({
          region: regionFilter.id,
          hazard: hazardFilter.id,
          impact: impactFilter.id,
          startDate: dateFilter.startDate,
          endDate: dateFilter.endDate
        })
      }).then((res) => res.json()).then((res) =>{ console.log(res.value); this.setState({ data: res.value })})
  }

  render() {
    let { hazardFilter, regionFilter, impactFilter, dateFilter } = this.props

    // console.log(JSON.stringify({
    //   region: regionFilter,
    //   hazard: hazardFilter,
    //   impact: impactFilter,
    //   startDate: dateFilter.startDate,
    //   endDate: dateFilter.endDate
    // }))
    this.getEvents()

    let eventQuery = {
      select: ['EventId', 'StartDate', 'EndDate'],
      expand: ['TypeEvent', 'EventImpacts', 'EventRegions/Region'],
      top: this.state.eventListSize,
      orderBy: 'EventId asc',
      filter: {}
    }
    if (hazardFilter.id) {
      eventQuery.filter.TypeEvent = { TypeEventId: hazardFilter.id }
      this.state.eventListSize = 10
    }
    if (impactFilter.id) {
      eventQuery.filter.EventImpacts = { any: { typeImpact: { typeImpactId: impactFilter.id } } }
      this.state.eventListSize = 10
    }
    if (dateFilter.startDate) {
      eventQuery.filter.StartDate = { ge: dateFilter.startDate }
      eventQuery.filter.EndDate = { le: dateFilter.endDate }
      this.state.eventListSize = 10
    }
    if (regionFilter.id) { }

    let query = {
      Filter: {
        region: regionFilter.id,
        impact: impactFilter.id,
        hazard: hazardFilter.id,
        startdate: dateFilter.startDate,
        endDate: dateFilter.endDate
      }
    }

    return (
      <div>
        <div> {this.handleTags()} </div>
        <div>
          { Object.keys(this.state.data).length > 1 && this.buildList(this.state.data)}
        </div>
      </div >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList)