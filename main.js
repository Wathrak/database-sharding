const mysql = require("mysql2/promise");
const { createTable } = require("./table");

const classicmodels = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "toor",
  database: "classicmodels",
});

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

// IF enployeeNumber is Even go to shard_1
// Else if employeeNum is Odd go to shard_2
const getShard = (employeeNumber) => {
  return employeeNumber % 2 === 0 ? connection.shard_1 : connection.shard_2;
};

// I need to create the table in the shards before moving the data or it will error
async function setupDB() {
  console.log("Setting up database...");
  await createTable(connection.shard_1);
  await createTable(connection.shard_2);
  console.log("Database setup completed.");
}

async function moveEmployees() {
  try {
    console.log("Fetching employees from classicmodels...");
    const [employees] = await classicmodels.execute("SELECT * FROM employees");

    for (const employee of employees) {
      // IF employeeNumber is Even go to shard_1
      // Else if employeeNum is Odd go to shard_2
      const shard =
        employee.employeeNumber % 2 === 0
          ? connection.shard_1
          : connection.shard_2;

      await shard.execute(
        `INSERT INTO employees (employeeNumber, lastName, firstName, extension, email, officeCode, reportsTo, jobTitle) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          employee.employeeNumber,
          employee.lastName,
          employee.firstName,
          employee.extension,
          employee.email,
          employee.officeCode,
          employee.reportsTo,
          employee.jobTitle,
        ]
      );

      console.log(
        `Inserted employee ${employee.employeeNumber} into correct shard.`
      );
    }

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration Error:", err);
  } finally {
    await classicmodels.end();
    await connection.shard_1.end();
    await connection.shard_2.end();
  }
}

async function main() {
  await setupDB();
  await moveEmployees();
}

main();

module.exports = { getShard };
