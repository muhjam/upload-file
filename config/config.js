console.log('Connecting to MySQL on port:', process.env.DB_PORT || 9000);

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'your_db_username',
    password: process.env.DB_PASSWORD || 'your_db_password',
    database: process.env.DB_NAME || 'your_db_name',
    host: process.env.DB_HOST || '195.110.58.17',
    port: process.env.DB_PORT || 9000,
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USERNAME || 'your_db_username',
    password: process.env.DB_PASSWORD || 'your_db_password',
    database: process.env.DB_NAME || 'your_db_name',
    host: process.env.DB_HOST || '195.110.58.17',
    port: process.env.DB_PORT || 9000,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USERNAME || 'your_db_username',
    password: process.env.DB_PASSWORD || 'your_db_password',
    database: process.env.DB_NAME || 'your_db_name',
    host: process.env.DB_HOST || '195.110.58.17',
    port: process.env.DB_PORT || 9000,
    dialect: 'mysql',
  },
};
