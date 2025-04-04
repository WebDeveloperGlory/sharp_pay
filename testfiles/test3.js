const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST_2,
  user: process.env.DB_USER_2,
  password: process.env.DB_PASS_2,
  database: process.env.DB_NAME_2,
  port: process.env.DB_PORT_2,
  connectTimeout: 10000, // 10 seconds
});

// Sample queries
const queries = [
  'SELECT * FROM table1 WHERE id = ?',
  'SELECT * FROM table2 WHERE id = ?'
];

// Function to prepare multiple queries
async function prepareQueries() {
  const connections = await Promise.all(new Array(queries.length).fill(0).map(() => pool.getConnection()));
  const preparedQueries = await Promise.all(queries.map(async (query, index) => {
    const connection = connections[index];
    try {
      const statement = await connection.prepare(query);
      return statement;
    } finally {
      connection.release(); // Release the connection after preparing the query
    }
  }));
  return preparedQueries;
}

// Function to execute a prepared statement with parameters
async function executeQuery(statement, params) {
  const [rows, fields] = await statement.execute(params);
  return rows;
}

// Example usage
async function main() {
  try {
    const preparedStatements = await prepareQueries();
    console.log('Queries prepared successfully:', preparedStatements);

    // Example of executing the prepared statements
    const result1 = await executeQuery(preparedStatements[0], [1]);
    const result2 = await executeQuery(preparedStatements[1], [2]);

    console.log('Result 1:', result1);
    console.log('Result 2:', result2);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    pool.end(); // Close the connection pool when done
  }
}

// Call the main function
main();
