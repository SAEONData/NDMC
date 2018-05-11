'use strict'

import React from 'react'
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact'
import { connect } from 'react-redux'
import * as ACTION_TYPES from "../../../constants/action-types"
import { apiBaseURL } from "../../../constants/apiBaseURL"
import EventDetailsTab from './EventDetailsTab.jsx'
import { BeatLoader } from 'react-spinners'
import ReactTooltip from 'react-tooltip'
import { UILookup } from '../../../constants/ui_config'

//react-tabs
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

const mapStateToProps = (state, props) => {
  let { eventData: { eventDetails } } = state
  let { globalData: { loading } } = state
  return {
    eventDetails, loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setLoading: payload => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload })
    },
    resetEventState: payload => {
      dispatch({ type: ACTION_TYPES.RESET_EVENT_STATE, payload })
    },
    loadRegion: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_REGION, payload })
    },
    loadHazardType: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_HAZARD_TYPE, payload })
    },
    loadImpact: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_IMPACTS, payload })
    },
    loadStartDate: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_STARTDATE, payload })
    },
    loadEndDate: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_ENDDATE, payload })
    },
    loadEventDetails: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_EVENT_DETAILS, payload })
    },
    loadDeclareDate: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_DECLAREDATE, payload })
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

  navBack() {
    this.props.setLoading(true)
    location.hash = "/events"
  }

  backToList() {
    let { eventDetails } = this.props
    let dataState = "original"
    if (eventDetails.state !== 'original') {
      dataState = eventDetails.state
    }
    if (dataState === "original") {
      this.navBack()
    }
    else {
      this.setState({ navBack: true })
    }
  }

  loadEvents(loadEventDetails) {
    let action
    action = fetch(apiBaseURL + 'api/Events/details/' + this.state.eventId, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(res => {
      res.state = "original"
      loadEventDetails(res)
    })
    return action
  }

  loadData() {
    let { setLoading, loadEventDetails, loadEvents, loadRegion, loadEndDate, loadStartDate, loadImpact, loadDeclareDate } = this.props
    setLoading(true)
    Promise.all([
      this.loadEvents(loadEventDetails)
    ])
      .then(() => {
        setLoading(false)
      })
      .catch(res => {
        setLoading(false)
        console.log("Error details:", res)
        alert("An error occurred while trying to fetch data from the server. Please try again later. (See log for error details)")
      })
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.loadData()
  }

  render() {
    const { eventDetails } = this.props
    return (
      <>
        <div
          hidden={!this.props.loading}
          className="card"
          style={{ position: "fixed", right: "40%", bottom: "42%", zIndex: "99", background: "white" }}>
          <div className="card-body" style={{ margin: "30px 80px 30px 80px" }}>
            <label style={{ fontSize: "x-large", fontWeight: "bold", color: "#4285F4" }}>LOADING</label>
            <BeatLoader
              color={'#4285F4'}
              size={30}
              loading={this.props.loading}
            />
          </div>
        </div>
        <Button style={{ width: "100px", margin: "8px 0px 8px 0px" }} color="secondary" size="sm" id="btnBackToList" onTouchTap={this.backToList}>
          <i className="fa fa-chevron-circle-left" aria-hidden="true"></i>&nbsp;&nbsp;Back
                </Button>
        <br />
        <Tabs forceRenderTabPanel={true}>
          <TabList>
            <Tab><b style={{ color: "#1565c0" }}>Event Details</b></Tab>
          </TabList>
          <TabPanel>
            <EventDetailsTab />
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