'use strict'

import React from 'react'
import { Button } from 'mdbreact'
import { apiBaseURL } from '../../../constants/apiBaseURL'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../../../constants/action-types'
import ReactTooltip from 'react-tooltip'
import { UILookup } from '../../../constants/ui_config'
import { stripURLParam, GetUID } from '../../../globalFunctions.js'

//AntD Tree
import Tree from 'antd/lib/tree'
import '../../../../css/antd.tree.css' //Overrides default antd.tree css
const TreeNode = Tree.TreeNode

const queryString = require('query-string')

const mapStateToProps = (state, props) => {
  let { lookupData: { region } } = state
  let { filterData: { regionFilter } } = state
  return { regionFilter, region }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRegionFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_REGION_FILTER, payload })
    },
    loadRegions: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_REGION, payload })
    }
  }
}

class RegionFilters extends React.Component {
  constructor(props) {
    super(props)
    this.expandAllNodes = this.expandAllNodes.bind(this)
    this.collapseAllNodes = this.collapseAllNodes.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onExpand = this.onExpand.bind(this)

    //Set initial local
    this.state = { expandedKeys: [] }

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
    //Load data
    let { loadRegions } = this.props
    fetch(apiBaseURL + 'api/events/regions', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        loadRegions(res)
      })
  }

  renderTreeNodes(data) {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={(item.modifiedState === true ? '* ' : '') + item.text} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode title={(item.modifiedState === true ? '* ' : '') + item.text} key={item.id} />
    })
  }

  onSelect(selectedKeys, info) {
    let { loadRegionFilter } = this.props
    let id = selectedKeys[0]
    if (typeof id === 'undefined') {
      id = 0
    }
    loadRegionFilter(id)
  }

  getParentKeys(id, data) {
    let parentKeys = []
    if (data.length > 0 && id > 0) {
      let idKey = Object.keys(data[0])[0].toString()
      let parentIdKey = 'Parent' + idKey
      let selectedItem = data.filter(x => x[idKey] == id)[0]
      if (selectedItem[parentIdKey] !== null) {
        let parentId = selectedItem[parentIdKey].toString()
        parentKeys.push(parentId)
        parentKeys.push(...this.getParentKeys(parentId, data))
      }
    }
    return parentKeys
  }

  expandAllNodes() {
    let expandedKeys = []
    let { region } = this.props
    region.map(x => expandedKeys.push(x.RegionId.toString()))
    this.setState({ expandedKeys: expandedKeys })
  }

  collapseAllNodes() {
    this.setState({ expandedKeys: [] })
  }

  onExpand(expandedKeys) {
    this.setState({ expandedKeys: expandedKeys })
  }

  transformDataTree(effectiveData, globalData, level = 0) {
    let treeNodes = []
    let parentIdKey = "Parent" + Object.keys(effectiveData[0])[0].toString()
    if (typeof globalData === 'undefined') {
      globalData = effectiveData
    }
    if (level === 0) {
      effectiveData = effectiveData.filter(x => x[parentIdKey] === null)
    }
    effectiveData.map(item => {
      let newTreeNode = {
        id: item[Object.keys(item)[0]],
        text: item[Object.keys(item)[1]],
        modifiedState: item.modifiedState
      }
      let children = globalData.filter(x => x[parentIdKey] == newTreeNode.id)
      if (children.length > 0) {
        newTreeNode.children = this.transformDataTree(children, globalData, (level + 1))
      }
      treeNodes.push(newTreeNode)
    })
    return treeNodes
  }

  render() {
    let { region, regionFilter } = this.props
    let { expandedKeys } = this.state
    let selectedValue = 'All'

    let treeData
    let filteredRegions = region.filter(function (item) {
      return !item.RegionName.includes('Ward')
    })
    if (filteredRegions.length > 1) {
      treeData = this.transformDataTree(filteredRegions)
    }
    if (regionFilter > 0 && region.length > 0) {
      selectedValue = region.filter(x => x.RegionId === parseInt(regionFilter))[0].RegionName
    }
    let uiconf = UILookup('treeRegionFilter', 'Region filter:')

    return (
      <>
        <div className='row'>
          <div className='col-md-12'>
            <label data-tip={uiconf.tooltip} style={{ fontSize: 'large' }}>{uiconf.label}&nbsp;&nbsp;</label>
            <label data-tip={uiconf.tooltip2} style={{ fontSize: 'large', fontWeight: 'bold' }}>{selectedValue}</label>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <Button color='secondary' size='sm' id='btnRegionTreeExpandAll' style={{ marginLeft: '0px' }} onTouchTap={this.expandAllNodes} >
              <i className='fa fa-plus-circle' aria-hidden='true'></i>&nbsp;&nbsp;Expand all
                        </Button>
            <Button color='secondary' size='sm' id='btnRegionTreeCollapseAll' onTouchTap={this.collapseAllNodes}>
              <i className='fa fa-minus-circle' aria-hidden='true'></i>&nbsp;&nbsp;Collapse all
                        </Button>
          </div>
        </div>
        <br />
        <Tree key={GetUID()}
          autoExpandParent
          onSelect={this.onSelect}
          defaultSelectedKeys={[regionFilter.toString()]}
          defaultExpandedKeys={[...expandedKeys, ...this.getParentKeys(regionFilter, region), regionFilter.toString()]}
          onExpand={this.onExpand}
        >
          {treeData === undefined ? [] : this.renderTreeNodes(treeData)}
        </Tree>
        <ReactTooltip />
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RegionFilters)