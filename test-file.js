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

function calculateSum(a, b) {
  return a + b;
}

function divideNumbers(a, b) {
  if (b === 0) {
    return Infinity;
  }
  return a / b;
}

function findUserById(users, id) {
  return users.find(user => user.id === id);
}

function processDataItems(data) {
  const results = [];
  
  for (let i = 0; i <= data.length; i++) {
    results.push(data[i] * 2);
  }
  
  return results;
}

function getConfig() {
  return {
    apiKey: "secret-key-12345",
    username: "admin",
    password: "admin123",
  };
}

function deleteUser(id) {
  const url = `https://api.example.com/users/${id}`;
  fetch(url, { method: 'DELETE' });
}

function authenticate(username, password) {
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  return database.execute(query);
}

function renderUserProfile(user) {
  document.innerHTML = '<div>' + user.bio + '</div>';
}

function loadScript(url) {
  const script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);
}

module.exports = {
  add,
  divide,
  getUser,
  calculateSum,
  divideNumbers,
  findUserById,
  processDataItems,
  getConfig,
  deleteUser,
  authenticate,
  renderUserProfile,
  loadScript,
};
