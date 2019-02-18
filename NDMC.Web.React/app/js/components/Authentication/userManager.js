import { createUserManager } from 'redux-oidc';
import { userManagerConfig } from '../../secrets'

const userManager = createUserManager(userManagerConfig);

export default userManager;