export const environment = {
  production: true,
  apiUrl: '/api',
  keycloak: {
    url:      '/auth',   // proxy inverso en producción
    realm:    'verdurasia',
    clientId: 'verdurasia-angular'
  }
};
