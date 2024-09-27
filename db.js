const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sampledb', 'postgres', 'Jesusis4me**', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
});

(async () => {
  try {
    await sequelize.authenticate(); // bridge between API server and database
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.log(`Unable to connect to the database: ${error}`);
  }
})();

module.exports = sequelize;