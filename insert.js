const { insertStudent } = require("./main");

// If Student ID is between 1 and 1000, insert into shard_1
// If Student ID is between 1001 and 2000, insert into shard_2

// insertStudent(id, name, age, major)
insertStudent(1, "Wathrak", 20, "Computer Science");
insertStudent(1001, "Jack", 22, "Engineering");
insertStudent(2, "Sak", 19, "Business");
