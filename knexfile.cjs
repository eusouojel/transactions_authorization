const path = require('path');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'src/infrastructure/persistence/database/database.sqlite')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'src/infrastructure/persistence/migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'src/infrastructure/persistence/seeds'),
      stub: path.join(__dirname, 'src/infrastructure/persistence/seeds/stubs/seed.stub')
    }
  }

};
