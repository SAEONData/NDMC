'use strict'

//React
import React from 'react'
import { connect } from 'react-redux'

//Local
import * as ACTION_TYPES from '../../../constants/action-types'

//AntD Tree
import TreeSelect from 'antd/lib/tree-select'
import '../../../../css/antd.tree-select.css' //Overrides default antd.tree-select css
import '../../../../css/antd.select.css' //Overrides default antd.select css

//Odata
import OData from 'react-odata'
const baseUrl = 'https://localhost:44334/odata/'

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
  }

  componentDidUpdate(){

    let { regionFilter } = this.props
    if(regionFilter.name === "" || regionFilter === 0) regionFilter = { id: 0, name: "Select..." }

    if(regionFilter.name !== this.state.treeValue){
      this.setState({ treeValue: regionFilter.name})
    }
  }

  onSelect(value, node) {
    let { loadRegionFilter } = this.props
    loadRegionFilter({ id: parseInt(value), name: node.props.title })

    console.log("selected value", node)
    this.setState({ treeValue: node.props.title })
  }

  /* TransformDataTree
  Converts a flat array of regions that contain regionId's and parentRegionId's into a region tree
  in a format for antd's tree-select
  */
  transformDataTree(filteredRegions) {
    let regions = filteredRegions.map(i => {
      return {
        ParentRegionId: i.ParentRegionId, RegionId: i.RegionId, children: [], title: i.RegionName, value: `${i.RegionId}`, key: i.RegionId
      }
    })
    regions.forEach(f => { f.children = regions.filter(g => g.ParentRegionId === f.RegionId) })
    var resultArray = regions.filter(f => f.ParentRegionId == null)
    return resultArray
  }

  render() {
    const regionQuery = {
      select: ['RegionId', 'RegionName', 'ParentRegionId', 'RegionTypeId'],
      filter: { RegionTypeId: { ne: 5 } }
    }
    return (
      <>
        <br />
        <OData baseUrl={baseUrl + 'regions'} query={regionQuery}>
          {({ loading, error, data }) => {
            if (loading) { return <div>Loading...</div> }
            if (error) { return <div>Error Loading Data From Server</div> }
            if (data) {
              if (data.value) {
                let regionTree = this.transformDataTree(data.value)
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