'use strict'

import React from 'react'
import { DEAGreen, DEAGreenDark } from './config/colours.js'

const fetchDefaults = require("fetch-defaults")
var apiFetch = fetchDefaults(fetch, {
  headers: { 'pragma': 'no-cache', 'cache-control': 'no-cache' }
})

export function CustomFetch(url, options) {
  // Detect IE //
  let ua = navigator.userAgent;
  /* MSIE used to detect old browsers and Trident used to newer ones*/
  let is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
  // Execute relevant fetch
  if (is_ie) {
    return apiFetch(url, options)
  }
  else {
    return fetch(url, options)
  }
}

export function fixEmptyValue(value, defaultValue) {

  if (isEmptyValue(value)) {
    return defaultValue
  }

  return value
}

export function isEmptyValue(value) {
  return (typeof value === 'undefined' || value === "" || value === null)
}

export function stripURLParam(paramKey) {
  let i = location.toString().indexOf("?")
  let l = location.toString().length
  let queryString = location.toString().substr(i, l - i)

  console.log("queryString", queryString)

  if (queryString === ("?" + paramKey)) {
    console.log("1")
    location = location.toString().replace(("?" + paramKey), "")
  }
  else if (queryString.includes("?" + paramKey + "&")) {
    console.log("2")
    location = location.toString().replace(paramKey + "&", "")
  }
  else if (queryString.includes("&" + paramKey)) {
    console.log("3")
    location = location.toString().replace("&" + paramKey, "")
  }
}

export function getFontColour(editMode) {
  if (editMode) {
    return "black" //DEAGreen
  }
  else {
    return "#606060"
  }
}

export function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function GetUID() {
  //return Math.random().toString().substr(2, 9)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function IsValidGuid(guid) {
  let pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return pattern.test(guid)
}

export function StringToHTML(strVal) {

  if (typeof strVal === 'undefined') {
    return <div><p></p></div>
  }
  else if (strVal.includes("\n")) {
    return (
      <div>
        {strVal.split("\n").map(x => <p>{x}</p>)}
      </div>
    )
  }
  else {
    return (
      <div>
        <p>{strVal}</p>
      </div>
    )
  }
}

export function isLocalhost() {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    return true
  }
  else {
    return false
  }
}

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export const wait = ms => new Promise((r, j) => setTimeout(r, ms))


//-------------------------//
// Create and Read Cookies //
//-------------------------//

export function SaveCurrentUrl() {
  CreateCookie("NDMC_last_url", document.URL, 1);
}

export function ReadLastUrl() {
  return ReadCookie("NDMC_last_url")
}

export function CreateCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
  }
  else {
    var expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

export function ReadCookie(name) {
  var nameEQ = name + "="; var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
} 