module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '6AphlGZSXopbjoghL8Nm9a5D3F23kZuSOj9yG5mRVxMAN9AYPaPxGm2jD6hoPEOU',
    database: process.env.DB_NAME || 'iom',
    host: process.env.DB_HOST || '195.110.58.17',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '6AphlGZSXopbjoghL8Nm9a5D3F23kZuSOj9yG5mRVxMAN9AYPaPxGm2jD6hoPEOU',
    database: process.env.DB_NAME || 'iom',
    host: process.env.DB_HOST || '195.110.58.17',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '6AphlGZSXopbjoghL8Nm9a5D3F23kZuSOj9yG5mRVxMAN9AYPaPxGm2jD6hoPEOU',
    database: process.env.DB_NAME || 'iom',
    host: process.env.DB_HOST || '195.110.58.17',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  },
};

