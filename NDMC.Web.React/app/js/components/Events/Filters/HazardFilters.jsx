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
  let { lookupData: { hazardTree, hazard } } = state
  let { filterData: { hazardFilter } } = state
  return { hazardTree, hazardFilter, hazard }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadData: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_HAZARD_TREE, payload })
    },
    loadHazardFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_HAZARD_FILTER, payload })
    },
    loadHazardType: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_HAZARD_TYPE, payload })
    }
  }
}

class HazardFilters extends React.Component {
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
    if (typeof parsedHash.hazard !== 'undefined') {
      //Dispatch to store
      let { loadHazardFilter } = this.props
      loadHazardFilter(parsedHash.hazard)
      stripURLParam('hazard=' + parsedHash.hazard)
    }
  }

  componentDidMount() {
    //Load data
    let { loadData, loadHazards } = this.props
    fetch(apiBaseURL + 'api/Hazard/GetAllTree', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        loadData(res)
      })

    fetch(apiBaseURL + 'api/Hazard/GetAll/', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        loadHazards(res)
      })
  }

  expandAllNodes() {
    let expandedKeys = []
    let { hazard } = this.props
    hazard.map(x => expandedKeys.push(x.HazardID.toString()))
    this.setState({ expandedKeys: expandedKeys })
  }

  collapseAllNodes() {
    this.setState({ expandedKeys: [] })
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
    let { loadHazardFilter } = this.props
    let id = selectedKeys[0]
    if (typeof id === 'undefined') {
      id = 0
    }
    loadHazardFilter(id)
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

  onExpand(expandedKeys) {
    this.setState({ expandedKeys: expandedKeys })
  }

  render() {
    let { hazard, hazardTree, hazardFilter } = this.props
    let { expandedKeys } = this.state
    let selectedValue = 'All'
    let treeData = typeof hazardTree.dataSource === 'undefined' ? [] : hazardTree.dataSource
    if (hazardFilter > 0 && hazard.length > 0) {
      selectedValue = hazard.filter(x => x.HazardId === parseInt(hazardFilter))[0].HazardName
    }
    let uiconf = UILookup('treeHazardFilter', 'Hazard filter:')
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
            <Button color='secondary' size='sm' id='btnHazardTreeExpandAll' style={{ marginLeft: '0px' }} onTouchTap={this.expandAllNodes} >
              <i className='fa fa-plus-circle' aria-hidden='true'></i>&nbsp;&nbsp;Expand all
                        </Button>
            <Button color='secondary' size='sm' id='btnHazardTreeCollapseAll' onTouchTap={this.collapseAllNodes}>
              <i className='fa fa-minus-circle' aria-hidden='true'></i>&nbsp;&nbsp;Collapse all
                        </Button>
          </div>
        </div>
        <br />
        <Tree key={GetUID()}
          autoExpandParent
          onSelect={this.onSelect}
          defaultSelectedKeys={[hazardFilter.toString()]}
          defaultExpandedKeys={[...expandedKeys, ...this.getParentKeys(hazardFilter, hazard), hazardFilter.toString()]}
          onExpand={this.onExpand}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
        <ReactTooltip />
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HazardFilters)