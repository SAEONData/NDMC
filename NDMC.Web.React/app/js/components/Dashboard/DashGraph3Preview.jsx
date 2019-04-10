import React, { Children } from 'react'
import { Row, Col, Button } from 'mdbreact'
import { connect } from 'react-redux'
import popout from '../../../images/popout.png'
import OData from 'react-odata'
import { apiBaseURL, vmsBaseURL } from '../../config/serviceURLs.js'
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import buildQuery from 'odata-query'
import moment from 'moment';
import { CustomFetch } from '../../globalFunctions';

const _gf = require('../../globalFunctions')

const mapStateToProps = (state, props) => {
  let { filterData: { regionFilter, hazardFilter, impactFilter, dateFilter } } = state
  let { chartData: { chart3 } } = state
  return { regionFilter, hazardFilter, impactFilter, chart3, dateFilter }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScrollPos: payload => {
      dispatch({ type: "SET_EVENTS_SCROLL", payload })
    },
    setChartData: payload => {
      dispatch({ type: "SET_CHART_3", payload })
    }
  }
}

const chartColours = [
  "#82CA9D", //pastel green
  "#8884D8", //pastel purple/blue
  "#FFCF77", //pastel orange
  "#A2D0D8", //pastel blue-grey
  "#FF6868" //pastel red
]

class DashGraph3Preview extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filterIDs: [],
      hazards: []
    }

    this.renderTooltipContent = this.renderTooltipContent.bind(this)
    this.getPercent = this.getPercent.bind(this)
    this.toPercent = this.toPercent.bind(this)
  }

  componentDidMount() {
    this.getChartData()
    this.getHazards()
    this.getFilteredEventIDs()
  }

  componentDidUpdate() {
    this.getFilteredEventIDs()
  }

  async getChartData() {

    if (this.props.chart3.length === 0) {

      const query = buildQuery({
        select: ["EventId", "StartDate", "EndDate", "TypeEventId"],
        filter: {
          StartDate: { ne: null },
          EndDate: { ne: null },
          TypeEventId: { ne: null }
        }
      })

      try {
        let res = await CustomFetch(apiBaseURL + `Events${query}`)
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

  async getHazards() {

    //Get Hazards list/details
    try {

      let res = await CustomFetch(vmsBaseURL + "hazards/flat")

      //Get response body
      let resBody = await res.json()

      if (res.ok) {
        this.setState({ hazards: resBody.items })
      }
      else {
        throw new Error(resBody.error.message)
      }

    } catch (ex) {
      console.error(ex)
    }
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

      let res = await CustomFetch(apiBaseURL + "Events/Extensions.Filter?$select=EventId",
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

  transformData(data, hazards) {

    let tData = []

    if(!data) return []

    let minYear = Math.min(...data.map(e => moment.unix(e.StartDate).year()))
    let maxYear = Math.max(...data.map(e => moment.unix(e.EndDate).year()))
    let currentYear = new Date().getFullYear()

    if (maxYear > currentYear) {
      maxYear = currentYear
    }

    //Get unique hazards
    let uniqueHazards = []
    data.forEach(h => {
      if (uniqueHazards.filter(x => x.Hazard === h.TypeEventId).length === 0) {
        uniqueHazards.push({
          Hazard: h.TypeEventId,
          Count: data.filter(d => d.TypeEventId === h.TypeEventId).length
        })
      }
    })

    //Sort by Count
    uniqueHazards.sort(function (haz1, haz2) {
      return haz2.Count - haz1.Count;
    });

    //Take top 5 only
    uniqueHazards = uniqueHazards.slice(0, 5)

    for (let i = minYear; i <= maxYear; i++) {

      let tItem = { Year: i }
      uniqueHazards.forEach(haz => {

        //Get Hazard Name
        let hazName = "Unknown"
        let searchHaz = hazards.filter(x => x.id == haz.Hazard)
        if (searchHaz.length > 0) {
          hazName = searchHaz[0].value.trim()
        }

        //Get relevant hazards
        let filteredHazards = data.filter(d => moment.unix(d.StartDate).year() <= i && moment.unix(d.EndDate).year() >= i && d.TypeEventId === haz.Hazard)
        tItem[hazName] = filteredHazards.length
      })

      tData.push(tItem)
    }

    return tData
  }

  getPercent(value, total) {
    const ratio = total > 0 ? value / total : 0;
    return this.toPercent(ratio, 1);
  }

  toPercent(decimal, fixed = 0) {
    return `${(decimal * 100).toFixed(fixed)}%`
  }

  renderTooltipContent(params) {
    const { payload, label, active } = params;
    const total = payload.reduce((result, entry) => (result + entry.value), 0);

    return (
      <div>
        {
          active &&
          <div style={{ backgroundColor: "white", padding: "10px", border: "1px solid gainsboro" }}>
            <p className="total" style={{ marginBottom: "5px" }}>{`${label} (Total: ${total})`}</p>
            {
              payload.map((entry, index) => (
                <p key={`item-${index}`} style={{ color: entry.color, marginBottom: "0px", fontSize: "14px" }}>
                  {`${entry.name}: ${entry.value} (${this.getPercent(entry.value, total)})`}
                </p>
              ))
            }
          </div>
        }
      </div>
    )
  }

  renderAreas(transformedData, hazards) {

    let areas = []
    let index = 0;

    Object.keys(transformedData[0]).filter(k => k !== "Year")
      .forEach(key => {

        //Get Hazard color
        let color = "lightgrey"
        let searchHaz = hazards.filter(h => h.value.trim() === key)
        if (searchHaz.length > 0) {
          color = chartColours[index] //searchHaz[0].color
        }

        areas.push(
          <Area
            key={key}
            type='monotone'
            dataKey={key}
            stackId="1"
            stroke={color}
            fill={color}
          />
        )

        index += 1
      })

    return areas
  }

  render() {

    let { filterIDs, hazards } = this.state
    let { chart3 } = this.props

    let filteredData = chart3.filter(p => filterIDs.includes(p.EventId))
    let transformedData = this.transformData(filteredData, hazards)

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
            location.hash = location.hash.replace("#/", "#/chart3")
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
          HAZARDS
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
            (transformedData.length > 0 && hazards.length > 0) &&
            <ResponsiveContainer key="G3Graph" width="100%" height="100%">
              <AreaChart data={transformedData} stackOffset="expand" >
                <XAxis hide dataKey="Year" />
                <YAxis hide tickFormatter={this.toPercent} />
                <Tooltip content={this.renderTooltipContent} />
                {this.renderAreas(transformedData, hazards)}
              </AreaChart>
            </ResponsiveContainer>
          }
        </div>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(DashGraph3Preview)