'use strict'
//React
import React from 'react'
import { connect } from 'react-redux'
import { BeatLoader } from 'react-spinners'
import ReactTooltip from 'react-tooltip'

//Local
import * as ACTION_TYPES from '../../../constants/action-types'
import EventDetailsTab from './EventDetailsTab.jsx'

//MDBReact
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact'

//React Tabs
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

const mapStateToProps = (state, props) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

class EventDetails extends React.Component {
  constructor(props) {
    super(props)
    this.backToList = this.backToList.bind(this)
    let eventId = this.props.match.params.id
    this.state = { ...this.state, eventId, navBack: false }
  }

  navBack() {
    location.hash = '/events'
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

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    const { eventDetails } = this.props
    const { eventId } = this.state
    return (
      <>
        <Button style={{ width: '100px', margin: '8px 0px 8px 0px' }} color='secondary' size='sm' id='btnBackToList' onClick={this.backToList}>
          <i className='fa fa-chevron-circle-left' aria-hidden='true'></i>&nbsp;&nbsp;Back
        </Button>
        <br />
        <Tabs forceRenderTabPanel={true}>
          <TabList>
            <Tab><b style={{ color: '#1565c0' }}>Event Details</b></Tab>
          </TabList>
          <TabPanel>
            <EventDetailsTab eventId={eventId} />
            <br />
            <br />
            <br />
          </TabPanel>
        </Tabs>
        <ReactTooltip />
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(EventDetails)