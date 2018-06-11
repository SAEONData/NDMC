'use strict'

//React
import React from 'react'
import { Button } from 'mdbreact'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'

//Local
import { apiBaseURL } from '../../../constants/apiBaseURL'
import * as ACTION_TYPES from '../../../constants/action-types'
import { UILookup } from '../../../constants/ui_config'
import { stripURLParam, GetUID } from '../../../globalFunctions.js'

//AntD Tree
import TreeSelect from 'antd/lib/tree-select'
import Input from 'antd/lib/input'
//import treestyle from '../../../../css/antd.tree.css' //Overrides default antd.tree css

//GraphQL
import { graphql } from 'graphql'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
const queryString = require('query-string')

const mapStateToProps = (state, props) => {
  let { filterData: { regionFilter } } = state
  return { regionFilter }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRegionFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_REGION_FILTER, payload })
    }
  }
}

class RegionFilters extends React.Component {
  constructor(props) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {
      treeValue: undefined
    }

    //Read initial filter from URL
    const parsedHash = queryString.parse(location.hash.replace('/events?', ''))
    if (typeof parsedHash.region !== 'undefined') {
      //Dispatch to store
      let { loadRegionFilter } = this.props
      loadRegionFilter(parsedHash.region)
      stripURLParam('region=' + parsedHash.region)
    }
  }

  componentDidMount() {
  }

  onSelect(selectedKeys, info) {
    let { loadRegionFilter } = this.props
    let id = selectedKeys[0]
    if (typeof id === 'undefined') {
      id = 0
    }
    loadRegionFilter(id)
  }

  onChange(value) {
    console.log(value)
    this.setState({ treeValue: value })
  }

  transformDataTree(filteredRegions) {
    let regions = filteredRegions.map(i => {
      return { regionName: i.regionName, parentRegionId: i.parentRegionId, regionId: i.regionId, children: [], label: i.regionName, value: `${i.regionId}`, key: i.regionId }
    })
    regions.forEach(f => { f.children = regions.filter(g => g.parentRegionId == f.regionId) })

    var resultArray = regions.filter(f => f.parentRegionId == null)
    console.log(resultArray)
    return resultArray
  }

  render() {
    let { region, regionFilter } = this.props
    let { expandedKeys } = this.state

    const GET_REGIONS = gql`
      {
        Regions {
            regionName
            regionId
            parentRegionId
            regionType {
              regionTypeName
          }
        }
      }`

    let selectedValue = 'All'
    let treeData
    if (regionFilter > 0 && region.length > 0) {
      selectedValue = region.filter(x => x.RegionId === parseInt(regionFilter))[0].RegionName
    }

    return (
      <>
        <br />
        {<Query query={GET_REGIONS}>
          {({ data, loading, error }) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error Loading Data From Server...</p>
            let filteredRegions = data.Regions.filter(region => !region.regionName.includes("Ward"))
            let regionTree = this.transformDataTree(filteredRegions)
            console.log(regionTree)
            return (
              <div className='row'>
                  <TreeSelect key={GetUID()}
                    style={{ width: 300 }}
                    value={this.state.treeValue}
                   // dropdownStyle={treestyle}
                    treeData={this.transformDataTree(regionTree)}
                    placeholder="Please select a region"
                    treeDefaultExpandAll
                    onChange={this.onChange}
                  >
                  </TreeSelect>
              </div>
            )
          }
          }
        </Query>
        }
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RegionFilters)