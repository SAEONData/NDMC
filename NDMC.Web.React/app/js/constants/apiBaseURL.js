let url

if (CONSTANTS.PRODUCTION) {
  url = 'http://app01.saeon.ac.za/ndmcapi/'
} else {
  url = 'http://app01.saeon.ac.za/ndmcapi/'
}

export const apiBaseURL = url
