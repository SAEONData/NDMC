'use strict'

import React from 'react'
import { Button, Collapse } from 'mdbreact'
import { connect } from 'react-redux'
import { Chip } from 'material-ui'
import * as ACTION_TYPES from "../../../constants/action-types"

//Filters
//import GeneralFilters from './GeneralFilters.jsx';
//import RegionFilters from './RegionFilters.jsx';
//import SectorFilters from './SectorFilters.jsx';

const mapStateToProps = (state, props) => {
    let { filterData: { titleFilter, regionFilter } } = state
    let { lookupData: { region } } = state
    return { titleFilter,  regionFilter, region }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearFilters: payload => {
            dispatch({ type: ACTION_TYPES.CLEAR_FILTERS, payload })
        },
        clearTitleFilter: () => {
            dispatch({ type: ACTION_TYPES.LOAD_TITLE_FILTER, payload: "" })
        },
        clearRegionFilter: () => {
            dispatch({ type: ACTION_TYPES.LOAD_REGION_FILTER, payload: 0 })
        }
    }
}

class EventFilters extends React.Component {

    constructor(props) {
        super(props);
        this.toggleRegion = this.toggleRegion.bind(this);
        this.clearFilters = this.clearFilters.bind(this)
        this.renderFilterChips = this.renderFilterChips.bind(this)

        this.state = {
            collapseGeneral: false,
            collapseRegion: false,
            collapseSector: false,
        };
    }

    toggleRegion() {
        this.setState({ collapseRegion: !this.state.collapseRegion });
    }

    getBottonColor(state) {
        if (state === true) {
            return "warning"
        }
        else {
            return "primary"
        }
    }

    clearFilters() {

        let { clearFilters } = this.props
        clearFilters("")

        location.hash = "/projects"
    }

    renderFilterChips() {

        let { titleFilter, regionFilter, region } = this.props
        let filterChips = []

        if (titleFilter !== "" || regionFilter !== 0) {
            filterChips.push(<br key="br" />)
            if (titleFilter !== "") {
                filterChips.push(
                    <Chip
                        label={"Title: " + titleFilter}
                        onDelete={() => this.deleteFilterChip("title")}
                        style={{ backgroundColor: "#4285F4", marginRight: "5px" }}
                        key="titleFilterChip"
                    />
                )
            }
            if (regionFilter > 0 && region.length > 0) {
                filterChips.push(
                    <Chip
                        label={"Region: " + region.filter(x => x.RegionId === parseInt(regionFilter))[0].RegionName}
                        onDelete={() => this.deleteFilterChip("region")}
                        style={{ backgroundColor: "#4285F4", marginRight: "5px" }}
                        key="regionFilterChip"
                    />
                )
            }
        }
        else {
            filterChips.push(<div key="br" />)
        }
        return filterChips
    }

    deleteFilterChip(type) {
        switch (type) {
            case "title":
                this.props.clearTitleFilter()
                break
            case "region":
                this.props.clearRegionFilter()
                break
        }
    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-md-12">
                        {this.renderFilterChips()}
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-3">
                        <Button block color={this.getBottonColor(this.state.collapseRegion)} className="btn-sm" onTouchTap={this.toggleRegion} >Region filters</Button>
                    </div>
                    <div className="col-md-3">
                        <Button block color="secondary" className="btn-sm" onTouchTap={this.clearFilters} >
                            <i className="fa fa-eraser" aria-hidden="true"></i>&nbsp;&nbsp;Clear filters
                        </Button>
                    </div>
                </div>
                <hr />
                <Collapse isOpen={this.state.collapseRegion}>
                    {/* <RegionFilters /> */}
                    <hr />
                </Collapse>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventFilters)