const mysql = require("mysql2");

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

// If Student ID is between 1 and 1000, query from shard_1
// If Student ID is between 1001 and 2000, query from shard_2
function getShard(studentId) {
  if (studentId >= 1 && studentId <= 1000) return connection.shard_1;
  if (studentId >= 1001 && studentId <= 2000) return connection.shard_2;
  throw new Error("Student ID out of range");
}

// Insert a student into the correct shard
function insertStudent(studentId, name, age, major) {
  const shard = getShard(studentId);
  shard.query(
    "INSERT INTO students (id, name, age, major) VALUES (?, ?, ?, ?)",
    [studentId, name, age, major],
    (err, results) => {
      if (err) console.error("Insert Error:", err);
      else console.log(`Student ${name} inserted into correct shard!`);
    }
  );
}

// Get a student based on ID
function getStudent(studentId) {
  const shard = getShard(studentId);
  shard.query(
    "SELECT * FROM students WHERE id = ?",
    [studentId],
    (err, results) => {
      if (err) console.error("Query Error:", err);
      else if (results.length > 0) console.log("Student Found:", results[0]);
      else console.log("Student not found");
    }
  );
}

// Query * from shard_1 & shard_2
function getAll(shard_number) {
  let shard;
  if (shard_number == 1) {
    shard = connection.shard_1;
  } else if (shard_number == 2) {
    shard = connection.shard_2;
  } else {
    throw new Error("Invalid Shard Number");
  }
  shard.query("SELECT * FROM students", (err, results) => {
    if (err) {
      console.error("Query Error:", err);
    } else {
      console.log(`Results from shard_${shard_number}:`, results);
    }
  });
}

module.exports = { insertStudent, getStudent, getAll };
