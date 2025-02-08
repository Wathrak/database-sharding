const { getStudent, getAll } = require("./main");

// If Student ID is between 1 and 1000, query from shard_1
// If Student ID is between 1001 and 2000, query from shard_2

// getStudent(1);
// getStudent(1001);
// getStudent(2);

getAll(1);
getAll(2);
