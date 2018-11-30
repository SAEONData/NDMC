'use strict'

import React from 'react'
import { Card, CardBody, CardText, CardTitle, Button, Fa } from 'mdbreact'
import { connect } from 'react-redux'
import { DEAGreen, DEAGreenDark } from '../../../config/colours.cfg'

const _gf = require('../../../globalFunctions')

const mapStateToProps = (state, props) => {
  let { globalData: { showListViewOption, showFavoritesOption, showDetailsInParent } } = state
  return { showListViewOption, showFavoritesOption, showDetailsInParent }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScrollPos: payload => {
      dispatch({ type: "SET_EVENTS_SCROLL", payload })
    },
    setForceNavRender: payload => {
      dispatch({ type: "FORCE_NAV_RENDER", payload })
    }
  }
}

class EventCard extends React.Component {
  constructor(props) {
    super(props)

    this.togleFavorite = this.togleFavorite.bind(this)

    this.state = {
      favorite: false
    }
  }

  componentDidMount() {
    let { eid } = this.props
    let favs = this.GetFavorites()
    this.setState({ favorite: favs.includes(eid) })
  }

  togleFavorite() {

    let { favorite } = this.state
    let { eid } = this.props

    let newState = !favorite
    this.setState({ favorite: newState })

    //Save to cookie
    let favs = this.GetFavorites()

    if (newState) {
      //Add if not contains
      if (!favs.includes(eid)) {
        favs.push(eid)
      }
    }
    else {
      //Remove if contains
      if (favs.includes(eid)) {
        let index = favs.indexOf(eid)
        favs.splice(index, 1)
      }
    }

    this.SetFavorites(favs)
  }

  GetFavorites() {
    let strFavs = _gf.ReadCookie("NDMC_Event_Favorites")

    if (strFavs !== null && strFavs.length > 0) {
      let favs = strFavs.split(",")

      if (favs.length > 0) {
        return favs.map(x => parseInt(x))
      }
    }

    return []
  }

  SetFavorites(favs) {

    favs = favs.filter(f => !isNaN(f))

    let strFavs = ""
    if (favs.length > 0) {
      strFavs = favs.map(x => x.toString()).join(",")
    }
    else if (false.length === 1) {
      strFavs = favs[0].toString()
    }

    _gf.CreateCookie("NDMC_Event_Favorites", strFavs, 3650)
  }

  onTouchTap() {

    if (this.props.showDetailsInParent) {
      let payload = {}
      payload.action = "showDetails"
      payload.value = this.props.eid
      window.parent.postMessage(payload, "*")
    }
    else {
      this.props.setScrollPos(window.pageYOffset)
      this.props.setForceNavRender(true)

      let navTo = ""
      if(location.hash.includes("events")){
        navTo = location.hash.replace("#/events", "#/events/" + this.props.eid)
      }
      else{
        navTo = location.hash.replace("#/", "#/events/" + this.props.eid)
      }

      location.hash = navTo      
    }
  }

  render() {

    const { region: { RegionName }, startdate, enddate, hazardtype } = this.props
    let { favorite } = this.state

    return (
      <>
        <CardBody>

          <CardTitle>Disaster at {RegionName} ({hazardtype} - {startdate}) </CardTitle>

          <CardText>
            {startdate ? `Date: ${startdate} until ${enddate}` : ''} <br />
            {hazardtype ? `Type: ${hazardtype}` : ' '}
          </CardText>

          {
            this.props.showListViewOption === true &&
            <Button
              size="sm"
              color="white"
              onClick={this.onTouchTap.bind(this)}
              style={{
                backgroundColor: "white",
                marginLeft: "0px",
                boxShadow: "none",
                border: "1px solid silver",
                borderRadius: "5px",
                padding: "3px 15px 3px 15px"
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <td valign="middle">
                      <Fa icon="eye" size="lg" style={{ color: DEAGreen, marginRight: "5px" }} />
                    </td>
                    <td valign="middle">
                      <div style={{ fontSize: "14px", marginTop: "2px" }} >
                        View
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Button>            
          }

          {
            this.props.showFavoritesOption === true &&
            <Button
              size="sm"
              color="white"
              onClick={this.togleFavorite}
              style={{
                backgroundColor: "white",
                marginLeft: "0px",
                boxShadow: "none",
                border: "1px solid silver",
                borderRadius: "5px",
                padding: "3px 15px 3px 15px"
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <td valign="middle">
                      <Fa icon="star" size="lg" style={{ color: favorite ? "#fdd835" : "#D8D8D8", marginRight: "5px" }} />
                    </td>
                    <td valign="middle">
                      <div style={{ fontSize: "14px", marginTop: "2px" }} >
                        Favorite
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Button>            
          }

        </CardBody>
        
        <hr style={{ margin: "0px 0px 15px 0px" }} />
      </>
    )
  }
}

//export default EventCard
export default connect(mapStateToProps, mapDispatchToProps)(EventCard)