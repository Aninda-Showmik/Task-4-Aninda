const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'sql213.infinityfree.com',  // Database host (provided by InfinityFree)
    user: 'if0_38614646',             // Database username (provided by InfinityFree)
    password: '182001612',            // vPanel password (you provided)
    database: 'f0_38614646_user_management'  // Database name (created on InfinityFree)
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
