function add(a, b) {
  return a + b;
}

function divide(a, b) {
  return a / b;
}

function getUser(id) {
  const user = database.query("SELECT * FROM users WHERE id = " + id);
  return user;
}

var globalVar = "I'm global";

function processData(data) {
  for (var i = 0; i < data.length; i++) {
    console.log(data[i]);
  }
}

const result = add(1, 2);
console.log(result);
