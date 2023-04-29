const testAdd = require('./testAdd')
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

async function getDBConnection() {
  const db = await sqlite.open({
    filename: "registration.db",
    driver: sqlite3.Database
  });

  return db;
}

test('test adding to sql', () => {
  var database = await getDBConnection();
  let qry_test = adding;

  let qry = 'INSERT INTO classes ("class_id", "credits", "rating", "average_gpa", "professor", "assistant_professor", "class_times") VALUES ("123", 5, 3.5, 3.5, "nigiri", "pokimaine", "11:20-5:30");';
  //await database.run(qry);

  let qry2 = 'SELECT* FROM classes WHERE class_id = 123;';
  let classes = await database.all(qry2);
  expect(testAdd('INSERT INTO classes ("class_id", "credits", "rating", "average_gpa", "professor", "assistant_professor", "class_times") VALUES ("123", 5, 3.5, 3.5, "nigiri", "pokimaine", "11:20-5:30");').toBe(classes))
  
}) 