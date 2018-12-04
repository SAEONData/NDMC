import { siteBaseURL } from '../js/config/serviceURLs.cfg'

export const MapConfig = {
  "service": "http://app01.saeon.ac.za/ndmcapi/odata/events/extensions.geojson",
  "domain": siteBaseURL,
  "IDField": "properties.id",
  "toolTipTitle": "properties.hazardName",
  "toolTipFields": [
    {
      "field": "properties.startDate",
      "alias": "Start Date"
    },
    {
      "field": "properties.endDate",
      "alias": "End Date"
    }
  ],
  "styleField": "properties.hazard",
  "styles": [
    {
      "value": 0,
      "title": "Unknown",
      "default": true,
      "strokeWidth": 1,
      "strokeColor": "rgba(255,255,255,0.5)", //white
      "fillColor": "rgba(255,255,255,0.3)"
    },
    {
      "value": 1,
      "title": "Drought",
      "strokeWidth": 1,
      "strokeColor": "rgba(255,165,0,0.5)", //orange
      "fillColor": "rgba(255,165,0,0.3)"
    },
    {
      "value": 2,
      "title": "Hailstorm",
      "strokeWidth": 1,
      "strokeColor": "rgba(33,158,186,0.5)", //alt-blue
      "fillColor": "rgba(33,158,186,0.3)"
    },
    {
      "value": 3,
      "title": "Floods",
      "strokeWidth": 1,
      "strokeColor": "rgba(30,144,255,0.5)", //dodger-blue (blue)
      "fillColor": "rgba(30,144,255,0.3)"
    },
    {
      "value": 4,
      "title": "Tornado",
      "strokeWidth": 1,
      "strokeColor": "rgba(106,90,205,0.5)", //slate-blue (purple)
      "fillColor": "rgba(106,90,205,0.3)"
    },
    {
      "value": 5,
      "title": "Storms",
      "strokeWidth": 1,
      "strokeColor": "rgba(128,128,128,0.5)", //grey
      "fillColor": "rgba(128,128,128,0.3)"
    },
    {
      "value": 6,
      "title": "Heavy Rain",
      "strokeWidth": 1,
      "strokeColor": "rgba(30,144,255,0.5)", //dodger-blue (blue)
      "fillColor": "rgba(30,144,255,0.3)"
    },
    {
      "value": 7,
      "title": "Fire",
      "strokeWidth": 1,
      "strokeColor": "rgba(255,99,71,0.5)", //tomate (red)
      "fillColor": "rgba(255,99,71,0.3)"
    },
    {
      "value": 8,
      "title": "Strong winds",
      "strokeWidth": 1,
      "strokeColor": "rgba(211,211,211,0.5)", //light-grey
      "fillColor": "rgba(211,211,211,0.3)"
    },
    {
      "value": 9,
      "title": "Earthquake",
      "strokeWidth": 1,
      "strokeColor": "rgba(255,216,0,0.5)", //yellow
      "fillColor": "rgba(255,216,0,0.3)"
    }
  ]
}