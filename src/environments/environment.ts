
export const environment = {
  production: false,
  explorer: 'http://dlt.plasma-bank.com',
  api: 'https://app.plasma-bank.com',
  auth: {
    url: 'http://plasma-local.com/id/permission-oauth',
    clientId: '904140a6-dedc-472d-ba30-2b605cba53c7',
    redirectUri: 'http://localhost:4203/auth',
    scope: ['plasma']
  },
  gameFee: 0.2,
  contract: 'plasma.dice',
  account: 'bank.dice',
  permission: 'auth.dice'
};
