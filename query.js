const mysql = require("mysql2/promise");

const connection = {
  shard_1: mysql.createPool({
    host: "localhost",
    user: "root",
    password: "toor",
    database: "shard_1",
  }),
  shard_2: mysql.createPool({
    host: "localhost",
    user: "root",
    password: "toor",
    database: "shard_2",
  }),
};

// Get employee by id
async function getEmployee(employeeNumber) {
  const shard =
    employeeNumber % 2 === 0 ? connection.shard_1 : connection.shard_2;

  try {
    const [results] = await shard.execute(
      "SELECT * FROM employees WHERE employeeNumber = ?",
      [employeeNumber]
    );

    if (results.length > 0) {
      console.log("Employee Details:", results[0]);
    } else {
      console.log(`Employee ${employeeNumber} not found.`);
    }
  } catch (err) {
    console.error("Query Error:", err);
  }
}

// Get all employee from shard_1 & shard_2
async function getAllEmployees() {
  try {
    const [shard1Results] = await connection.shard_1.execute(
      "SELECT * FROM employees"
    );
    const [shard2Results] = await connection.shard_2.execute(
      "SELECT * FROM employees"
    );

    console.log("Employees from Shard 1:");
    console.table(shard1Results);

    console.log("Employees from Shard 2:");
    console.table(shard2Results);
  } catch (err) {
    console.error("Query Error:", err);
  }
}

async function main() {
  console.log("Get all employees:");
  await getAllEmployees();
}

main();

module.exports = { getEmployee, getAllEmployees };
