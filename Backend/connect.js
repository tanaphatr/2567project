const sql = require('mssql');

const config = {
  user: 'admin',
  password: 'admin',
  server: 'LAPTOP-369163PM',
  database: 'Preproject',
  driver: 'msnodesqlv8',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database');
});

module.exports = {
  query: async (text) => {
    try {
      const result = await pool.request().query(text);
      return result.recordset;
    } catch (err) {
      console.error('Error executing query:', err);
      throw err; // Make sure to propagate the error
    }
  },
};
