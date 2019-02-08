let _apiBaseURL = ''
let _siteBaseURL = ''
let _vmsBaseURL = ''
let _ssoBaseURL = ''
let _ccisBaseURL = ''
let _mapServerBaseURL = ''

if (CONSTANTS.DEV) {
  _apiBaseURL = 'https://localhost:44334/odata/'
  _siteBaseURL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/`
  _ccisBaseURL = 'http://app01.saeon.ac.za/ccistestapi/odata/' //'https://localhost:44301/odata/'
  _vmsBaseURL = 'http://app01.saeon.ac.za/vmstest/api/' //'http://localhost:64161/api/'
  _ssoBaseURL = 'http://identity.saeon.ac.za/' //'http://localhost:44320/'
  _mapServerBaseURL = 'http://app01.saeon.ac.za'
}
else if (CONSTANTS.TEST) {
  _apiBaseURL = 'http://app01.saeon.ac.za/ndmctestapi/odata/'
  _siteBaseURL = 'http://app01.saeon.ac.za/ndmctestsite/'
  _ccisBaseURL = 'http://app01.saeon.ac.za/ccistestapi/odata/'
  _vmsBaseURL = 'http://app01.saeon.ac.za/vmstest/api/'
  _ssoBaseURL = 'http://identity.saeon.ac.za/'
  _mapServerBaseURL = 'http://app01.saeon.ac.za'
}
else if (CONSTANTS.PROD) {
  _apiBaseURL = 'http://app01.saeon.ac.za/ndmcapi/odata/'
  _siteBaseURL = 'http://app01.saeon.ac.za/ndmcsite/'
  _ccisBaseURL = 'http://app01.saeon.ac.za/ccisapi/odata/'
  _vmsBaseURL = 'http://app01.saeon.ac.za/vms/api/'
  _ssoBaseURL = 'http://identity.saeon.ac.za/'
  _mapServerBaseURL = 'http://app01.saeon.ac.za'
}

export const apiBaseURL = _apiBaseURL
export const siteBaseURL = _siteBaseURL
export const vmsBaseURL = _vmsBaseURL
export const ssoBaseURL = _ssoBaseURL
export const ccisBaseURL = _ccisBaseURL
export const mapServerBaseURL = _mapServerBaseURL
