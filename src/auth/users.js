const bcrypt = require("bcryptjs");
const users = [
    { id: 1, email: 'user@example.com', password: bcrypt.hashSync('password', 10), role: 'user' }
];  // Example user store

module.exports = users;