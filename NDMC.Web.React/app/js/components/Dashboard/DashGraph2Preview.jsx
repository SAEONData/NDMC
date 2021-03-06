import React from 'react'
import { connect } from 'react-redux'
import popout from '../../../images/popout.png'
import OData from 'react-odata'
import { apiBaseURL } from '../../config/serviceURLs.js'
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import buildQuery from 'odata-query'
import moment from 'moment';

const _gf = require('../../globalFunctions')

const mapStateToProps = (state, props) => {
  let { filterData: { regionFilter, hazardFilter, impactFilter } } = state
  let { chartData: { chart2 } } = state
  return { regionFilter, hazardFilter, impactFilter, chart2 }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScrollPos: payload => {
      dispatch({ type: "SET_EVENTS_SCROLL", payload })
    },
    setChartData: payload => {
      dispatch({ type: "SET_CHART_2", payload })
    }
  }
}

class DashGraph2Preview extends React.Component {

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

    let { regionFilter, hazardFilter, impactFilter } = this.props
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

    if (this.props.chart2.length === 0) {

      const query = buildQuery({
        select: ["EventId", "DeclaredDate"],
        filter: {
          DeclaredDate: { ne: null }
        }
      })

      try {
        let res = await fetch(apiBaseURL + `DeclaredEvents${query}`)
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

    if (!data) {
      return []
    }

    let currentYear = new Date().getFullYear()
    let minYear = currentYear
    let maxYear = 0

    //Get MinYear
    data.forEach(de => {
      let year = moment.unix(de.DeclaredDate).year()
      if (year < minYear) {
        minYear = year
      }
    })

    //Get MaxYear
    data.forEach(de => {
      let year = moment.unix(de.DeclaredDate).year()
      if (year > maxYear) {
        maxYear = year
      }
    })

    for (let i = minYear; i <= maxYear; i++) {

      let declaredDisasters = data.filter(de => moment.unix(de.DeclaredDate).year() == i)

      tData.push({
        Year: i,
        DeclaredDisasters: declaredDisasters.length
      })
    }

    return tData
  }

  render() {

    let { chart2 } = this.props
    let { filterIDs } = this.state

    let filteredData = chart2.filter(de => filterIDs.includes(de.EventId))
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
            location.hash = location.hash.replace("#/", "#/chart2")
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
          DISASTERS
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
              <BarChart data={transformedData} >
                <XAxis hide dataKey="Year" />
                <Bar dataKey='DeclaredDisasters' fill='#82CA9D' />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          }
        </div>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(DashGraph2Preview)