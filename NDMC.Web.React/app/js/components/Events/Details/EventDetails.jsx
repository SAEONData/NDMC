'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import EventDetailsTab from './EventDetailsTab.jsx'
import EventResoponseTab from './EventResponseTab.jsx'
import EventImpactTab from './EventImpactTab.jsx'
import { Button } from 'mdbreact'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

const mapStateToProps = (state, props) => {
  let { globalData: { eventsFullView, showBackToList } } = state
  return {
    eventsFullView, showBackToList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setForceNavRender: payload => {
      dispatch({ type: "FORCE_NAV_RENDER", payload })
    }
  }
}

/**
 * EventResponseTab Class for response details tab of individual events
 * @class
 */
class EventDetails extends React.Component {
  constructor (props) {
    super(props)
    this.backToList = this.backToList.bind(this)
    let eventId = this.props.match.params.id
    this.state = { ...this.state, eventId, navBack: false }
  }

  componentDidMount () {
    window.scrollTo(0, 0)
  }

  componentDidUpdate () {
  }

  /**
   * Handle changes for navigating back to events
   */
  navBack () {
    setTimeout(() => { this.props.setForceNavRender(true) }, 250)
    let navTo = location.hash.replace(
      "#/events/" + this.state.eventId,
      this.props.eventsFullView === true ? "#/events" : "/"
    )
    location.hash = navTo
  }

  /**
   * Handle navigating back to events list
   */
  backToList () {
    let dataState = 'original'
    if (dataState === 'original') {
      this.navBack()
    }
    else {
      this.setState({ navBack: true })
    }
  }

  render () {
    const { eventId } = this.state
    return (
      <>
        {
          this.props.showBackToList === true &&
          <Button style={{ margin: '8px 0px 15px -1px' }} color='grey' size='sm' id='btnBackToList' onClick={this.backToList}>
            <i className='fa fa-chevron-circle-left' aria-hidden='true'></i>&nbsp;&nbsp;Back To List
          </Button>
        }
        <br />
        <Tabs forceRenderTabPanel={true}>
          <TabList>
            <Tab><b style={{ color: '#1565c0' }}>Event Details</b></Tab>
            <Tab><b style={{ color: '#1565c0' }}>Event Impacts</b></Tab>
            <Tab><b style={{ color: '#1565c0' }}>Event Responses</b></Tab>
          </TabList>
          <TabPanel>
            <EventDetailsTab eventId={eventId} />
            <br />
          </TabPanel>
          <TabPanel>
            <EventImpactTab eventId={eventId} />
            <br />
          </TabPanel>
          <TabPanel>
            <EventResoponseTab eventId={eventId} />
            <br />
          </TabPanel>
        </Tabs>
        <ReactTooltip />
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(EventDetails)
