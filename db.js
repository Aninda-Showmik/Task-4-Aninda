require('dotenv').config();  // Load environment variables from .env file
const { Client } = require('pg');

// Create the connection to PostgreSQL using the environment variables
const client = new Client({
  user: process.env.DB_USER,        // PostgreSQL username from .env
  host: process.env.DB_HOST,        // PostgreSQL host from .env
  database: process.env.DB_NAME,    // PostgreSQL database name from .env
  password: process.env.DB_PASSWORD,// PostgreSQL password from .env
  port: process.env.DB_PORT,        // PostgreSQL port (5432 by default)
  ssl: {
    rejectUnauthorized: false      // Allow insecure SSL connections, adjust if needed
  }
});

// Connect to the PostgreSQL database
client.connect()
  .then(() => console.log("✅ Connected to PostgreSQL on Render"))
  .catch(err => console.error("❌ Error connecting to PostgreSQL:", err));

module.exports = client;  // Export the client so it can be used in your app
