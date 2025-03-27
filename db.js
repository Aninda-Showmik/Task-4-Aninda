const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'fdb1029.awardspace.net',  // Database host (provided by AwardSpace)
    user: '4610662_userdetails',      // Database username (provided by AwardSpace)
    password: 'your_password_here',   // Replace with your actual password
    database: '4610662_userdetails'   // Database name (created on AwardSpace)
});
// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to MySQL database');
    }
});

module.exports = db;
