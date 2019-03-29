'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../../../config/action-types'
import { TreeSelect } from 'antd'
import OData from 'react-odata'
import { vmsBaseURL } from '../../../config/serviceURLs.js'

const mapStateToProps = (state, props) => {
  let { filterData: { regionFilter, regions } } = state
  return { regionFilter, regions }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRegionFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_REGION_FILTER, payload })
    },
    loadRegions: payload => {
      dispatch({ type: "LOAD_REGIONS", payload })
    }
  }
}

/**
 * RegionFilters Class for dealing with region filter selection and rendering
 * @class
 */
class RegionFilters extends React.Component {
  constructor(props) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
    this.state = {
      treeValue: undefined
    }
  }

  componentDidMount() {
    this.Init()
  }

  componentDidUpdate() {
    this.Init()
  }

  Init() {
    let { regionFilter, regions } = this.props

    let searchRegions = regions.filter(r => r.RegionId == regionFilter)
    let regionName = "Select..."
    if (searchRegions.length > 0) {
      regionName = searchRegions[0].RegionName
    }
  }

  /**
   * Handle selection of region filter
   * @param {string} value String value of the selected node
   * @param {object} node Object of selected node contatining details of node
   */
  onSelect(value, node) {
    let { loadRegionFilter } = this.props
    loadRegionFilter(parseInt(node.props.id))
    this.setState({ treeValue: value })
  }

  render() {
    const regionQuery = {
      select: ['RegionId', 'RegionName', 'ParentRegionId', 'RegionTypeId']
    }
    return (
      <>
        <OData baseUrl={vmsBaseURL + 'regions'} query={regionQuery}>
          {({ loading, error, data }) => {
            if (loading) { return <div>Loading...</div> }
            if (error) { return <div>Error Loading Data From Server</div> }
            if (data) {
              if (data.items) {
                let regionsFormatted = data.items.map(region => {
                  return {
                    ...region, title: region.value, children: region.children.map(subRegion => {
                      return {
                        ...subRegion, title: subRegion.value, children: subRegion.children.map(subSubRegion => {
                          return { ...subSubRegion, title: subSubRegion.value }
                        })
                      }
                    })
                  }
                })
                data.items.sort((a, b) => a.value.localeCompare(b.value))
                return (
                  <TreeSelect
                    style={{ width: "100%" }}
                    value={this.state.treeValue}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={regionsFormatted}
                    placeholder="Select..."
                    onSelect={this.onSelect}
                  >
                  </TreeSelect>
                )
              }
            }
          }}
        </OData>
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RegionFilters)
