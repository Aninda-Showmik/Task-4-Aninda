CREATE DATABASE user_management;
-- Connect to the database manually or using your application logic.
-- Create the 'users' table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- Use SERIAL for auto-increment
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'blocked')) DEFAULT 'active',  -- ENUM-like with CHECK constraint
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- In PostgreSQL, `ON UPDATE CURRENT_TIMESTAMP` is not supported directly like MySQL.
-- You'd typically handle this behavior in application logic or triggers if necessary.
SELECT datname FROM pg_database;
