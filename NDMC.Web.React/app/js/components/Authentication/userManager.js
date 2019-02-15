// import { createUserManager } from 'redux-oidc'
// import { ssoBaseURL } from '../../config/ssoBaseURL'

// const userManagerConfig = {
//     client_id: 'NDMC_React_Client',
//     redirect_uri: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/#/callback#`,
//     response_type: 'id_token token',
//     scope: 'openid profile email SAEON_NDMC_Web_API',
//     authority: 'http://identity.saeon.ac.za/',
//     automaticSilentRenew: false,
//     filterProtocolClaims: true,
//     loadUserInfo: true
// }

// const userManager = createUserManager(userManagerConfig)

// export default userManager

import { createUserManager } from 'redux-oidc';
import { userManagerConfig } from '../../secrets'

const userManager = createUserManager(userManagerConfig);

export default userManager;