'use strict'

import React from 'react'
import { Button, Collapse } from 'mdbreact'
import { connect } from 'react-redux'
import { Chip } from 'material-ui'
import * as ACTION_TYPES from "../../../constants/action-types"

//Filters
//import GeneralFilters from './GeneralFilters.jsx';
import RegionFilters from './RegionFilters.jsx';
import HazardFilters from './HazardFilters.jsx';

const mapStateToProps = (state, props) => {
    let { filterData: { regionFilter, hazardFilter } } = state
    let { lookupData: { region, hazard } } = state
    return { regionFilter, region, hazardFilter, hazard }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearFilters: payload => {
            dispatch({ type: ACTION_TYPES.CLEAR_FILTERS, payload })
        },
        clearHazardFilter: () => {
            dispatch({ type: ACTION_TYPES.LOAD_HAZARD_FILTER, payload: 0 })
        },
        clearRegionFilter: () => {
            dispatch({ type: ACTION_TYPES.LOAD_REGION_FILTER, payload: 0 })
        }
    }
}

class EventFilters extends React.Component {
    constructor(props) {
        super(props);
        this.toggleRegion = this.toggleRegion.bind(this)
        this.toggleHazard = this.toggleHazard.bind(this)
        this.clearFilters = this.clearFilters.bind(this)
        this.renderFilterChips = this.renderFilterChips.bind(this)

        this.state = {
            collapseRegion: false,
            collapsHazzard: false
        }
    }

    toggleRegion() {
        this.setState({ collapseRegion: !this.state.collapseRegion })
    }

    toggleHazard() {
        this.setState({ collapseHazard: !this.state.collapseHazard })
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
        location.hash = "/events"
    }

    renderFilterChips() {
        let { hazardFilter, regionFilter, region, hazard } = this.props
        let filterChips = []
        if (hazardFilter > 0 && hazard.length > 0) {
            filterChips.push(<br key="br" />)
            if (hazardFilter !== "") {
                filterChips.push(
                    <Chip
                        label={"Hazard: " + hazard.filter(x => x.HazardID === parseInt(hazardFilter))[0].HazardName}
                        onDelete={() => this.deleteFilterChip("title")}
                        style={{ backgroundColor: "#4285F4", marginRight: "5px" }}
                        key="hazardFilterChip"
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
            case "region":
                this.props.clearRegionFilter()
                break
            case "hazard":
                this.props.clearHazardFilter()
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
                        <Button block color={this.getBottonColor(this.state.collapseHazard)} className="btn-sm" onTouchTap={this.toggleHazard} >Hazard filters</Button>
                    </div>
                    <div className="col-md-3">
                        <Button block color="secondary" className="btn-sm" onTouchTap={this.clearFilters} >
                            <i className="fa fa-eraser" aria-hidden="true"></i>&nbsp;&nbsp;Clear filters
                        </Button>
                    </div>
                </div>
                <hr />
                <Collapse isOpen={this.state.collapseRegion}>
                    <RegionFilters />
                    <hr />
                </Collapse>
                <Collapse isOpen={this.state.collapseHazard}>
                    <HazardFilters />
                    <hr />
                </Collapse>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventFilters)