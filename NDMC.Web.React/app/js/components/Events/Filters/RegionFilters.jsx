'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../../../constants/action-types'
import TreeSelect from 'antd/lib/tree-select'
import '../../../../css/antd.tree-select.css' //Overrides default antd.tree-select css
import '../../../../css/antd.select.css' //Overrides default antd.select css
import OData from 'react-odata'
import { apiBaseURL } from '../../../config/serviceURLs.cfg'

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
  constructor (props) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
    this.state = {
      treeValue: undefined
    }
  }

  componentDidMount(){
    this.Init()
  }

  componentDidUpdate() {
    this.Init()
  }

  Init(){
    let { regionFilter, regions } = this.props

    let searchRegions = regions.filter(r => r.RegionId == regionFilter)
    let regionName = "Select..."
    if (searchRegions.length > 0) {
      regionName = searchRegions[0].RegionName
    }

    if (regionName !== this.state.treeValue) {
      this.setState({ treeValue: regionName })
    }
  }

  /**
   * Handle selection of region filter
   * @param {string} value String value of the selected node
   * @param {object} node Object of selected node contatining details of node
   */
  onSelect (value, node) {
    let { loadRegionFilter } = this.props
    loadRegionFilter(parseInt(value))
    this.setState({ treeValue: node.props.title })
  }

  /**
   * Converts a flat array of regions that contain regionId's and parentRegionId's into a region tree
   * in a format for antd's tree-select
   * @param {object} filteredRegions Object containing array of pre-filtered regions
   */
  transformDataTree (filteredRegions) {
    let regions = filteredRegions.map(i => {
      return {
        ParentRegionId: i.ParentRegionId, RegionId: i.RegionId, children: [], title: i.RegionName, value: `${ i.RegionId }`, key: i.RegionId
      }
    })
    regions.forEach(f => { f.children = regions.filter(g => g.ParentRegionId === f.RegionId) })
    var resultArray = regions.filter(f => f.ParentRegionId == null)
    return resultArray
  }

  render () {
    const regionQuery = {
      select: ['RegionId', 'RegionName', 'ParentRegionId', 'RegionTypeId'],
      filter: { RegionTypeId: { ne: 5 } }
    }
    return (
      <>
        <br />
        <OData baseUrl={apiBaseURL + 'regions'} query={regionQuery}>
          {({ loading, error, data }) => {
            if (loading) { return <div>Loading...</div> }
            if (error) { return <div>Error Loading Data From Server</div> }
            if (data) {
              if (data.value) {
                //Dispatch data to store
                setTimeout(() => {
                  if (!_.isEqual(data.value, this.props.regions)) {
                    this.props.loadRegions(data.value)
                  }
                }, 100)
                let regionTree = this.transformDataTree(data.value)
                regionTree.sort((a, b) => a.title.localeCompare(b.title))
                return (
                  <TreeSelect
                    style={{ width: "100%" }}
                    value={this.state.treeValue}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={regionTree}
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
