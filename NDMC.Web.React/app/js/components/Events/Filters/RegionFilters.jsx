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
const baseUrl = 'http://app01.saeon.ac.za/ndmcapi/odata/'

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

  componentDidMount() {
  }

  onSelect(value, node) {
    let { loadRegionFilter } = this.props
    this.setState({ treeValue: value })

    // Check if selected node is top level, if it is, create an array of second level
    // region id's so that we can filter events with third level region id's easily
    if (node.props.parentRegionId === null) {
      let regionFilterArray = node.props.children.map(child => parseInt(child.key))
      regionFilterArray.push(parseInt(value))
      loadRegionFilter({ id: regionFilterArray, name: node.props.title })
    }
    else {
      loadRegionFilter({ id: parseInt(value), name: node.props.title })
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
    const regionQuery = {
      select: ['RegionId', 'RegionName', 'ParentRegionId'],
      filter: { RegionTypeId: { ne:5}}
    }
    return (
      <>
        <br />
        <OData baseUrl={'http://app01.saeon.ac.za/ndmcapi/odata/regions'} query={regionQuery}>
          {/* {({ loading, error, data }) => {
            if (loading) { return <div>Loading...</div> }
            if (error) { return <div>Error Loading Data From Server</div> }
            console.log(data)
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
          }} */}
        </OData>
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RegionFilters)