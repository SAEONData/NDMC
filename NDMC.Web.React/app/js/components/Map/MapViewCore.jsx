import React from 'react'
import { Row, Col, Button } from 'mdbreact'
import { connect } from 'react-redux'
import popout from '../../../images/popout.png'
import popin from '../../../images/popin.png'
import { MapConfig } from '../../../data/mapConfig'
import loader from '../../..//images/loader.gif'

const mapStateToProps = (state, props) => {
  let { filterData: { titleFilter, statusFilter, typologyFilter, regionFilter, sectorFilter, favoritesFilter } } = state
  return {
    titleFilter, statusFilter, typologyFilter, regionFilter, sectorFilter, favoritesFilter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScrollPos: payload => {
      dispatch({ type: "SET_PROJECT_SCROLL", payload })
    }
  }
}

class MapViewCore extends React.Component {

  constructor(props) {
    super(props);
  }

  buildMapConfig() {

    let { titleFilter, statusFilter, typologyFilter, regionFilter, sectorFilter, favoritesFilter } = this.props
    let mapConfig = MapConfig

    //Add filters
    if (regionFilter > 0 || statusFilter > 0 || typologyFilter > 0 || sectorFilter > 0) {

      mapConfig.filters = {}

      if (parseInt(regionFilter) > 0) {
        mapConfig.filters.region = {
          uid: parseInt(regionFilter)
        }
      }

      if (parseInt(statusFilter) > 0) {
        mapConfig.filters.status = {
          uid: parseInt(statusFilter)
        }
      }

      if (parseInt(typologyFilter) > 0) {
        mapConfig.filters.typology = {
          uid: parseInt(typologyFilter)
        }
      }

      if (parseInt(sectorFilter) > 0) {
        mapConfig.filters.sector = {
          uid: parseInt(sectorFilter)
        }
      }
    }

    return encodeURI(JSON.stringify(mapConfig))
  }

  render() {

    let { height, width, fullView } = this.props
    let mapConfig = this.buildMapConfig()

    if(!height){
      height = "300px"
    }

    if(!width){
      width = "100%"
    }

    return (
      <div style={{ backgroundColor: "white", padding: "10px", borderRadius: "10px", border: "1px solid gainsboro" }}>

        <h4 style={{ margin: "5px 5px 0px 19px", display: "inline-block" }}>
          <b>Map</b>
        </h4>

        <img
          src={ fullView ? popin : popout}
          style={{
            width: "25px",
            float: "right",
            margin: "5px 5px 0px 0px",
            cursor: "pointer"
          }}
          onClick={() => {
            if(!fullView) this.props.setScrollPos(window.pageYOffset)
            location.hash = fullView ? "" : "/map"
          }}
        />

        <hr />

        <iframe
          style={{
            width,
            height,
            margin: "0px",
            border: "none",
            backgroundImage: `url(${loader})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "50% 50%"
          }}
          // src={`http://app01.saeon.ac.za/components/map?conf=${mapConfig}`}
          src={'http://www.example.com'}
        />

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapViewCore)