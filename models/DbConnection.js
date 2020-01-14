require('dotenv').config();

const { Client } = require('pg')

class DbConnection {
  constructor() {
    this.port = process.env.DB_PORT;

    if (process.env.NODE_ENV == 'TEST'){
      this.user = process.env.DB_USER_LOCAL;
      this.db_name = process.env.TEST_DB_NAME;
      this.db_ip = 'localhost'
      this.uri = `postgres://${this.user}@${this.db_ip}:${this.port}/${this.db_name}`;
    } else if (process.env.NODE_ENV == 'DEVELOPMENT') {
      this.user = process.env.DB_USER_LOCAL;
      this.db_name = process.env.DB_NAME;
      this.db_ip = 'localhost'
      this.uri = `postgres://${this.user}@${this.db_ip}:${this.port}/${this.db_name}`;
    } else if (process.env.NODE_ENV == 'PRODUCTION') {
      this.user = process.env.DB_USER;
      this.db_name = process.env.DB_NAME;
      this.db_ip = process.env.DB_IP;
      this.uri = process.env.DATABASE_URL;
    }
    console.log(this.uri)
    this.client = new Client(this.uri)
  }

  async start() {
    try {
      await this.client.connect()
    } catch (err) {
      console.error(err)
    }
  }

  async close() {
    try {
      await this.client.end()
    } catch (err) {
      console.error(err)
    }
  }

  async query(query) {
    try {
      await this.start()
      let result =  await this.client.query(query)
      await this.close()
      return result
    } catch (err) {
      console.error(err)
      return []
    }
  }
}

module.exports = DbConnection;