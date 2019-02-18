'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../../../config/action-types'
import OData from 'react-odata'
import { apiBaseURL, vmsBaseURL } from '../../../config/serviceURLs.js'
import TreeSelect from 'antd/lib/tree-select'
import '../../../../css/antd.tree-select.css' //Overrides default antd.tree-select css

const mapStateToProps = (state, props) => {
  let { filterData: { hazardFilter, hazards } } = state
  return { hazardFilter, hazards }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadHazardFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_HAZARD_FILTER, payload })
    },
    loadHazards: payload => {
      dispatch({ type: "LOAD_HAZARDS", payload })
    }
  }
}

/**
 * EventResponseTab Class for dealing with hazard filter selection and renderings
 * @class
 */
class HazardFilters extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: "Select..."
    }
    this.onHazardSelect = this.onHazardSelect.bind(this)
    this.transformTreeData = this.transformTreeData.bind(this)
  }

  componentDidMount () {
    this.Init()
  }

  componentDidUpdate () {
    this.Init()
  }

  /**
   * Initialize the Hazard Filter class with default values
   *
   * @function
   */
  Init () {
    let { hazardFilter, hazards } = this.props

    let searchHazards = hazards.filter(h => h.TypeEventId == hazardFilter)
    let hazardName = "Select..."
    if (searchHazards.length > 0) {
      hazardName = searchHazards[0].TypeEventName
    }

    // if (hazardName !== this.state.value) {
    //   this.setState({ value: hazardName })
    // }
  }

  /**
  * Handle selection of hazard filter
  * @function
  * @param {string} value String value of the selected node
  * @param {object} node Object of selected node contatining details of node
  */
  onHazardSelect (value, node) {
    let { loadHazardFilter } = this.props
    loadHazardFilter(parseInt(node.props.id))
    this.setState({ value: value })
  }

  /**
   * Recursive function that takes a hazard array object and maps each key to a new value for ant.d's treeselect.
   *
   * @function
   * @param {object} hazards
   * @returns The final object keymapped to new values
   */
  transformTreeData (hazards) {
    if (typeof hazards === 'object') {
      return hazards.map(item => {
        return { ...item, title: item.value, children: this.transformTreeData(item.children) }
      })
    }
  }

  render () {
    const hazardsQuery = {
      select: ['TypeEventId', 'TypeEventName']
    }
    return (
      <>
        {/* <OData baseUrl={vmsBaseURL + 'hazards/flat'} query={hazardsQuery}>
          {({ loading, error, data }) => {
            if (loading) { return <div>Loading...</div> }
            if (error) { return <div>Error Loading Data From Server</div> }
            if (data) {
              //Dispatch data to store
              setTimeout(() => {
                if (!_.isEqual(data.items, this.props.hazards)) {
                  this.props.loadHazards(data.items)
                }
              }, 100)
            }
          }
          }
        </OData> */}
        <OData baseUrl={vmsBaseURL + 'hazards'} query={hazardsQuery}>
          {({ loading, error, data }) => {
            if (loading) { return <div>Loading...</div> }
            if (error) { return <div>Error Loading Data From Server</div> }
            if (data && data.items) {
              let hazards = data.items
              let convertedHazards = this.transformTreeData(hazards)

              return (
                <TreeSelect
                  style={{ width: "100%" }}
                  value={this.state.value}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  dropdownMatchSelectWidth={false}
                  treeData={convertedHazards}
                  placeholder="Select..."
                  onSelect={this.onHazardSelect}
                >
                </TreeSelect>
              )
            }
          }}
        </OData>
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HazardFilters)
