// ** Auth Endpoints
export default {
  loginEndpoint: '/auth/login',
  registerEndpoint: '/auth/register',
  forgotPasswordEndpoint: '/auth/forgot-password',
  resetPasswordEndpoint: (token) => `/auth/reset-password/${token}`,

  refreshEndpoint: '/refresh-token',
  logoutEndpoint: '/logout',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'access_token',
  storageRefreshTokenKeyName: 'refreshToken',
  storageUserKeyName: 'userData'
}
