'use strict'

import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { connect } from 'react-redux'
import * as ACTION_TYPES from "../../constants/action-types"
import { UILookup } from "../../constants/ui_config.js"

//AntD Tree-Select
import TreeSelect from 'antd/lib/tree-select'
import '../../../css/antd.tree-select.css' //Overrides default antd.tree-select css
import '../../../css/antd.select.css' //Overrides default antd.select css
const TreeSelectNode = TreeSelect.TreeNode;

const mapStateToProps = (state, props) => {
    let { globalData: { editMode } } = state
    let editListModalStateChanged = state.editListModalData.show
    return { editMode, editListModalStateChanged }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedValue: (key, payload) => {
            dispatch({ type: key, payload })
        },
        setEditList: (payload) => {
            dispatch({ type: ACTION_TYPES.SET_EDIT_LIST, payload })
        }
    }
}

let allowChange = false

class TreeSelectComponent extends React.Component {

    constructor(props) {
        super(props);

        // this.onSelect = this.onSelect.bind(this)
        this.getDisabledState = this.getDisabledState.bind(this)
    }

    getFontColour() {
        if (this.props.editMode) {
            return "steelblue"
        }
        else {
            return "black"
        }
    }

    getLabelFontColour(uiconf) {
        if (typeof uiconf.required != 'undefined' && uiconf.required === true) {
            return "red"
        }
        else {
            return "black"
        }
    }

    getDisabledState() {
        let { editMode, editModeOverride } = this.props

        let disabledState = true

        if (typeof editModeOverride !== "undefined" && editModeOverride === true) {
            disabledState = false
        }
        else if (typeof editMode !== "undefined" && editMode === true) {
            disabledState = false
        }

        return disabledState
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

    renderTreeSelectNodes(data, level = "top") {

        let { allowEdit } = this.props

        if (allowEdit === true && level === "top") {

            //Insert "[Edit list values...]" entry
            if (data.filter(x => x.value === "[Edit list values...]").length === 0) {
                data.splice(0, 0, {
                    "id": -1,
                    "text": "[Edit list values...]",
                    "modifiedState": false
                })
            }
        }

        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeSelectNode value={item.text} title={(item.modifiedState === true ? "* " : "") + item.text} key={item.id} dataRef={item}>
                        {this.renderTreeSelectNodes(item.children, "child")}
                    </TreeSelectNode>
                )
            }
            return <TreeSelectNode value={item.text} title={(item.modifiedState === true ? "* " : "") + item.text} key={item.id} />
        })
    }

    dependencyTreeSelect(value, label, extra) {

        let { setSelectedValueKey, setSelectedValue, editMode, parentId, setEditList, data, dispatch, persist, type, dependencies, newItemTemplate } = this.props
        let selectedValue = 0

        if (typeof extra.triggerNode !== 'undefined') {
            selectedValue = extra.triggerNode.props.eventKey
        }

        if (selectedValue == -1) {

            //Setup and Show EditListModal
            if (typeof type === 'undefined') {
                type = "std"
            }
            if (typeof dependencies === 'undefined') {
                dependencies = []
            }

            setEditList({
                show: true, data: data, dispatch: dispatch, persist: persist, type: type,
                dependencies: dependencies, newItemTemplate: newItemTemplate
            })
        }
        else {

            //Dispatch to store
            if (typeof setSelectedValueKey !== 'undefined') {
                setSelectedValue(setSelectedValueKey, { value: selectedValue, id: parentId, state: editMode === true ? "modified" : "original" })
            }
        }
    }

    getDisabledState() {
        let { editMode, editModeOverride } = this.props
    
        let disabledState = true
    
        if (typeof editModeOverride !== "undefined" && editModeOverride === true) {
          disabledState = false
        }
        else if (typeof editMode !== "undefined" && editMode === true) {
          disabledState = false
        }
    
        return disabledState
      }

    render() {

        let { col, label, id, selectedValue, data } = this.props
        let uiconf = UILookup(id, label)
        let treeData = []
        let selVal = []

        if (data.length > 0) {

            //Get tree data
            treeData = this.transformDataTree(data)

            //Get selected value
            let idKey = Object.keys(data[0])[0].toString()
            let valueKey = Object.keys(data[0])[1].toString()
            let valObj = data.filter(x => x[idKey] == selectedValue)[0]
            if (typeof valObj !== 'undefined') {
                selVal = valObj[valueKey]
            }
        }

        return (
            <div className={col}>
                <label data-tip={uiconf.tooltip} style={{ fontWeight: "bold", color: this.getLabelFontColour(uiconf) }}>{uiconf.label}</label>

                <TreeSelect
                    disabled={this.getDisabledState()}
                    showSearch
                    searchPlaceholder="Search..."
                    style={{ width: "100%" }}
                    value={selVal}
                    dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
                    placeholder="Select..."
                    allowClear
                    onChange={this.dependencyTreeSelect.bind(this)}
                >
                    {this.renderTreeSelectNodes(treeData)}
                </TreeSelect>

            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeSelectComponent)