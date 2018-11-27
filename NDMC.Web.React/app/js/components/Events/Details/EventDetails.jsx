'use strict'
//React
import React from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'

//Local
import EventDetailsTab from './EventDetailsTab.jsx'
import EventResoponseTab from './EventResponseTab.jsx'
import EventImpactTab from './EventImpactTab.jsx'

//MDBReact
import { Button } from 'mdbreact'

//React Tabs
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

const mapStateToProps = (state, props) => {
  let { globalData: { eventsFullView } } = state
  return {
    eventsFullView
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setForceNavRender: payload => {
      dispatch({ type: "FORCE_NAV_RENDER", payload })
    }
  }
}

class EventDetails extends React.Component {
  constructor(props) {
    super(props)
    this.backToList = this.backToList.bind(this)
    let eventId = this.props.match.params.id
    this.state = { ...this.state, eventId, navBack: false }
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  componentDidUpdate() {
  }

  navBack() {
    setTimeout(() => { this.props.setForceNavRender(true) }, 250)
    let navTo = location.hash.replace(
      "#/events/" + this.state.eventId,
      this.props.eventsFullView === true ? "#/events" : "/"
    )
    location.hash = navTo
  }

  backToList() {
    let { eventDetails } = this.props
    let dataState = 'original'
    if (dataState === 'original') {
      this.navBack()
    }
    else {
      this.setState({ navBack: true })
    }
  }

  render() {
    const { eventDetails } = this.props
    const { eventId } = this.state
    return (
      <>
        <Button style={{ margin: '8px 0px 15px -1px' }} color='grey' size='sm' id='btnBackToList' onClick={this.backToList}>
          <i className='fa fa-chevron-circle-left' aria-hidden='true'></i>&nbsp;&nbsp;Back To List
        </Button>
        <br />
        <Tabs forceRenderTabPanel={true}>
          <TabList>
            <Tab><b style={{ color: '#1565c0' }}>Event Details</b></Tab>
            <Tab><b style={{ color: '#1565c0' }}>Event Responses</b></Tab>
            <Tab><b style={{ color: '#1565c0' }}>Event Impacts</b></Tab>
          </TabList>
          <TabPanel>
            <EventDetailsTab eventId={eventId} />
            <br />
          </TabPanel>
          <TabPanel>
            <EventResoponseTab eventId={eventId} />
            <br />
          </TabPanel>
          <TabPanel>
            <EventImpactTab eventId={eventId} />
            <br />
          </TabPanel>
        </Tabs>
        <ReactTooltip />
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(EventDetails)