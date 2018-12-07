import React from 'react'
import { connect } from 'react-redux'
import popin from '../../../images/popin.png'
import { apiBaseURL } from '../../config/serviceURLs.cfg'
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import buildQuery from 'odata-query'
import moment from 'moment';

const _gf = require('../../globalFunctions')

const mapStateToProps = (state, props) => {
  let { filterData: { regionFilter, hazardFilter, impactFilter } } = state
  let { chartData: { chart3 } } = state
  return { regionFilter, hazardFilter, impactFilter, chart3 }
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

class DashGraph3FullView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filterIDs: []
    }

    this.renderTooltipContent = this.renderTooltipContent.bind(this)
    this.getPercent = this.getPercent.bind(this)
    this.toPercent = this.toPercent.bind(this)
  }

  componentDidMount() {
    window.scroll({
      top: 125,
      left: 0,
      behavior: 'smooth'
    });

    this.getChartData()
    this.getFilteredEventIDs()
  }

  componentDidUpdate() {
    this.getFilteredEventIDs()
  }

  async getChartData() {

    if (this.props.chart3.length === 0) {

      const query = buildQuery({
        select: ["EventId", "StartDate", "EndDate"],
        filter: {
          StartDate: { ne: null },
          EndDate: { ne: null },
          TypeEventId: { ne: null }
        },
        expand: {
          TypeEvent: {
            select: ["TypeEventName"]
          }
        }
      })

      try {
        let res = await fetch(apiBaseURL + `Events${query}`)
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
      if (uniqueHazards.filter(x => x.Hazard === h.TypeEvent.TypeEventName).length === 0) {
        uniqueHazards.push({
          Hazard: h.TypeEvent.TypeEventName,
          Count: data.filter(d => d.TypeEvent.TypeEventName === h.TypeEvent.TypeEventName).length
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

        //Get relevant hazards
        let filteredHazards = data.filter(d => moment.unix(d.StartDate).year() <= i && moment.unix(d.EndDate).year() >= i && d.TypeEvent.TypeEventName === haz.Hazard)
        tItem[haz.Hazard] = filteredHazards.length
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

  renderAreas(transformedData) {

    let areas = []
    let index = 0;

    Object.keys(transformedData[0]).filter(k => k !== "Year")
      .forEach(key => {

        //Get Hazard color
        let color = "lightgrey"
        color = chartColours[index]

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

    let { filterIDs } = this.state
    let { chart3 } = this.props

    let hazards = []
    if(chart3) hazards = Array.from(new Set(chart3.map(e => e.TypeEvent.TypeEventName))) 

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

        <div
          style={{
            width: "95%",
            textAlign: "center",
            marginTop: "3px",
            marginBottom: "10px",
            paddingRight: "25px",
            color: "grey",
            fontSize: "14px",
            fontWeight: "bolder",
            display: "inline",
            float: "left"
          }}
        >
          PERCENTAGE OF REPORTS OF EACH HAZARD TYPE PER YEAR
        </div>

        <img
          src={popin}
          style={{
            width: "25px",
            cursor: "pointer",
            float: "right",
            display: "inline"
          }}
          onClick={() => { 
            location.hash = location.hash.replace("#/chart3", "")
          }}
        />

        <br />

        <div
          style={{
            width: "100%",
            height: "550px",
            paddingTop: "5px",
            paddingLeft: "10px",
            border: "none"
          }}
        >
          {
            (transformedData.length > 0 && hazards.length > 0) &&
            <ResponsiveContainer key="G3Graph" width="96%" height="98%">
              <AreaChart data={transformedData} stackOffset="expand" >
                <XAxis dataKey="Year" />
                <YAxis tickFormatter={this.toPercent} />
                <Tooltip content={this.renderTooltipContent} />
                {this.renderAreas(transformedData)}
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          }
        </div>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(DashGraph3FullView)