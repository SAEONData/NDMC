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
    this.onSelect = this.onSelect.bind(this)
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

  onSelect(value, node, extra) {
    let { loadRegionFilter } = this.props
    this.setState({ treeValue: value })

    // Check if selected node is top level, if it is, create an array of second level
    // region id's so that we can filter events with third level region id's easily
    if (node.props.parentRegionId === null) {
      let regionFilterArray = node.props.children.map(child => parseInt(child.key))
      regionFilterArray.push(parseInt(value))
      loadRegionFilter(regionFilterArray)
    }
    else {
      loadRegionFilter(parseInt(value))
    }
  }

  /* TransformDataTree
  Converts a flat array of regions that contain regionId's and parentRegionId's into a region tree
  in a format for antd's tree-select
  */
  transformDataTree(filteredRegions) {
    let regions = filteredRegions.map(i => {
      return {
        parentRegionId: i.parentRegionId, regionId: i.regionId, children: [], title: i.regionName, value: `${i.regionId}`, key: i.regionId
      }
    })
    regions.forEach(f => { f.children = regions.filter(g => g.parentRegionId === f.regionId) })
    var resultArray = regions.filter(f => f.parentRegionId == null)
    return resultArray
  }

  render() {
    let { regionFilter } = this.props
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
    return (
      <>
        <br />
        {<Query query={GET_REGIONS}>
          {({ data, loading, error }) => {
            if (loading) return <p>Loading Region List...</p>
            if (error) return <p>Error Loading Region List From Server...</p>
            let filteredRegions = data.Regions.filter(region => !region.regionName.includes("Ward"))
            let regionTree = this.transformDataTree(filteredRegions)
            return (
              <div className='row'>
                <div className="col-md-6">
                  <TreeSelect
                    style={{ width: "100%" }}
                    value={this.state.treeValue}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={regionTree}
                    placeholder="Please select a region"
                    onSelect={this.onSelect}
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