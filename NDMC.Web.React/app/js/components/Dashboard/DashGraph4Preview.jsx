import React from 'react'
import { connect } from 'react-redux'
import popout from '../../../images/popout.png'
import OData from 'react-odata'
import { apiBaseURL } from '../../config/serviceURLs.js'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import buildQuery from 'odata-query'
import moment from 'moment';

const _gf = require('../../globalFunctions')

const mapStateToProps = (state, props) => {
  let { filterData: { regionFilter, hazardFilter, impactFilter, dateFilter } } = state
  let { chartData: { chart4 } } = state
  return { regionFilter, hazardFilter, impactFilter, chart4, dateFilter }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScrollPos: payload => {
      dispatch({ type: "SET_EVENTS_SCROLL", payload })
    },
    setChartData: payload => {
      dispatch({ type: "SET_CHART_4", payload })
    }
  }
}

class DashGraph4Preview extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filterIDs: []
    }
  }

  componentDidMount() {
    this.getChartData()
    this.getFilteredEventIDs()
  }

  componentDidUpdate() {
    this.getFilteredEventIDs()
  }

  async getFilteredEventIDs() {

    let { regionFilter, hazardFilter, impactFilter, dateFilter } = this.props
    let filters = {}

    //ADD FILTERS//
    //Region//
    if (regionFilter !== 0) {
      filters.region = regionFilter
    }

    //Hazard//
    if (hazardFilter !== 0) {
      filters.hazard = hazardFilter
    }

    //Impact//
    if (impactFilter != 0) {
      filters.impact = impactFilter
    }

    //StartDate
    if(dateFilter.startDate != 0){
      filters.startDate = dateFilter.startDate
    }

    //EndDate
    if(dateFilter.endDate != 0){
      filters.endDate = dateFilter.endDate
    }

    //GET EVENTS FILTERED//
    try {

      let res = await fetch(apiBaseURL + "Events/Extensions.Filter?$select=EventId",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(filters)
        })

      let resBody = await res.json()

      if (res.ok) {
        //Process resBody
        let filterIDs = resBody.value.map(p => p.EventId)
        if (!_gf.arraysEqual(filterIDs, this.state.filterIDs)) {
          this.setState({ filterIDs })
        }
      }
      else {
        throw new Error(resBody.error.message)
      }

    }
    catch (ex) {
      console.error(ex)
    }

  }

  async getChartData() {

    if (this.props.chart4.length === 0) {

      const query = buildQuery({
        select: ["EventId"],
        expand: {
          Event: {
            select: ["StartDate", "EndDate"]
          },
          EventImpacts: {
            select: ["TypeImpact"],
            expand: {
              TypeImpact: {
                select: ["TypeImpactName"]
              }
            }
          }
        }
      })

      try {
        let res = await fetch(apiBaseURL + `EventRegions${query}`)
        let resBody = await res.json()

        if (res.ok && resBody.value) {
          //Process resBody
          this.props.setChartData(resBody.value)
        }
        else {
          throw new Error(resBody.error.message)
        }
      }
      catch (ex) {
        console.error(ex)
      }
    }
  }

  transformData(data) {

    let tData = []

    if (data.length === 0) {
      return []
    }

    //Filter data
    let typeImpacts = ["Fatality", "Injury"]
    data = data.filter(er => er.Event.StartDate !== null && er.Event.EndDate !== null)
    data = data.filter(er => er.EventImpacts.filter(ei => typeImpacts.includes(ei.TypeImpact.TypeImpactName)).length > 0)

    let minYear = Math.min(...data.map(e => moment.unix(e.Event.StartDate).year()))
    let maxYear = Math.max(...data.map(e => moment.unix(e.Event.EndDate).year()))
    let currentYear = new Date().getFullYear()

    if (maxYear > currentYear) {
      maxYear = currentYear
    }

    for (let i = minYear; i <= maxYear; i++) {

      let Fatalities = data
        .filter(er => moment.unix(er.Event.StartDate).year() <= i && moment.unix(er.Event.EndDate).year() >= i &&
          er.EventImpacts.filter(ei => ei.TypeImpact.TypeImpactName === "Fatality").length > 0)

      let Injuries = data
        .filter(er => moment.unix(er.Event.StartDate).year() <= i && moment.unix(er.Event.EndDate).year() >= i &&
          er.EventImpacts.filter(ei => ei.TypeImpact.TypeImpactName === "Injury").length > 0)

      tData.push({
        Year: i,
        Fatalities: Fatalities.length,
        Injuries: Injuries.length,
      })
    }

    return tData
  }

  render() {

    let { chart4 } = this.props
    let { filterIDs } = this.state

    let filteredData = chart4.filter(er => filterIDs.includes(er.EventId))
    let transformedData = this.transformData(filteredData)

    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "10px 10px 0px 10px",
          borderRadius: "10px",
          border: "1px solid gainsboro",
          cursor: "pointer",
        }}
      >

        <img src={popout} style={{ width: "25px", position: "absolute", top: "10px", right: "25px" }}
          onClick={() => {
            this.props.setScrollPos(window.pageYOffset)
            location.hash = location.hash.replace("#/", "#/chart4")
          }} />

        <div
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: "3px",
            marginBottom: "10px",
            paddingRight: "25px",
            color: "grey",
            fontSize: "14px",
            fontWeight: "bolder"
          }}
        >
          FATALITIES / INJURIES
        </div>

        <div
          style={{
            width: "100%",
            height: "130px",
            margin: "0px",
            border: "none",
            paddingBottom: "10px"
          }}
        >
          {
            (transformedData.length > 0) &&
            <ResponsiveContainer key={new Date().valueOf()} width="100%" height="100%">
              <LineChart data={transformedData} >
                <XAxis hide dataKey="Year" />
                <Line dot={false} type='monotone' dataKey='Fatalities' stroke='#82CA9D' strokeWidth={2} />
                <Line dot={false} type="monotone" dataKey="Injuries" stroke="#8884D8" strokeWidth={2} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          }
        </div>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(DashGraph4Preview)