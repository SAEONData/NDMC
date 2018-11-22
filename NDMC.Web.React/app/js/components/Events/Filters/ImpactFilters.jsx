'use strict'

//React
import React from 'react'
import { connect } from 'react-redux'

//MDBReact
//import { Select, SelectInput, SelectOptions, SelectOption } from 'mdbreact'

//Local
import * as ACTION_TYPES from '../../../constants/action-types'

//Odata
import OData from 'react-odata'
const baseUrl = 'https://localhost:44334/odata/'

//AntD Tree-Select
import Select from 'antd/lib/select'
import '../../../../css/antd.select.css' //Overrides default antd.select css
const Option = Select.Option;

const mapStateToProps = (state, props) => {
  let { filterData: { impactFilter } } = state
  return { impactFilter }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadImpactFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_IMPACT_FILTER, payload })
    },
  }
}

let _data
class impactFilters extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 'Select...'
    }
    this.optionClick = this.optionClick.bind(this)
  }

  // optionClick(value) {
  //   let { loadImpactFilter } = this.props
  //   let id = 0
  //   let filteredData
  //   if (_data) { filteredData = _data.filter(x => x.TypeImpactName === value[0]) }
  //   if (filteredData) { filteredData[0].TypeImpactId ? id = filteredData[0].TypeImpactId : '' }
  //   if (value[0] !== this.state.value && value !== "Select...") {
  //     this.setState({ value: value[0] })
  //     loadImpactFilter({ id: id, name: value[0] })
  //   }
  // }

  optionClick(value) {

    let { loadImpactFilter } = this.props
    let id = 0

    let filteredData

    if (_data) { 
      filteredData = _data.filter(x => x.TypeImpactName === value) 
    }

    if (filteredData) { 
      filteredData[0].TypeImpactId ? id = filteredData[0].TypeImpactId : '' 
    }

    if (value[0] !== this.state.value && value !== "Select...") {
      this.setState({ value: value })
      loadImpactFilter({ id: id, name: value })
    }
  }

  renderOptions(data){
    let options = []

    //Sort
    data.value.sort((a,b) => (a.TypeImpactName > b.TypeImpactName) ? 1 : ((b.TypeImpactName > a.TypeImpactName) ? -1 : 0))

    //Remove duplicates
    var uniq = {}
    data.value = data.value.filter(obj => !uniq[obj.TypeImpactName] && (uniq[obj.TypeImpactName] = true));

    data.value.map(item => {
      options.push(
        <Option key={item.TypeImpactId + "_" + item.TypeImpactName} value={item.TypeImpactName}>
          {item.TypeImpactName}
        </Option>
      )
    })

    return options
  }

  render() {

    const impactsQuery = {
      select: ['TypeImpactId', 'TypeImpactName']
    }

    return (
      <>

        <OData baseUrl={baseUrl + 'TypeImpacts'} query={impactsQuery}>
          {({ loading, error, data }) => {

            if (loading) { 
              return <div>Loading...</div> 
            }

            if (error) { 
              return <div>Error Loading Data From Server</div> 
            }

            if (data && data.value) {
              return (
                <Select
                  style={{ width: "100%" }}
                  onChange={this.optionClick}
                  value={this.state.value}   
                  dropdownMatchSelectWidth={false}
                >
                  {this.renderOptions(data)}
                </Select>
              )
            }

          }}

        </OData>

        {/* <Select getValue={this.optionClick}
          style={{ marginTop: "-8px" }}
        >
          <SelectInput value={this.state.value}></SelectInput>
          <SelectOptions>
            <OData baseUrl={baseUrl + 'TypeImpacts'} query={impactsQuery}>
              {({ loading, error, data }) => {
                if (loading) { return <div>Loading...</div> }
                if (error) { return <div>Error Loading Data From Server</div> }
                if (data) {
                  _data = data.value
                  let sorted = data.value.map(x => { return { TypeImpactName: x.TypeImpactName, TypeImpactId: x.TypeImpactId } })
                    .sort((c, n) => c.TypeImpactName.localeCompare(n.TypeImpactName))
                  return sorted.map(item => {
                    return <SelectOption key={item.TypeImpactId}>{item.TypeImpactName}</SelectOption>
                  })
                }
              }}
            </OData>
          </SelectOptions>
        </Select> */}


      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(impactFilters)