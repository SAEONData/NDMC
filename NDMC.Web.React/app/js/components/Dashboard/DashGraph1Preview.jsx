import React from 'react'
import { connect } from 'react-redux'
import popout from '../../../images/popout.png'
import OData from 'react-odata'
import { apiBaseURL } from '../../config/serviceURLs.js'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import buildQuery from 'odata-query'
import { CustomFetch } from '../../globalFunctions';

const _gf = require('../../globalFunctions')

const mapStateToProps = (state, props) => {
  let { filterData: { regionFilter, hazardFilter, impactFilter, dateFilter } } = state
  let { chartData: { chart1 } } = state
  return { regionFilter, hazardFilter, impactFilter, chart1, dateFilter }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScrollPos: payload => {
      dispatch({ type: "SET_EVENTS_SCROLL", payload })
    },
    setChartData: payload => {
      dispatch({ type: "SET_CHART_1", payload })
    }
  }
}

class DashGraph1Preview extends React.Component {

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

  async getChartData() {

    if (this.props.chart1.length === 0) {

      const query = buildQuery({
        select: ["TypeMitigationName", "TypeMitigationId", "ParentTypeMitigationId"],
        filter: {
          UnitOfMeasure: "Rands"
        },
        expand: {
          Mitigations: {
            select: ["EventId", "Date", "Value"],
            filter: {
              Date: { gt: 0 }
            }
          }
        }
      })

      try {
        let res = await CustomFetch(apiBaseURL + `TypeMitigations${query}`)
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

  transformData(data, filterIDs) {

    let tData = []

    if (!data) {
      return []
    }

    let currentYear = new Date().getFullYear()
    let minYear = currentYear
    let maxYear = 0

    //Get MinYear
    data.forEach(tm => {
      if (tm.Mitigations) {
        tm.Mitigations.forEach(m => {
          if (filterIDs.includes(m.EventId) && m.Date < minYear) {
            minYear = m.Date
          }
        })
      }
    })

    //Get MaxYear
    data.forEach(tm => {
      if (tm.Mitigations) {
        tm.Mitigations.forEach(m => {
          if (filterIDs.includes(m.EventId) && m.Date > maxYear && m.Date <= currentYear) {
            maxYear = m.Date
          }
        })
      }
    })

    for (let i = minYear; i <= maxYear; i++) {

      let Rehab_Reconst = this.recursiveSum(data, filterIDs, this.getIdByKey(data, "Rehabilitation and Reconstruction"), i)
      let Emergency = this.recursiveSum(data, filterIDs, this.getIdByKey(data, "Emergency"), i)
      let Mitigation = this.recursiveSum(data, filterIDs, this.getIdByKey(data, "Mitigation"), i)
      let Adaptation = this.recursiveSum(data, filterIDs, this.getIdByKey(data, "Adaptation"), i)

      tData.push({
        Year: i,
        Rehab_Reconst: Math.round(Rehab_Reconst * 100) / 100,
        Emergency: Math.round(Emergency * 100) / 100,
        Mitigation: Math.round(Mitigation * 100) / 100,
        Adaptation: Math.round(Adaptation * 100) / 100,
      })
    }

    return tData
  }

  getIdByKey(data, key) {
    let id = 0

    let filtered = data.filter(tm => tm.TypeMitigationName === key)
    if (filtered.length > 0) {
      id = filtered[0].TypeMitigationId
    }

    return id
  }

  recursiveSum(data, filterIDs, id, year) {

    let sum = 0

    let typeMitigations = data.filter(m => m.ParentTypeMitigationId === id)
    typeMitigations.forEach(tm => {
      tm.Mitigations.filter(m => m.Date === year && filterIDs.includes(m.EventId))
        .forEach(m => {
          sum += m.Value + this.recursiveSum(data, tm.TypeMitigationId, year)
        })
    })

    return sum
  }

  renderTooltipContent(params) {
    const { payload, label, active } = params;

    return (
      <div>
        {
          active &&
          <div style={{ backgroundColor: "white", padding: "10px", border: "1px solid gainsboro", width: "110%" }}>
            <p className="total" style={{ marginBottom: "5px" }}>{`${label}`}</p>
            {
              payload.map((entry, index) => {

                if (entry.name === "Rehab_Reconst") {
                  entry.name = "Rehabilitation"
                }

                return (
                  <p key={`item-${index}`} style={{ color: entry.color, marginBottom: "0px", fontSize: "13px" }}>
                    {`${entry.name}: ${entry.value}`}
                  </p>
                )
              }
              )
            }
          </div>
        }
      </div>
    )
  }

  render() {

    let { chart1 } = this.props
    let { filterIDs } = this.state

    //let filteredData = chart1.filter(p => filterIDs.includes(p.ProjectId))

    let transformedData = this.transformData(chart1, filterIDs)

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
            location.hash = location.hash.replace("#/", "#/chart1")
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
          FUNDING
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
                <Line dot={false} type='monotone' dataKey='Rehab_Reconst' stroke='#82CA9D' strokeWidth={2} />
                <Line dot={false} type="monotone" dataKey="Emergency" stroke="#8884D8" strokeWidth={2} />
                <Line dot={false} type="monotone" dataKey="Mitigation" stroke="#FFCF77" strokeWidth={2} />
                <Line dot={false} type="monotone" dataKey="Adaptation" stroke="#A2D0D8" strokeWidth={2} />
                <Tooltip content={this.renderTooltipContent} />
              </LineChart>
            </ResponsiveContainer>
          }
        </div>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(DashGraph1Preview)