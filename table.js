const mysql = require("mysql2/promise");

const tableSchema = `
  CREATE TABLE IF NOT EXISTS employees (
    employeeNumber INT(11) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    extension VARCHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL,
    officeCode VARCHAR(10) NOT NULL,
    reportsTo INT(11) DEFAULT NULL,
    jobTitle VARCHAR(50) NOT NULL,
    PRIMARY KEY (employeeNumber)
  )
`;

async function createTable(connection) {
  try {
    await connection.execute(tableSchema);
    console.log("Employees table created successfully.");
  } catch (err) {
    console.error("Error creating employees table:", err);
  }
}

module.exports = { createTable };
