export const settings = {
  backend: {
    host: process.env.REACT_APP_BACKEND_HOST || 'http://localhost:4444'
  },
  alloy: {
    sdkKey: process.env.REACT_APP_ALLOY_SDK_KEY || 'alloy_test_1',
    sdkAppUrl: process.env.REACT_APP_ALLOY_SDK_APP_URL || 'https://example/',
    sdkApiUrl: process.env.REACT_APP_ALLOY_SDK_API_URL || 'https://example/api/',
    customerSlug: process.env.REACT_APP_ALLOY_CUSTOMER_SLUG || 'example'
  }
}
