'use strict'

//React
import React from 'react'
import { connect } from 'react-redux'

//Local
import EventCard from './EventCard.jsx'
import * as ACTION_TYPES from '../../../constants/action-types'

//Odata
import OData from 'react-odata'
const baseUrl = 'http://app01.saeon.ac.za/ndmcapi/odata/'

//MDBReact
import { ToastContainer, toast } from 'react-toastify'
import { Button, Chip } from 'mdbreact'

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
      eventListSize: 10,
      bottomReached: false,
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
    if (Math.ceil(windowBottom) >= docHeight) {
      this.setState({
        bottomReached: true,
        eventListSize: this.state.eventListSize + 10 //increase the amount of events that should be displayed by 10
      })
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
    for (let i of events) {
      let startdate = new Date(i.startDate * 1000)
      let enddate = new Date(i.endDate * 1000)
      if (i.typeEvent !== null && i.startDate && i.eventRegions[0] !== undefined) {
        ar.push(<EventCard key={i.eventId} eid={i.eventId} region={i.eventRegions[0].region} startdate={startdate.toDateString()} enddate={enddate.toDateString()} hazardtype={i.typeEvent.typeEventName} />)
      }
    }
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

  render() {
    let { hazardFilter, regionFilter, impactFilter, dateFilter } = this.props
    let eventQuery = {
      select: ['eventId', 'startDate', 'endDate', 'typeEvent', 'eventImpacts', 'EventRegions'],
      top: this.eventListSize,
      orderBy: 'eventId asc',
    }
    if (hazardFilter) { eventQuery.typeEvent = { filter: { typeEventId: hazardFilter } } }
    if (impactFilter) { eventQuery.eventImpacts = { typeImpact: { filter: { typeImpactId: impactFilter } } } }
    if (dateFilter) { eventQuery.filter = { startDate: dateFilter.startDate, endDate: dateFilter.endDate } }
    if (regionFilter) { eventQuery.eventRegions = { region: { filter: {regionId: regionFilter} } } }
    return (
      <div>
        <div> {this.handleTags()} </div>
        <ToastContainer
          hideProgressBar={true}
          newestOnTop={true}
          autoClose={2500}
        />
        <OData baseUrl={baseUrl + 'Events'} query={eventQuery}>
          {({ loading, error, data }) => {
            if (loading) {
              toast.info('Fetching list of events')
              return <div>Loading...</div>
            }
            if (error) {
              toast.error('error fetching list from server\n' + error)
              return <div>Unable to load events, please contact the site administrator</div>
            }
            toast.success('Successfully loaded Events!')
            console.log(data)
            this.state.bottomReached = false
            return this.buildList(data)
          }}
        </OData>
      </div >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList)