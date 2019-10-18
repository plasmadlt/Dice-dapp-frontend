export const environment = {
  production: true,
  explorer: 'http://plasmadlt.com',
  api: 'https://app.plasmapay.com',
  auth: {
    url: 'https://app.plasmapay.com/id/permission-oauth',
    clientId: '6044bd86-3207-4d69-864e-c2e490c48467',
    redirectUri: 'https://plasmadice.com/auth',
    scope: ['plasma']
  },
  gameFee: 0.2,
  contract: 'plasma.dice',
  account: 'bank.dice',
  permission: 'auth.dice'
};
