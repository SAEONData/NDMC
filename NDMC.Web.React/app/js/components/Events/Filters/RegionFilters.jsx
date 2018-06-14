'use strict'

//React
import React from 'react'
import { Button } from 'mdbreact'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'

//Local
import * as ACTION_TYPES from '../../../constants/action-types'
import { stripURLParam, GetUID } from '../../../globalFunctions.js'

//AntD Tree
// import TreeSelect from 'antd/lib/tree-select'
// import '../../../../css/antd.tree-select.css' //Overrides default antd.tree css

import TreeSelect from 'antd/lib/tree-select'
import '../../../../css/antd.tree-select.css' //Overrides default antd.tree-select css
import '../../../../css/antd.select.css' //Overrides default antd.select css
const TreeSelectNode = TreeSelect.TreeNode

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

  onChange(value) {
    console.log(value)
    this.setState({ treeValue: value })
  }

  transformDataTree(filteredRegions) {
    let regions = filteredRegions.map(i => {
      return {
        regionName: i.regionName,
        parentRegionId: i.parentRegionId,
        regionId: i.regionId,
        children: [],
        label: i.regionName, //Can be removed if not used elsewhere - replaced by text
        text: i.regionName, //Added text property
        value: `${i.regionId}`,
        key: i.regionId, //Can be removed if not used elsewhere - replaced by id
        id: i.regionId //Added id property
      }
    })
    regions.forEach(f => { f.children = regions.filter(g => g.parentRegionId === f.regionId) })

    var resultArray = regions.filter(f => f.parentRegionId == null)
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
                <div className="col-md-6">
                  <TreeSelect
                    style={{ width: "100%" }}
                    value={this.state.treeValue}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={regionTree} // you were transforming the transformed data again here
                    placeholder="Please select a region"
                    // treeDefaultExpandAll - removed this prop
                    onChange={this.onChange}
                  >
                  </TreeSelect>
                </div>
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